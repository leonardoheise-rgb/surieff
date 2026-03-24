export type DeviceConnectionState = 'online' | 'degraded' | 'offline';

export interface DeviceRegistrationDraft {
  name: string;
  host: string;
}

export interface RegisteredDevice {
  id: string;
  name: string;
  host: string;
  addedAt: string;
  lastConnectionState: DeviceConnectionState;
}

export interface AlarmPreview {
  id: string;
  label: string;
  time: string;
  scheduleSummary: string;
  isEnabled: boolean;
  sunriseDurationInMinutes: number;
}

export interface DeviceSnapshot {
  deviceId: string;
  deviceName: string;
  deviceHost: string;
  connectionState: DeviceConnectionState;
  firmwareVersion: string;
  brightnessPercent: number;
  activeSceneName: string;
  nextAlarm: AlarmPreview;
}

export interface DeviceSummary {
  deviceName: string;
  deviceHost: string;
  connectionState: DeviceConnectionState;
  connectionLabel: string;
  firmwareVersion: string;
  brightnessLabel: string;
  activeSceneName: string;
  nextAlarmLabel: string;
}

export interface DeviceProbeResult {
  isReachable: boolean;
  connectionState: DeviceConnectionState;
  connectionLabel: string;
  details: string;
}

export interface DeviceRegistrationResult {
  device: RegisteredDevice | null;
  probe: DeviceProbeResult;
  message: string;
}

export interface DeviceState {
  registeredDevices: RegisteredDevice[];
  activeDeviceId: string | null;
  snapshot: DeviceSnapshot | null;
  summary: DeviceSummary;
  isBusy: boolean;
  onboardingMessage: string | null;
}
