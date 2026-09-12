import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../state/GameContext';
import * as questService from '../services/questService';

// Asset imports
import adventureHeroArt from '../assets/adventure-hero-art.png';
import adventureLocationMap from '../assets/adventure-location-map.png';

/* ================================================================
   ADVENTURE PATHS DATA
   ================================================================ */

const ADVENTURE_PATHS = [
  {
    id: 'habits',
    title: 'Forest of Habits',
    description: 'Build better habits and unlock your potential.',
    quests: 12,
    progress: 20,
    icon: 'eco',
    iconBg: 'bg-[#e8f7ee]',
    iconColor: 'text-[#22845c]',
    barColor: 'bg-[#2ec57d]',
  },
  {
    id: 'productivity',
    title: 'Peak of Productivity',
    description: 'Master focus, time management, and get things done.',
    quests: 8,
    progress: 35,
    icon: 'landscape',
    iconBg: 'bg-[#fff1e1]',
    iconColor: 'text-[#d96a1a]',
    barColor: 'bg-[#ff8f1f]',
  },
  {
    id: 'knowledge',
    title: 'Citadel of Knowledge',
    description: 'Learn new skills and expand your mind.',
    quests: 15,
    progress: 40,
    icon: 'account_balance',
    iconBg: 'bg-[#eef0ff]',
    iconColor: 'text-[#505be8]',
    barColor: 'bg-[#6e63ea]',
  },
  {
    id: 'wellbeing',
    title: 'Isle of Wellbeing',
    description: 'Improve your health, mindset, and balance.',
    quests: 10,
    progress: 25,
    icon: 'favorite',
    iconBg: 'bg-[#ffe9ed]',
    iconColor: 'text-[#ea436b]',
    barColor: 'bg-[#f45376]',
  },
];

/* ================================================================
   FEATURED ADVENTURES DATA
   ================================================================ */

const FEATURED_ADVENTURES = [
  {
    id: 'challenge',
    title: '30-Day Challenge',
    subtitle: 'A month. A better you.',
    reward: '+500 XP',
    icon: 'emoji_events',
    iconBg: 'bg-[#fff6e2]',
    iconColor: 'text-[#efa813]',
  },
  {
    id: 'mastery',
    title: 'Mastery Quest',
    subtitle: 'Push past your boundaries.',
    reward: '+450 XP',
    icon: 'psychology',
    iconBg: 'bg-[#f0efff]',
    iconColor: 'text-[#6356df]',
  },
  {
    id: 'legendary',
    title: 'Legendary Quest',
    subtitle: 'For those who go further.',
    reward: '+1,000 XP',
    icon: 'workspace_premium',
    iconBg: 'bg-[#fff6e2]',
    iconColor: 'text-[#efa813]',
  },
];

/* ================================================================
   LOADING STATE
   ================================================================ */

function AdventureLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">
          progress_activity
        </span>
        <p className="text-sm font-semibold text-[#686985]">
          Loading Adventure Realm...
        </p>
      </div>
    </div>
  );
}

/* ================================================================
   HERO BANNER
   ================================================================ */

function AdventureHero({ onStartAdventure, onViewMap }) {
  return (
    <section className="relative mb-6 min-h-[260px] overflow-hidden rounded-2xl bg-gradient-to-r from-[#e8e7fc] via-[#dce8fd] to-[#d4e4fd] shadow-[0_4px_18px_rgba(20,19,55,0.06)] border border-[#dedcf2]">
      {/* Full panoramic background image */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src={adventureHeroArt}
          alt="Explore Learn Grow Landscape"
          className="h-full w-full object-cover object-right sm:object-[center_35%]"
        />
        {/* Soft linear fade from left so text is completely legible */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#eef0fc] via-[#eef0fc]/90 via-35% to-transparent sm:via-[#eef0fc]/70" />
      </div>

      {/* Floating motivational quote in upper right */}
      <div className="absolute right-6 top-6 hidden max-w-[170px] text-right md:block z-10">
        <p className="text-[13px] font-bold italic leading-snug text-[#1f2048] drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
          “New horizons
          <br />
          build stronger you.”
        </p>
      </div>

      {/* Hero content on left */}
      <div className="relative z-10 flex min-h-[260px] max-w-[540px] flex-col justify-center p-6 sm:p-7">
        <div className="mb-3">
          <span className="inline-flex items-center rounded-full bg-[#dfd9fc]/90 backdrop-blur-sm px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#5547c8]">
            Adventure Mode
          </span>
        </div>

        <h1 className="text-[32px] font-black leading-[1.08] tracking-tight text-[#16163f] sm:text-[38px]">
          Explore. Learn. Grow.
        </h1>

        <p className="mt-2 text-[13px] leading-relaxed text-[#505170] sm:text-[14px]">
          Take on quests, explore new domains, and become a better version of yourself.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onStartAdventure}
            className="flex items-center gap-2 rounded-full bg-[#5b4be2] px-5 py-2.5 text-[13px] font-extrabold text-white shadow-[0_4px_14px_rgba(91,75,226,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4d3dd4] active:translate-y-0"
          >
            <span className="material-symbols-outlined text-[18px]">
              explore
            </span>
            <span>Start an Adventure</span>
          </button>

          <button
            type="button"
            onClick={onViewMap}
            className="flex items-center gap-2 rounded-full border border-[#dedef0] bg-white/90 backdrop-blur-sm px-5 py-2.5 text-[13px] font-extrabold text-[#18183c] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-md active:translate-y-0"
          >
            <span className="material-symbols-outlined text-[18px] text-[#4f4f72]">
              map
            </span>
            <span>View World Map</span>
          </button>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   ADVENTURE PATH CARD (CLEAN WITHOUT TOP IMAGE)
   ================================================================ */

function AdventurePathCard({ path, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex flex-col justify-between rounded-2xl border border-[#e8e7f2] bg-white p-4 text-left shadow-[0_3px_12px_rgba(20,19,50,0.04)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(20,19,50,0.08)] min-h-[160px]"
    >
      <div>
        <div className="flex items-center gap-3 mb-2.5">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${path.iconBg} ${path.iconColor}`}
          >
            <span className="material-symbols-outlined text-[22px]">
              {path.icon}
            </span>
          </div>

          <h3 className="truncate text-[15px] font-extrabold text-[#1c1c45]">
            {path.title}
          </h3>
        </div>

        <p className="line-clamp-2 text-[12px] leading-relaxed text-[#686985]">
          {path.description}
        </p>
      </div>

      {/* Footer Progress & Action */}
      <div className="mt-4 flex items-center gap-2 border-t border-[#f2f1f8] pt-3">
        <span className="whitespace-nowrap text-[11px] font-bold text-[#424360]">
          {path.quests} Quests
        </span>

        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#ebeaf4]">
          <div
            className={`h-full rounded-full ${path.barColor} transition-all duration-500`}
            style={{ width: `${path.progress}%` }}
          />
        </div>

        <span className="text-[11px] font-extrabold text-[#333455]">
          {path.progress}%
        </span>

        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f2f1fc] text-primary transition-all group-hover:bg-primary group-hover:text-white">
          <span className="material-symbols-outlined text-[16px]">
            arrow_forward
          </span>
        </span>
      </div>
    </button>
  );
}

/* ================================================================
   FEATURED ADVENTURE CARD
   ================================================================ */

function FeaturedAdventureCard({ adventure, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex items-center gap-3 rounded-2xl border border-[#e8e7f2] bg-white p-3.5 shadow-[0_3px_10px_rgba(20,19,50,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(20,19,50,0.07)] text-left"
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${adventure.iconBg} ${adventure.iconColor}`}
      >
        <span className="material-symbols-outlined text-[23px]">
          {adventure.icon}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[13px] font-extrabold text-[#1c1c45]">
          {adventure.title}
        </h3>
        <p className="mt-0.5 truncate text-[11px] text-[#73748e]">
          {adventure.subtitle}
        </p>
        <span className="mt-1.5 inline-flex items-center rounded-full bg-[#f0effe] px-2.5 py-0.5 text-[10px] font-extrabold text-primary">
          {adventure.reward}
        </span>
      </div>

      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f2f1fc] text-primary transition-all group-hover:bg-primary group-hover:text-white">
        <span className="material-symbols-outlined text-[16px]">
          arrow_forward
        </span>
      </span>
    </button>
  );
}

/* ================================================================
   LOCATION PANEL (RIGHT COLUMN CARD 1)
   ================================================================ */

function CurrentLocationPanel({ onViewMap }) {
  return (
    <section className="overflow-hidden rounded-2xl bg-[#101032] border border-[#1e1e4a] text-white shadow-[0_4px_18px_rgba(16,16,50,0.14)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-[#8e81ff]">
            location_on
          </span>
          <h3 className="text-[14px] font-extrabold tracking-tight text-white">
            Your Current Location
          </h3>
        </div>

        <button
          type="button"
          onClick={onViewMap}
          className="group flex items-center gap-1 text-[11px] font-extrabold text-[#9b8dff] transition-colors hover:text-white"
        >
          <span>View Map</span>
          <span className="material-symbols-outlined text-[15px] transition-transform group-hover:translate-x-0.5">
            arrow_forward
          </span>
        </button>
      </div>

      {/* Map Art Area */}
      <div className="relative h-[175px] overflow-hidden">
        <img
          src={adventureLocationMap}
          alt="Adventure World Location"
          className="h-full w-full object-cover object-center"
        />

        {/* Ambient Dark Overlay to make HUD waypoints stand out */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0d28]/70 via-[#13143c]/35 to-[#0e0f2d]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c26]/85 via-transparent to-[#1a1b4d]/20" />

        {/* Waypoint: You Are Here */}
        <div className="absolute left-4 top-[50px] flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#5be6a1] shadow-[0_0_20px_rgba(91,230,161,0.85)] animate-pulse" />
            <div className="absolute inset-[6px] rounded-full border-2 border-white/80" />
          </div>

          <div className="rounded-xl bg-[#0e1030]/90 px-3 py-1.5 shadow-[0_4px_14px_rgba(0,0,0,0.4)] backdrop-blur-sm border border-white/10">
            <p className="text-[9px] font-bold uppercase tracking-wider text-[#a0a2c2]">
              You are here
            </p>
            <p className="text-[12px] font-extrabold text-white">
              Forest of Habits
            </p>
          </div>
        </div>

        {/* Dotted travel path */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 380 175"
          preserveAspectRatio="none"
        >
          <path
            d="M 60 95 Q 160 140 230 115 T 320 130"
            fill="none"
            stroke="#9f93ff"
            strokeWidth="2.5"
            strokeDasharray="4 6"
            strokeOpacity="0.8"
          />
          {/* Stepping nodes */}
          <circle cx="150" cy="118" r="4" fill="#9f93ff" />
          <circle cx="230" cy="115" r="4" fill="#9f93ff" />
        </svg>

        {/* Waypoint: Next Stop */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#555490]/40 backdrop-blur-sm border border-white/15">
            <span className="material-symbols-outlined text-[17px] text-white/90">
              lock
            </span>
          </div>

          <div className="rounded-lg bg-[#0e1030]/85 px-2.5 py-1 backdrop-blur-sm border border-white/10 text-left">
            <p className="text-[8px] font-semibold uppercase tracking-wider text-[#a0a2c2]">
              Next Stop
            </p>
            <p className="text-[11px] font-extrabold text-white">
              Citadel of Knowledge
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   ADVENTURE PROGRESS (RIGHT COLUMN CARD 2)
   ================================================================ */

function AdventureProgressPanel({ progress = 28, cycle = 'Cycle 4', milestones = '3 / 12', onDetail }) {
  const circumference = 2 * Math.PI * 34;
  const offset = circumference * (1 - progress / 100);

  return (
    <section className="rounded-2xl bg-[#101032] border border-[#1e1e4a] p-4 text-white shadow-[0_4px_18px_rgba(16,16,50,0.14)]">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-[#8e81ff]">
            bar_chart
          </span>
          <h3 className="text-[14px] font-extrabold tracking-tight text-white">
            Adventure Progress
          </h3>
        </div>

        <span className="rounded-full bg-[#1e1f4a] px-2.5 py-0.5 text-[10px] font-extrabold text-[#9b8dff]">
          {cycle}
        </span>
      </div>

      <div className="flex items-center gap-3.5">
        {/* Circular Donut Ring */}
        <div className="relative h-[72px] w-[72px] shrink-0">
          <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="#20204c"
              strokeWidth="7"
            />
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="#6c5ce7"
              strokeLinecap="round"
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-700"
            />
          </svg>

          <span className="absolute inset-0 flex items-center justify-center text-[15px] font-extrabold">
            {progress}%
          </span>
        </div>

        {/* Milestone Stats */}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-[18px] font-black text-white">
              {milestones}
            </span>
            <span className="text-[11px] font-medium text-[#9a9bb8]">
              Adventure Milestones
            </span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#20204c]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#6c5ce7] to-[#9b8dff] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onDetail}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1e1f4a] text-[#9b8dff] transition-colors hover:bg-primary hover:text-white"
        >
          <span className="material-symbols-outlined text-[18px]">
            arrow_forward
          </span>
        </button>
      </div>
    </section>
  );
}

/* ================================================================
   ACTIVE ADVENTURE QUEST (RIGHT COLUMN CARD 3 - CLEAN)
   ================================================================ */

function ActiveAdventureQuest({ quest, onContinue, onViewDetails }) {
  const title = quest?.title || 'The Habit Trail';
  const description =
    quest?.description ||
    'Complete 7 days of your morning routine to unlock the next path.';
  const progressPct = quest?.progress ?? 43;
  const difficulty = quest?.difficulty || 'MEDIUM';

  return (
    <section>
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[20px] text-primary">
            explore
          </span>
          <h2 className="text-[14px] font-extrabold text-[#17173e]">
            Active Adventure Quest
          </h2>
        </div>

        <button
          type="button"
          onClick={onViewDetails}
          className="group flex items-center gap-0.5 text-[11px] font-extrabold text-primary hover:text-[#4d3dd4]"
        >
          <span>View Details</span>
          <span className="material-symbols-outlined text-[14px] transition-transform group-hover:translate-x-0.5">
            arrow_forward
          </span>
        </button>
      </div>

      <div className="rounded-2xl border border-[#e8e7f2] bg-white p-4 shadow-[0_3px_12px_rgba(20,19,50,0.04)]">
        <div className="flex items-start justify-between gap-1.5">
          <h3 className="truncate text-[14px] font-extrabold text-[#1c1c45]">
            {title}
          </h3>
          <span className="shrink-0 rounded-full bg-[#fff4e5] px-2.5 py-0.5 text-[9px] font-black text-[#d97706]">
            {difficulty.toUpperCase()}
          </span>
        </div>

        <p className="mt-1 line-clamp-2 text-[11.5px] leading-relaxed text-[#686985]">
          {description}
        </p>

        <div className="mt-3 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#ebeaf4]">
            <div
              className="h-full rounded-full bg-[#6c5ce7]"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="whitespace-nowrap text-[10px] font-bold text-[#555675]">
            3 / 7 days
          </span>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="mt-3.5 flex h-9 w-full items-center justify-center gap-1.5 rounded-full bg-[#5b4be2] text-[12px] font-extrabold text-white shadow-[0_3px_0_#4029ba] transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#4d3dd4] active:translate-y-0"
        >
          <span className="material-symbols-outlined text-[16px]">
            play_arrow
          </span>
          <span>Continue Quest</span>
        </button>
      </div>
    </section>
  );
}

/* ================================================================
   ADVENTURE QUOTE (RIGHT COLUMN CARD 4)
   ================================================================ */

function AdventureQuote() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-[#d6e5f8] bg-gradient-to-r from-[#e3f0fc] via-[#edf4fe] to-[#dfebfe] p-4 shadow-sm">
      {/* Decorative cloud/mountain watermark */}
      <div className="pointer-events-none absolute -bottom-6 -right-6 h-28 w-32 opacity-25">
        <svg viewBox="0 0 100 100" fill="#699fe5">
          <polygon points="0,100 45,40 60,65 75,30 100,100" />
        </svg>
      </div>

      <div className="relative flex items-start gap-2.5">
        <span className="font-serif text-[48px] font-black leading-[36px] text-[#7fb0ed] select-none">
          “
        </span>
        <p className="pt-0.5 text-[12.5px] font-extrabold leading-relaxed text-[#151e48]">
          “Adventure is the bridge between who you are and who you can become.”
        </p>
      </div>
    </section>
  );
}

/* ================================================================
   MAIN ADVENTURE PAGE
   ================================================================ */

export default function AdventurePage() {
  const { state } = useGame();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [quests, setQuests] = useState({
    featuredQuest: null,
    continueQuests: [],
    recommendedQuests: [],
  });

  useEffect(() => {
    let cancelled = false;

    questService
      .getQuests()
      .then((data) => {
        if (cancelled) return;
        setQuests({
          featuredQuest: data?.featuredQuest || null,
          continueQuests: data?.continueQuests || [],
          recommendedQuests: data?.recommendedQuests || [],
        });
        setLoading(false);
      })
      .catch((error) => {
        if (cancelled) return;
        console.warn('Could not load quests:', error);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const activeQuest = useMemo(() => {
    return (
      quests.continueQuests?.[0] ||
      quests.featuredQuest ||
      null
    );
  }, [quests]);

  if (loading) {
    return <AdventureLoading />;
  }

  return (
    <div className="min-w-0 pb-10">
      {/* ==========================================================
          MAIN TWO-COLUMN LAYOUT
         ========================================================== */}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_370px]">

        {/* ========================================================
            LEFT COLUMN: HERO, PATHS, FEATURED ADVENTURES
           ======================================================== */}

        <div className="min-w-0">

          {/* 1. Hero Banner */}
          <AdventureHero
            onStartAdventure={() => navigate('/quests')}
            onViewMap={() => navigate('/domains')}
          />

          {/* 2. Explore Adventure Paths */}
          <section className="mb-7">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[21px] text-primary">
                  menu_book
                </span>
                <h2 className="text-[18px] font-extrabold tracking-tight text-[#17173e]">
                  Explore Adventure Paths
                </h2>
              </div>

              <button
                type="button"
                onClick={() => navigate('/domains')}
                className="group flex items-center gap-1 text-[12px] font-extrabold text-primary transition-colors hover:text-[#4d3dd4]"
              >
                <span>View All</span>
                <span className="material-symbols-outlined text-[15px] transition-transform group-hover:translate-x-0.5">
                  arrow_forward
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
              {ADVENTURE_PATHS.map((path) => (
                <AdventurePathCard
                  key={path.id}
                  path={path}
                  onSelect={() => navigate('/domains')}
                />
              ))}
            </div>
          </section>

          {/* 3. Featured Adventures */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">
                star
              </span>
              <h2 className="text-[18px] font-extrabold tracking-tight text-[#17173e]">
                Featured Adventures
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3.5 md:grid-cols-3">
              {FEATURED_ADVENTURES.map((adventure) => (
                <FeaturedAdventureCard
                  key={adventure.id}
                  adventure={adventure}
                  onSelect={() => navigate('/quests')}
                />
              ))}
            </div>
          </section>
        </div>

        {/* ========================================================
            RIGHT COLUMN: PANELS
           ======================================================== */}

        <aside className="flex min-w-0 flex-col gap-3.5">
          {/* 1. Location Panel */}
          <CurrentLocationPanel
            onViewMap={() => navigate('/domains')}
          />

          {/* 2. Progress Panel */}
          <AdventureProgressPanel
            progress={28}
            cycle="Cycle 4"
            milestones="3 / 12"
            onDetail={() => navigate('/progress')}
          />

          {/* 3. Active Adventure Quest */}
          <ActiveAdventureQuest
            quest={activeQuest}
            onContinue={() => navigate('/quests')}
            onViewDetails={() => navigate('/quests')}
          />

          {/* 4. Adventure Quote */}
          <AdventureQuote />
        </aside>
      </div>
    </div>
  );
}