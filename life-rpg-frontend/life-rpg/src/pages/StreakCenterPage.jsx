import { useEffect, useState } from 'react';
import { useGame } from '../state/GameContext';
import * as progressService from '../services/progressService';
import streakHeroBanner from '../assets/streak-hero-banner.png';

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto pb-12 animate-pulse">
      <div className="h-60 rounded-3xl bg-slate-200" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="h-28 rounded-2xl bg-slate-200" />
        <div className="h-28 rounded-2xl bg-slate-200" />
        <div className="h-28 rounded-2xl bg-slate-200" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 h-96 rounded-3xl bg-slate-200" />
        <div className="xl:col-span-5 h-96 rounded-3xl bg-slate-200" />
      </div>
    </div>
  );
}

function StreakGrid30Days({ days, todayDate = 30 }) {
  // 30 days grid layout (10 columns x 3 rows).
  // Day numbers: 1 to 30.
  // Completed days display a flame icon.
  // Missed days display their clean sequential day number (1..30).
  // Day 30 (today) is active with an outer highlight ring.
  return (
    <div className="grid grid-cols-10 gap-2.5 sm:gap-3.5 my-4 justify-items-center">
      {days.map((isDone, idx) => {
        const dayNumber = idx + 1;
        const isToday = dayNumber === 30;

        return (
          <div
            key={dayNumber}
            title={`Day ${dayNumber}: ${isDone ? 'Completed' : 'Missed'}${isToday ? ' (Today)' : ''}`}
            className={[
              'w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-200 select-none cursor-pointer',
              isDone
                ? 'bg-[#2d6a4f] text-white shadow-sm hover:scale-110 hover:bg-[#245740]'
                : 'bg-[#ede9fe] text-[#5b4be2] font-semibold hover:bg-[#e2dcfa]',
              isToday ? 'ring-4 ring-[#5046e5]/40 border-2 border-[#5046e5]' : '',
            ].join(' ')}
          >
            {isDone ? (
              <span className="material-symbols-outlined fill text-base sm:text-lg">local_fire_department</span>
            ) : (
              <span>{dayNumber}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function StreakCenterPage() {
  const { state } = useGame();
  const [loading, setLoading] = useState(true);
  const [streakHistory, setStreakHistory] = useState(null);
  const [milestones, setMilestones] = useState([]);

  useEffect(() => {
    let cancelled = false;
    progressService
      .getProgressHistory()
      .then((data) => {
        if (cancelled) return;
        if (data) {
          setStreakHistory(data.streakHistory || null);
          setMilestones(data.streakMilestones || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Failed to load streak history:', err);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  const current = state?.streak ?? streakHistory?.current ?? 18;
  const longest = state?.longestStreak ?? streakHistory?.longest ?? 24;
  const rawDays = streakHistory?.last30Days || [];

  // Generate 30-day array where completed days have flame icon and missed days show day number.
  let days30 = rawDays.length === 30
    ? [...rawDays]
    : [
      1, 1, 1, 1, 0, 1, 1, 1, 1, 1,
      1, 0, 1, 1, 1, 1, 1, 1, 1, 0,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    ];

  // Guarantee that the current active streak ending today (day 30) is marked as completed
  if (current > 0) {
    const streakStartIdx = Math.max(0, 30 - current);
    for (let i = streakStartIdx; i < 30; i++) {
      days30[i] = 1;
    }
  }

  const activeDaysCount = days30.filter(Boolean).length;

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto pb-12">
      {/* Top Hero Banner Section with Castle, Cute Flame, and Script Text */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-[#d8d2f5] shadow-sm bg-gradient-to-r from-[#4b3bb2] via-[#5c4ac9] to-[#806bf3] min-h-[250px] lg:min-h-[270px] flex items-center p-6 sm:p-8 lg:p-10">
        {/* Background Panoramic Artwork */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${streakHeroBanner})`,
            backgroundPosition: 'right bottom',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* Soft Left Gradient Wash for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#3e2e9c]/90 via-[#4c3cb5]/65 to-transparent pointer-events-none" />

        {/* Hero Content Overlay */}
        <div className="relative z-10 w-full flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Text Column */}
          <div className="flex flex-col max-w-xl">
            <div className="inline-flex items-center mb-2.5">
              <span className="bg-[#ede9fe]/90 backdrop-blur-sm text-[#5046e5] text-[11px] font-bold tracking-wider px-3.5 py-1 rounded-full uppercase border border-[#ddd6fe]/60 shadow-sm flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm fill text-[#5046e5]">local_fire_department</span>
                STREAK CENTER
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
              Keep the Flame Alive!
            </h1>
            <p className="text-sm sm:text-base text-white/90 font-medium leading-relaxed mt-2 max-w-md drop-shadow-sm">
              Complete at least one quest each day. Miss a day and it resets to zero.
            </p>
          </div>

          {/* Center Stylized Handwritten Slogan (Small steps every day lead to big adventures!) */}
          <div className="hidden xl:flex flex-col items-start justify-center pr-48 select-none pointer-events-none">
            <span className="font-['Caveat',cursive] text-2xl lg:text-3xl text-[#f5f3ff] font-bold leading-tight drop-shadow-md -rotate-3">
              Small steps
            </span>
            <span className="font-['Caveat',cursive] text-2xl lg:text-3xl text-[#f5f3ff] font-bold leading-tight drop-shadow-md -rotate-2 pl-2">
              every day lead
            </span>
            <span className="font-['Caveat',cursive] text-2xl lg:text-3xl text-[#f5f3ff] font-bold leading-tight drop-shadow-md -rotate-1 pl-4">
              to big adventures!
            </span>
          </div>
        </div>
      </div>

      {/* 3 KPI Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card 1: Current Streak */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-[#e8e7f2] flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-[#5046e5] text-white flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined fill text-2xl">local_fire_department</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-black text-slate-900 leading-none">
              {current}
            </span>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-1">
              CURRENT STREAK (DAYS)
            </span>
            <span className="text-xs text-slate-500 font-medium mt-1">
              You're on fire! Keep going!
            </span>
          </div>
        </div>

        {/* Card 2: Longest Streak */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-[#e8e7f2] flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-[#f59e0b] text-white flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined fill text-2xl">military_tech</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-black text-slate-900 leading-none">
              {longest}
            </span>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-1">
              LONGEST STREAK (DAYS)
            </span>
            <span className="text-xs text-slate-500 font-medium mt-1">
              Your best so far!
            </span>
          </div>
        </div>

        {/* Card 3: Active Days */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-[#e8e7f2] flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-[#1e6f50] text-white flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined fill text-2xl">calendar_today</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-black text-slate-900 leading-none">
              {activeDaysCount}/30
            </span>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-1">
              ACTIVE DAYS (30D)
            </span>
            <span className="text-xs text-slate-500 font-medium mt-1">
              Great consistency!
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Last 30 Days & Pro Tip Card */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Card: Last 30 Days */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-[#e8e7f2] flex flex-col gap-3">
            {/* Header with Legend */}
            <div className="flex items-center justify-between pb-2">
              <h2 className="text-xl font-extrabold text-slate-900">Last 30 Days</h2>
              <div className="flex items-center gap-4 font-bold text-[11px] tracking-wider uppercase text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#2d6a4f] inline-block" />
                  COMPLETED
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-3 h-3 rounded-sm bg-[#ede9fe] inline-block" />
                  MISSED
                </span>
              </div>
            </div>

            {/* 30-Day Circular Activity Grid */}
            <StreakGrid30Days days={days30} />
          </div>

          {/* Card: Pro Tip Banner */}
          <div className="bg-[#f0edfd] rounded-3xl p-5 sm:p-6 border border-[#e0dbfa] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#5046e5] text-white flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-xl">lightbulb</span>
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-slate-900 text-sm">Pro Tip</h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5 max-w-md leading-relaxed">
                  Even a small quest counts! Complete at least one quest each day to keep your streak alive.
                </p>
              </div>
            </div>

            {/* Script Text on Right */}
            <div className="select-none pointer-events-none self-end sm:self-center shrink-0">
              <span className="font-['Caveat',cursive] text-lg text-[#5046e5] font-bold leading-tight block text-right -rotate-1">
                Consistency<br />today, a stronger<br />you tomorrow.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Streak Milestones */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-[#e8e7f2] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-xl font-extrabold text-slate-900">Streak Milestones</h2>
            <span className="text-xs font-bold text-[#5046e5]">
              Next: 30-Day
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {/* Milestone 1: 3-Day Spark */}
            <div className="flex items-center gap-4 bg-[#fbfbfe] rounded-2xl p-4 border border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-[#2d6a4f] text-white flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined fill text-xl">local_fire_department</span>
              </div>
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-900 text-sm">3-Day Spark</span>
                  <span className="bg-[#dcfce7] text-[#16a34a] font-bold text-xs px-3 py-0.5 rounded-full">
                    Unlocked
                  </span>
                </div>
                <span className="text-xs text-slate-500 mt-1">
                  Reward: <b className="font-semibold text-slate-700">Bronze Completionist Badge</b>
                </span>
              </div>
            </div>

            {/* Milestone 2: 7-Day Kindling */}
            <div className="flex items-center gap-4 bg-[#fbfbfe] rounded-2xl p-4 border border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-[#2d6a4f] text-white flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-xl">trending_up</span>
              </div>
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-900 text-sm">7-Day Kindling</span>
                  <span className="bg-[#dcfce7] text-[#16a34a] font-bold text-xs px-3 py-0.5 rounded-full">
                    Unlocked
                  </span>
                </div>
                <span className="text-xs text-slate-500 mt-1">
                  Reward: <b className="font-semibold text-slate-700">Ember Streak Badge</b>
                </span>
              </div>
            </div>

            {/* Milestone 3: 14-Day Steady Flame */}
            <div className="flex items-center gap-4 bg-[#fbfbfe] rounded-2xl p-4 border border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-[#2d6a4f] text-white flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined fill text-xl">local_fire_department</span>
              </div>
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-900 text-sm">14-Day Steady Flame</span>
                  <span className="bg-[#dcfce7] text-[#16a34a] font-bold text-xs px-3 py-0.5 rounded-full">
                    Unlocked
                  </span>
                </div>
                <span className="text-xs text-slate-500 mt-1">
                  Reward: <b className="font-semibold text-slate-700">Streak Sentinel Badge</b>
                </span>
              </div>
            </div>

            {/* Milestone 4: 30-Day Bonfire (Locked with Progress Bar) */}
            <div className="flex items-start gap-4 bg-[#fbfbfe] rounded-2xl p-4 border border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-[#f1f0fb] text-slate-400 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">lock</span>
              </div>
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-900 text-sm">30-Day Bonfire</span>
                  <span className="bg-[#f1f0fb] text-slate-500 font-bold text-xs px-3 py-0.5 rounded-full">
                    Locked
                  </span>
                </div>

                {/* Progress bar (18 / 30 = 60%) */}
                <div className="w-full h-1.5 bg-[#ede9fe] rounded-full overflow-hidden mt-2.5 mb-1">
                  <div
                    className="h-full bg-[#5046e5] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.round((current / 30) * 100))}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-slate-500">
                    Reward: <b className="font-semibold text-slate-700">Streak Vanguard Medal</b>
                  </span>
                  <span className="font-bold text-slate-700">
                    {current} / 30
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
