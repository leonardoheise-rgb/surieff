import { buildAlarmScheduleSummary } from '../../alarms/domain/alarmMappers';
import { useAlarmState } from '../../alarms/state/useAlarmState';
import { OverviewCard } from '../ui/OverviewCard';
import { useDeviceControls } from '../../devices/state/useDeviceControls';
import { useDeviceSnapshot } from '../../devices/state/useDeviceSnapshot';
import { useDeviceSyncStatus } from '../../devices/state/useDeviceSyncStatus';
import './DashboardPage.css';

export function DashboardPage() {
  const { snapshot, summary, registeredDevices } = useDeviceSnapshot();
  const { alarms } = useAlarmState();
  const { inFlightCommand, lastCommandMessage, setActiveScene, setBrightness, setPower, triggerSunriseTest } =
    useDeviceControls();
  const { isBusy, refreshActiveDevice } = useDeviceSyncStatus();
  const nextAlarm = alarms[0];
  const sceneOptions = Array.from(
    new Set([...(snapshot?.availableSceneNames ?? []), ...(snapshot?.activeSceneName ? [snapshot.activeSceneName] : [])]),
  );

  const nextAlarmLabel = nextAlarm
    ? `${nextAlarm.time} - ${buildAlarmScheduleSummary(nextAlarm.recurrence)}`
    : summary.nextAlarmLabel;

  return (
    <div className="dashboard-page">
      <section className="dashboard-page__hero">
        <div>
          <p className="dashboard-page__eyebrow">Wake-up orchestration</p>
          <h2>{summary.activeSceneName}</h2>
          <p className="dashboard-page__lede">
            Sprint 3 turns the dashboard into a live control surface with optimistic device sync,
            manual scene selection, and power controls.
          </p>
        </div>

        <div className="dashboard-page__hero-actions">
          <button
            className="dashboard-page__refresh-button"
            onClick={() => void refreshActiveDevice()}
            type="button"
          >
            {inFlightCommand === 'refresh' ? 'Refreshing...' : 'Refresh device status'}
          </button>
          {lastCommandMessage ? (
            <p className="dashboard-page__status" role="status">
              {lastCommandMessage}
            </p>
          ) : null}
        </div>
      </section>

      <section className="dashboard-page__grid" aria-label="Device summary widgets">
        <OverviewCard title="Connection" value={summary.connectionLabel} supportingText={summary.deviceHost} />
        <OverviewCard
          title="Power"
          value={snapshot?.isPoweredOn ? 'On' : 'Off'}
          supportingText="Current lamp power state"
        />
        <OverviewCard
          title="Brightness"
          value={summary.brightnessLabel}
          supportingText="Current simulated light output"
        />
        <OverviewCard
          title="Scene"
          value={summary.activeSceneName}
          supportingText="Live scene selected on the device"
        />
        <OverviewCard
          title="Next alarm"
          value={nextAlarmLabel}
          supportingText="Upcoming sunrise routine"
        />
        <OverviewCard
          title="Last sync"
          value={snapshot ? new Date(snapshot.lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
          supportingText={`${registeredDevices.length} registered lamp(s)`}
        />
      </section>

      <div className="dashboard-page__controls-grid">
        <section className="dashboard-page__panel">
          <div className="dashboard-page__section-heading">
            <div>
              <p className="dashboard-page__section-label">Live controls</p>
              <h3>Manual lamp control</h3>
            </div>
            <span className="dashboard-page__badge">
              {isBusy ? 'Syncing' : 'Ready'}
            </span>
          </div>

          <div className="dashboard-page__control-group">
            <span className="dashboard-page__control-label">Power</span>
            <div className="dashboard-page__button-row">
              <button
                className={snapshot?.isPoweredOn ? 'dashboard-page__pill dashboard-page__pill--active' : 'dashboard-page__pill'}
                onClick={() => void setPower(true)}
                type="button"
              >
                Turn on
              </button>
              <button
                className={!snapshot?.isPoweredOn ? 'dashboard-page__pill dashboard-page__pill--active' : 'dashboard-page__pill'}
                onClick={() => void setPower(false)}
                type="button"
              >
                Turn off
              </button>
            </div>
          </div>

          <div className="dashboard-page__control-group">
            <label className="dashboard-page__control-label" htmlFor="brightness-range">
              Brightness: {snapshot?.brightnessPercent ?? 0}%
            </label>
            <input
              id="brightness-range"
              max={100}
              min={0}
              onChange={(event) => void setBrightness(Number(event.target.value))}
              type="range"
              value={snapshot?.brightnessPercent ?? 0}
            />
          </div>

          <div className="dashboard-page__control-group">
            <label className="dashboard-page__control-label" htmlFor="scene-select">
              Preset scene
            </label>
            <select
              id="scene-select"
              onChange={(event) => void setActiveScene(event.target.value)}
              value={snapshot?.activeSceneName ?? ''}
            >
              {sceneOptions.map((sceneName) => (
                <option key={sceneName} value={sceneName}>
                  {sceneName}
                </option>
              ))}
            </select>
          </div>

          <button
            className="dashboard-page__sunrise-button"
            onClick={() => void triggerSunriseTest()}
            type="button"
          >
            {inFlightCommand === 'sunrise-test' ? 'Starting sunrise test...' : 'Run sunrise test'}
          </button>
        </section>

        <section className="dashboard-page__panel">
          <div>
            <p className="dashboard-page__section-label">Current alarm</p>
            <h3>{nextAlarm?.label ?? snapshot?.nextAlarm.label ?? 'Loading next alarm'}</h3>
            <p>
              {nextAlarm
                ? buildAlarmScheduleSummary(nextAlarm.recurrence)
                : snapshot?.nextAlarm.scheduleSummary ?? 'Preparing recurring wake-up data'}
            </p>
          </div>

          <dl className="dashboard-page__facts">
            <div>
              <dt>Time</dt>
              <dd>{nextAlarm?.time ?? snapshot?.nextAlarm.time ?? '--:--'}</dd>
            </div>
            <div>
              <dt>Duration</dt>
              <dd>{nextAlarm?.routine.durationInMinutes ?? snapshot?.nextAlarm.sunriseDurationInMinutes ?? 0} min</dd>
            </div>
            <div>
              <dt>State</dt>
              <dd>
                {nextAlarm ? (nextAlarm.isEnabled ? 'Enabled' : 'Disabled') : snapshot?.nextAlarm.isEnabled ? 'Enabled' : 'Disabled'}
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
