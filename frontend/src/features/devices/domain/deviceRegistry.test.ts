import { updateDeviceConnectionState, upsertRegisteredDevice } from './deviceRegistry';
import type { RegisteredDevice } from './deviceTypes';

const baseDevice: RegisteredDevice = {
  id: 'bedroom-lamp',
  name: 'Bedroom Lamp',
  host: 'solaris.local',
  addedAt: '2026-03-24T00:00:00.000Z',
  lastConnectionState: 'online',
};

describe('deviceRegistry', () => {
  it('adds a new device to the registry', () => {
    expect(upsertRegisteredDevice([], baseDevice)).toEqual([baseDevice]);
  });

  it('updates an existing device when the host already exists', () => {
    expect(
      upsertRegisteredDevice([baseDevice], {
        ...baseDevice,
        name: 'Bedroom Lamp Updated',
      })[0].name,
    ).toBe('Bedroom Lamp Updated');
  });

  it('updates only the target device connection state', () => {
    expect(
      updateDeviceConnectionState(
        [baseDevice, { ...baseDevice, id: 'desk-lamp', host: 'desk.local' }],
        'desk-lamp',
        'degraded',
      )[1].lastConnectionState,
    ).toBe('degraded');
  });
});

