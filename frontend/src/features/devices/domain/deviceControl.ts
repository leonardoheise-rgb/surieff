import type { DeviceCommand, DeviceSnapshot } from './deviceTypes';

export function clampBrightness(value: number) {
  return Math.min(100, Math.max(0, value));
}

export function applySnapshotPatch(
  snapshot: DeviceSnapshot,
  patch: Partial<DeviceSnapshot>,
): DeviceSnapshot {
  return {
    ...snapshot,
    ...patch,
    lastSyncedAt: new Date().toISOString(),
  };
}

export function buildCommandSuccessMessage(command: DeviceCommand, detail?: string) {
  const messageByCommand: Record<DeviceCommand, string> = {
    power: 'Power state updated.',
    brightness: 'Brightness updated.',
    scene: 'Scene updated.',
    'sunrise-test': 'Sunrise test started.',
    refresh: 'Device status refreshed.',
  };

  return detail ? `${messageByCommand[command]} ${detail}` : messageByCommand[command];
}

export function buildCommandFailureMessage(command: DeviceCommand) {
  const messageByCommand: Record<DeviceCommand, string> = {
    power: 'Power command failed. Restoring the last confirmed device state.',
    brightness: 'Brightness command failed. Restoring the last confirmed device state.',
    scene: 'Scene selection failed. Restoring the last confirmed device state.',
    'sunrise-test': 'Sunrise test failed. Restoring the last confirmed device state.',
    refresh: 'Refresh failed. Keeping the last confirmed device state.',
  };

  return messageByCommand[command];
}
