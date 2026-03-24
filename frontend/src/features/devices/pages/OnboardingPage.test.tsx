import { fireEvent, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { OnboardingPage } from './OnboardingPage';
import { renderWithRouter } from '../../../test/renderWithRouter';

describe('OnboardingPage', () => {
  it('renders the onboarding title', () => {
    renderWithRouter(<OnboardingPage />);

    expect(screen.getByText('Register and validate a Solaris lamp')).toBeInTheDocument();
  });

  it('shows validation feedback from the shared device store', async () => {
    const registerDevice = vi.fn().mockResolvedValue({
      device: null,
      probe: {
        isReachable: false,
        connectionState: 'offline',
        connectionLabel: 'Offline',
        details: 'Device name is required.',
      },
      message: 'Device name is required.',
    });

    renderWithRouter(<OnboardingPage />, ['/onboarding'], {
      registerDevice,
      onboardingMessage: 'Device name is required.',
    });

    fireEvent.click(screen.getByRole('button', { name: 'Validate and save' }));

    expect(registerDevice).toHaveBeenCalled();
    expect(await screen.findByRole('status')).toHaveTextContent('Device name is required.');
  });

  it('renders the registered device list', () => {
    renderWithRouter(<OnboardingPage />);

    expect(screen.getByText('Bedroom Lamp')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Active device' })).toBeInTheDocument();
  });
});

