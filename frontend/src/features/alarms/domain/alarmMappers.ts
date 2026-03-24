import { createDefaultAlarm, defaultAlarmFormValues } from './alarmDefaults';
import type { AlarmFormValues, AlarmWeekday, SunriseAlarm } from './alarmTypes';

const weekdayLabels: Record<AlarmWeekday, string> = {
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
  sat: 'Sat',
  sun: 'Sun',
};

export function buildAlarmFromForm(values: AlarmFormValues, nowIso: string = new Date().toISOString()): SunriseAlarm {
  return {
    id: `${values.label.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${values.time.replace(':', '')}`,
    label: values.label.trim(),
    time: values.time,
    recurrence: values.recurrence,
    isEnabled: values.isEnabled,
    audioMode: values.audioMode,
    routine: {
      gradientStyle: values.gradientStyle,
      durationInMinutes: values.durationInMinutes,
      maxBrightnessPercent: values.maxBrightnessPercent,
    },
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}

export function updateAlarmFromForm(alarmId: string, existingAlarm: SunriseAlarm, values: AlarmFormValues): SunriseAlarm {
  return {
    ...existingAlarm,
    id: alarmId,
    label: values.label.trim(),
    time: values.time,
    recurrence: values.recurrence,
    isEnabled: values.isEnabled,
    audioMode: values.audioMode,
    routine: {
      gradientStyle: values.gradientStyle,
      durationInMinutes: values.durationInMinutes,
      maxBrightnessPercent: values.maxBrightnessPercent,
    },
    updatedAt: new Date().toISOString(),
  };
}

export function buildFormValuesFromAlarm(alarm: SunriseAlarm): AlarmFormValues {
  return {
    label: alarm.label,
    time: alarm.time,
    recurrence: alarm.recurrence,
    isEnabled: alarm.isEnabled,
    audioMode: alarm.audioMode,
    gradientStyle: alarm.routine.gradientStyle,
    durationInMinutes: alarm.routine.durationInMinutes,
    maxBrightnessPercent: alarm.routine.maxBrightnessPercent,
  };
}

export function buildAlarmScheduleSummary(recurrence: AlarmWeekday[]): string {
  if (recurrence.length === 7) {
    return 'Every day';
  }

  const isWeekdayRoutine =
    recurrence.length === 5 &&
    ['mon', 'tue', 'wed', 'thu', 'fri'].every((weekday) => recurrence.includes(weekday as AlarmWeekday));

  if (isWeekdayRoutine) {
    return 'Weekdays';
  }

  return recurrence.map((weekday) => weekdayLabels[weekday]).join(', ');
}

export function buildRoutinePreview(values: AlarmFormValues): string[] {
  return [
    `Minute 0: begin ${values.gradientStyle} glow at 5% output.`,
    `Minute ${Math.max(1, Math.floor(values.durationInMinutes / 3))}: introduce warm color shift.`,
    `Minute ${Math.max(2, Math.floor((values.durationInMinutes * 2) / 3))}: fade in ${values.audioMode} audio.`,
    `Minute ${values.durationInMinutes}: reach ${values.maxBrightnessPercent}% brightness.`,
  ];
}

export function duplicateAlarm(existingAlarm: SunriseAlarm): SunriseAlarm {
  const duplicatedBase = buildFormValuesFromAlarm(existingAlarm);
  return buildAlarmFromForm(
    {
      ...duplicatedBase,
      label: `${existingAlarm.label} Copy`,
    },
    new Date().toISOString(),
  );
}

export function createFallbackAlarmCollection(): SunriseAlarm[] {
  return [createDefaultAlarm()];
}

export { defaultAlarmFormValues };

