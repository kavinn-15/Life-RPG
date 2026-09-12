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

function SkeletonList() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
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
        The Quartermaster has nothing queued for you right now — check back after adding active quests.
      </p>
    </div>
  );
}

function MissionCard({ mission, onClaim, claiming }) {
  const current = mission.current ?? 0;
  const target = Math.max(1, mission.target ?? 1);
  const pct = Math.min(100, Math.round((current / target) * 100));
  const complete = current >= target;
  const isClaimed = Boolean(mission.claimed);

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center gap-4">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
          isClaimed
            ? 'bg-tertiary-container text-on-tertiary'
            : complete
            ? 'bg-primary-container text-on-primary ring-2 ring-primary/40'
            : 'bg-surface-container-high text-on-surface-variant'
        }`}
      >
        <span className="material-symbols-outlined fill text-xl">
          {isClaimed ? 'verified' : complete ? 'check_circle' : mission.icon || 'task_alt'}
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-label-lg text-label-lg text-on-surface">{mission.title}</span>
            {complete && !isClaimed && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary text-on-primary animate-pulse">
                Ready to Claim!
              </span>
            )}
          </div>
          <Chip
            className={
              isClaimed
                ? 'text-tertiary bg-tertiary-fixed font-bold'
                : complete
                ? 'text-primary bg-primary-fixed font-bold'
                : 'text-outline bg-surface-container'
            }
          >
            {isClaimed ? 'Claimed' : complete ? 'Complete' : `${current}/${target}`}
          </Chip>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">{mission.description}</p>
        <ProgressBar
          pct={pct}
          className={
            isClaimed ? 'bg-tertiary-container' : complete ? 'bg-primary-container' : 'bg-surface-container-high'
          }
        />
      </div>

      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 sm:w-44">
        <div className="flex items-center gap-1.5">
          <Chip className="text-primary bg-primary-fixed font-bold">+{mission.rewardXp} XP</Chip>
          {mission.rewardGold > 0 && (
            <Chip className="text-secondary bg-secondary-fixed font-bold">+{mission.rewardGold} Gold</Chip>
          )}
        </div>

        {complete && !isClaimed ? (
          <button
            onClick={() => onClaim(mission.id)}
            disabled={claiming}
            className="px-4 py-1.5 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">redeem</span>
            <span>{claiming ? 'Claiming...' : 'Claim Reward'}</span>
          </button>
        ) : (
          <span className="flex items-center gap-1 font-label-caps text-label-caps text-outline uppercase">
            <span className="material-symbols-outlined text-[14px]">
              {isClaimed ? 'done_all' : 'schedule'}
            </span>
            {isClaimed ? 'Claimed' : 'Resets at midnight'}
          </span>
        )}
      </div>
    </div>
  );
}

export default function DailyMissionsPage() {
  const { state, grantRewards, pushToast } = useGame();
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState([]);
  const [claimingId, setClaimingId] = useState(null);
  const [countdown, setCountdown] = useState(formatCountdown(msUntilMidnight()));

  const fetchMissions = () => {
    return dailyMissionService
      .getDailyMissions()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setMissions(data);
        }
      })
      .catch((err) => {
        console.warn('Could not load live daily missions from server:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCountdown(formatCountdown(msUntilMidnight())), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClaim = async (missionId) => {
    if (claimingId) return;
    setClaimingId(missionId);
    try {
      const res = await dailyMissionService.claimDailyMission(missionId);
      const mission = missions.find((m) => m.id === missionId);
      const xp = res?.rewardXp ?? mission?.rewardXp ?? 0;
      const gold = res?.rewardGold ?? mission?.rewardGold ?? 0;

      grantRewards({ xp, gold, questTitle: mission?.title ? `Mission: ${mission.title}` : 'Daily Mission' });
      pushToast(`Claimed ${mission?.title || 'Daily Mission'}! (+${xp} XP, +${gold} Gold)`, 'military_tech');

      setMissions((prev) =>
        prev.map((m) => (m.id === missionId ? { ...m, claimed: true, completed: true } : m))
      );
    } catch (err) {
      console.warn('Backend claim error, updating locally:', err);
      const mission = missions.find((m) => m.id === missionId);
      if (mission) {
        grantRewards({
          xp: mission.rewardXp,
          gold: mission.rewardGold,
          questTitle: `Mission: ${mission.title}`,
        });
        pushToast(`Claimed ${mission.title}! (+${mission.rewardXp} XP, +${mission.rewardGold} Gold)`, 'military_tech');
        setMissions((prev) =>
          prev.map((m) => (m.id === missionId ? { ...m, claimed: true, completed: true } : m))
        );
      }
    } finally {
      setClaimingId(null);
    }
  };

  // Dynamically overlay live state if player completed quests in the current session
  const dynamicMissions = useMemo(() => {
    return missions.map((m) => {
      let current = m.current ?? 0;
      const target = Math.max(1, m.target ?? 1);

      // If user completed quests today in current session, ensure counter is at least that
      const id = (m.id || '').toLowerCase();
      const source = m.source || '';
      if (
        source === 'questsCompletedToday' ||
        source === 'activeQuests' ||
        source === 'dailyQuestsRatio' ||
        id.includes('threat') ||
        id.includes('complete-daily') ||
        id.includes('full-house') ||
        id.includes('3-quests')
      ) {
        if (state?.questsCompletedToday !== undefined) {
          current = Math.max(current, state.questsCompletedToday);
        }
      }
      if (id.includes('flame') && state?.questsCompletedToday > 0) {
        current = Math.max(current, 1);
      }

      const completed = current >= target;
      return {
        ...m,
        current,
        target,
        completed: completed || Boolean(m.completed),
      };
    });
  }, [missions, state]);

  const completedCount = dynamicMissions.filter((d) => d.completed || d.claimed).length;
  const totalXp = dynamicMissions.reduce((sum, m) => sum + (m.rewardXp || 0), 0);

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
            A fresh set of bite-sized goals every day synced to your actual quest achievements. Complete and claim rewards before midnight reset.
          </p>
        </div>
        <div className="flex items-center gap-6 shrink-0 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined fill text-tertiary-container text-2xl">check_circle</span>
            <div className="flex flex-col leading-tight">
              <span className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                {completedCount} / {dynamicMissions.length || '—'}
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
      ) : dynamicMissions.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-3">
          {dynamicMissions.map((m) => (
            <MissionCard
              key={m.id}
              mission={m}
              onClaim={handleClaim}
              claiming={claimingId === m.id}
            />
          ))}
        </div>
      )}
    </>
  );
}
