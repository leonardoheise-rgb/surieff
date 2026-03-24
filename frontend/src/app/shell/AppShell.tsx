import { NavLink, Outlet } from 'react-router-dom';
import { useDeviceSnapshot } from '../../features/devices/state/useDeviceSnapshot';
import './AppShell.css';

const navigationItems = [
  { label: 'Dashboard', to: '/' },
  { label: 'Onboarding', to: '/onboarding' },
  { label: 'Alarms', to: '/alarms' },
  { label: 'Settings', to: '/settings' },
];

export function AppShell() {
  const { summary, registeredDevices } = useDeviceSnapshot();

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div>
          <p className="brand-kicker">Solaris Companion</p>
          <h1 className="brand-title">Radiant Horizon Control Center</h1>
        </div>
        <div className={`connection-pill connection-pill--${summary.connectionState}`}>
          <span className="connection-dot" />
          <span>{summary.connectionLabel}</span>
        </div>
      </header>

      <div className="app-shell__body">
        <aside className="side-panel">
          <section className="hero-card">
            <p className="hero-card__eyebrow">Current device</p>
            <h2>{summary.deviceName}</h2>
            <p>{summary.deviceHost}</p>
            <p className="hero-card__meta">{registeredDevices.length} registered device(s)</p>
          </section>

          <nav className="nav-list" aria-label="Primary navigation">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                className={({ isActive }) =>
                  isActive ? 'nav-list__link nav-list__link--active' : 'nav-list__link'
                }
                to={item.to}
                end={item.to === '/'}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="content-panel">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
