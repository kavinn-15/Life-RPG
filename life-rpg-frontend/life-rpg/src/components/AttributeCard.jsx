export default function AttributeCard({ attribute = {} }) {
  const icon = attribute.icon || 'star';
  const label = attribute.label || 'Attribute';
  const level = Number(attribute.level) || 1;
  const xp = Number(attribute.xp) || 0;
  const weeklyXp = Number(attribute.weeklyXp) || 0;
  const pct = Math.min(100, Math.max(0, Number(attribute.pct) || 0));
  const nextThreshold = attribute.nextThreshold ?? (level + 1);

  return (
    <div className="bg-surface rounded-2xl p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-primary text-xl shrink-0">{icon}</span>
          <div className="flex flex-col min-w-0">
            <span className="font-label-lg text-label-lg text-on-surface truncate">{label}</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              LVL {level} • {xp.toLocaleString()} XP
            </span>
          </div>
        </div>
        <span
          className={`font-label-caps text-label-caps font-extrabold shrink-0 ${
            attribute.needQuest ? 'text-secondary' : attribute.stable ? 'text-outline' : 'text-tertiary'
          }`}
        >
          {attribute.needQuest ? 'Need Quest' : attribute.stable ? 'Stable' : `+${weeklyXp} this week`}
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

