import { useEffect, useMemo, useState } from 'react';
import { useGame } from '../state/GameContext';
import * as dailyMissionService from '../services/dailyMissionService';
import { Chip, ProgressBar } from '../components/Chip';

function msUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}

function formatCountdown(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

// Derives {current, target} for a mission from live GameContext state where
// a real counter exists, falling back to the mission's own mock data
// otherwise (see comment in dailyMissionData.js).
function deriveProgress(mission, state) {
  if (mission.source === 'dailyQuestsRatio') {
    return { current: state.questsCompletedToday, target: state.questsTotalToday };
  }
  if (mission.source) {
    return { current: state[mission.source] ?? 0, target: mission.target };
  }
  return { current: mission.mockCurrent ?? 0, target: mission.target };
}

function SkeletonList() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-surface-container animate-pulse shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-3.5 w-1/3 rounded-full bg-surface-container animate-pulse" />
            <div className="h-2 w-full rounded-full bg-surface-container animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-12 shadow-sm flex flex-col items-center text-center gap-2">
      <span className="material-symbols-outlined text-4xl text-outline">event_available</span>
      <h3 className="font-headline-sm text-headline-sm text-on-surface">No missions available</h3>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
        The Quartermaster has nothing queued for you today — check back at dawn for a fresh board.
      </p>
    </div>
  );
}

function MissionCard({ mission, current, target, countdown }) {
  const pct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
  const complete = current >= target;

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
          complete ? 'bg-tertiary-container text-on-tertiary' : 'bg-primary-container text-on-primary'
        }`}
      >
        <span className="material-symbols-outlined fill text-xl">{complete ? 'check_circle' : mission.icon}</span>
      </div>

      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="font-label-lg text-label-lg text-on-surface">{mission.title}</span>
          <Chip className={complete ? 'text-tertiary bg-tertiary-fixed' : 'text-outline bg-surface-container'}>
            {complete ? 'Complete' : `${current}/${target}`}
          </Chip>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">{mission.description}</p>
        <ProgressBar pct={pct} className={complete ? 'bg-tertiary-container' : 'bg-primary-container'} />
      </div>

      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 sm:w-36">
        <div className="flex items-center gap-1.5">
          <Chip className="text-primary bg-primary-fixed">+{mission.rewardXp} XP</Chip>
          {mission.rewardGold > 0 && (
            <Chip className="text-secondary bg-secondary-fixed">+{mission.rewardGold} Gold</Chip>
          )}
        </div>
        <span className="flex items-center gap-1 font-label-caps text-label-caps text-outline uppercase">
          <span className="material-symbols-outlined text-[14px]">schedule</span>
          {complete ? 'Claimed at reset' : countdown}
        </span>
      </div>
    </div>
  );
}

export default function DailyMissionsPage() {
  const { state } = useGame();
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState([]);
  const [countdown, setCountdown] = useState(formatCountdown(msUntilMidnight()));

  useEffect(() => {
    let cancelled = false;
    dailyMissionService.getDailyMissions().then((data) => {
      if (cancelled) return;
      setMissions(data);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCountdown(formatCountdown(msUntilMidnight())), 1000);
    return () => clearInterval(interval);
  }, []);

  const derived = useMemo(
    () => missions.map((m) => ({ mission: m, ...deriveProgress(m, state) })),
    [missions, state]
  );
  const completedCount = derived.filter((d) => d.current >= d.target).length;
  const totalXp = missions.reduce((sum, m) => sum + m.rewardXp, 0);

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col">
          <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider bg-surface-variant px-3 py-1 rounded-full w-fit mb-1">
            Quartermaster's Board
          </span>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined fill text-primary text-2xl">event_available</span>
            Daily Missions
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-0.5 max-w-xl">
            A fresh set of bite-sized goals every day. Clear them all before the board resets at midnight.
          </p>
        </div>
        <div className="flex items-center gap-6 shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined fill text-tertiary-container text-2xl">check_circle</span>
            <div className="flex flex-col leading-tight">
              <span className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                {completedCount} / {missions.length || '—'}
              </span>
              <span className="font-label-caps text-label-caps text-outline uppercase">Missions Complete</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined fill text-secondary-container text-2xl">bolt</span>
            <div className="flex flex-col leading-tight">
              <span className="font-headline-sm text-headline-sm text-on-surface font-extrabold">+{totalXp}</span>
              <span className="font-label-caps text-label-caps text-outline uppercase">Total XP Today</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">schedule</span>
            <div className="flex flex-col leading-tight">
              <span className="font-headline-sm text-headline-sm text-on-surface font-extrabold">{countdown}</span>
              <span className="font-label-caps text-label-caps text-outline uppercase">Until Reset</span>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <SkeletonList />
      ) : missions.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-3">
          {derived.map(({ mission, current, target }) => (
            <MissionCard key={mission.id} mission={mission} current={current} target={target} countdown={countdown} />
          ))}
        </div>
      )}
    </>
  );
}
