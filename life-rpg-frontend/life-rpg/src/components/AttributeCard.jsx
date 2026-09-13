export default function AttributeCard({ attribute }) {
  return (
    <div className="bg-surface rounded-2xl p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-primary text-xl shrink-0">{attribute.icon}</span>
          <div className="flex flex-col min-w-0">
            <span className="font-label-lg text-label-lg text-on-surface truncate">{attribute.label}</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              LVL {attribute.level} • {attribute.xp.toLocaleString()} XP
            </span>
          </div>
        </div>
        <span
          className={`font-label-caps text-label-caps font-extrabold shrink-0 ${
            attribute.needQuest ? 'text-secondary' : attribute.stable ? 'text-outline' : 'text-tertiary'
          }`}
        >
          {attribute.needQuest ? 'Need Quest' : attribute.stable ? 'Stable' : `+${attribute.weeklyXp} this week`}
        </span>
      </div>
      <div className="flex items-center justify-between text-label-caps font-label-caps text-outline">
        <span>Next Threshold: LVL {attribute.nextThreshold}</span>
        <span className="font-bold text-on-surface">{attribute.pct}%</span>
      </div>
      <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-container rounded-full transition-all duration-500"
          style={{ width: `${attribute.pct}%` }}
        />
      </div>
    </div>
  );
}
