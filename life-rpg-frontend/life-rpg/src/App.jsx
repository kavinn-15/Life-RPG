import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { GameProvider } from './state/GameContext';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const AdventurePage = lazy(() => import('./pages/AdventurePage'));
const QuestsPage = lazy(() => import('./pages/QuestsPage'));
const CharacterPage = lazy(() => import('./pages/CharacterPage'));
const DomainsPage = lazy(() => import('./pages/DomainsPage'));
const DomainDetailsPage = lazy(() => import('./pages/DomainDetailsPage'));
const CreateQuestPage = lazy(() => import('./pages/CreateQuestPage'));
const EditQuestPage = lazy(() => import('./pages/EditQuestPage'));
const QuestDetailsPage = lazy(() => import('./pages/QuestDetailsPage'));
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'));
const RewardShopPage = lazy(() => import('./pages/RewardShopPage'));
const InventoryPage = lazy(() => import('./pages/InventoryPage'));
const StreakCenterPage = lazy(() => import('./pages/StreakCenterPage'));
const DailyMissionsPage = lazy(() => import('./pages/DailyMissionsPage'));
const ProgressPage = lazy(() => import('./pages/ProgressPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const HelpPage = lazy(() => import('./pages/HelpPage'));

function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[50vh] p-8">
      <div className="flex flex-col items-center gap-3">
        <span className="material-symbols-outlined text-3xl text-primary animate-spin">progress_activity</span>
        <span className="font-label-caps text-xs text-on-surface-variant uppercase tracking-wider">Loading...</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* Standalone public pages outside GameProvider so they load with zero delay */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/onboarding"
            element={
              <GameProvider>
                <OnboardingPage />
              </GameProvider>
            }
          />

          {/* Authenticated RPG gameplay routes wrapped with GameProvider */}
          <Route
            element={
              <GameProvider>
                <Layout />
              </GameProvider>
            }
          >
            <Route path="adventure" element={<AdventurePage />} />
            <Route path="dashboard" element={<AdventurePage />} />
            <Route path="quests" element={<QuestsPage />} />
            <Route path="quests/new" element={<CreateQuestPage />} />
            <Route path="quests/:id/edit" element={<EditQuestPage />} />
            <Route path="quests/:id" element={<QuestDetailsPage />} />
            <Route path="character" element={<CharacterPage />} />
            <Route path="characters" element={<CharacterPage />} />
            <Route path="domains" element={<DomainsPage />} />
            <Route path="domains/:domainId" element={<DomainDetailsPage />} />
            <Route path="daily-missions" element={<DailyMissionsPage />} />
            <Route path="streak" element={<StreakCenterPage />} />
            <Route path="achievements" element={<AchievementsPage />} />
            <Route path="loot-vault" element={<RewardShopPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="progress" element={<ProgressPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="support" element={<HelpPage />} />
            <Route path="help" element={<HelpPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

