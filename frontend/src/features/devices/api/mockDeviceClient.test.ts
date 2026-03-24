import { MockDeviceClient } from './mockDeviceClient';

const device = {
  id: 'bedroom-lamp',
  name: 'Bedroom Lamp',
  host: 'solaris.local',
  addedAt: '2026-03-24T06:00:00.000Z',
  lastConnectionState: 'online' as const,
};

describe('MockDeviceClient', () => {
  it('returns a snapshot for reachable devices', async () => {
    const client = new MockDeviceClient();

    await expect(client.getSnapshot(device)).resolves.toMatchObject({
      deviceId: 'bedroom-lamp',
      deviceName: 'Bedroom Lamp',
    });
  });

  it('updates power state', async () => {
    const client = new MockDeviceClient();

    await expect(client.setPower(device, false)).resolves.toMatchObject({
      isPoweredOn: false,
      brightnessPercent: 0,
    });
  });

  it('updates brightness and scene', async () => {
    const client = new MockDeviceClient();

    await expect(client.setBrightness(device, 55)).resolves.toMatchObject({
      brightnessPercent: 55,
    });
    await expect(client.setActiveScene(device, 'Golden Wake')).resolves.toMatchObject({
      activeSceneName: 'Golden Wake',
    });
  });

  it('starts a sunrise test', async () => {
    const client = new MockDeviceClient();

    await expect(client.triggerSunriseTest(device)).resolves.toMatchObject({
      activeSceneName: 'Manual Sunrise Test',
    });
  });

  it('rejects commands for offline devices', async () => {
    const client = new MockDeviceClient();

    await expect(
      client.setPower(
        {
          ...device,
          id: 'offline-lamp',
          host: 'offline.local',
        },
        true,
      ),
    ).rejects.toThrow('The device is offline.');
  });
});
