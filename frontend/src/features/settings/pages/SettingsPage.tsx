import { useDeviceSnapshot } from '../../devices/state/useDeviceSnapshot';
import './SettingsPage.css';

const settingsGroups = [
  {
    title: 'Wake-up defaults',
    description: 'Default sunrise duration, brightness ceiling, and fallback routine.',
  },
  {
    title: 'Device naming',
    description: 'Friendly labels for the room, lamp, and integration profile.',
  },
  {
    title: 'Capability gating',
    description: 'Show only the settings that match the current hardware profile.',
  },
];

export function SettingsPage() {
  const { summary } = useDeviceSnapshot();

  return (
    <section className="settings-page">
      <header className="settings-page__header">
        <p className="settings-page__eyebrow">Advanced settings</p>
        <h2>Capability-aware configuration</h2>
        <p>
          Current target firmware: <strong>{summary.firmwareVersion}</strong>
        </p>
      </header>

      <div className="settings-page__grid">
        {settingsGroups.map((group) => (
          <article key={group.title} className="settings-card">
            <h3>{group.title}</h3>
            <p>{group.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
