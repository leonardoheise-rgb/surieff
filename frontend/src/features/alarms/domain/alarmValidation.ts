import type { AlarmFormValues, SunriseAlarm } from './alarmTypes';

const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function validateAlarmForm(
  values: AlarmFormValues,
  existingAlarms: SunriseAlarm[],
  editedAlarmId?: string | null,
): string[] {
  const errors: string[] = [];
  const trimmedLabel = values.label.trim();

  if (!trimmedLabel) {
    errors.push('Alarm label is required.');
  }

  if (!timePattern.test(values.time)) {
    errors.push('Alarm time must use the HH:MM 24-hour format.');
  }

  if (values.recurrence.length === 0) {
    errors.push('Select at least one weekday.');
  }

  if (values.durationInMinutes < 5 || values.durationInMinutes > 120) {
    errors.push('Sunrise duration must stay between 5 and 120 minutes.');
  }

  if (values.maxBrightnessPercent < 10 || values.maxBrightnessPercent > 100) {
    errors.push('Max brightness must stay between 10% and 100%.');
  }

  const normalizedLabel = trimmedLabel.toLowerCase();
  const hasDuplicateLabel = existingAlarms.some(
    (alarm) => alarm.id !== editedAlarmId && alarm.label.trim().toLowerCase() === normalizedLabel,
  );

  if (hasDuplicateLabel) {
    errors.push('Alarm labels must be unique per device.');
  }

  return errors;
}

