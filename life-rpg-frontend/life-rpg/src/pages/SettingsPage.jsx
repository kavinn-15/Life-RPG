import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../state/GameContext';
import * as authService from '../services/authService';
import { setForcedFailure, getForcedFailure } from '../services/apiClient';

function Toggle({ id, checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex flex-col">
        <label htmlFor={id} className="font-label-lg text-label-lg text-on-surface font-semibold cursor-pointer">
          {label}
        </label>
        {description && (
          <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{description}</span>
        )}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
          checked ? 'bg-primary' : 'bg-surface-variant'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { state, setState, pushToast } = useGame();
  const navigate = useNavigate();

  // Local settings state
  const [profileName, setProfileName] = useState(state.playerName || 'Adventurer');
  const [profileTitle, setProfileTitle] = useState(state.title || 'Cyber Nomad');
  const [themeMode, setThemeMode] = useState('dark-fantasy');
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [streakWarnings, setStreakWarnings] = useState(true);
  const [questReminders, setQuestReminders] = useState(true);
  const [defaultDifficulty, setDefaultDifficulty] = useState('Medium');
  const [autoArchive, setAutoArchive] = useState(true);
  const [publicLeaderboard, setPublicLeaderboard] = useState(true);
  const [anonymousMetrics, setAnonymousMetrics] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [simulatedFailure, setSimulatedFailure] = useState(getForcedFailure());

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setState((prev) => ({
      ...prev,
      playerName: profileName,
      title: profileTitle,
    }));
    pushToast('Character profile updated successfully!', 'person');
  };

  const handleToggleFailureMode = (val) => {
    setSimulatedFailure(val);
    setForcedFailure(val);
    pushToast(
      val ? 'Forced-failure mode activated: service calls will simulate errors.' : 'Service calls normal.',
      val ? 'warning' : 'check_circle'
    );
  };

  const handleLogout = async () => {
    await authService.logout();
    pushToast('You have returned to the nexus.', 'logout');
    navigate('/login');
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider bg-surface-variant px-3 py-1 rounded-full">
            System Configuration
          </span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight flex items-center gap-2">
          <span className="material-symbols-outlined fill text-primary text-2xl">settings</span>
          Player &amp; Game Settings
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-0.5">
          Tune your character credentials, telemetry preferences, interface themes, and accessibility controls.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Section 1: Profile Settings */}
        <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline/5 flex flex-col gap-5">
          <div className="flex items-center gap-3 pb-3 border-b border-surface-container">
            <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">badge</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Character Identity</h2>
              <p className="font-body-sm text-xs text-on-surface-variant">Update your public alias and title.</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-md text-xs text-on-surface-variant mb-1">Character Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-variant rounded-xl font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  required
                />
              </div>
              <div>
                <label className="block font-label-md text-xs text-on-surface-variant mb-1">Class / Title</label>
                <input
                  type="text"
                  value={profileTitle}
                  onChange={(e) => setProfileTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-variant rounded-xl font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-primary-container text-on-primary font-label-md text-xs shadow-sm hover:translate-y-0.5 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">save</span>
                Save Changes
              </button>
            </div>
          </form>
        </section>

        {/* Section 2: Appearance & Theme */}
        <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline/5 flex flex-col gap-4">
          <div className="flex items-center gap-3 pb-3 border-b border-surface-container">
            <div className="w-10 h-10 rounded-xl bg-tertiary-fixed text-tertiary flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">palette</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Appearance &amp; Atmosphere</h2>
              <p className="font-body-sm text-xs text-on-surface-variant">Configure interface visuals and audio feedback.</p>
            </div>
          </div>

          <div className="flex flex-col divide-y divide-surface-container">
            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="font-label-lg text-label-lg text-on-surface font-semibold">Visual Palette</label>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Select your realm visual styling.</p>
              </div>
              <select
                value={themeMode}
                onChange={(e) => {
                  setThemeMode(e.target.value);
                  pushToast(`Theme updated to ${e.target.options[e.target.selectedIndex].text}`, 'palette');
                }}
                className="px-4 py-2 bg-surface-variant rounded-xl font-label-md text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="dark-fantasy">Midnight Velvet (Default)</option>
                <option value="cyberpunk-neon">Neon Cyberpunk</option>
                <option value="solar-citadel">Solar Citadel Gold</option>
                <option value="astral-plane">Astral Void Purple</option>
              </select>
            </div>

            <Toggle
              id="motion-toggle"
              checked={motionEnabled}
              onChange={setMotionEnabled}
              label="Interface Micro-Animations"
              description="Spring physics on card hover, level-up celebrations, and quest reward pops."
            />

            <Toggle
              id="sound-toggle"
              checked={soundEffects}
              onChange={setSoundEffects}
              label="Atmospheric Audio Cues"
              description="Play 8-bit chime sounds when completing quests and minting gold rewards."
            />
          </div>
        </section>

        {/* Section 3: Quest & Habit Preferences */}
        <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline/5 flex flex-col gap-4">
          <div className="flex items-center gap-3 pb-3 border-b border-surface-container">
            <div className="w-10 h-10 rounded-xl bg-secondary-fixed text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">swords</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Quest Forge Preferences</h2>
              <p className="font-body-sm text-xs text-on-surface-variant">Default behaviors when forging and completing quests.</p>
            </div>
          </div>

          <div className="flex flex-col divide-y divide-surface-container">
            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="font-label-lg text-label-lg text-on-surface font-semibold">Default Quest Difficulty</label>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Pre-selected difficulty tier in the forge modal.</p>
              </div>
              <select
                value={defaultDifficulty}
                onChange={(e) => setDefaultDifficulty(e.target.value)}
                className="px-4 py-2 bg-surface-variant rounded-xl font-label-md text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Easy">Easy (15-30m / 50 XP)</option>
                <option value="Medium">Medium (30-60m / 100 XP)</option>
                <option value="Hard">Hard (1-3h / 250 XP)</option>
                <option value="Epic">Epic (Multi-day / 500 XP)</option>
              </select>
            </div>

            <Toggle
              id="auto-archive-toggle"
              checked={autoArchive}
              onChange={setAutoArchive}
              label="Auto-Archive Completed Quests"
              description="Automatically shift finished quests off the active mission queue into the historical archive."
            />
          </div>
        </section>

        {/* Section 4: Notifications & Telemetry Alerts */}
        <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline/5 flex flex-col gap-4">
          <div className="flex items-center gap-3 pb-3 border-b border-surface-container">
            <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">notifications_active</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Notification Dispatches</h2>
              <p className="font-body-sm text-xs text-on-surface-variant">Control when and how dispatches reach you.</p>
            </div>
          </div>

          <div className="flex flex-col divide-y divide-surface-container">
            <Toggle
              id="streak-warnings-toggle"
              checked={streakWarnings}
              onChange={setStreakWarnings}
              label="Streak Freeze &amp; Expiry Alerts"
              description="Notify 2 hours prior to daily reset if your streak is in jeopardy."
            />

            <Toggle
              id="quest-reminders-toggle"
              checked={questReminders}
              onChange={setQuestReminders}
              label="Daily Campaign Morning Briefing"
              description="Receive today's recommended quest roster at 08:00."
            />

            <Toggle
              id="email-alerts-toggle"
              checked={emailAlerts}
              onChange={setEmailAlerts}
              label="Weekly Telemetry Digest"
              description="Receive a weekly summary report of XP velocity and domain rankings."
            />
          </div>
        </section>

        {/* Section 5: Privacy & Accessibility */}
        <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline/5 flex flex-col gap-4">
          <div className="flex items-center gap-3 pb-3 border-b border-surface-container">
            <div className="w-10 h-10 rounded-xl bg-tertiary-fixed text-tertiary flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">accessibility</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Privacy &amp; Accessibility</h2>
              <p className="font-body-sm text-xs text-on-surface-variant">Adjust contrast, visibility, and leaderboard privacy.</p>
            </div>
          </div>

          <div className="flex flex-col divide-y divide-surface-container">
            <Toggle
              id="leaderboard-toggle"
              checked={publicLeaderboard}
              onChange={setPublicLeaderboard}
              label="Broadcast to Public Leaderboard"
              description="Allow other players in the realm to see your level, title, and current streak."
            />

            <Toggle
              id="contrast-toggle"
              checked={highContrast}
              onChange={setHighContrast}
              label="Enhanced Contrast Mode"
              description="Boost text contrast and darken card borders for high legibility."
            />

            <Toggle
              id="large-text-toggle"
              checked={largeText}
              onChange={setLargeText}
              label="Comfortable Font Scale"
              description="Increase base reading typography size across all realm cards."
            />
          </div>
        </section>

        {/* Section 6: Developer Mode & Account Actions */}
        <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline/5 flex flex-col gap-4">
          <div className="flex items-center gap-3 pb-3 border-b border-surface-container">
            <div className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">build</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">System Diagnostics &amp; Session</h2>
              <p className="font-body-sm text-xs text-on-surface-variant">Developer inspection tools and session termination.</p>
            </div>
          </div>

          <div className="flex flex-col divide-y divide-surface-container">
            {/* Forced Failure Toggle for Testing Error States */}
            <Toggle
              id="failure-toggle"
              checked={simulatedFailure}
              onChange={handleToggleFailureMode}
              label="Simulate Service Failure Mode"
              description="Forces mock REST calls to reject so you can verify error and retry states across pages."
            />

            <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-label-lg text-label-lg text-on-surface font-semibold">End Active Session</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Disconnect from Life RPG and return to the gateway.
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="px-5 py-2.5 rounded-full bg-error/10 hover:bg-error text-error hover:text-white font-label-md text-xs transition-all flex items-center gap-2 self-start sm:self-auto shrink-0 shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                Disconnect Session
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
