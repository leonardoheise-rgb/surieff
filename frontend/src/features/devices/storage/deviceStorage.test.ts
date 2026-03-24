import {
  loadPersistedDeviceState,
  persistActiveDeviceId,
  persistRegisteredDevices,
} from './deviceStorage';

describe('deviceStorage', () => {
  it('loads empty state when storage is blank', () => {
    expect(loadPersistedDeviceState()).toEqual({
      registeredDevices: [],
      activeDeviceId: null,
    });
  });

  it('persists registered devices and active id', () => {
    const devices = [
      {
        id: 'bedroom-lamp',
        name: 'Bedroom Lamp',
        host: 'solaris.local',
        addedAt: '2026-03-24T00:00:00.000Z',
        lastConnectionState: 'online' as const,
      },
    ];

    persistRegisteredDevices(devices);
    persistActiveDeviceId('bedroom-lamp');

    expect(loadPersistedDeviceState()).toEqual({
      registeredDevices: devices,
      activeDeviceId: 'bedroom-lamp',
    });
  });
});
