import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { createMockDeviceClient, createDefaultDeviceSnapshot } from '../api/mockDeviceClient';
import {
  applySnapshotPatch,
  buildCommandFailureMessage,
  buildCommandSuccessMessage,
  clampBrightness,
} from '../domain/deviceControl';
import { createEmptyDeviceSummary, buildDeviceSummary } from '../domain/deviceSummary';
import { upsertRegisteredDevice, updateDeviceConnectionState } from '../domain/deviceRegistry';
import { normalizeDeviceDraft, validateDeviceDraft } from '../domain/deviceValidation';
import type {
  DeviceCommand,
  DeviceRegistrationDraft,
  DeviceRegistrationResult,
  DeviceSnapshot,
  DeviceState,
  RegisteredDevice,
} from '../domain/deviceTypes';
import {
  loadPersistedDeviceState,
  persistActiveDeviceId,
  persistRegisteredDevices,
} from '../storage/deviceStorage';

interface DeviceContextValue extends DeviceState {
  registerDevice: (draft: DeviceRegistrationDraft) => Promise<DeviceRegistrationResult>;
  selectDevice: (deviceId: string) => Promise<void>;
  refreshActiveDevice: () => Promise<void>;
  setPower: (isPoweredOn: boolean) => Promise<void>;
  setBrightness: (brightnessPercent: number) => Promise<void>;
  setActiveScene: (sceneName: string) => Promise<void>;
  triggerSunriseTest: () => Promise<void>;
}

const mockClient = createMockDeviceClient();
const defaultSnapshot = createDefaultDeviceSnapshot();
const emptySummary = createEmptyDeviceSummary();
const defaultRegisteredDevice: RegisteredDevice = {
  id: defaultSnapshot.deviceId,
  name: defaultSnapshot.deviceName,
  host: defaultSnapshot.deviceHost,
  addedAt: new Date('2026-03-24T00:00:00.000Z').toISOString(),
  lastConnectionState: defaultSnapshot.connectionState,
};

const initialState: DeviceState = {
  registeredDevices: [],
  activeDeviceId: null,
  snapshot: null,
  summary: emptySummary,
  isBusy: false,
  onboardingMessage: null,
  inFlightCommand: null,
  lastCommandMessage: null,
};

const DeviceContext = createContext<DeviceContextValue>({
  ...initialState,
  registerDevice: async () => ({
    device: null,
    probe: {
      isReachable: false,
      connectionState: 'offline',
      connectionLabel: 'Offline',
      details: 'Device registration is unavailable.',
    },
    message: 'Device registration is unavailable.',
  }),
  selectDevice: async () => {},
  refreshActiveDevice: async () => {},
  setPower: async () => {},
  setBrightness: async () => {},
  setActiveScene: async () => {},
  triggerSunriseTest: async () => {},
});

function getInitialRegistry() {
  const persistedState = loadPersistedDeviceState();

  if (persistedState.registeredDevices.length > 0) {
    return persistedState;
  }

  return {
    registeredDevices: [defaultRegisteredDevice],
    activeDeviceId: defaultRegisteredDevice.id,
  };
}

export function DeviceProvider({ children }: PropsWithChildren) {
  const initialRegistry = useMemo(() => getInitialRegistry(), []);
  const [registeredDevices, setRegisteredDevices] = useState(initialRegistry.registeredDevices);
  const [activeDeviceId, setActiveDeviceId] = useState<string | null>(initialRegistry.activeDeviceId);
  const [snapshot, setSnapshot] = useState<DeviceSnapshot | null>(initialState.snapshot);
  const [onboardingMessage, setOnboardingMessage] = useState<string | null>(null);
  const [lastCommandMessage, setLastCommandMessage] = useState<string | null>(null);
  const [registrationBusy, setRegistrationBusy] = useState(false);
  const [inFlightCommand, setInFlightCommand] = useState<DeviceCommand | null>(null);
  const pollingTimerId = useRef<number | null>(null);

  const activeDevice =
    registeredDevices.find((device) => device.id === activeDeviceId) ?? registeredDevices[0] ?? null;

  useEffect(() => {
    persistRegisteredDevices(registeredDevices);
  }, [registeredDevices]);

  useEffect(() => {
    persistActiveDeviceId(activeDevice?.id ?? null);
  }, [activeDevice]);

  function syncRegisteredDeviceState(deviceId: string, connectionState: RegisteredDevice['lastConnectionState']) {
    setRegisteredDevices((currentDevices) =>
      updateDeviceConnectionState(currentDevices, deviceId, connectionState),
    );
  }

  const syncDeviceSnapshot = useCallback(async (device: RegisteredDevice) => {
    const nextSnapshot = await mockClient.getSnapshot(device);
    setSnapshot(nextSnapshot);
    syncRegisteredDeviceState(device.id, nextSnapshot.connectionState);
    return nextSnapshot;
  }, []);

  useEffect(() => {
    if (!activeDevice) {
      setSnapshot(null);
      return;
    }

    void syncDeviceSnapshot(activeDevice);

    pollingTimerId.current = window.setInterval(() => {
      void syncDeviceSnapshot(activeDevice);
    }, 30000);

    return () => {
      if (pollingTimerId.current) {
        window.clearInterval(pollingTimerId.current);
      }
    };
  }, [activeDevice, syncDeviceSnapshot]);

  async function runDeviceCommand(
    command: DeviceCommand,
    optimisticSnapshotFactory: ((currentSnapshot: DeviceSnapshot) => DeviceSnapshot) | null,
    performCommand: (device: RegisteredDevice) => Promise<DeviceSnapshot>,
  ) {
    if (!activeDevice || !snapshot) {
      setLastCommandMessage('Select a device before sending live controls.');
      return;
    }

    const previousSnapshot = snapshot;

    if (optimisticSnapshotFactory) {
      setSnapshot(optimisticSnapshotFactory(previousSnapshot));
    }

    setInFlightCommand(command);

    try {
      const confirmedSnapshot = await performCommand(activeDevice);
      setSnapshot(confirmedSnapshot);
      syncRegisteredDeviceState(activeDevice.id, confirmedSnapshot.connectionState);
      setLastCommandMessage(buildCommandSuccessMessage(command));
    } catch {
      setSnapshot(previousSnapshot);
      setLastCommandMessage(buildCommandFailureMessage(command));
    } finally {
      setInFlightCommand(null);
    }
  }

  async function registerDevice(draft: DeviceRegistrationDraft): Promise<DeviceRegistrationResult> {
    const normalizedDraft = normalizeDeviceDraft(draft);
    const validationErrors = validateDeviceDraft(normalizedDraft);

    if (validationErrors.length > 0) {
      const message = validationErrors[0];
      setOnboardingMessage(message);
      return {
        device: null,
        probe: {
          isReachable: false,
          connectionState: 'offline',
          connectionLabel: 'Offline',
          details: message,
        },
        message,
      };
    }

    setRegistrationBusy(true);

    try {
      const probe = await mockClient.probeConnection(normalizedDraft);

      if (!probe.isReachable) {
        setOnboardingMessage(probe.details);
        return {
          device: null,
          probe,
          message: probe.details,
        };
      }

      const registeredDevice: RegisteredDevice = {
        id: normalizedDraft.host.replace(/[^a-z0-9]+/g, '-'),
        name: normalizedDraft.name,
        host: normalizedDraft.host,
        addedAt: new Date().toISOString(),
        lastConnectionState: probe.connectionState,
      };

      setRegisteredDevices((currentDevices) =>
        upsertRegisteredDevice(currentDevices, registeredDevice),
      );
      setActiveDeviceId(registeredDevice.id);
      setOnboardingMessage(probe.details);

      return {
        device: registeredDevice,
        probe,
        message: probe.details,
      };
    } finally {
      setRegistrationBusy(false);
    }
  }

  async function selectDevice(deviceId: string) {
    setActiveDeviceId(deviceId);
    setOnboardingMessage('Active device updated.');
  }

  async function refreshActiveDevice() {
    if (!activeDevice) {
      setLastCommandMessage('Add a device before refreshing connectivity.');
      return;
    }

    setInFlightCommand('refresh');

    try {
      await syncDeviceSnapshot(activeDevice);
      setLastCommandMessage(buildCommandSuccessMessage('refresh'));
    } catch {
      setLastCommandMessage(buildCommandFailureMessage('refresh'));
    } finally {
      setInFlightCommand(null);
    }
  }

  async function setPower(isPoweredOn: boolean) {
    await runDeviceCommand(
      'power',
      (currentSnapshot) =>
        applySnapshotPatch(currentSnapshot, {
          isPoweredOn,
          brightnessPercent: isPoweredOn ? Math.max(currentSnapshot.brightnessPercent, 25) : 0,
        }),
      (device) => mockClient.setPower(device, isPoweredOn),
    );
  }

  async function setBrightness(brightnessPercent: number) {
    const nextBrightness = clampBrightness(brightnessPercent);

    await runDeviceCommand(
      'brightness',
      (currentSnapshot) =>
        applySnapshotPatch(currentSnapshot, {
          isPoweredOn: nextBrightness > 0,
          brightnessPercent: nextBrightness,
        }),
      (device) => mockClient.setBrightness(device, nextBrightness),
    );
  }

  async function setActiveScene(sceneName: string) {
    await runDeviceCommand(
      'scene',
      (currentSnapshot) =>
        applySnapshotPatch(currentSnapshot, {
          activeSceneName: sceneName,
        }),
      (device) => mockClient.setActiveScene(device, sceneName),
    );
  }

  async function triggerSunriseTest() {
    await runDeviceCommand(
      'sunrise-test',
      (currentSnapshot) =>
        applySnapshotPatch(currentSnapshot, {
          isPoweredOn: true,
          activeSceneName: 'Manual Sunrise Test',
          brightnessPercent: Math.max(currentSnapshot.brightnessPercent, 68),
        }),
      (device) => mockClient.triggerSunriseTest(device),
    );
  }

  return (
    <DeviceContext
      value={{
        registeredDevices,
        activeDeviceId: activeDevice?.id ?? null,
        snapshot,
        summary: snapshot ? buildDeviceSummary(snapshot) : emptySummary,
        isBusy: registrationBusy || inFlightCommand !== null,
        onboardingMessage,
        inFlightCommand,
        lastCommandMessage,
        registerDevice,
        selectDevice,
        refreshActiveDevice,
        setPower,
        setBrightness,
        setActiveScene,
        triggerSunriseTest,
      }}
    >
      {children}
    </DeviceContext>
  );
}

export { DeviceContext };
