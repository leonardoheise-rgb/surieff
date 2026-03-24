import type { PropsWithChildren } from 'react';
import { AlarmProvider } from '../../features/alarms/state/AlarmContext';
import { DeviceProvider } from '../../features/devices/state/DeviceContext';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <DeviceProvider>
      <AlarmProvider>{children}</AlarmProvider>
    </DeviceProvider>
  );
}
