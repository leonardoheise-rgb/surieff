import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '../shell/AppShell';
import { AlarmsPage } from '../../features/alarms/pages/AlarmsPage';
import { DashboardPage } from '../../features/dashboard/pages/DashboardPage';
import { OnboardingPage } from '../../features/devices/pages/OnboardingPage';
import { SettingsPage } from '../../features/settings/pages/SettingsPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="onboarding" element={<OnboardingPage />} />
        <Route path="alarms" element={<AlarmsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

