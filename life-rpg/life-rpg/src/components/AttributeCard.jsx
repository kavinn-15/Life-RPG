export default function AttributeCard({ attribute }) {
  const level = attribute.level ?? 1;
  const xp = attribute.xp ?? attribute.currentXp ?? 0;
  const nextThreshold = attribute.nextThreshold ?? (level + 1);
  const pct = Math.min(100, Math.max(0, attribute.pct ?? attribute.percentage ?? 0));
  const weeklyXp = attribute.weeklyXp ?? 0;
  const label = attribute.label || attribute.displayName || attribute.key || 'Attribute';
  const icon = attribute.icon || 'tune';

  return (
    <div className="bg-surface rounded-2xl p-4 flex flex-col gap-2 transition-all hover:border-primary/20 border border-transparent">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-primary text-xl shrink-0">{icon}</span>
          <div className="flex flex-col min-w-0">
            <span className="font-label-lg text-label-lg text-on-surface truncate font-bold">{label}</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              LVL {level} • {Number(xp).toLocaleString()} XP
            </span>
          </div>
        </div>
        <span
          className={`font-label-caps text-label-caps font-extrabold shrink-0 ${
            attribute.needQuest ? 'text-secondary' : attribute.stable ? 'text-outline' : 'text-tertiary'
          }`}
        >
          {attribute.needQuest ? 'Need Quest' : attribute.stable ? 'Stable' : `+${weeklyXp} XP 7D`}
        </span>
      </div>
      <div className="flex items-center justify-between text-label-caps font-label-caps text-outline">
        <span>Next Threshold: LVL {nextThreshold}</span>
        <span className="font-bold text-on-surface">{pct}%</span>
      </div>
      <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-container rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
