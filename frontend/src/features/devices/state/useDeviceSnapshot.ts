import { useContext } from 'react';
import { DeviceContext } from './DeviceContext';

export function useDeviceSnapshot() {
  return useContext(DeviceContext);
}
