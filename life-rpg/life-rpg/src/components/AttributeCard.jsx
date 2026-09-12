const THEME_MAP = {
  coding: {
    iconBg: 'from-blue-600 to-indigo-600 text-white shadow-blue-500/25',
    accentText: 'text-blue-500 dark:text-blue-400',
    barGradient: 'from-blue-500 via-indigo-500 to-cyan-400',
    badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/20',
    glow: 'group-hover:border-blue-500/40 group-hover:shadow-[0_4px_20px_rgba(59,130,246,0.12)]',
  },
  strength: {
    iconBg: 'from-amber-500 to-rose-600 text-white shadow-amber-500/25',
    accentText: 'text-amber-500 dark:text-amber-400',
    barGradient: 'from-amber-500 via-orange-500 to-rose-500',
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20',
    glow: 'group-hover:border-amber-500/40 group-hover:shadow-[0_4px_20px_rgba(245,158,11,0.12)]',
  },
  intelligence: {
    iconBg: 'from-purple-600 to-indigo-700 text-white shadow-purple-500/25',
    accentText: 'text-purple-500 dark:text-purple-400',
    barGradient: 'from-purple-500 via-violet-500 to-indigo-400',
    badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/20',
    glow: 'group-hover:border-purple-500/40 group-hover:shadow-[0_4px_20px_rgba(168,85,247,0.12)]',
  },
  discipline: {
    iconBg: 'from-indigo-600 to-blue-700 text-white shadow-indigo-500/25',
    accentText: 'text-indigo-500 dark:text-indigo-400',
    barGradient: 'from-indigo-500 via-blue-600 to-cyan-400',
    badge: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-indigo-500/20',
    glow: 'group-hover:border-indigo-500/40 group-hover:shadow-[0_4px_20px_rgba(99,102,241,0.12)]',
  },
  knowledge: {
    iconBg: 'from-sky-500 to-cyan-700 text-white shadow-sky-500/25',
    accentText: 'text-sky-500 dark:text-sky-400',
    barGradient: 'from-sky-500 via-teal-500 to-emerald-400',
    badge: 'bg-sky-500/10 text-sky-600 dark:text-sky-300 border-sky-500/20',
    glow: 'group-hover:border-sky-500/40 group-hover:shadow-[0_4px_20px_rgba(14,165,233,0.12)]',
  },
  focus: {
    iconBg: 'from-fuchsia-600 to-pink-600 text-white shadow-fuchsia-500/25',
    accentText: 'text-fuchsia-500 dark:text-fuchsia-400',
    barGradient: 'from-fuchsia-500 via-pink-500 to-rose-400',
    badge: 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-300 border-fuchsia-500/20',
    glow: 'group-hover:border-fuchsia-500/40 group-hover:shadow-[0_4px_20px_rgba(217,70,239,0.12)]',
  },
  vitality: {
    iconBg: 'from-rose-500 to-pink-600 text-white shadow-rose-500/25',
    accentText: 'text-rose-500 dark:text-rose-400',
    barGradient: 'from-rose-500 via-pink-500 to-red-400',
    badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/20',
    glow: 'group-hover:border-rose-500/40 group-hover:shadow-[0_4px_20px_rgba(244,63,94,0.12)]',
  },
  creativity: {
    iconBg: 'from-violet-500 to-amber-500 text-white shadow-violet-500/25',
    accentText: 'text-violet-500 dark:text-violet-400',
    barGradient: 'from-violet-500 via-pink-500 to-amber-400',
    badge: 'bg-violet-500/10 text-violet-600 dark:text-violet-300 border-violet-500/20',
    glow: 'group-hover:border-violet-500/40 group-hover:shadow-[0_4px_20px_rgba(168,85,247,0.12)]',
  },
  social: {
    iconBg: 'from-emerald-500 to-teal-600 text-white shadow-emerald-500/25',
    accentText: 'text-emerald-500 dark:text-emerald-400',
    barGradient: 'from-emerald-500 via-teal-500 to-cyan-400',
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20',
    glow: 'group-hover:border-emerald-500/40 group-hover:shadow-[0_4px_20px_rgba(16,185,129,0.12)]',
  },
  travel: {
    iconBg: 'from-cyan-500 to-blue-600 text-white shadow-cyan-500/25',
    accentText: 'text-cyan-500 dark:text-cyan-400',
    barGradient: 'from-cyan-500 via-blue-500 to-indigo-400',
    badge: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-cyan-500/20',
    glow: 'group-hover:border-cyan-500/40 group-hover:shadow-[0_4px_20px_rgba(6,182,212,0.12)]',
  },
};

const DEFAULT_THEME = {
  iconBg: 'from-primary to-primary-container text-on-primary shadow-primary/25',
  accentText: 'text-primary',
  barGradient: 'from-primary to-primary-container',
  badge: 'bg-primary/10 text-primary border-primary/20',
  glow: 'group-hover:border-primary/40 group-hover:shadow-[0_4px_20px_rgba(99,102,241,0.12)]',
};

export default function AttributeCard({ attribute }) {
  const level = attribute.level ?? 1;
  const xp = attribute.xp ?? attribute.currentXp ?? 0;
  const nextThreshold = attribute.nextThreshold ?? (level + 1);
  const pct = Math.min(100, Math.max(0, attribute.pct ?? attribute.percentage ?? 0));
  const weeklyXp = attribute.weeklyXp ?? 0;
  const label = attribute.label || attribute.displayName || attribute.key || 'Attribute';
  const icon = attribute.icon || 'tune';
  const key = (attribute.key || '').toLowerCase();
  const theme = THEME_MAP[key] || DEFAULT_THEME;

  return (
    <div
      className={`group relative bg-surface-container-lowest/90 dark:bg-surface-container-low rounded-2xl p-4 sm:p-5 flex flex-col gap-3.5 border border-surface-container-high/70 dark:border-white/10 shadow-xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 overflow-hidden ${theme.glow}`}
    >
      {/* Top Row: Icon + Name/Level + Growth Badge */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Glowing Icon Squircle */}
          <div
            className={`w-11 h-11 rounded-xl bg-gradient-to-br ${theme.iconBg} shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200`}
          >
            <span className="material-symbols-outlined text-xl">{icon}</span>
          </div>

          <div className="flex flex-col min-w-0">
            <span className="font-headline-sm text-base font-bold text-on-surface truncate tracking-tight group-hover:text-primary transition-colors">
              {label}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface font-label-caps text-[11px] font-extrabold tracking-wide">
                LVL {level}
              </span>
              <span className="font-body-sm text-xs text-on-surface-variant font-medium">
                {Number(xp).toLocaleString()} XP
              </span>
            </div>
          </div>
        </div>

        {/* Status / Weekly Trend Badge */}
        <div className="shrink-0">
          {attribute.needQuest ? (
            <span className="px-2.5 py-1 rounded-full bg-secondary-container/20 text-secondary border border-secondary/20 font-label-caps text-[11px] font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">flag</span>
              Need Quest
            </span>
          ) : attribute.stable ? (
            <span className="px-2.5 py-1 rounded-full bg-surface-container text-outline border border-surface-container-high font-label-caps text-[11px] font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">check</span>
              Stable
            </span>
          ) : (
            <span
              className={`px-2.5 py-1 rounded-full border font-label-caps text-[11px] font-extrabold flex items-center gap-1 shadow-2xs ${theme.badge}`}
            >
              <span className="material-symbols-outlined text-xs">trending_up</span>
              +{weeklyXp} XP 7D
            </span>
          )}
        </div>
      </div>

      {/* Threshold & Progress Meter */}
      <div className="flex flex-col gap-1.5 pt-1 border-t border-surface-container/60 dark:border-white/5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-label-caps text-outline font-semibold">
            Next Threshold: <b className="text-on-surface">LVL {nextThreshold}</b>
          </span>
          <span className="font-bold text-on-surface">
            {pct}%
          </span>
        </div>

        {/* Progress Track & Gradient Fill */}
        <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${theme.barGradient} transition-all duration-500 shadow-xs`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
