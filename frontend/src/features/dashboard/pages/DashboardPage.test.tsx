import { fireEvent, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { DashboardPage } from './DashboardPage';
import { renderWithRouter } from '../../../test/renderWithRouter';

describe('DashboardPage', () => {
  it('shows the mocked active scene', async () => {
    renderWithRouter(<DashboardPage />);

    expect(await screen.findByRole('heading', { level: 2, name: 'Tropical Dawn' })).toBeInTheDocument();
  });

  it('shows the mocked next alarm label', async () => {
    renderWithRouter(<DashboardPage />);

    expect(await screen.findByText('06:30 - Weekdays')).toBeInTheDocument();
  });

  it('dispatches the refresh command', () => {
    const refreshActiveDevice = vi.fn().mockResolvedValue(undefined);

    renderWithRouter(<DashboardPage />, ['/'], { refreshActiveDevice });

    fireEvent.click(screen.getByRole('button', { name: 'Refresh device status' }));

    expect(refreshActiveDevice).toHaveBeenCalledTimes(1);
  });

  it('dispatches power, scene, brightness, and sunrise test commands', () => {
    const setPower = vi.fn().mockResolvedValue(undefined);
    const setBrightness = vi.fn().mockResolvedValue(undefined);
    const setActiveScene = vi.fn().mockResolvedValue(undefined);
    const triggerSunriseTest = vi.fn().mockResolvedValue(undefined);

    renderWithRouter(<DashboardPage />, ['/'], {
      setPower,
      setBrightness,
      setActiveScene,
      triggerSunriseTest,
    });

    fireEvent.click(screen.getByRole('button', { name: 'Turn off' }));
    fireEvent.change(screen.getByLabelText('Brightness: 82%'), {
      target: { value: '55' },
    });
    fireEvent.change(screen.getByLabelText('Preset scene'), {
      target: { value: 'Golden Wake' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Run sunrise test' }));

    expect(setPower).toHaveBeenCalledWith(false);
    expect(setBrightness).toHaveBeenCalledWith(55);
    expect(setActiveScene).toHaveBeenCalledWith('Golden Wake');
    expect(triggerSunriseTest).toHaveBeenCalledTimes(1);
  });
});
