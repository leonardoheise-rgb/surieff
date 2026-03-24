import { useState } from 'react';
import { useDeviceSnapshot } from '../state/useDeviceSnapshot';
import './OnboardingPage.css';

const onboardingSteps = [
  'Power the ESP32 and connect it to your local Wi-Fi.',
  'Enter the WLED host or IP so Solaris can validate the device.',
  'Confirm compatibility, save the lamp profile, and select it as active.',
];

export function OnboardingPage() {
  const {
    activeDeviceId,
    isBusy,
    onboardingMessage,
    registerDevice,
    registeredDevices,
    selectDevice,
  } = useDeviceSnapshot();
  const [deviceName, setDeviceName] = useState('');
  const [deviceHost, setDeviceHost] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await registerDevice({
      name: deviceName,
      host: deviceHost,
    });

    if (result.device) {
      setDeviceName('');
      setDeviceHost('');
    }
  }

  return (
    <section className="onboarding-page">
      <header className="onboarding-page__header">
        <p className="onboarding-page__eyebrow">Device onboarding</p>
        <h2>Register and validate a Solaris lamp</h2>
        <p>
          Sprint 1 adds manual device registration, persisted lamp profiles, and connectivity-aware
          status handling.
        </p>
      </header>

      <div className="onboarding-page__grid">
        <section className="onboarding-card">
          <h3>Add device</h3>

          <form className="onboarding-form" onSubmit={(event) => void handleSubmit(event)}>
            <label className="onboarding-field">
              <span>Device name</span>
              <input
                name="deviceName"
                onChange={(event) => setDeviceName(event.target.value)}
                placeholder="Bedroom Lamp"
                value={deviceName}
              />
            </label>

            <label className="onboarding-field">
              <span>Host or IP</span>
              <input
                name="deviceHost"
                onChange={(event) => setDeviceHost(event.target.value)}
                placeholder="solaris.local or 192.168.1.25"
                value={deviceHost}
              />
            </label>

            <button className="onboarding-button" disabled={isBusy} type="submit">
              {isBusy ? 'Validating device...' : 'Validate and save'}
            </button>
          </form>

          {onboardingMessage ? (
            <p className="onboarding-status" role="status">
              {onboardingMessage}
            </p>
          ) : null}
        </section>

        <section className="onboarding-card">
          <h3>Registered devices</h3>

          {registeredDevices.length === 0 ? (
            <p className="onboarding-empty">No devices yet. Add your first lamp to continue.</p>
          ) : (
            <div className="registered-device-list">
              {registeredDevices.map((device) => (
                <article className="registered-device-card" key={device.id}>
                  <div>
                    <p className="registered-device-card__eyebrow">{device.lastConnectionState}</p>
                    <h4>{device.name}</h4>
                    <p>{device.host}</p>
                  </div>
                  <button
                    className="registered-device-card__button"
                    disabled={device.id === activeDeviceId}
                    onClick={() => void selectDevice(device.id)}
                    type="button"
                  >
                    {device.id === activeDeviceId ? 'Active device' : 'Make active'}
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <ol className="onboarding-checklist">
        {onboardingSteps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </section>
  );
}
