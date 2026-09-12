import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../state/GameContext';

export default function ActiveQuestCard({ quest }) {
  const { grantRewards, pushToast } = useGame();
  const [milestones, setMilestones] = useState(quest.milestones ?? []);
  const [completed, setCompleted] = useState(false);
  const [showRewardPop, setShowRewardPop] = useState(false);

  const doneCount = milestones.filter((m) => m.done).length;
  const pct = milestones.length ? Math.round((doneCount / milestones.length) * 100) : quest.sprintPct ?? 0;

  const toggleMilestone = (id) => {
    setMilestones((prev) => prev.map((m) => (m.id === id ? { ...m, done: !m.done } : m)));
  };

  const handleComplete = () => {
    if (completed) return;
    setCompleted(true);
    setShowRewardPop(true);
    grantRewards({
      xp: quest.xp,
      gold: quest.gold,
      statKey: quest.statKey,
      statAmount: 3,
      questTitle: quest.title,
    });
    pushToast(`${quest.title} complete · +${quest.xp} XP`);
    setTimeout(() => setShowRewardPop(false), 2400);
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4 relative overflow-hidden"
    >
      {/* Floating XP / Gold popup on completion */}
      <AnimatePresence>
        {showRewardPop && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.8 }}
            animate={{ opacity: 1, y: -20, scale: 1.1 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 pointer-events-none z-30 flex items-center gap-2 bg-ink/95 border border-primary/50 text-white px-4 py-2 rounded-full shadow-2xl backdrop-blur-md"
          >
            <span className="font-stat-counter font-black text-primary-fixed">+{quest.xp} XP</span>
            <span className="text-outline">•</span>
            <span className="font-stat-counter font-black text-secondary-container">+{quest.gold} G</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">
              {quest.domain}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full font-label-caps text-label-caps uppercase ${quest.difficultyClass}`}>
              {quest.difficulty}
            </span>
            {quest.timeRemaining && (
              <span className="flex items-center gap-1 font-label-caps text-label-caps text-outline">
                <span className="material-symbols-outlined text-xs">schedule</span>
                {quest.timeRemaining}
              </span>
            )}
          </div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined fill text-primary text-xl">{quest.icon}</span>
            <Link to={`/quests/${quest.id}`} className="hover:underline underline-offset-2">
              {quest.title}
            </Link>
          </h3>
        </div>
        <Link
          to={`/quests/${quest.id}/edit`}
          title="Edit quest"
          className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors shrink-0"
        >
          <span className="material-symbols-outlined">edit</span>
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="font-label-caps text-label-caps text-primary bg-primary-fixed px-2 py-0.5 rounded-full font-extrabold">
          +{quest.xp} XP
        </span>
        <span className="font-label-caps text-label-caps text-secondary-container bg-[#FFF8E6] px-2 py-0.5 rounded-full font-extrabold">
          +{quest.gold} Gold
        </span>
        <span className="font-label-caps text-label-caps text-tertiary bg-tertiary-fixed px-2 py-0.5 rounded-full font-extrabold">
          {quest.statLabel}
        </span>
      </div>

      {milestones.length > 0 && (
        <>
          {quest.milestoneLabel && (
            <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">
              {quest.milestoneLabel}
            </span>
          )}
          <div className="flex flex-col gap-2">
            {milestones.map((m) => (
              <label
                key={m.id}
                className="flex items-center gap-3 cursor-pointer group select-none"
                onClick={() => toggleMilestone(m.id)}
              >
                <input
                  readOnly
                  checked={m.done}
                  type="checkbox"
                  className="w-5 h-5 rounded-lg accent-tertiary-container cursor-pointer transition-transform group-hover:scale-110"
                />
                <span
                  className={`font-body-sm text-body-sm transition-all ${
                    m.done ? 'text-on-surface-variant line-through opacity-70' : 'text-on-surface'
                  }`}
                >
                  {m.label}
                </span>
              </label>
            ))}
          </div>
        </>
      )}

      <div className="flex items-center justify-between gap-4 pt-2">
        {milestones.length > 0 ? (
          <div className="flex-1 flex items-center gap-3">
            <span className="font-label-md text-label-md text-on-surface-variant whitespace-nowrap hidden sm:inline">
              Sprint Completion
            </span>
            <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
              <div
                className="h-full bg-tertiary-container rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="font-label-md text-label-md text-on-surface font-bold whitespace-nowrap">
              {pct}% ({doneCount}/{milestones.length})
            </span>
          </div>
        ) : (
          <div className="flex-1" />
        )}
        <button
          className={[
            'px-5 py-2.5 rounded-full font-label-md text-label-md shadow-sm transition-all flex items-center gap-1.5 shrink-0 select-none active:scale-95',
            completed
              ? 'bg-tertiary-container text-on-tertiary shadow-none'
              : 'bg-primary-container text-on-primary hover:translate-y-0.5 hover:shadow-md',
          ].join(' ')}
          onClick={handleComplete}
          disabled={completed}
        >
          <span className="material-symbols-outlined text-base">
            {completed ? 'done_all' : 'check_circle'}
          </span>
          <span>{completed ? 'Done!' : milestones.length > 0 ? 'Complete Milestone' : 'Mark Done'}</span>
        </button>
      </div>
    </motion.div>
  );
}
