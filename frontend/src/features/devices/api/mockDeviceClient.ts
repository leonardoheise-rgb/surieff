import type { DeviceClient } from './deviceClient';
import type {
  DeviceProbeResult,
  DeviceRegistrationDraft,
  DeviceSnapshot,
  RegisteredDevice,
} from '../domain/deviceTypes';

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
    brightnessPercent: 82,
    activeSceneName: 'Tropical Dawn',
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

export class MockDeviceClient implements DeviceClient {
  async probeConnection(draft: DeviceRegistrationDraft): Promise<DeviceProbeResult> {
    const normalizedHost = draft.host.trim().toLowerCase();
    return Promise.resolve(createConnectionProfile(normalizedHost));
  }

  async getSnapshot(device: RegisteredDevice): Promise<DeviceSnapshot> {
    const connectionProfile = createConnectionProfile(device.host);
    const defaultSnapshot = createDefaultDeviceSnapshot();

    return Promise.resolve({
      ...defaultSnapshot,
      deviceId: device.id,
      deviceName: device.name,
      deviceHost: device.host,
      connectionState: connectionProfile.connectionState,
      activeSceneName:
        connectionProfile.connectionState === 'degraded' ? 'Signal Recovery Glow' : defaultSnapshot.activeSceneName,
    });
  }
}

export function createMockDeviceClient() {
  return new MockDeviceClient();
}
