import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../state/GameContext';
import * as questService from '../services/questService';

const DOMAINS = [
  { key: 'finance', label: 'Finance', icon: 'account_balance', color: 'amber', iconBg: '#fef3c7', iconColor: '#d97706' },
  { key: 'code', label: 'Programming', icon: 'code', color: 'blue', iconBg: '#ede9fe', iconColor: '#6366f1' },
  { key: 'sports', label: 'Sports', icon: 'sports_soccer', color: 'green', iconBg: '#dcfce7', iconColor: '#15803d' },
  { key: 'reading', label: 'Reading', icon: 'menu_book', color: 'blue', iconBg: '#dbeafe', iconColor: '#2563eb' },
  { key: 'mind', label: 'Mind', icon: 'self_improvement', color: 'pink', iconBg: '#fce7f3', iconColor: '#db2777' },
  { key: 'fitness', label: 'Fitness', icon: 'fitness_center', color: 'green', iconBg: '#dcfce7', iconColor: '#15803d' },
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Epic'];
const TIMES = ['15m', '30m', '60m', '120m'];

const DIFFICULTY_MULT = { Easy: 0.6, Medium: 1, Hard: 1.6, Epic: 2.4 };
const TIME_MULT = { '15m': 0.5, '30m': 0.75, '60m': 1, '120m': 1.6 };

export default function QuestForgePanel() {
  const { grantRewards, pushToast } = useGame();
  const [title, setTitle] = useState('Draft 20-Page Pitch Deck for Series A');
  const [domain, setDomain] = useState('finance');
  const [difficulty, setDifficulty] = useState('Medium');
  const [time, setTime] = useState('60m');
  const [minted, setMinted] = useState(false);

  const baseXp = 90;
  const baseGold = 70;
  const mult = DIFFICULTY_MULT[difficulty] * TIME_MULT[time];
  const xp = Math.round(baseXp * mult);
  const gold = Math.round(baseGold * mult);
  const activeDomain = DOMAINS.find((d) => d.key === domain) || DOMAINS[0];

  const handleForge = async () => {
    setMinted(true);

    const diffColor =
      difficulty === 'Hard' || difficulty === 'Epic' ? 'red' : difficulty === 'Medium' ? 'amber' : 'green';

    await questService.createQuest({
      title: title.trim() || 'Untitled Forged Quest',
      description: `Custom forged ${difficulty} quest in ${activeDomain.label} domain (${time}).`,
      domain: activeDomain.label.toUpperCase(),
      domainId: domain,
      domainColor: activeDomain.color,
      difficulty: difficulty.toUpperCase(),
      diffColor,
      time,
      duration: time,
      rewardXp: xp,
      xp,
      rewardGold: gold,
      gold,
      icon: activeDomain.icon,
      iconBg: activeDomain.iconBg,
      iconColor: activeDomain.iconColor,
      subtasks: [
        { id: 1, text: title.trim() || 'Complete forged quest task', done: false },
        { id: 2, text: 'Review performance & log mastery', done: false },
      ],
      progressPct: 0,
      progress: 0,
      progressLabel: '0% (0/2)',
      status: 'ACTIVE',
    });

    grantRewards?.({ xp: Math.round(xp * 0.1), gold: Math.round(gold * 0.1), questTitle: 'Contract Sign-on Bonus' });
    pushToast(`Quest forged: ${title || 'Untitled Quest'} · +${xp} XP`, 'auto_awesome');
    setTimeout(() => setMinted(false), 1500);
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined fill text-secondary-container text-2xl">auto_fix_high</span>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-on-surface leading-tight">Forge a New Quest</span>
            <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">
              Contract Generation Desk
            </span>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps uppercase shrink-0">
          Draft Mode
        </span>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="font-label-md text-label-md text-on-surface-variant">Mission Title</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2.5 bg-surface rounded-2xl border border-surface-container-high focus:outline-none focus:ring-4 focus:ring-primary/15 font-body-sm text-body-sm text-on-surface"
          placeholder="Name your quest"
        />
      </label>

      <div className="flex flex-col gap-2">
        <span className="font-label-md text-label-md text-on-surface-variant">Domain &amp; Skill Sphere</span>
        <div className="grid grid-cols-3 gap-2">
          {DOMAINS.map((d) => (
            <button
              key={d.key}
              onClick={() => setDomain(d.key)}
              className={[
                'flex flex-col items-center gap-1 py-3 rounded-xl font-label-md text-label-md transition-colors',
                domain === d.key
                  ? 'bg-primary-container text-on-primary shadow-sm'
                  : 'bg-surface text-on-surface-variant hover:bg-surface-container',
              ].join(' ')}
            >
              <span className="material-symbols-outlined text-xl">{d.icon}</span>
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-label-md text-label-md text-on-surface-variant">Difficulty Grade</span>
        <div className="flex bg-surface rounded-full p-1 gap-1">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={[
                'flex-1 py-2 rounded-full font-label-md text-label-md transition-colors',
                difficulty === d ? 'bg-surface-container-lowest text-on-surface shadow-sm font-bold' : 'text-on-surface-variant',
              ].join(' ')}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-label-md text-label-md text-on-surface-variant">Time Commitment</span>
        <div className="flex bg-surface rounded-full p-1 gap-1">
          {TIMES.map((t) => (
            <button
              key={t}
              onClick={() => setTime(t)}
              className={[
                'flex-1 py-2 rounded-full font-label-md text-label-md transition-colors',
                time === t ? 'bg-surface-container-lowest text-on-surface shadow-sm font-bold' : 'text-on-surface-variant',
              ].join(' ')}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-surface rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">
            Contract Output Simulator
          </span>
          <span className="flex items-center gap-1 font-label-caps text-label-caps text-tertiary font-bold">
            <span className="material-symbols-outlined text-sm">bolt</span> Ready to Mint
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps uppercase">
            <span className="material-symbols-outlined align-middle text-xs mr-1">{activeDomain.icon}</span>
            {activeDomain.label}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps uppercase">
            {difficulty}
          </span>
        </div>
        <p className="font-headline-sm text-base font-bold text-on-surface">{title || 'Untitled Quest'}</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-label-caps text-label-caps text-primary bg-primary-fixed px-2 py-0.5 rounded-full font-extrabold">
            +{xp} XP
          </span>
          <span className="font-label-caps text-label-caps text-secondary-container bg-[#FFF8E6] px-2 py-0.5 rounded-full font-extrabold">
            +{gold} Gold
          </span>
          <span className="flex items-center gap-1 font-label-caps text-label-caps text-outline">
            <span className="material-symbols-outlined text-xs">schedule</span> {time}
          </span>
        </div>
      </div>

      <button
        className={[
          'w-full py-3.5 rounded-full font-label-lg text-label-lg shadow-md transition-all flex items-center justify-center gap-2',
          minted ? 'bg-tertiary-container text-on-tertiary' : 'bg-primary-container text-on-primary hover:translate-y-0.5',
        ].join(' ')}
        onClick={handleForge}
      >
        <span className="material-symbols-outlined text-lg">{minted ? 'done_all' : 'bolt'}</span>
        <span>{minted ? 'Injected Into Active Log' : 'Forge & Inject Into Active Log'}</span>
      </button>

      <Link
        to="/quests/new"
        className="text-center font-label-md text-label-md text-primary hover:underline -mt-2"
      >
        Open Full Quest Builder →
      </Link>
    </div>
  );
}
