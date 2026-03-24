import {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { createMockDeviceClient, createDefaultDeviceSnapshot } from '../api/mockDeviceClient';
import { createEmptyDeviceSummary, buildDeviceSummary } from '../domain/deviceSummary';
import { upsertRegisteredDevice, updateDeviceConnectionState } from '../domain/deviceRegistry';
import { normalizeDeviceDraft, validateDeviceDraft } from '../domain/deviceValidation';
import type {
  DeviceRegistrationDraft,
  DeviceRegistrationResult,
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
  const [snapshot, setSnapshot] = useState(initialState.snapshot);
  const [isBusy, setIsBusy] = useState(initialState.isBusy);
  const [onboardingMessage, setOnboardingMessage] = useState<string | null>(null);
  const pollingTimerId = useRef<number | null>(null);

  const activeDevice =
    registeredDevices.find((device) => device.id === activeDeviceId) ?? registeredDevices[0] ?? null;

  useEffect(() => {
    persistRegisteredDevices(registeredDevices);
  }, [registeredDevices]);

  useEffect(() => {
    persistActiveDeviceId(activeDevice?.id ?? null);
  }, [activeDevice]);

  async function syncDeviceSnapshot(device: RegisteredDevice) {
    const nextSnapshot = await mockClient.getSnapshot(device);
    setSnapshot(nextSnapshot);
    setRegisteredDevices((currentDevices) =>
      updateDeviceConnectionState(currentDevices, device.id, nextSnapshot.connectionState),
    );
  }

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
  }, [activeDevice]);

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

    setIsBusy(true);

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
      setIsBusy(false);
    }
  }

  async function selectDevice(deviceId: string) {
    setActiveDeviceId(deviceId);
    setOnboardingMessage('Active device updated.');
  }

  async function refreshActiveDevice() {
    if (!activeDevice) {
      setOnboardingMessage('Add a device before refreshing connectivity.');
      return;
    }

    setIsBusy(true);
    await syncDeviceSnapshot(activeDevice);
    setOnboardingMessage('Device status refreshed.');
    setIsBusy(false);
  }

  return (
    <DeviceContext
      value={{
        registeredDevices,
        activeDeviceId: activeDevice?.id ?? null,
        snapshot,
        summary: snapshot ? buildDeviceSummary(snapshot) : emptySummary,
        isBusy,
        onboardingMessage,
        registerDevice,
        selectDevice,
        refreshActiveDevice,
      }}
    >
      {children}
    </DeviceContext>
  );
}

export { DeviceContext };
