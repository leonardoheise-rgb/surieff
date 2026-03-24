import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('renders the Solaris shell title', async () => {
    render(<App />);

    expect(await screen.findByText('Radiant Horizon Control Center')).toBeInTheDocument();
  });

  it('renders the primary navigation links', async () => {
    render(<App />);

    expect(await screen.findByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Onboarding' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Alarms' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Settings' })).toBeInTheDocument();
  });
});
