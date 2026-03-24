import type { PropsWithChildren, ReactElement } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AlarmProvider } from '../features/alarms/state/AlarmContext';
import { createDefaultDeviceSnapshot } from '../features/devices/api/mockDeviceClient';
import { buildDeviceSummary } from '../features/devices/domain/deviceSummary';
import type {
  DeviceRegistrationDraft,
  DeviceRegistrationResult,
  DeviceState,
  RegisteredDevice,
} from '../features/devices/domain/deviceTypes';
import { DeviceContext } from '../features/devices/state/DeviceContext';

const snapshot = createDefaultDeviceSnapshot();
const registeredDevice: RegisteredDevice = {
  id: snapshot.deviceId,
  name: snapshot.deviceName,
  host: snapshot.deviceHost,
  addedAt: new Date('2026-03-24T00:00:00.000Z').toISOString(),
  lastConnectionState: snapshot.connectionState,
};

type TestDeviceContextValue = DeviceState & {
  registerDevice: (draft: DeviceRegistrationDraft) => Promise<DeviceRegistrationResult>;
  selectDevice: (deviceId: string) => Promise<void>;
  refreshActiveDevice: () => Promise<void>;
};

export function createTestDeviceContextValue(
  overrides: Partial<TestDeviceContextValue> = {},
): TestDeviceContextValue {
  return {
    registeredDevices: [registeredDevice],
    activeDeviceId: registeredDevice.id,
    snapshot,
    summary: buildDeviceSummary(snapshot),
    isBusy: false,
    onboardingMessage: null,
    registerDevice: async (draft: DeviceRegistrationDraft) => {
      void draft;
      return {
      device: registeredDevice,
      probe: {
        isReachable: true,
        connectionState: 'online' as const,
        connectionLabel: 'Connected',
        details: 'The device responded and looks compatible with the current WLED target.',
      },
      message: 'The device responded and looks compatible with the current WLED target.',
      };
    },
    selectDevice: async (deviceId: string) => {
      void deviceId;
    },
    refreshActiveDevice: async () => {},
    ...overrides,
  };
}

export function renderWithRouter(
  ui: ReactElement,
  initialEntries: string[] = ['/'],
  overrides: Partial<TestDeviceContextValue> = {},
) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <DeviceContext value={createTestDeviceContextValue(overrides)}>
        <AlarmProvider>{ui}</AlarmProvider>
      </DeviceContext>
    </MemoryRouter>,
  );
}

export function TestWrapper({ children }: PropsWithChildren) {
  return (
    <MemoryRouter initialEntries={['/']}>
      <DeviceContext value={createTestDeviceContextValue()}>
        <AlarmProvider>{children}</AlarmProvider>
      </DeviceContext>
    </MemoryRouter>
  );
}
