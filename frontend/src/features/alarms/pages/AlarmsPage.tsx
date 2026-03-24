import { defaultAlarmFormValues, buildAlarmScheduleSummary, buildRoutinePreview } from '../domain/alarmMappers';
import type { AlarmWeekday } from '../domain/alarmTypes';
import { useAlarmState } from '../state/useAlarmState';
import './AlarmsPage.css';

const weekdays: Array<{ value: AlarmWeekday; label: string }> = [
  { value: 'mon', label: 'Mon' },
  { value: 'tue', label: 'Tue' },
  { value: 'wed', label: 'Wed' },
  { value: 'thu', label: 'Thu' },
  { value: 'fri', label: 'Fri' },
  { value: 'sat', label: 'Sat' },
  { value: 'sun', label: 'Sun' },
];

export function AlarmsPage() {
  const {
    alarms,
    createAlarm,
    deleteAlarm,
    duplicateAlarmById,
    formValues,
    resetForm,
    selectedAlarmId,
    selectAlarm,
    setFormValues,
    statusMessage,
    toggleAlarm,
    updateAlarm,
  } = useAlarmState();

  const previewSteps = buildRoutinePreview(formValues);
  const selectedAlarm = alarms.find((alarm) => alarm.id === selectedAlarmId) ?? null;

  function toggleWeekday(weekday: AlarmWeekday) {
    const nextRecurrence = formValues.recurrence.includes(weekday)
      ? formValues.recurrence.filter((currentWeekday) => currentWeekday !== weekday)
      : [...formValues.recurrence, weekday];

    setFormValues({
      ...formValues,
      recurrence: nextRecurrence,
    });
  }

  function startNewAlarmDraft() {
    selectAlarm(null);
    setFormValues({
      ...defaultAlarmFormValues,
      label: `Alarm ${alarms.length + 1}`,
      time: '07:00',
    });
  }

  return (
    <section className="alarms-page">
      <header className="alarms-page__header">
        <p className="alarms-page__eyebrow">Alarm engine</p>
        <h2>Alarm presets and sunrise routines</h2>
        <p>
          Sprint 2 introduces alarm CRUD, recurrence rules, and a sunrise routine editor with a
          preview timeline.
        </p>
      </header>

      <div className="alarms-page__grid">
        <section className="alarm-editor">
          <div className="alarm-editor__header">
            <div>
              <p className="alarm-editor__eyebrow">Editor</p>
              <h3>{selectedAlarm ? `Editing ${selectedAlarm.label}` : 'Create a new alarm'}</h3>
            </div>
            <button className="alarm-editor__ghost-button" onClick={startNewAlarmDraft} type="button">
              New draft
            </button>
          </div>

          <div className="alarm-editor__form-grid">
            <label className="alarm-field">
              <span>Alarm label</span>
              <input
                onChange={(event) => setFormValues({ ...formValues, label: event.target.value })}
                value={formValues.label}
              />
            </label>

            <label className="alarm-field">
              <span>Wake-up time</span>
              <input
                onChange={(event) => setFormValues({ ...formValues, time: event.target.value })}
                type="time"
                value={formValues.time}
              />
            </label>

            <label className="alarm-field">
              <span>Audio mode</span>
              <select
                onChange={(event) =>
                  setFormValues({
                    ...formValues,
                    audioMode: event.target.value as typeof formValues.audioMode,
                  })
                }
                value={formValues.audioMode}
              >
                <option value="birds">Birds</option>
                <option value="chimes">Chimes</option>
                <option value="silent">Silent</option>
              </select>
            </label>

            <label className="alarm-field">
              <span>Gradient style</span>
              <select
                onChange={(event) =>
                  setFormValues({
                    ...formValues,
                    gradientStyle: event.target.value as typeof formValues.gradientStyle,
                  })
                }
                value={formValues.gradientStyle}
              >
                <option value="tropical">Tropical</option>
                <option value="golden">Golden</option>
                <option value="ember">Ember</option>
                <option value="soft">Soft</option>
              </select>
            </label>
          </div>

          <div className="alarm-field">
            <span>Recurrence</span>
            <div className="weekday-list">
              {weekdays.map((weekday) => (
                <button
                  className={
                    formValues.recurrence.includes(weekday.value)
                      ? 'weekday-pill weekday-pill--active'
                      : 'weekday-pill'
                  }
                  key={weekday.value}
                  onClick={() => toggleWeekday(weekday.value)}
                  type="button"
                >
                  {weekday.label}
                </button>
              ))}
            </div>
          </div>

          <div className="alarm-editor__form-grid">
            <label className="alarm-field">
              <span>Sunrise duration</span>
              <input
                max={120}
                min={5}
                onChange={(event) =>
                  setFormValues({
                    ...formValues,
                    durationInMinutes: Number(event.target.value),
                  })
                }
                type="number"
                value={formValues.durationInMinutes}
              />
            </label>

            <label className="alarm-field">
              <span>Max brightness</span>
              <input
                max={100}
                min={10}
                onChange={(event) =>
                  setFormValues({
                    ...formValues,
                    maxBrightnessPercent: Number(event.target.value),
                  })
                }
                type="number"
                value={formValues.maxBrightnessPercent}
              />
            </label>
          </div>

          <label className="alarm-toggle">
            <input
              checked={formValues.isEnabled}
              onChange={(event) =>
                setFormValues({
                  ...formValues,
                  isEnabled: event.target.checked,
                })
              }
              type="checkbox"
            />
            <span>Enable alarm after saving</span>
          </label>

          <div className="alarm-editor__actions">
            <button className="alarm-editor__primary-button" onClick={selectedAlarm ? updateAlarm : createAlarm} type="button">
              {selectedAlarm ? 'Save changes' : 'Create alarm'}
            </button>
            <button className="alarm-editor__secondary-button" onClick={resetForm} type="button">
              Reset form
            </button>
          </div>

          {statusMessage ? (
            <p className="alarm-editor__status" role="status">
              {statusMessage}
            </p>
          ) : null}
        </section>

        <section className="alarm-preview-panel">
          <div className="alarm-preview-panel__section">
            <p className="alarm-preview-panel__eyebrow">Routine preview</p>
            <h3>{formValues.label}</h3>
            <p>{buildAlarmScheduleSummary(formValues.recurrence)}</p>
          </div>

          <div className="alarm-preview-panel__timeline">
            {previewSteps.map((step) => (
              <div className="alarm-preview-panel__step" key={step}>
                {step}
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="alarm-list-panel">
        <div className="alarm-list-panel__header">
          <p className="alarm-list-panel__eyebrow">Saved alarms</p>
          <h3>{alarms.length} configured alarm(s)</h3>
        </div>

        <div className="alarm-list">
          {alarms.map((alarm) => (
            <article className="alarm-card" key={alarm.id}>
              <div>
                <p className="alarm-card__label">{alarm.label}</p>
                <h4>{alarm.time}</h4>
                <p>{buildAlarmScheduleSummary(alarm.recurrence)}</p>
              </div>
              <div className="alarm-card__details">
                <span>{alarm.routine.durationInMinutes} min sunrise</span>
                <span>{alarm.routine.maxBrightnessPercent}% brightness</span>
                <span>{alarm.audioMode}</span>
                <span>{alarm.isEnabled ? 'Enabled' : 'Disabled'}</span>
              </div>
              <div className="alarm-card__actions">
                <button onClick={() => selectAlarm(alarm.id)} type="button">
                  Edit
                </button>
                <button onClick={() => duplicateAlarmById(alarm.id)} type="button">
                  Duplicate
                </button>
                <button onClick={() => toggleAlarm(alarm.id)} type="button">
                  {alarm.isEnabled ? 'Disable' : 'Enable'}
                </button>
                <button onClick={() => deleteAlarm(alarm.id)} type="button">
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
