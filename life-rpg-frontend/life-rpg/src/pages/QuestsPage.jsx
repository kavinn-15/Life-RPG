import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../state/GameContext';
import * as questService from '../services/questService';
import questsHeroBanner from '../assets/quests-hero-banner.jpg';
import treasureChestArt from '../assets/treasure-chest-3d.jpg';
import './QuestsPage.css';

const SORT_OPTIONS = [
  { key: 'priority', label: 'Priority', icon: 'low_priority' },
  { key: 'xp-desc', label: 'Highest XP', icon: 'trending_up' },
  { key: 'gold-desc', label: 'Highest Gold', icon: 'monetization_on' },
  { key: 'progress-desc', label: 'Most Progress', icon: 'pie_chart' },
  { key: 'progress-asc', label: 'Least Progress', icon: 'donut_large' },
  { key: 'difficulty', label: 'Difficulty', icon: 'bolt' },
];

export default function QuestsPage() {
  const { grantRewards, pushToast } = useGame();
  const [activeTab, setActiveTab] = useState('active');
  const [quests, setQuests] = useState(() => questService.getStoredQuests());
  const [sortBy, setSortBy] = useState('priority');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [openMenuQuestId, setOpenMenuQuestId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const refreshQuests = () => {
      questService.getQuests().then((data) => {
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) {
          setQuests(data);
        }
      });
    };
    refreshQuests();

    const handleQuestsUpdated = () => {
      setQuests(questService.getStoredQuests());
    };

    window.addEventListener('liferpg_quests_updated', handleQuestsUpdated);
    window.addEventListener('storage', handleQuestsUpdated);

    return () => {
      cancelled = true;
      window.removeEventListener('liferpg_quests_updated', handleQuestsUpdated);
      window.removeEventListener('storage', handleQuestsUpdated);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.quests-sort-wrapper')) {
        setIsSortOpen(false);
      }
      if (!e.target.closest('.quest-menu-wrapper')) {
        setOpenMenuQuestId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const toggleSubtask = (questId, subtaskId) => {
    setQuests((prev) => {
      const updated = prev.map((q) => {
        if (q.id !== questId) return q;
        const subtasks = (q.subtasks || []).map((st) =>
          st.id === subtaskId ? { ...st, done: !st.done } : st
        );
        const doneCount = subtasks.filter((st) => st.done).length;
        const newPct = subtasks.length ? Math.round((doneCount / subtasks.length) * 100) : 0;
        return {
          ...q,
          subtasks,
          progressPct: newPct,
          progress: newPct,
          progressLabel: `${newPct}% (${doneCount}/${subtasks.length})`,
          status: newPct === 100 ? 'COMPLETED' : 'ACTIVE',
        };
      });
      questService.saveStoredQuests(updated);
      return updated;
    });
  };

  const handleMarkComplete = (quest) => {
    questService.completeQuest(quest.id);
    setQuests((prev) => {
      const updated = prev.map((q) => {
        if (q.id !== quest.id) return q;
        const updatedSubtasks = (q.subtasks || []).map((st) => ({ ...st, done: true }));
        return {
          ...q,
          subtasks: updatedSubtasks,
          progressPct: 100,
          progress: 100,
          progressLabel: `100% (${updatedSubtasks.length}/${updatedSubtasks.length})`,
          status: 'COMPLETED',
          completed: true,
        };
      });
      questService.saveStoredQuests(updated);
      return updated;
    });
    grantRewards?.({
      xp: quest.rewardXp || quest.xp || 100,
      gold: quest.rewardGold || quest.gold || 50,
      questTitle: quest.title,
    });
    pushToast?.(`Quest "${quest.title}" completed! +${quest.rewardXp || quest.xp || 100} XP, +${quest.rewardGold || quest.gold || 50} Gold`, 'celebration');
    setOpenMenuQuestId(null);
  };

  const handleResetProgress = (quest) => {
    setQuests((prev) => {
      const updated = prev.map((q) => {
        if (q.id !== quest.id) return q;
        const updatedSubtasks = (q.subtasks || []).map((st) => ({ ...st, done: false }));
        return {
          ...q,
          subtasks: updatedSubtasks,
          progressPct: 0,
          progress: 0,
          progressLabel: `0% (0/${updatedSubtasks.length})`,
          status: 'ACTIVE',
          completed: false,
        };
      });
      questService.saveStoredQuests(updated);
      return updated;
    });
    pushToast?.(`Reset progress for "${quest.title}"`, 'restart_alt');
    setOpenMenuQuestId(null);
  };

  const handleDeleteQuest = (quest) => {
    questService.deleteQuest(quest.id);
    setQuests((prev) => {
      const updated = prev.filter((q) => q.id !== quest.id);
      questService.saveStoredQuests(updated);
      return updated;
    });
    pushToast?.(`Quest "${quest.title}" deleted`, 'delete');
    setOpenMenuQuestId(null);
  };

  const tabCounts = {
    active: quests.filter((q) => (q.progressPct ?? q.progress ?? 0) < 100).length,
    daily: quests.filter((q) => {
      const d = String(q.domain || '').toUpperCase();
      return d === 'FITNESS' || d === 'READING' || d === 'HEALTH' || d === 'MEDITATION';
    }).length,
    weekly: quests.filter((q) => {
      const d = String(q.domain || '').toUpperCase();
      return d === 'PROGRAMMING' || d === 'CODE' || d === 'FINANCE' || d === 'CAREER';
    }).length,
    epic: quests.filter((q) => {
      const diff = String(q.difficulty || '').toUpperCase();
      return diff === 'HARD' || diff === 'EPIC';
    }).length,
    completed: quests.filter((q) => (q.progressPct ?? q.progress ?? 0) === 100).length,
  };

  const tabs = [
    { key: 'active', label: `Active (${tabCounts.active})` },
    { key: 'daily', label: `Daily (${tabCounts.daily})` },
    { key: 'weekly', label: `Weekly (${tabCounts.weekly})` },
    { key: 'epic', label: `Epic (${tabCounts.epic})` },
    { key: 'completed', label: `Completed (${tabCounts.completed})` },
  ];

  const filteredQuests = quests.filter((q) => {
    const prog = q.progressPct ?? q.progress ?? 0;
    const d = String(q.domain || '').toUpperCase();
    const diff = String(q.difficulty || '').toUpperCase();
    if (activeTab === 'active') return prog < 100;
    if (activeTab === 'daily') return d === 'FITNESS' || d === 'READING' || d === 'HEALTH' || d === 'MEDITATION';
    if (activeTab === 'weekly') return d === 'PROGRAMMING' || d === 'CODE' || d === 'FINANCE' || d === 'CAREER';
    if (activeTab === 'epic') return diff === 'HARD' || diff === 'EPIC';
    if (activeTab === 'completed') return prog === 100;
    return true;
  });

  const diffOrder = { EPIC: 4, HARD: 3, MEDIUM: 2, EASY: 1 };

  const displayedQuests = [...filteredQuests].sort((a, b) => {
    const aXp = a.rewardXp ?? a.xp ?? 0;
    const bXp = b.rewardXp ?? b.xp ?? 0;
    const aGold = a.rewardGold ?? a.gold ?? 0;
    const bGold = b.rewardGold ?? b.gold ?? 0;
    const aProg = a.progressPct ?? a.progress ?? 0;
    const bProg = b.progressPct ?? b.progress ?? 0;
    const aDiff = String(a.difficulty || '').toUpperCase();
    const bDiff = String(b.difficulty || '').toUpperCase();

    if (sortBy === 'xp-desc') return bXp - aXp;
    if (sortBy === 'gold-desc') return bGold - aGold;
    if (sortBy === 'progress-desc') return bProg - aProg;
    if (sortBy === 'progress-asc') return aProg - bProg;
    if (sortBy === 'difficulty') return (diffOrder[bDiff] || 0) - (diffOrder[aDiff] || 0);
    return 0;
  });

  const selectedSortOption = SORT_OPTIONS.find((s) => s.key === sortBy) || SORT_OPTIONS[0];

  // Dynamic Domain Overview stats
  const domainsSummary = useMemo(() => {
    const initialDomains = [
      { name: 'Fitness', icon: 'fitness_center', color: '#10b981', current: 0, total: 0 },
      { name: 'Programming', icon: 'code', color: '#6366f1', current: 0, total: 0 },
      { name: 'Finance', icon: 'payments', color: '#f59e0b', current: 0, total: 0 },
      { name: 'Reading', icon: 'auto_stories', color: '#3b82f6', current: 0, total: 0 },
      { name: 'Mind', icon: 'psychology', color: '#ec4899', current: 0, total: 0 },
      { name: 'Career', icon: 'work', color: '#854d0e', current: 0, total: 0 },
    ];

    const map = {};
    initialDomains.forEach((d) => {
      map[d.name.toUpperCase()] = { ...d };
    });

    quests.forEach((q) => {
      const dKey = String(q.domain || 'GENERAL').toUpperCase();
      const matchedKey =
        dKey === 'CODE'
          ? 'PROGRAMMING'
          : dKey === 'HEALTH' || dKey === 'SPORTS'
          ? 'FITNESS'
          : dKey === 'MEDITATION'
          ? 'MIND'
          : dKey;

      if (!map[matchedKey]) {
        map[matchedKey] = {
          name: q.domain || 'General',
          icon: q.icon || 'star',
          color: '#6366f1',
          current: 0,
          total: 0,
        };
      }
      map[matchedKey].total += 1;
      if ((q.progressPct ?? q.progress ?? 0) === 100) {
        map[matchedKey].current += 1;
      }
    });

    return Object.values(map).filter((d) => d.total > 0 || initialDomains.some((id) => id.name === d.name)).slice(0, 6);
  }, [quests]);

  const completedQuestsCount = quests.filter((q) => (q.progressPct ?? q.progress ?? 0) === 100).length;
  const totalQuestsCount = quests.length || 1;
  const questMasteryPct = Math.round((completedQuestsCount / totalQuestsCount) * 100);
  const remainingForReward = Math.max(0, totalQuestsCount - completedQuestsCount);

  return (
    <div className="quests-page-container">
      {/* ================= MAIN 2-COLUMN GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT MAIN FEED (8 cols) ================= */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* 1. Hero Banner */}
          <section className="quests-hero-banner">
            <div className="quests-hero-scenery">
              <img
                src={questsHeroBanner}
                alt="Turn Habits Into Real Progress"
                className="w-full h-full object-cover object-[center_28%]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#f1f3fd] via-[#f1f3fd]/90 via-48% to-transparent" />
            </div>

            <div className="quests-hero-content">
              <span className="quests-hero-badge">QUESTS</span>
              <h1 className="quests-hero-title">
                Turn Habits Into<br />Real Progress
              </h1>
              <p className="quests-hero-subtitle">
                Complete quests, earn XP and Gold, and level up your life across every domain.
              </p>
            </div>

            <div className="quests-hero-quote-box hidden sm:flex">
              <p className="quests-hero-quote-text">
                &ldquo;Progress begins<br />with a single quest.&rdquo;
              </p>
              <div className="quests-hero-quote-line" />
            </div>
          </section>

          {/* 2. Tabs & Sort Filter Row */}
          <div className="quests-filter-bar">
            <div className="quests-tabs-group">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActiveTab(t.key)}
                  className={`quest-tab-pill ${activeTab === t.key ? 'active' : ''}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="quests-sort-group">
              <span>Sort by</span>
              <div className="quests-sort-wrapper">
                <button
                  type="button"
                  className="quests-sort-dropdown"
                  onClick={() => setIsSortOpen((prev) => !prev)}
                >
                  <span>{selectedSortOption.label}</span>
                  <span
                    className={`material-symbols-outlined text-[16px] transition-transform duration-200 ${
                      isSortOpen ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>

                {isSortOpen && (
                  <div className="quests-sort-menu">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        className={`quests-sort-menu-item ${sortBy === opt.key ? 'active' : ''}`}
                        onClick={() => {
                          setSortBy(opt.key);
                          setIsSortOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[15px] opacity-70">
                            {opt.icon}
                          </span>
                          <span>{opt.label}</span>
                        </div>
                        {sortBy === opt.key && (
                          <span className="material-symbols-outlined text-[15px] text-indigo-600 font-bold">
                            check
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. Quest Cards Feed */}
          <div className="flex flex-col">
            {displayedQuests.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-slate-100 flex flex-col items-center gap-3 text-slate-500 shadow-sm">
                <span className="material-symbols-outlined text-4xl text-slate-300">task_alt</span>
                <p className="font-semibold text-slate-700">No quests found</p>
                <p className="text-xs text-slate-400">There are no quests under this tab.</p>
              </div>
            ) : (
              displayedQuests.map((quest) => {
                const subtasks = Array.isArray(quest.subtasks) ? quest.subtasks : [];
                const xpReward = quest.rewardXp ?? quest.xp ?? 100;
                const goldReward = quest.rewardGold ?? quest.gold ?? 50;
                const timeStr = quest.time || quest.duration || '30m';
                const iconBg = quest.iconBg || '#ede9fe';
                const iconColor = quest.iconColor || '#6366f1';
                const domainColor = quest.domainColor || 'blue';
                const diffColor = quest.diffColor || 'amber';
                const progressPct = quest.progressPct ?? quest.progress ?? 0;
                const progressLabel =
                  quest.progressLabel ||
                  `${progressPct}% (${subtasks.filter((s) => s.done).length}/${subtasks.length})`;

                return (
                  <div
                    key={quest.id}
                    className="quest-feed-card"
                    style={{ zIndex: openMenuQuestId === quest.id ? 30 : 1, position: 'relative' }}
                  >
                    {/* Left Section: Icon & Content */}
                    <div className="quest-card-left">
                      <div
                        className="quest-card-icon-box"
                        style={{ background: iconBg, color: iconColor }}
                      >
                        <span className="material-symbols-outlined text-[24px]">
                          {quest.icon || 'star'}
                        </span>
                      </div>

                      <div className="quest-card-content">
                        {/* Tags */}
                        <div className="quest-card-tags">
                          <span className={`dash-chip dash-chip-${domainColor}`}>
                            {quest.domain || 'GENERAL'}
                          </span>
                          <span className={`dash-chip dash-chip-${diffColor}`}>
                            <span className="material-symbols-outlined text-[11px]">bolt</span>
                            {quest.difficulty || 'MEDIUM'}
                          </span>
                          <span className="text-[11px] font-bold text-[#64748b] flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">schedule</span>
                            {timeStr}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="quest-card-title">{quest.title}</h3>

                        {/* Subtasks Checklist */}
                        <div className="quest-subtasks-list">
                          {subtasks.map((st) => (
                            <div
                              key={st.id}
                              onClick={() => toggleSubtask(quest.id, st.id)}
                              className="quest-subtask-item"
                            >
                              <div
                                className={`quest-subtask-checkbox ${
                                  st.done ? 'checked' : ''
                                }`}
                              >
                                {st.done && (
                                  <span className="material-symbols-outlined text-[11px]">
                                    check
                                  </span>
                                )}
                              </div>
                              <span
                                className={`quest-subtask-text ${
                                  st.done ? 'checked' : ''
                                }`}
                              >
                                {st.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Section: Progress & Action */}
                    <div className="quest-card-right">
                      <div className="quest-menu-wrapper">
                        <button
                          type="button"
                          className={`quest-menu-btn ${openMenuQuestId === quest.id ? 'active' : ''}`}
                          title="More options"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuQuestId(openMenuQuestId === quest.id ? null : quest.id);
                          }}
                        >
                          <span className="material-symbols-outlined text-[18px]">more_vert</span>
                        </button>

                        {openMenuQuestId === quest.id && (
                          <div className="quest-actions-menu">
                            <Link
                              to={`/quests/${quest.id}`}
                              className="quest-action-item"
                              onClick={() => setOpenMenuQuestId(null)}
                            >
                              <span className="material-symbols-outlined text-[16px]">visibility</span>
                              <span>View Details</span>
                            </Link>
                            <Link
                              to={`/quests/${quest.id}/edit`}
                              className="quest-action-item"
                              onClick={() => setOpenMenuQuestId(null)}
                            >
                              <span className="material-symbols-outlined text-[16px]">edit</span>
                              <span>Edit Quest</span>
                            </Link>
                            {progressPct < 100 ? (
                              <button
                                type="button"
                                className="quest-action-item"
                                style={{ color: '#059669' }}
                                onClick={() => handleMarkComplete(quest)}
                              >
                                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                <span>Mark Complete</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="quest-action-item"
                                onClick={() => handleResetProgress(quest)}
                              >
                                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                                <span>Reset Progress</span>
                              </button>
                            )}
                            <div className="quest-action-divider" />
                            <button
                              type="button"
                              className="quest-action-item danger"
                              onClick={() => handleDeleteQuest(quest)}
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                              <span>Delete Quest</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="quest-card-progress-section">
                        <div className="quest-card-progress-header">
                          <span className="quest-card-progress-lbl">Progress</span>
                          <span className="quest-card-progress-val">
                            {progressLabel}
                          </span>
                        </div>
                        <div className="quest-card-track">
                          <div
                            className="quest-card-fill"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full mt-1">
                        <div className="quest-card-badges-row">
                          <span className="mission-pill-xp">+{xpReward} XP</span>
                          <span className="mission-pill-gold">+{goldReward} Gold</span>
                        </div>

                        <Link to={`/quests/${quest.id}`} className="quest-btn-continue">
                          <span className="material-symbols-outlined text-[10px]">play_arrow</span>
                          <span>Continue</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ================= RIGHT SIDE PANELS (4 cols) ================= */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* 1. Quest Mastery Dark Card */}
          <section className="quests-mastery-card">
            <h2 className="quests-mastery-title">Quest Mastery</h2>

            <div className="quests-mastery-body">
              {/* Circular Donut Ring */}
              <div className="quests-donut-box">
                <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    fill="none"
                    stroke="#1e2448"
                    strokeWidth="6.5"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    fill="none"
                    stroke="#6366f1"
                    strokeLinecap="round"
                    strokeWidth="6.5"
                    strokeDasharray={2 * Math.PI * 32}
                    strokeDashoffset={2 * Math.PI * 32 * (1 - Math.min(1, questMasteryPct / 100))}
                  />
                </svg>
                <span className="absolute quests-donut-val">
                  {completedQuestsCount}/{totalQuestsCount}
                </span>
              </div>

              {/* Info */}
              <div className="quests-mastery-info">
                <span className="quests-mastery-label">Quests Completed</span>
                <p className="quests-mastery-sub">
                  {remainingForReward > 0
                    ? `Complete ${remainingForReward} more to unlock the next reward!`
                    : 'All quests in this cycle completed! Forge new ones to level up!'}
                </p>
              </div>

              {/* Treasure Chest Icon Box */}
              <div className="quests-chest-box">
                <img
                  src={treasureChestArt}
                  alt="Quest Mastery Chest"
                  className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(245,158,11,0.35)]"
                />
              </div>
            </div>
          </section>

          {/* 2. Domain Overview Card */}
          <section className="quests-domains-card">
            <div className="quests-domains-header">
              <h2 className="quests-domains-title">Domain Overview</h2>
              <Link to="/domains" className="quests-domains-link">
                <span>View All</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              {domainsSummary.map((dom) => {
                const pct = dom.total > 0 ? Math.round((dom.current / dom.total) * 100) : 0;
                return (
                  <div key={dom.name} className="quests-domain-item-row">
                    <div className="quests-domain-item-left">
                      <span
                        className="material-symbols-outlined text-[18px]"
                        style={{ color: dom.color }}
                      >
                        {dom.icon}
                      </span>
                      <span className="quests-domain-item-name">{dom.name}</span>
                    </div>

                    <div className="quests-domain-item-bar">
                      <div
                        className="quests-domain-item-fill"
                        style={{ width: `${pct}%`, background: dom.color }}
                      />
                    </div>

                    <span className="quests-domain-item-count">
                      {dom.current} / {dom.total}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 3. Forge a New Quest AI Card */}
          <section className="quests-forge-ai-card">
            {/* Sparkle decorative stars */}
            <span className="quests-sparkle quests-sparkle-1">✦</span>
            <span className="quests-sparkle quests-sparkle-2">✨</span>
            <span className="quests-sparkle quests-sparkle-3">✦</span>

            <div className="flex items-center gap-3 w-full">
              <div className="quests-forge-trophy-box">
                <span className="material-symbols-outlined text-[#6366f1] text-[24px]">
                  emoji_events
                </span>
              </div>

              <div>
                <h3 className="quests-forge-ai-title">Forge a New Quest</h3>
                <p className="quests-forge-ai-desc">
                  Turn any goal into a personalized quest with AI.
                </p>
              </div>
            </div>

            <Link to="/quests/new" className="quests-btn-forge-custom">
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Create Custom Quest</span>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
