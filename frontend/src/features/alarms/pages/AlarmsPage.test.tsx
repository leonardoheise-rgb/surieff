import { fireEvent, screen } from '@testing-library/react';
import { AlarmsPage } from './AlarmsPage';
import { renderWithRouter } from '../../../test/renderWithRouter';

describe('AlarmsPage', () => {
  it('renders the saved alarm list', () => {
    renderWithRouter(<AlarmsPage />);

    expect(screen.getAllByText('Weekday Wake Up')).toHaveLength(2);
    expect(screen.getByText('1 configured alarm(s)')).toBeInTheDocument();
  });

  it('creates a new alarm from the draft form', async () => {
    renderWithRouter(<AlarmsPage />);

    fireEvent.click(screen.getByRole('button', { name: 'New draft' }));
    fireEvent.change(screen.getByDisplayValue('Alarm 2'), {
      target: { value: 'Gym Sunrise' },
    });
    fireEvent.change(screen.getByDisplayValue('07:00'), {
      target: { value: '05:45' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create alarm' }));

    expect(await screen.findByRole('status')).toHaveTextContent('Alarm created.');
    expect(screen.getAllByText('Gym Sunrise')).toHaveLength(2);
  });

  it('duplicates an alarm', async () => {
    renderWithRouter(<AlarmsPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Duplicate' }));

    expect(await screen.findByRole('status')).toHaveTextContent('Alarm duplicated.');
    expect(screen.getAllByText('Weekday Wake Up Copy')).toHaveLength(2);
  });
});
