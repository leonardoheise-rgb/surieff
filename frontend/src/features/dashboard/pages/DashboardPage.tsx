import { buildAlarmScheduleSummary } from '../../alarms/domain/alarmMappers';
import { useAlarmState } from '../../alarms/state/useAlarmState';
import { OverviewCard } from '../ui/OverviewCard';
import { useDeviceSnapshot } from '../../devices/state/useDeviceSnapshot';
import './DashboardPage.css';

export function DashboardPage() {
  const { snapshot, summary, registeredDevices, refreshActiveDevice, isBusy } = useDeviceSnapshot();
  const { alarms } = useAlarmState();
  const nextAlarm = alarms[0];

  return (
    <div className="dashboard-page">
      <section className="dashboard-page__hero">
        <p className="dashboard-page__eyebrow">Wake-up orchestration</p>
        <h2>{summary.activeSceneName}</h2>
        <p className="dashboard-page__lede">
          Sprint 1 adds device registration, persisted profiles, and connectivity-aware status so
          the control center can behave like a real onboarding surface before hardware integration.
        </p>
        <button className="dashboard-page__refresh-button" onClick={() => void refreshActiveDevice()} type="button">
          {isBusy ? 'Refreshing...' : 'Refresh device status'}
        </button>
      </section>

      <section className="dashboard-page__grid" aria-label="Device summary widgets">
        <OverviewCard title="Connection" value={summary.connectionLabel} supportingText={summary.deviceHost} />
        <OverviewCard
          title="Brightness"
          value={summary.brightnessLabel}
          supportingText="Current simulated light output"
        />
        <OverviewCard
          title="Firmware"
          value={summary.firmwareVersion}
          supportingText="Mocked WLED compatibility target"
        />
        <OverviewCard
          title="Next alarm"
          value={nextAlarm ? `${nextAlarm.time} - ${buildAlarmScheduleSummary(nextAlarm.recurrence)}` : summary.nextAlarmLabel}
          supportingText="Upcoming sunrise routine"
        />
      </section>

      <section className="dashboard-page__panel">
        <div>
          <p className="dashboard-page__section-label">Registered lamps</p>
          <h3>{registeredDevices.length}</h3>
          <p>Device profiles available for selection and future polling.</p>
        </div>
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
            <dd>{nextAlarm ? (nextAlarm.isEnabled ? 'Enabled' : 'Disabled') : snapshot?.nextAlarm.isEnabled ? 'Enabled' : 'Disabled'}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
