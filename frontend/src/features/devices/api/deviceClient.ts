import type {
  DeviceProbeResult,
  DeviceRegistrationDraft,
  DeviceSnapshot,
  RegisteredDevice,
} from '../domain/deviceTypes';

export interface DeviceClient {
  probeConnection(draft: DeviceRegistrationDraft): Promise<DeviceProbeResult>;
  getSnapshot(device: RegisteredDevice): Promise<DeviceSnapshot>;
}
