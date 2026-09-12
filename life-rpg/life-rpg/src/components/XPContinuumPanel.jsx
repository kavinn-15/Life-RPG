import { useGame } from '../state/GameContext';

export default function XPContinuumPanel() {
  const { state, xpNeeded, xpPct, xpForLevel } = useGame();

  const prevLevel = Math.max(1, state.level - 1);
  const nextLevel = state.level + 1;
  const prevLevelXp = xpForLevel(prevLevel);
  const nextLevelXp = xpForLevel(nextLevel);
  const remainingXp = Math.max(0, xpNeeded - state.xp);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-stretch">
      {/* Experience Continuum Panel */}
      <div className="lg:col-span-7 bg-surface-container-lowest dark:bg-surface-container-low rounded-2xl shadow-xs border border-surface-container-high/80 dark:border-white/10 p-6 flex flex-col justify-between gap-5 relative overflow-hidden group">
        {/* Subtle Ambient Background Glow */}
        <div className="absolute -right-12 -top-12 w-36 h-36 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/15 transition-all duration-500" />

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm shadow-amber-500/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">bolt</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-base font-bold text-on-surface">Experience Continuum</h3>
                <span className="font-body-xs text-xs text-on-surface-variant font-medium">Real-time Level Progression</span>
              </div>
            </div>

            <div className="flex items-baseline gap-1 bg-surface-container dark:bg-surface-container-high px-3 py-1.5 rounded-xl border border-surface-container-highest/60">
              <span className="font-stat-counter text-base font-black text-on-surface">
                {state.xp.toLocaleString()}
              </span>
              <span className="text-xs text-on-surface-variant font-semibold">
                / {xpNeeded.toLocaleString()} XP
              </span>
            </div>
          </div>

          {/* Progress Bar with Glowing Cap */}
          <div className="flex flex-col gap-2">
            <div className="w-full h-3 bg-surface-container dark:bg-surface-container-high rounded-full overflow-hidden p-0.5 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-primary via-indigo-500 to-cyan-400 rounded-full transition-all duration-700 shadow-sm relative"
                style={{ width: `${Math.max(3, xpPct)}%` }}
              >
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/60 rounded-full shadow-[0_0_8px_white]" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5 text-on-surface-variant font-semibold">
                <span className="material-symbols-outlined text-primary text-sm">arrow_upward</span>
                {remainingXp.toLocaleString()} XP to Level {nextLevel} Ascension
              </span>
              <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                {xpPct.toFixed(1)}% Completed
              </span>
            </div>
          </div>
        </div>

        {/* Mini stats footer */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3 border-t border-surface-container/70 dark:border-white/5">
          <div className="flex flex-col">
            <span className="text-[11px] font-label-caps text-outline uppercase">Level Tier</span>
            <span className="text-xs font-bold text-on-surface">Mastery Node {state.level}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-label-caps text-outline uppercase">Active Streak</span>
            <span className="text-xs font-bold text-tertiary">🔥 {state.streak || 0} Days</span>
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-[11px] font-label-caps text-outline uppercase">Efficiency</span>
            <span className="text-xs font-bold text-primary">Optimal 1.0x</span>
          </div>
        </div>
      </div>

      {/* Formula Model Panel */}
      <div className="lg:col-span-5 bg-surface-container-lowest dark:bg-surface-container-low rounded-2xl shadow-xs border border-surface-container-high/80 dark:border-white/10 p-6 flex flex-col justify-between gap-5">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">functions</span>
              <h3 className="font-headline-sm text-base font-bold text-on-surface">Formula Model</h3>
            </div>
            <span className="font-mono text-xs font-bold text-primary bg-primary/10 dark:bg-primary/20 border border-primary/25 px-2.5 py-1 rounded-lg">
              Req XP = 100 × Lvl²
            </span>
          </div>
          <p className="font-body-xs text-xs text-on-surface-variant">
            XP threshold scales quadratically to reward consistency and compound skill progression.
          </p>
        </div>

        {/* 3 Tier Node Cards */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Node 1: Completed Level */}
          <div className="bg-surface dark:bg-surface-container-lowest rounded-xl p-3 flex flex-col items-center justify-between text-center border border-surface-container-high/80 dark:border-white/10 hover:border-emerald-500/30 transition-all">
            <span className="px-2 py-0.5 rounded-md bg-surface-container text-outline font-label-caps text-[10px] font-extrabold uppercase">
              L{prevLevel}
            </span>
            <div className="my-1.5 flex flex-col items-center">
              <span className="font-stat-counter text-sm sm:text-base font-extrabold text-on-surface">
                {prevLevelXp.toLocaleString()}
              </span>
              <span className="text-[10px] text-outline font-medium">XP Req</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-label-caps text-[10px] font-bold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[12px]">check</span>
              Achieved
            </span>
          </div>

          {/* Node 2: Current Active Level (Hero) */}
          <div className="relative bg-gradient-to-b from-primary/10 via-surface to-surface dark:from-primary/20 dark:via-surface-container-lowest dark:to-surface-container-lowest rounded-xl p-3 flex flex-col items-center justify-between text-center border-2 border-primary shadow-sm shadow-primary/15 transition-all">
            <div className="absolute -top-2 px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-caps text-[9px] font-black tracking-wider uppercase shadow-xs">
              Current
            </div>
            <span className="px-2 py-0.5 rounded-md bg-primary/15 text-primary font-label-caps text-[10px] font-black uppercase mt-1">
              L{state.level}
            </span>
            <div className="my-1 flex flex-col items-center">
              <span className="font-stat-counter text-sm sm:text-base font-black text-on-surface">
                {xpNeeded.toLocaleString()}
              </span>
              <span className="text-[10px] text-primary font-bold">
                {xpPct.toFixed(0)}% of {(xpNeeded / 1000).toFixed(1)}k
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-caps text-[10px] font-black flex items-center gap-0.5">
              Active
            </span>
          </div>

          {/* Node 3: Next Level Gate */}
          <div className="bg-surface dark:bg-surface-container-lowest rounded-xl p-3 flex flex-col items-center justify-between text-center border border-surface-container-high/80 dark:border-white/10 hover:border-primary/30 transition-all opacity-85">
            <span className="px-2 py-0.5 rounded-md bg-surface-container text-outline font-label-caps text-[10px] font-extrabold uppercase">
              L{nextLevel}
            </span>
            <div className="my-1.5 flex flex-col items-center">
              <span className="font-stat-counter text-sm sm:text-base font-extrabold text-on-surface">
                {nextLevelXp.toLocaleString()}
              </span>
              <span className="text-[10px] text-outline font-medium">XP Req</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-surface-container text-outline border border-surface-container-high font-label-caps text-[10px] font-bold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[12px]">lock</span>
              Gate Next
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
