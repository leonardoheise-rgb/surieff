import { screen } from '@testing-library/react';
import { SettingsPage } from './SettingsPage';
import { renderWithRouter } from '../../../test/renderWithRouter';

describe('SettingsPage', () => {
  it('renders the capability-aware settings heading', () => {
    renderWithRouter(<SettingsPage />);

    expect(screen.getByText('Capability-aware configuration')).toBeInTheDocument();
  });

  it('renders the settings groups', () => {
    renderWithRouter(<SettingsPage />);

    expect(screen.getByText('Wake-up defaults')).toBeInTheDocument();
    expect(screen.getByText('Device naming')).toBeInTheDocument();
    expect(screen.getByText('Capability gating')).toBeInTheDocument();
  });
});
