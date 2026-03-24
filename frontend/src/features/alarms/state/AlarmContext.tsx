import { createContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { useDeviceSnapshot } from '../../devices/state/useDeviceSnapshot';
import {
  buildAlarmFromForm,
  buildFormValuesFromAlarm,
  createFallbackAlarmCollection,
  duplicateAlarm,
  updateAlarmFromForm,
} from '../domain/alarmMappers';
import type { AlarmFormValues, AlarmState, SunriseAlarm } from '../domain/alarmTypes';
import { validateAlarmForm } from '../domain/alarmValidation';
import { loadAlarmRegistry, persistAlarmRegistry } from '../storage/alarmStorage';

interface AlarmContextValue extends AlarmState {
  formValues: AlarmFormValues;
  setFormValues: (values: AlarmFormValues) => void;
  createAlarm: () => string | null;
  updateAlarm: () => string | null;
  deleteAlarm: (alarmId: string) => void;
  duplicateAlarmById: (alarmId: string) => void;
  toggleAlarm: (alarmId: string) => void;
  selectAlarm: (alarmId: string | null) => void;
  resetForm: () => void;
}

const initialAlarmCollection = createFallbackAlarmCollection();
const initialFormValues = buildFormValuesFromAlarm(initialAlarmCollection[0]);

const initialState: AlarmState = {
  alarms: initialAlarmCollection,
  selectedAlarmId: initialAlarmCollection[0].id,
  statusMessage: null,
};

const AlarmContext = createContext<AlarmContextValue>({
  ...initialState,
  formValues: initialFormValues,
  setFormValues: () => {},
  createAlarm: () => null,
  updateAlarm: () => null,
  deleteAlarm: () => {},
  duplicateAlarmById: () => {},
  toggleAlarm: () => {},
  selectAlarm: () => {},
  resetForm: () => {},
});

export function AlarmProvider({ children }: PropsWithChildren) {
  const { activeDeviceId } = useDeviceSnapshot();
  const [alarmRegistry, setAlarmRegistry] = useState(loadAlarmRegistry);
  const [selectedAlarmId, setSelectedAlarmId] = useState<string | null>(initialState.selectedAlarmId);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const alarms = useMemo(() => {
    if (!activeDeviceId) {
      return [];
    }

    return alarmRegistry[activeDeviceId] ?? createFallbackAlarmCollection();
  }, [activeDeviceId, alarmRegistry]);

  useEffect(() => {
    persistAlarmRegistry(alarmRegistry);
  }, [alarmRegistry]);

  useEffect(() => {
    if (!activeDeviceId) {
      setSelectedAlarmId(null);
      setStatusMessage('Add a device before managing alarms.');
      return;
    }

    setAlarmRegistry((currentRegistry) => {
      if (currentRegistry[activeDeviceId]) {
        return currentRegistry;
      }

      return {
        ...currentRegistry,
        [activeDeviceId]: createFallbackAlarmCollection(),
      };
    });
  }, [activeDeviceId]);

  useEffect(() => {
    if (selectedAlarmId === null) {
      return;
    }

    const nextSelectedAlarm = alarms.find((alarm) => alarm.id === selectedAlarmId) ?? alarms[0] ?? null;

    if (!nextSelectedAlarm) {
      setSelectedAlarmId(null);
      return;
    }

    if (nextSelectedAlarm.id !== selectedAlarmId) {
      setSelectedAlarmId(nextSelectedAlarm.id);
    }

    setFormValues(buildFormValuesFromAlarm(nextSelectedAlarm));
  }, [alarms, selectedAlarmId]);

  function updateRegistryForActiveDevice(updater: (currentAlarms: SunriseAlarm[]) => SunriseAlarm[]) {
    if (!activeDeviceId) {
      return;
    }

    setAlarmRegistry((currentRegistry) => ({
      ...currentRegistry,
      [activeDeviceId]: updater(currentRegistry[activeDeviceId] ?? createFallbackAlarmCollection()),
    }));
  }

  function resetForm() {
    const selectedAlarm = alarms.find((alarm) => alarm.id === selectedAlarmId) ?? alarms[0];

    if (selectedAlarm) {
      setFormValues(buildFormValuesFromAlarm(selectedAlarm));
    }
  }

  function selectAlarm(alarmId: string | null) {
    setSelectedAlarmId(alarmId);
    if (!alarmId) {
      return;
    }

    const nextAlarm = alarms.find((alarm) => alarm.id === alarmId);
    if (nextAlarm) {
      setFormValues(buildFormValuesFromAlarm(nextAlarm));
    }
  }

  function createAlarm() {
    const errors = validateAlarmForm(formValues, alarms);
    if (errors.length > 0) {
      setStatusMessage(errors[0]);
      return errors[0];
    }

    const nextAlarm = buildAlarmFromForm(formValues);
    updateRegistryForActiveDevice((currentAlarms) => [nextAlarm, ...currentAlarms]);
    setSelectedAlarmId(nextAlarm.id);
    setStatusMessage('Alarm created.');
    return null;
  }

  function updateAlarm() {
    if (!selectedAlarmId) {
      setStatusMessage('Select an alarm before saving changes.');
      return 'Select an alarm before saving changes.';
    }

    const selectedAlarm = alarms.find((alarm) => alarm.id === selectedAlarmId);
    if (!selectedAlarm) {
      setStatusMessage('The selected alarm could not be found.');
      return 'The selected alarm could not be found.';
    }

    const errors = validateAlarmForm(formValues, alarms, selectedAlarmId);
    if (errors.length > 0) {
      setStatusMessage(errors[0]);
      return errors[0];
    }

    const nextAlarm = updateAlarmFromForm(selectedAlarmId, selectedAlarm, formValues);
    updateRegistryForActiveDevice((currentAlarms) =>
      currentAlarms.map((alarm) => (alarm.id === selectedAlarmId ? nextAlarm : alarm)),
    );
    setStatusMessage('Alarm updated.');
    return null;
  }

  function deleteAlarm(alarmId: string) {
    const remainingAlarms = alarms.filter((alarm) => alarm.id !== alarmId);
    const nextAlarms = remainingAlarms.length > 0 ? remainingAlarms : createFallbackAlarmCollection();

    updateRegistryForActiveDevice(() => nextAlarms);
    setSelectedAlarmId(nextAlarms[0]?.id ?? null);
    setStatusMessage('Alarm deleted.');
  }

  function duplicateAlarmById(alarmId: string) {
    const targetAlarm = alarms.find((alarm) => alarm.id === alarmId);
    if (!targetAlarm) {
      setStatusMessage('The selected alarm could not be duplicated.');
      return;
    }

    const nextAlarm = duplicateAlarm(targetAlarm);
    updateRegistryForActiveDevice((currentAlarms) => [nextAlarm, ...currentAlarms]);
    setSelectedAlarmId(nextAlarm.id);
    setStatusMessage('Alarm duplicated.');
  }

  function toggleAlarm(alarmId: string) {
    updateRegistryForActiveDevice((currentAlarms) =>
      currentAlarms.map((alarm) =>
        alarm.id === alarmId
          ? {
              ...alarm,
              isEnabled: !alarm.isEnabled,
              updatedAt: new Date().toISOString(),
            }
          : alarm,
      ),
    );
    setStatusMessage('Alarm state updated.');
  }

  return (
    <AlarmContext
      value={{
        alarms,
        selectedAlarmId,
        statusMessage,
        formValues,
        setFormValues,
        createAlarm,
        updateAlarm,
        deleteAlarm,
        duplicateAlarmById,
        toggleAlarm,
        selectAlarm,
        resetForm,
      }}
    >
      {children}
    </AlarmContext>
  );
}
export { AlarmContext };
