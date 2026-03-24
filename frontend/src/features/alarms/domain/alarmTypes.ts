export type AlarmWeekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type GradientStyle = 'tropical' | 'golden' | 'ember' | 'soft';

export type AudioMode = 'birds' | 'chimes' | 'silent';

export interface SunriseRoutine {
  gradientStyle: GradientStyle;
  durationInMinutes: number;
  maxBrightnessPercent: number;
}

export interface SunriseAlarm {
  id: string;
  label: string;
  time: string;
  recurrence: AlarmWeekday[];
  isEnabled: boolean;
  audioMode: AudioMode;
  routine: SunriseRoutine;
  createdAt: string;
  updatedAt: string;
}

export interface AlarmFormValues {
  label: string;
  time: string;
  recurrence: AlarmWeekday[];
  isEnabled: boolean;
  audioMode: AudioMode;
  gradientStyle: GradientStyle;
  durationInMinutes: number;
  maxBrightnessPercent: number;
}

export interface AlarmState {
  alarms: SunriseAlarm[];
  selectedAlarmId: string | null;
  statusMessage: string | null;
}

