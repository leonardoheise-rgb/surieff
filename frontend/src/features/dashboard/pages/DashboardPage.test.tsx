import { screen } from '@testing-library/react';
import { DashboardPage } from './DashboardPage';
import { renderWithRouter } from '../../../test/renderWithRouter';

describe('DashboardPage', () => {
  it('shows the mocked active scene', async () => {
    renderWithRouter(<DashboardPage />);

    expect(await screen.findByText('Tropical Dawn')).toBeInTheDocument();
  });

  it('shows the mocked next alarm label', async () => {
    renderWithRouter(<DashboardPage />);

    expect(await screen.findByText('06:30 - Weekdays')).toBeInTheDocument();
  });
});
