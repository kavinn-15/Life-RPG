import { useGame } from '../state/GameContext';

export default function XPContinuumPanel() {
  const { state, xpNeeded = 100, xpPct = 0, xpForLevel = (l) => 100 * l * l } = useGame();

  const currentLevel = state?.level ?? 1;
  const currentXp = state?.xp ?? 0;
  const needed = Number(xpNeeded) || 100;
  const pct = typeof xpPct === 'number' && !isNaN(xpPct) ? Math.min(100, Math.max(0, xpPct)) : 0;
  const remaining = Math.max(0, needed - currentXp);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-stretch">
      <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl shadow-sm p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 font-headline-sm text-headline-sm text-on-surface">
            <span className="material-symbols-outlined fill text-secondary-container text-xl">bolt</span>
            Experience Continuum
          </span>
          <span className="font-label-lg text-label-lg text-on-surface-variant">
            {currentXp.toLocaleString()} / {needed.toLocaleString()} XP
          </span>
        </div>
        <div className="w-full h-4 bg-surface-container rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-label-md text-label-md text-on-surface-variant">
            <span className="material-symbols-outlined text-base">arrow_upward</span>
            {remaining.toLocaleString()} XP until Level {currentLevel + 1} Ascension
          </span>
          <span className="font-label-md text-label-md text-tertiary font-bold">{pct.toFixed(1)}% Completed</span>
        </div>
      </div>

      <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl shadow-sm p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="font-headline-sm text-headline-sm text-on-surface">Formula Model</span>
          <span className="font-label-caps text-label-caps text-outline uppercase">Quadratic Curve</span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Req XP = 100 × Lvl<sup>2</sup>
        </p>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-surface rounded-xl p-3 flex flex-col items-center">
            <span className="font-label-caps text-label-caps text-outline">L{Math.max(1, currentLevel - 1)}</span>
            <span className="font-stat-counter text-base text-on-surface mt-0.5">
              {(xpForLevel(Math.max(1, currentLevel - 1)) || 0).toLocaleString()}
            </span>
            <span className="font-label-caps text-label-caps text-tertiary">Achieved ✓</span>
          </div>
          <div className="bg-primary-fixed rounded-xl p-3 flex flex-col items-center ring-2 ring-primary/30">
            <span className="font-label-caps text-label-caps text-primary font-bold">L{currentLevel} (Now)</span>
            <span className="font-stat-counter text-base text-on-surface mt-0.5">{needed.toLocaleString()}</span>
            <span className="font-label-caps text-label-caps text-on-surface-variant">
              {pct.toFixed(0)}% of {(needed / 1000).toFixed(1)}k
            </span>
          </div>
          <div className="bg-surface rounded-xl p-3 flex flex-col items-center">
            <span className="font-label-caps text-label-caps text-outline">L{currentLevel + 1}</span>
            <span className="font-stat-counter text-base text-on-surface mt-0.5">
              {(xpForLevel(currentLevel + 1) || 0).toLocaleString()}
            </span>
            <span className="font-label-caps text-label-caps text-outline">Gate Next</span>
          </div>
        </div>
      </div>
    </div>
  );
}

