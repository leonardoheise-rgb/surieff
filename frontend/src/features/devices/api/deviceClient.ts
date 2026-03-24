import type {
  DeviceProbeResult,
  DeviceRegistrationDraft,
  DeviceSnapshot,
  RegisteredDevice,
} from '../domain/deviceTypes';

export interface DeviceClient {
  probeConnection(draft: DeviceRegistrationDraft): Promise<DeviceProbeResult>;
  getSnapshot(device: RegisteredDevice): Promise<DeviceSnapshot>;
  setPower(device: RegisteredDevice, isPoweredOn: boolean): Promise<DeviceSnapshot>;
  setBrightness(device: RegisteredDevice, brightnessPercent: number): Promise<DeviceSnapshot>;
  setActiveScene(device: RegisteredDevice, sceneName: string): Promise<DeviceSnapshot>;
  triggerSunriseTest(device: RegisteredDevice): Promise<DeviceSnapshot>;
}
