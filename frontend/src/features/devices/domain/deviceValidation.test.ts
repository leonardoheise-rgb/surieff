import { normalizeDeviceDraft, validateDeviceDraft } from './deviceValidation';

describe('deviceValidation', () => {
  it('normalizes host casing and whitespace', () => {
    expect(
      normalizeDeviceDraft({
        name: '  Bedroom Lamp  ',
        host: '  SOLARIS.LOCAL  ',
      }),
    ).toEqual({
      name: 'Bedroom Lamp',
      host: 'solaris.local',
    });
  });

  it('requires a device name', () => {
    expect(validateDeviceDraft({ name: '', host: 'solaris.local' })).toContain(
      'Device name is required.',
    );
  });

  it('requires a device host', () => {
    expect(validateDeviceDraft({ name: 'Lamp', host: '' })).toContain(
      'Device host or IP is required.',
    );
  });

  it('rejects invalid hostnames', () => {
    expect(validateDeviceDraft({ name: 'Lamp', host: 'bad host value' })).toContain(
      'Enter a valid hostname, localhost, or IPv4 address.',
    );
  });
});

