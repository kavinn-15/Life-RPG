import { leaderboard } from '../data/questData';

export function SpotlightPanel() {
  return (
    <div className="bg-on-tertiary-container text-on-surface rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
      <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-tertiary-fixed-dim/40 rounded-full blur-2xl pointer-events-none" />
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined fill text-tertiary text-xl">workspace_premium</span>
          <span className="font-label-caps text-label-caps text-tertiary uppercase font-bold tracking-wider">
            Apex Domain Spotlight
          </span>
        </div>
        <h3 className="font-headline-sm text-headline-sm text-on-surface">Master Coding</h3>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Unlock the Tier III Vanguard Title. Over 3.2k players engaged in this cycle's architectural sprint.
        </p>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <div className="flex -space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold ring-2 ring-surface">
            JD
          </div>
          <div className="w-8 h-8 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center text-xs font-bold ring-2 ring-surface">
            SK
          </div>
          <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-xs font-bold ring-2 ring-surface">
            +3k
          </div>
        </div>
        <button className="px-5 py-2.5 rounded-full bg-tertiary-container text-on-tertiary font-label-md text-label-md shadow-sm hover:translate-y-0.5 active:translate-y-1 transition-all">
          Explore Domain
        </button>
      </div>
    </div>
  );
}

export function LeaderboardPanel({ playerLevel, playerXp }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined fill text-secondary-container text-xl">leaderboard</span>
          <h3 className="font-headline-sm text-headline-sm text-on-surface">Global Vanguard</h3>
        </div>
        <span className="font-label-caps text-label-caps text-outline">Cycle 4</span>
      </div>
      <div className="flex flex-col divide-y divide-surface-container/60">
        {leaderboard.map((p) => (
          <div key={p.rank} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center font-label-caps text-label-caps font-extrabold ${p.rankClass}`}
              >
                {p.rank}
              </div>
              <div
                className={`w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-sm ${p.avatarClass}`}
              >
                {p.initials}
              </div>
              <div className="flex flex-col">
                <span className="font-label-lg text-label-lg text-on-surface">{p.name}</span>
                <span className="font-label-caps text-label-caps text-outline">{p.meta}</span>
              </div>
            </div>
            <span className="font-label-md text-label-md font-bold text-primary">
              {p.xp.toLocaleString()} XP
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between py-3 bg-primary-fixed/50 -mx-6 px-6 rounded-xl mt-1">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-caps text-label-caps font-extrabold">
              10
            </div>
            <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-sm">
              AV
            </div>
            <div className="flex flex-col">
              <span className="font-label-lg text-label-lg text-on-surface font-extrabold">{state.playerName || 'Hero'} (You)</span>
              <span className="font-label-caps text-label-caps text-primary font-bold">
                LVL {playerLevel} • The Builder
              </span>
            </div>
          </div>
          <span className="font-label-md text-label-md font-extrabold text-primary">
            {playerXp.toLocaleString()} XP
          </span>
        </div>
      </div>
    </div>
  );
}
