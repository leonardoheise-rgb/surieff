import type { SunriseAlarm } from '../domain/alarmTypes';
import { loadAlarmRegistry, persistAlarmRegistry } from './alarmStorage';

describe('alarmStorage', () => {
  it('returns an empty registry by default', () => {
    expect(loadAlarmRegistry()).toEqual({});
  });

  it('persists alarms by device id', () => {
    const registry: Record<string, SunriseAlarm[]> = {
      'mock-default-device': [
        {
          id: 'weekday-wakeup',
          label: 'Weekday Wake Up',
          time: '06:30',
          recurrence: ['mon', 'tue', 'wed', 'thu', 'fri'],
          isEnabled: true,
          audioMode: 'birds',
          routine: {
            gradientStyle: 'tropical',
            durationInMinutes: 30,
            maxBrightnessPercent: 82,
          },
          createdAt: '2026-03-24T06:00:00.000Z',
          updatedAt: '2026-03-24T06:00:00.000Z',
        },
      ],
    };

    persistAlarmRegistry(registry);

    expect(loadAlarmRegistry()).toEqual(registry);
  });
});
