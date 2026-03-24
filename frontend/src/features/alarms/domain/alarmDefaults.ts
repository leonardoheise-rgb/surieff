import type { AlarmFormValues, SunriseAlarm } from './alarmTypes';

export const defaultAlarmFormValues: AlarmFormValues = {
  label: 'Weekday Wake Up',
  time: '06:30',
  recurrence: ['mon', 'tue', 'wed', 'thu', 'fri'],
  isEnabled: true,
  audioMode: 'birds',
  gradientStyle: 'tropical',
  durationInMinutes: 30,
  maxBrightnessPercent: 82,
};

export function createDefaultAlarm(nowIso: string = new Date('2026-03-24T06:00:00.000Z').toISOString()): SunriseAlarm {
  return {
    id: 'weekday-wakeup',
    label: defaultAlarmFormValues.label,
    time: defaultAlarmFormValues.time,
    recurrence: defaultAlarmFormValues.recurrence,
    isEnabled: defaultAlarmFormValues.isEnabled,
    audioMode: defaultAlarmFormValues.audioMode,
    routine: {
      gradientStyle: defaultAlarmFormValues.gradientStyle,
      durationInMinutes: defaultAlarmFormValues.durationInMinutes,
      maxBrightnessPercent: defaultAlarmFormValues.maxBrightnessPercent,
    },
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}

