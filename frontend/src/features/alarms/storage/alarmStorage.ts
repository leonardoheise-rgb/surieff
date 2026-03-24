import type { SunriseAlarm } from '../domain/alarmTypes';

const storageKey = 'solaris.alarmsByDeviceId';

type AlarmRegistry = Record<string, SunriseAlarm[]>;

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function loadAlarmRegistry(): AlarmRegistry {
  if (!canUseStorage()) {
    return {};
  }

  const rawValue = window.localStorage.getItem(storageKey);
  return rawValue ? (JSON.parse(rawValue) as AlarmRegistry) : {};
}

export function persistAlarmRegistry(registry: AlarmRegistry) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(registry));
}
