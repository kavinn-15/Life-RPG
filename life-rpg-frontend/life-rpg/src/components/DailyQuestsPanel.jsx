import { useEffect, useState } from 'react';
import { initialDailyQuests } from '../data/questData';
import { useGame } from '../state/GameContext';
import * as questService from '../services/questService';

export default function DailyQuestsPanel() {
  const [quests, setQuests] = useState(initialDailyQuests);
  const { state, grantRewards, pushToast } = useGame();

  useEffect(() => {
    let cancelled = false;
    questService
      .getDailyQuests()
      .then((data) => {
        if (cancelled || !data || data.length === 0) return;
        setQuests(
          data.map((q) => ({
            id: q.id,
            label: q.title,
            domain: q.domainName || 'Daily Discipline',
            xp: q.xpReward || 50,
            done: q.status === 'COMPLETED',
          }))
        );
      })
      .catch((err) => {
        console.warn('Could not fetch live daily quests, using cached roster:', err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = (id) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;
        const done = !q.done;
        if (done) grantRewards({ xp: q.xp });
        return { ...q, done };
      })
    );
    questService.toggleDailyQuest(id).catch((err) => {
      console.warn('Daily quest sync error:', err);
    });
  };

  const handleCheckIn = () => {
    pushToast(`Daily check-in logged · Streak ${(state?.streak ?? 18) + 1} days`, 'event_available');
  };

  return (
    <div className="bg-ink text-white rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col">
      <div className="absolute -right-6 -top-6 w-32 h-32 bg-primary/20 rounded-full blur-xl pointer-events-none" />
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <span className="font-label-caps text-label-caps text-tertiary-fixed tracking-widest uppercase">
            Daily Quests
          </span>
          <span className="font-headline-sm text-headline-sm font-bold text-white mt-0.5">
            Consecutive Streaks
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-ink-border px-3.5 py-1.5 rounded-full">
          <span className="material-symbols-outlined fill text-secondary-container text-xl">
            local_fire_department
          </span>
          <span className="font-stat-counter text-xl font-black text-white">{state?.streak ?? 18}</span>
          <span className="font-label-caps text-label-caps text-ink-muted uppercase">Days</span>
        </div>
      </div>
      <div className="flex flex-col gap-2.5 my-3">
        {quests.map((q) => (
          <label
            key={q.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-ink-rail hover:bg-ink-hover cursor-pointer transition-colors group"
          >
            <input
              checked={q.done}
              onChange={() => toggle(q.id)}
              className="w-5 h-5 rounded-lg focus:ring-0 cursor-pointer accent-primary-container"
              type="checkbox"
            />
            <div className="flex flex-col">
              <span className={`font-label-md text-label-md text-white ${q.done ? 'line-through opacity-70' : ''}`}>
                {q.label}
              </span>
              <span
                className={`font-label-caps text-label-caps font-bold ${
                  q.done ? 'text-tertiary-fixed' : 'text-secondary-container'
                }`}
              >
                +{q.xp} XP • {q.done ? 'Complete' : 'Pending'}
              </span>
            </div>
          </label>
        ))}
      </div>
      <button
        className="mt-4 w-full py-3 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg shadow-md hover:bg-primary transition-all flex items-center justify-center gap-2"
        onClick={handleCheckIn}
      >
        <span className="material-symbols-outlined text-lg">event_available</span>
        <span>Check In Today</span>
      </button>
    </div>
  );
}
