import { useContext } from 'react';
import { DeviceContext } from './DeviceContext';

export function useDeviceControls() {
  const {
    inFlightCommand,
    lastCommandMessage,
    setActiveScene,
    setBrightness,
    setPower,
    triggerSunriseTest,
  } = useContext(DeviceContext);

  return {
    inFlightCommand,
    lastCommandMessage,
    setActiveScene,
    setBrightness,
    setPower,
    triggerSunriseTest,
  };
}

