import type { DeviceRegistrationDraft } from './deviceTypes';

const hostPattern =
  /^(localhost|[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*|(\d{1,3}\.){3}\d{1,3})(:\d{2,5})?$/;

export function normalizeDeviceDraft(draft: DeviceRegistrationDraft): DeviceRegistrationDraft {
  return {
    name: draft.name.trim(),
    host: draft.host.trim().toLowerCase(),
  };
}

export function validateDeviceDraft(draft: DeviceRegistrationDraft): string[] {
  const normalizedDraft = normalizeDeviceDraft(draft);
  const errors: string[] = [];

  if (!normalizedDraft.name) {
    errors.push('Device name is required.');
  }

  if (!normalizedDraft.host) {
    errors.push('Device host or IP is required.');
  } else if (!hostPattern.test(normalizedDraft.host)) {
    errors.push('Enter a valid hostname, localhost, or IPv4 address.');
  }

  return errors;
}
