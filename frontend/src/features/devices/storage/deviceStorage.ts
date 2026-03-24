import type { RegisteredDevice } from '../domain/deviceTypes';

const registryStorageKey = 'solaris.registeredDevices';
const activeDeviceStorageKey = 'solaris.activeDeviceId';

interface PersistedDeviceState {
  registeredDevices: RegisteredDevice[];
  activeDeviceId: string | null;
}

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function loadPersistedDeviceState(): PersistedDeviceState {
  if (!canUseStorage()) {
    return {
      registeredDevices: [],
      activeDeviceId: null,
    };
  }

  const registeredDevicesRaw = window.localStorage.getItem(registryStorageKey);
  const activeDeviceId = window.localStorage.getItem(activeDeviceStorageKey);

  return {
    registeredDevices: registeredDevicesRaw ? (JSON.parse(registeredDevicesRaw) as RegisteredDevice[]) : [],
    activeDeviceId,
  };
}

export function persistRegisteredDevices(registeredDevices: RegisteredDevice[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(registryStorageKey, JSON.stringify(registeredDevices));
}

export function persistActiveDeviceId(activeDeviceId: string | null) {
  if (!canUseStorage()) {
    return;
  }

  if (activeDeviceId) {
    window.localStorage.setItem(activeDeviceStorageKey, activeDeviceId);
    return;
  }

  window.localStorage.removeItem(activeDeviceStorageKey);
}
