import type { DeviceClient } from './deviceClient';
import type {
  DeviceProbeResult,
  DeviceRegistrationDraft,
  DeviceSnapshot,
  RegisteredDevice,
} from '../domain/deviceTypes';
import { clampBrightness } from '../domain/deviceControl';

const availableSceneNames = ['Tropical Dawn', 'Golden Wake', 'Ember Rise', 'Soft Horizon'];
const deviceStateRegistry = new Map<string, DeviceSnapshot>();

function createConnectionProfile(host: string): DeviceProbeResult {
  if (host.includes('offline') || host.includes('fail')) {
    return {
      isReachable: false,
      connectionState: 'offline',
      connectionLabel: 'Offline',
      details: 'Solaris could not reach the device at that address.',
    };
  }

  if (host.includes('slow') || host.includes('recover')) {
    return {
      isReachable: true,
      connectionState: 'degraded',
      connectionLabel: 'Signal recovering',
      details: 'The device responded, but with slow or unstable connectivity.',
    };
  }

  return {
    isReachable: true,
    connectionState: 'online',
    connectionLabel: 'Connected',
    details: 'The device responded and looks compatible with the current WLED target.',
  };
}

export function createDefaultDeviceSnapshot(): DeviceSnapshot {
  return {
    deviceId: 'mock-default-device',
    deviceName: import.meta.env.VITE_SOLARIS_DEFAULT_DEVICE_NAME ?? 'Bedroom Lamp',
    deviceHost: import.meta.env.VITE_SOLARIS_DEFAULT_DEVICE_HOST ?? 'solaris.local',
    connectionState: 'online',
    firmwareVersion: 'WLED 0.15.0',
    isPoweredOn: true,
    brightnessPercent: 82,
    activeSceneName: 'Tropical Dawn',
    availableSceneNames,
    lastSyncedAt: new Date('2026-03-24T06:00:00.000Z').toISOString(),
    nextAlarm: {
      id: 'weekday-wakeup',
      label: 'Weekday Wake Up',
      time: '06:30',
      scheduleSummary: 'Weekdays',
      isEnabled: true,
      sunriseDurationInMinutes: 30,
    },
  };
}

function createSnapshotForDevice(device: RegisteredDevice): DeviceSnapshot {
  const connectionProfile = createConnectionProfile(device.host);
  const defaultSnapshot = createDefaultDeviceSnapshot();

  return {
    ...defaultSnapshot,
    deviceId: device.id,
    deviceName: device.name,
    deviceHost: device.host,
    connectionState: connectionProfile.connectionState,
    isPoweredOn: connectionProfile.connectionState !== 'offline',
    activeSceneName:
      connectionProfile.connectionState === 'degraded' ? 'Signal Recovery Glow' : defaultSnapshot.activeSceneName,
    availableSceneNames,
    lastSyncedAt: new Date().toISOString(),
  };
}

function ensureReachable(device: RegisteredDevice) {
  const connectionProfile = createConnectionProfile(device.host);

  if (!connectionProfile.isReachable) {
    throw new Error('The device is offline.');
  }

  return connectionProfile;
}

function getOrCreateDeviceState(device: RegisteredDevice) {
  const existingSnapshot = deviceStateRegistry.get(device.id);

  if (existingSnapshot) {
    return existingSnapshot;
  }

  const nextSnapshot = createSnapshotForDevice(device);
  deviceStateRegistry.set(device.id, nextSnapshot);
  return nextSnapshot;
}

function saveDeviceState(snapshot: DeviceSnapshot) {
  const nextSnapshot = {
    ...snapshot,
    lastSyncedAt: new Date().toISOString(),
  };
  deviceStateRegistry.set(snapshot.deviceId, nextSnapshot);
  return nextSnapshot;
}

export class MockDeviceClient implements DeviceClient {
  async probeConnection(draft: DeviceRegistrationDraft): Promise<DeviceProbeResult> {
    const normalizedHost = draft.host.trim().toLowerCase();
    return Promise.resolve(createConnectionProfile(normalizedHost));
  }

  async getSnapshot(device: RegisteredDevice): Promise<DeviceSnapshot> {
    const currentSnapshot = getOrCreateDeviceState(device);
    const connectionProfile = createConnectionProfile(device.host);

    return Promise.resolve(
      saveDeviceState({
        ...currentSnapshot,
        deviceName: device.name,
        deviceHost: device.host,
        connectionState: connectionProfile.connectionState,
      }),
    );
  }

  async setPower(device: RegisteredDevice, isPoweredOn: boolean): Promise<DeviceSnapshot> {
    const connectionProfile = ensureReachable(device);
    const currentSnapshot = getOrCreateDeviceState(device);

    return Promise.resolve(
      saveDeviceState({
        ...currentSnapshot,
        connectionState: connectionProfile.connectionState,
        isPoweredOn,
        brightnessPercent: isPoweredOn ? Math.max(currentSnapshot.brightnessPercent, 25) : 0,
      }),
    );
  }

  async setBrightness(device: RegisteredDevice, brightnessPercent: number): Promise<DeviceSnapshot> {
    const connectionProfile = ensureReachable(device);
    const currentSnapshot = getOrCreateDeviceState(device);
    const nextBrightness = clampBrightness(brightnessPercent);

    return Promise.resolve(
      saveDeviceState({
        ...currentSnapshot,
        connectionState: connectionProfile.connectionState,
        isPoweredOn: nextBrightness > 0,
        brightnessPercent: nextBrightness,
      }),
    );
  }

  async setActiveScene(device: RegisteredDevice, sceneName: string): Promise<DeviceSnapshot> {
    const connectionProfile = ensureReachable(device);
    const currentSnapshot = getOrCreateDeviceState(device);

    return Promise.resolve(
      saveDeviceState({
        ...currentSnapshot,
        connectionState: connectionProfile.connectionState,
        activeSceneName: sceneName,
      }),
    );
  }

  async triggerSunriseTest(device: RegisteredDevice): Promise<DeviceSnapshot> {
    const connectionProfile = ensureReachable(device);
    const currentSnapshot = getOrCreateDeviceState(device);

    return Promise.resolve(
      saveDeviceState({
        ...currentSnapshot,
        connectionState: connectionProfile.connectionState,
        isPoweredOn: true,
        activeSceneName: 'Manual Sunrise Test',
        brightnessPercent: Math.max(currentSnapshot.brightnessPercent, 68),
      }),
    );
  }
}

export function createMockDeviceClient() {
  return new MockDeviceClient();
}
