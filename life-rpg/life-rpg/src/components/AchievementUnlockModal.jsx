import { getCategoryMeta } from '../data/achievementData';

// Badge-reveal modal — visually paired with LevelUpModal (same overlay +
// scale-in shell) but themed around a single medal popping into view, with a
// shimmer sweep and a pulsing ring behind the badge.
export default function AchievementUnlockModal({ achievement, onClose }) {
  const open = Boolean(achievement);
  const meta = achievement ? getCategoryMeta(achievement.category) : getCategoryMeta('Quest');
  const xpReward = Number(achievement?.reward?.xp ?? achievement?.xp ?? 0);
  const goldReward = Number(achievement?.reward?.gold ?? achievement?.gold ?? 0);

  return (
    <div
      className={[
        'fixed inset-0 z-[65] flex items-center justify-center bg-ink/60 backdrop-blur-sm transition-opacity duration-300',
        open ? 'opacity-100' : 'opacity-0 pointer-events-none',
      ].join(' ')}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={[
          'bg-surface-container-lowest rounded-2xl p-8 max-w-sm w-full mx-4 shadow-xl text-center flex flex-col items-center relative overflow-hidden transition-transform duration-300',
          open ? 'scale-100' : 'scale-95',
        ].join(' ')}
      >
        <div className="w-48 h-48 rounded-full bg-primary/10 absolute -top-16 -left-16 pointer-events-none" />
        <div className="w-48 h-48 rounded-full bg-tertiary-fixed-dim/20 absolute -bottom-16 -right-16 pointer-events-none" />

        <span className="font-label-caps text-label-caps text-primary tracking-widest uppercase mb-1">
          Achievement Unlocked
        </span>
        <h3 className="font-headline-lg text-headline-lg text-on-surface">Medal Earned!</h3>

        {achievement && (
          <>
            <div className="relative my-6" key={achievement.id}>
              <div className="absolute inset-0 rounded-full animate-badge-ring" />
              <div
                className={`relative w-24 h-24 rounded-2xl flex items-center justify-center shadow-md animate-badge-reveal overflow-hidden ${meta.accentClass}`}
              >
                <span className="material-symbols-outlined fill text-5xl">{achievement.icon || 'emoji_events'}</span>
                <span className="absolute inset-y-0 -left-1/2 w-1/3 bg-white/40 blur-md animate-badge-shimmer" />
              </div>
            </div>

            <p className="font-headline-sm text-headline-sm text-on-surface">{achievement.title}</p>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1 px-2">
              {achievement.description}
            </p>

            <div className="grid grid-cols-2 gap-3 w-full my-6">
              <div className="bg-surface-container rounded-xl p-3 flex flex-col items-center">
                <span className="font-label-caps text-label-caps text-outline">XP REWARD</span>
                <span className="font-stat-counter text-stat-counter text-primary mt-0.5">
                  +{xpReward}
                </span>
              </div>
              <div className="bg-surface-container rounded-xl p-3 flex flex-col items-center">
                <span className="font-label-caps text-label-caps text-outline">GOLD REWARD</span>
                <span className="font-stat-counter text-stat-counter text-secondary mt-0.5">
                  +{goldReward}
                </span>
              </div>
            </div>
          </>
        )}

        <button
          className="w-full py-3.5 px-6 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg shadow-md hover:translate-y-0.5 active:translate-y-1 transition-all"
          onClick={onClose}
        >
          Claim &amp; Close
        </button>
      </div>
    </div>
  );
}
