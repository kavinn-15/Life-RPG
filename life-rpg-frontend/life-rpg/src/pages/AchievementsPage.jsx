import { useEffect, useMemo, useState } from 'react';
import { useGame } from '../state/GameContext';
import * as achievementService from '../services/achievementService';
import * as questService from '../services/questService';
import { CATEGORY_META, ACHIEVEMENT_CATEGORIES, getCategoryMeta } from '../data/achievementData';
import { Chip, ProgressBar } from '../components/Chip';
import AchievementUnlockModal from '../components/AchievementUnlockModal';

const CATEGORY_TABS = [{ key: 'All', label: 'All' }, ...ACHIEVEMENT_CATEGORIES.map((c) => ({ key: c, label: c }))];
const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'unlocked', label: 'Unlocked' },
  { key: 'locked', label: 'Locked' },
];

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-gutter">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-surface-container animate-pulse shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-3.5 w-3/4 rounded-full bg-surface-container animate-pulse" />
              <div className="h-3 w-1/2 rounded-full bg-surface-container animate-pulse" />
            </div>
          </div>
          <div className="h-3 w-full rounded-full bg-surface-container animate-pulse" />
          <div className="h-2 w-full rounded-full bg-surface-container animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ statusTab, categoryTab }) {
  const copy =
    statusTab === 'unlocked'
      ? "The Hall of Medals stands empty in this wing — go complete a few quests and come claim your first badge."
      : statusTab === 'locked'
      ? "Every medal here is already claimed. Impressive work, Architect — check another category for more to chase."
      : `No achievements have been forged for ${categoryTab} yet. Check back after your next update.`;

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-12 shadow-sm flex flex-col items-center text-center gap-2">
      <span className="material-symbols-outlined text-4xl text-outline">emoji_events</span>
      <h3 className="font-headline-sm text-headline-sm text-on-surface">No achievements yet</h3>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">{copy}</p>
    </div>
  );
}

function AchievementCard({ achievement }) {
  const meta = getCategoryMeta(achievement?.category);
  const current = Number(achievement?.progress?.current ?? achievement?.current ?? 0);
  const target = Math.max(1, Number(achievement?.progress?.target ?? achievement?.target ?? 1));
  const pct = Math.min(100, Math.max(0, Math.round((current / target) * 100)));
  const xpReward = Number(achievement?.reward?.xp ?? achievement?.xp ?? 0);
  const goldReward = Number(achievement?.reward?.gold ?? achievement?.gold ?? 0);
  const isUnlocked = Boolean(achievement?.unlocked);

  if (isUnlocked) {
    return (
      <div className="animate-card-pop bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-emerald-500/20 flex flex-col gap-3 relative overflow-hidden ring-1 ring-emerald-500/30">
        <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />
        <div className="flex items-center gap-3">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm shrink-0 ${meta.accentClass}`}>
            <span className="material-symbols-outlined fill text-2xl">{achievement?.icon || 'emoji_events'}</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-label-lg text-label-lg text-on-surface truncate">{achievement?.title}</span>
            <Chip className="text-emerald-700 bg-emerald-100 font-bold w-fit mt-0.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              <span>Completed</span>
            </Chip>
          </div>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">{achievement?.description}</p>
        <div className="flex items-center gap-2 mt-auto pt-1">
          <Chip className="text-primary bg-primary-fixed">+{xpReward} XP</Chip>
          {goldReward > 0 && (
            <Chip className="text-secondary bg-secondary-fixed">+{goldReward} Gold</Chip>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline/10 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-surface-container text-outline shrink-0">
          <span className="material-symbols-outlined text-2xl">lock</span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-label-lg text-label-lg text-on-surface truncate">{achievement?.title}</span>
          <Chip className="text-outline bg-surface-container w-fit mt-0.5">Locked</Chip>
        </div>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant">{achievement?.description}</p>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-label-caps font-label-caps text-outline">
          <span>
            {current.toLocaleString()} / {target.toLocaleString()}
          </span>
          <span className="font-bold text-on-surface">{pct}%</span>
        </div>
        <ProgressBar pct={pct} className={meta.accentClass.split(' ')[0]} />
      </div>
      <div className="flex items-center gap-2 mt-auto pt-1">
        <Chip className="text-primary bg-primary-fixed">+{xpReward} XP</Chip>
        {goldReward > 0 && (
          <Chip className="text-secondary bg-secondary-fixed">+{goldReward} Gold</Chip>
        )}
      </div>
    </div>
  );
}

export default function AchievementsPage() {
  const { state } = useGame();
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState([]);
  const [categoryTab, setCategoryTab] = useState('All');
  const [statusTab, setStatusTab] = useState('all');
  const [revealAchievement, setRevealAchievement] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const storedQuests = questService.getStoredQuests();
    achievementService
      .getAchievements(state, storedQuests)
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data) ? data : [];
        setAchievements(list);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Failed to load achievements:', err);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [state]);

  const filtered = useMemo(() => {
    if (!Array.isArray(achievements)) return [];
    return achievements.filter((a) => {
      if (categoryTab !== 'All' && String(a?.category || '').toLowerCase() !== categoryTab.toLowerCase()) {
        return false;
      }
      if (statusTab === 'unlocked' && !a?.unlocked) return false;
      if (statusTab === 'locked' && a?.unlocked) return false;
      return true;
    });
  }, [achievements, categoryTab, statusTab]);

  const unlockedCount = achievements.filter((a) => a?.unlocked).length;
  const totalXpEarned = achievements
    .filter((a) => a?.unlocked)
    .reduce((sum, a) => sum + Number(a?.reward?.xp ?? a?.xp ?? 0), 0);

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider bg-surface-variant px-3 py-1 rounded-full">
              Hall of Medals
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined fill text-primary text-2xl">emoji_events</span>
            Achievements &amp; Medals
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-0.5 max-w-xl">
            Every quest, streak, and stat milestone earns its own medal. Chase them down across all six categories.
          </p>
        </div>
        <div className="flex items-center gap-6 shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined fill text-tertiary-container text-2xl">workspace_premium</span>
            <div className="flex flex-col leading-tight">
              <span className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                {unlockedCount} / {achievements.length || '—'}
              </span>
              <span className="font-label-caps text-label-caps text-outline uppercase">Medals Unlocked</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined fill text-secondary-container text-2xl">bolt</span>
            <div className="flex flex-col leading-tight">
              <span className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                {totalXpEarned.toLocaleString()}
              </span>
              <span className="font-label-caps text-label-caps text-outline uppercase">XP From Medals</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-surface-container">
        <div className="flex bg-surface-container rounded-full p-1 gap-1 w-fit overflow-x-auto">
          {CATEGORY_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setCategoryTab(t.key)}
              className={[
                'px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors',
                categoryTab === t.key
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm font-bold'
                  : 'text-on-surface-variant hover:text-on-surface',
              ].join(' ')}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex bg-surface-container rounded-full p-1 gap-1 w-fit overflow-x-auto">
          {STATUS_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setStatusTab(t.key)}
              className={[
                'px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors',
                statusTab === t.key
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm font-bold'
                  : 'text-on-surface-variant hover:text-on-surface',
              ].join(' ')}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <SkeletonGrid />
      ) : filtered.length === 0 ? (
        <EmptyState statusTab={statusTab} categoryTab={categoryTab} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-gutter">
          {filtered.map((a) => (
            <AchievementCard key={a.id} achievement={a} />
          ))}
        </div>
      )}

      <AchievementUnlockModal achievement={revealAchievement} onClose={() => setRevealAchievement(null)} />
    </>
  );
}
