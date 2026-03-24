import { useContext } from 'react';
import { AlarmContext } from './AlarmContext';

export function useAlarmState() {
  return useContext(AlarmContext);
}
