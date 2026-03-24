import { defaultAlarmFormValues } from './alarmDefaults';
import {
  buildAlarmFromForm,
  buildAlarmScheduleSummary,
  buildRoutinePreview,
  duplicateAlarm,
} from './alarmMappers';

describe('alarmMappers', () => {
  it('builds a weekday summary', () => {
    expect(buildAlarmScheduleSummary(['mon', 'tue', 'wed', 'thu', 'fri'])).toBe('Weekdays');
  });

  it('creates a four-step routine preview', () => {
    expect(buildRoutinePreview(defaultAlarmFormValues)).toHaveLength(4);
  });

  it('duplicates alarms with a copy suffix', () => {
    const sourceAlarm = buildAlarmFromForm(defaultAlarmFormValues, '2026-03-24T06:00:00.000Z');

    expect(duplicateAlarm(sourceAlarm).label).toBe('Weekday Wake Up Copy');
  });
});

