import type { RegisteredDevice } from './deviceTypes';

export function upsertRegisteredDevice(
  devices: RegisteredDevice[],
  candidate: RegisteredDevice,
): RegisteredDevice[] {
  const existingDeviceIndex = devices.findIndex(
    (device) => device.id === candidate.id || device.host === candidate.host,
  );

  if (existingDeviceIndex === -1) {
    return [candidate, ...devices];
  }

  return devices.map((device, index) =>
    index === existingDeviceIndex
      ? {
          ...device,
          ...candidate,
        }
      : device,
  );
}

export function updateDeviceConnectionState(
  devices: RegisteredDevice[],
  deviceId: string,
  connectionState: RegisteredDevice['lastConnectionState'],
): RegisteredDevice[] {
  let didChange = false;

  const nextDevices = devices.map((device) => {
    if (device.id !== deviceId || device.lastConnectionState === connectionState) {
      return device;
    }

    didChange = true;

    return {
      ...device,
      lastConnectionState: connectionState,
    };
  });

  return didChange ? nextDevices : devices;
}
