import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../state/GameContext';
import * as questService from '../services/questService';
import ActiveQuestCard from '../components/ActiveQuestCard';
import QuestForgePanel from '../components/QuestForgePanel';

export default function QuestsPage() {
  const [tab, setTab] = useState('active');
  const [loading, setLoading] = useState(true);
  const [allQuests, setAllQuests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { state, xpNeeded } = useGame();

  const fetchQuests = () => {
    let cancelled = false;
    questService.getQuests()
      .then((data) => {
        if (cancelled) return;
        let list = [];
        if (Array.isArray(data)) {
          list = data;
        } else if (data && typeof data === 'object') {
          const all = Array.isArray(data.allQuests) ? data.allQuests : [];
          const featured = data.featuredQuest ? [data.featuredQuest] : [];
          const continues = Array.isArray(data.continueQuests) ? data.continueQuests : [];
          const recs = Array.isArray(data.recommendedQuests) ? data.recommendedQuests : [];
          const dailies = Array.isArray(data.dailyQuests) ? data.dailyQuests : [];
          const actives = Array.isArray(data.activeQuestQueue) ? data.activeQuestQueue : [];
          const map = new Map();
          [...all, ...actives, ...continues, ...featured, ...dailies, ...recs].forEach((q) => {
            if (q && q.id && !map.has(q.id)) {
              map.set(q.id, q);
            }
          });
          list = Array.from(map.values());
        }
        setAllQuests(list);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Could not load quests:', err);
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  };

  useEffect(() => {
    return fetchQuests();
  }, []);

  const activeQuests = useMemo(
    () => allQuests.filter((q) => (q.status === 'ACTIVE' || !q.status) && !q.done),
    [allQuests]
  );

  const dailyQuests = useMemo(
    () => allQuests.filter((q) => q.daily || q.questType === 'DAILY' || q.frequency === 'Daily'),
    [allQuests]
  );

  const weeklyQuests = useMemo(
    () => allQuests.filter((q) => q.frequency === 'Weekly' || q.questType === 'SIDE'),
    [allQuests]
  );

  const epicQuests = useMemo(
    () => allQuests.filter((q) => (q.difficulty || '').toLowerCase().includes('epic') || (q.difficulty || '').toLowerCase().includes('heroic') || (q.difficulty || '').toLowerCase().includes('hard')),
    [allQuests]
  );

  const completedQuests = useMemo(
    () => allQuests.filter((q) => q.status === 'COMPLETED' || q.done),
    [allQuests]
  );

  const tabs = [
    { key: 'active', label: 'Active', count: activeQuests.length },
    { key: 'daily', label: 'Daily', count: dailyQuests.length },
    { key: 'weekly', label: 'Weekly & Side', count: weeklyQuests.length },
    { key: 'epic', label: 'Epic & Hard', count: epicQuests.length },
    { key: 'completed', label: 'Completed', count: completedQuests.length },
  ];

  const currentTabQuests = useMemo(() => {
    let list = [];
    switch (tab) {
      case 'daily':
        list = dailyQuests;
        break;
      case 'weekly':
        list = weeklyQuests;
        break;
      case 'epic':
        list = epicQuests;
        break;
      case 'completed':
        list = completedQuests;
        break;
      case 'active':
      default:
        list = activeQuests;
        break;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return list.filter(
        (item) =>
          (item.title || '').toLowerCase().includes(q) ||
          (item.description || '').toLowerCase().includes(q) ||
          (item.domain || '').toLowerCase().includes(q) ||
          (item.domainName || '').toLowerCase().includes(q) ||
          (item.difficulty || '').toLowerCase().includes(q) ||
          (item.statKey || '').toLowerCase().includes(q) ||
          (item.requirements || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [tab, activeQuests, dailyQuests, weeklyQuests, epicQuests, completedQuests, searchQuery]);

  const potentialXp = activeQuests.reduce((sum, q) => sum + (Number(q.xp) || 0), 0);
  const xpRemaining = Math.max(0, xpNeeded - state.xp);

  const handleQuestCompleted = (questId) => {
    setAllQuests((prev) =>
      prev.map((q) =>
        q.id === questId ? { ...q, status: 'COMPLETED', done: true, progress: 100 } : q
      )
    );
  };

  const handleQuestForged = (newQuest) => {
    setAllQuests((prev) => [newQuest, ...prev]);
  };

  return (
    <>
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider bg-surface-variant px-3 py-1 rounded-full">
                Mission Command
              </span>
              <span className="flex items-center gap-1 font-label-caps text-label-caps text-tertiary font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary inline-block" /> Live Sync Active
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined fill text-primary text-2xl">swords</span>
              Quest Board &amp; Mission Forge
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-0.5 max-w-xl">
              Turn real-life habits into RPG progression. Complete quests to earn XP, Gold, and rank attributes
              across your domains.
            </p>
          </div>
          <div className="flex items-center gap-6 shrink-0">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined fill text-tertiary-container text-2xl">
                check_circle
              </span>
              <div className="flex flex-col leading-tight">
                <span className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                  {activeQuests.length}
                </span>
                <span className="font-label-caps text-label-caps text-outline uppercase">Active Quests</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined fill text-secondary-container text-2xl">bolt</span>
              <div className="flex flex-col leading-tight">
                <span className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                  +{potentialXp}
                </span>
                <span className="font-label-caps text-label-caps text-outline uppercase">Potential XP</span>
              </div>
            </div>
            <Link
              to="/quests/new"
              className="px-4 py-2.5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md shadow-sm hover:translate-y-0.5 transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-base">add</span>
              New Quest
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-surface-container">
          <div className="flex bg-surface-container rounded-full p-1 gap-1 w-fit overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={[
                  'px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors flex items-center gap-1.5',
                  tab === t.key
                    ? 'bg-surface-container-lowest text-on-surface shadow-sm font-bold'
                    : 'text-on-surface-variant hover:text-on-surface',
                ].join(' ')}
              >
                {t.label}
                <span className="text-primary font-bold">({t.count})</span>
              </button>
            ))}
          </div>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3.5 text-outline text-[18px] pointer-events-none">
              search
            </span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-surface-container-lowest rounded-full font-body-sm text-body-sm text-on-surface shadow-[0_2px_6px_rgba(20,19,43,0.04)] focus:outline-none focus:ring-2 focus:ring-primary-container transition-all w-full sm:w-56"
              placeholder="Search mission name or stat..."
              type="text"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-surface-container-lowest rounded-2xl p-10 shadow-sm flex flex-col items-center text-center gap-3">
          <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
          <p className="font-body-md text-body-md text-on-surface-variant">Loading the quest board...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter items-start">
          <div className="xl:col-span-8 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-sm text-headline-sm text-on-surface capitalize">
                {tab} Quests · {currentTabQuests.length} {tab === 'completed' ? 'Archived' : 'Ready'}
              </h2>
              <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">
                {tab === 'completed' ? 'Completed History' : 'Sorted by Priority'}
              </span>
            </div>

            {currentTabQuests.length > 0 ? (
              currentTabQuests.map((q) => (
                <ActiveQuestCard key={q.id} quest={q} onCompleted={handleQuestCompleted} />
              ))
            ) : (
              <div className="bg-surface-container-lowest rounded-2xl p-10 shadow-sm flex flex-col items-center text-center gap-3">
                <span className="material-symbols-outlined text-4xl text-outline">
                  {tab === 'completed' ? 'military_tech' : 'assignment'}
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  No {tabs.find((t) => t.key === tab)?.label} quests right now
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
                  {tab === 'completed'
                    ? 'Quests you complete will appear here in your permanent hall of triumphs.'
                    : 'Forge a new quest on the right or explore domains to add new missions.'}
                </p>
                <Link
                  to="/quests/new"
                  className="mt-2 px-5 py-2.5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md shadow-sm"
                >
                  Forge a Quest
                </Link>
              </div>
            )}
          </div>
          <div className="xl:col-span-4">
            <QuestForgePanel onQuestForged={handleQuestForged} />
          </div>
        </div>
      )}

      <div className="mt-8 bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-headline-sm font-extrabold shrink-0">
            {state.level}
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-on-surface">
              {state.playerName}'s Level {state.level} Progression
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {state.title || 'Novice'} · {state.xp.toLocaleString()} / {xpNeeded.toLocaleString()} XP to Level{' '}
              {state.level + 1} ({xpRemaining.toLocaleString()} XP remaining)
            </span>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center">
            <span className="font-label-caps text-label-caps text-outline uppercase">Today's XP Yield</span>
            <span className="font-stat-counter text-stat-counter text-primary">+{potentialXp}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-label-caps text-label-caps text-outline uppercase">Gold Mined</span>
            <span className="font-stat-counter text-stat-counter text-secondary">
              +{activeQuests.reduce((s, q) => s + (Number(q.gold) || 0), 0)}
            </span>
          </div>
          <Link
            to="/character"
            className="px-5 py-2.5 rounded-full bg-tertiary-container text-on-tertiary font-label-md text-label-md shadow-sm hover:translate-y-0.5 transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">military_tech</span>
            Character Sheet
          </Link>
        </div>
      </div>
    </>
  );
}
