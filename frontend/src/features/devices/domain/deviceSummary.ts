import type { DeviceConnectionState, DeviceSnapshot, DeviceSummary } from './deviceTypes';

const connectionLabelsByState: Record<DeviceConnectionState, string> = {
  online: 'Connected',
  degraded: 'Signal recovering',
  offline: 'Offline',
};

export function buildDeviceSummary(snapshot: DeviceSnapshot): DeviceSummary {
  return {
    deviceName: snapshot.deviceName,
    deviceHost: snapshot.deviceHost,
    connectionState: snapshot.connectionState,
    connectionLabel: connectionLabelsByState[snapshot.connectionState],
    firmwareVersion: snapshot.firmwareVersion,
    brightnessLabel: `${snapshot.brightnessPercent}% brightness`,
    activeSceneName: snapshot.activeSceneName,
    nextAlarmLabel: `${snapshot.nextAlarm.time} - ${snapshot.nextAlarm.scheduleSummary}`,
  };
}

export function createEmptyDeviceSummary(): DeviceSummary {
  return {
    deviceName: 'No device selected',
    deviceHost: 'Add a lamp in onboarding',
    connectionState: 'offline',
    connectionLabel: 'No device registered',
    firmwareVersion: 'Unknown firmware',
    brightnessLabel: 'Brightness unavailable',
    activeSceneName: 'Waiting for a device',
    nextAlarmLabel: 'No alarm loaded',
  };
}
