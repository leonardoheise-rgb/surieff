import { buildDeviceSummary } from './deviceSummary';
import type { DeviceSnapshot } from './deviceTypes';

const baseSnapshot: DeviceSnapshot = {
  deviceId: 'bedside-solaris',
  deviceName: 'Bedside Solaris',
  deviceHost: '192.168.1.22',
  connectionState: 'online',
  firmwareVersion: 'WLED 0.15.0',
  isPoweredOn: true,
  brightnessPercent: 68,
  activeSceneName: 'Golden Wake',
  availableSceneNames: ['Golden Wake', 'Soft Horizon'],
  lastSyncedAt: '2026-03-24T06:15:00.000Z',
  nextAlarm: {
    id: 'weekday',
    label: 'Weekday',
    time: '06:10',
    scheduleSummary: 'Weekdays',
    isEnabled: true,
    sunriseDurationInMinutes: 25,
  },
};

describe('buildDeviceSummary', () => {
  it('creates a readable next alarm label', () => {
    expect(buildDeviceSummary(baseSnapshot).nextAlarmLabel).toBe('06:10 - Weekdays');
  });

  it('maps connection states to human labels', () => {
    expect(buildDeviceSummary(baseSnapshot).connectionLabel).toBe('Connected');
    expect(
      buildDeviceSummary({ ...baseSnapshot, connectionState: 'offline' }).connectionLabel,
    ).toBe('Offline');
  });
});
