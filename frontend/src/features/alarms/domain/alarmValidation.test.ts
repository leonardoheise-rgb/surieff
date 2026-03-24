import { defaultAlarmFormValues } from './alarmDefaults';
import { buildAlarmFromForm } from './alarmMappers';
import { validateAlarmForm } from './alarmValidation';

describe('validateAlarmForm', () => {
  it('requires a label', () => {
    expect(
      validateAlarmForm(
        {
          ...defaultAlarmFormValues,
          label: '',
        },
        [],
      ),
    ).toContain('Alarm label is required.');
  });

  it('requires at least one weekday', () => {
    expect(
      validateAlarmForm(
        {
          ...defaultAlarmFormValues,
          recurrence: [],
        },
        [],
      ),
    ).toContain('Select at least one weekday.');
  });

  it('blocks duplicate labels on the same device', () => {
    const existingAlarm = buildAlarmFromForm(defaultAlarmFormValues, '2026-03-24T06:00:00.000Z');

    expect(validateAlarmForm(defaultAlarmFormValues, [existingAlarm])).toContain(
      'Alarm labels must be unique per device.',
    );
  });
});

