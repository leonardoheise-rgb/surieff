import { useContext } from 'react';
import { DeviceContext } from './DeviceContext';

export function useDeviceSyncStatus() {
  const { inFlightCommand, isBusy, lastCommandMessage, refreshActiveDevice, summary } =
    useContext(DeviceContext);

  return {
    inFlightCommand,
    isBusy,
    lastCommandMessage,
    refreshActiveDevice,
    summary,
  };
}
