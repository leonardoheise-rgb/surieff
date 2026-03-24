import {
  applySnapshotPatch,
  buildCommandFailureMessage,
  buildCommandSuccessMessage,
  clampBrightness,
} from './deviceControl';
import { createDefaultDeviceSnapshot } from '../api/mockDeviceClient';

describe('deviceControl', () => {
  it('clamps brightness within the supported range', () => {
    expect(clampBrightness(-10)).toBe(0);
    expect(clampBrightness(150)).toBe(100);
  });

  it('applies optimistic snapshot patches', () => {
    const snapshot = createDefaultDeviceSnapshot();

    expect(
      applySnapshotPatch(snapshot, {
        brightnessPercent: 44,
      }).brightnessPercent,
    ).toBe(44);
  });

  it('builds readable success and failure messages', () => {
    expect(buildCommandSuccessMessage('power')).toBe('Power state updated.');
    expect(buildCommandFailureMessage('scene')).toContain('Scene selection failed');
  });
});

