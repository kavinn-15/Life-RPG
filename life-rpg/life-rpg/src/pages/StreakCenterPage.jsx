import { useEffect, useState } from 'react';
import * as progressService from '../services/progressService';
import { Chip } from '../components/Chip';

function LoadingState() {
  return (
    <div className="flex flex-col gap-gutter">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter">
        <div className="h-28 rounded-2xl bg-surface-container animate-pulse" />
        <div className="h-28 rounded-2xl bg-surface-container animate-pulse" />
      </div>
      <div className="h-64 rounded-2xl bg-surface-container animate-pulse" />
      <div className="h-64 rounded-2xl bg-surface-container animate-pulse" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-12 shadow-sm flex flex-col items-center text-center gap-2">
      <span className="material-symbols-outlined text-4xl text-outline">local_fire_department</span>
      <h3 className="font-headline-sm text-headline-sm text-on-surface">No streak history yet</h3>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
        Complete a quest today to light the first flame on your calendar.
      </p>
    </div>
  );
}

function StreakCalendar({ days }) {
  // days[i] === 1 means completed, 0 means missed. Index 0 is 30 days ago,
  // last index is today — laid out oldest-to-newest, left-to-right, wrapping
  // into calendar-style rows.
  const today = new Date();

  return (
    <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
      {days.map((done, i) => {
        const offset = days.length - 1 - i;
        const date = new Date(today);
        date.setDate(today.getDate() - offset);
        const isToday = offset === 0;

        return (
          <div
            key={i}
            title={date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            className={[
              'aspect-square rounded-lg flex items-center justify-center font-label-caps text-label-caps transition-colors',
              done
                ? 'bg-tertiary-container text-on-tertiary font-bold'
                : 'bg-surface-container text-outline',
              isToday ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface-container-lowest' : '',
            ].join(' ')}
          >
            {done ? (
              <span className="material-symbols-outlined fill text-[16px]">local_fire_department</span>
            ) : (
              date.getDate()
            )}
          </div>
        );
      })}
    </div>
  );
}

function MilestoneRow({ milestone, currentStreak }) {
  const unlocked = currentStreak >= milestone.days;
  const pct = Math.min(100, Math.round((currentStreak / milestone.days) * 100));

  return (
    <div
      className={[
        'flex items-center gap-4 rounded-2xl p-4',
        unlocked ? 'bg-surface' : 'bg-surface opacity-80',
      ].join(' ')}
    >
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
          unlocked ? 'bg-tertiary-container text-on-tertiary' : 'bg-surface-container text-outline'
        }`}
      >
        <span className="material-symbols-outlined fill text-xl">{unlocked ? milestone.icon : 'lock'}</span>
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <span className="font-label-lg text-label-lg text-on-surface truncate">
            {milestone.days}-Day {milestone.title}
          </span>
          <Chip className={unlocked ? 'text-tertiary bg-tertiary-fixed' : 'text-outline bg-surface-container'}>
            {unlocked ? 'Unlocked' : 'Locked'}
          </Chip>
        </div>
        {!unlocked && (
          <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-container rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          Reward: <b>{milestone.badgeReward}</b>
        </span>
      </div>
    </div>
  );
}

export default function StreakCenterPage() {
  const [loading, setLoading] = useState(true);
  const [streakHistory, setStreakHistory] = useState(null);
  const [milestones, setMilestones] = useState([]);

  useEffect(() => {
    let cancelled = false;
    progressService.getProgressHistory().then((data) => {
      if (cancelled) return;
      setStreakHistory(data.streakHistory);
      setMilestones(data.streakMilestones);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <>
        <div className="flex flex-col mb-8">
          <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider bg-surface-variant px-3 py-1 rounded-full w-fit mb-1">
            Flame Tracker
          </span>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined fill text-primary text-2xl">local_fire_department</span>
            Streak Center
          </h1>
        </div>
        <LoadingState />
      </>
    );
  }

  if (!streakHistory) {
    return <EmptyState />;
  }

  const { current, longest, last30Days } = streakHistory;
  const completedDays = last30Days.filter(Boolean).length;
  const nextMilestone = milestones.find((m) => m.days > current);

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col">
          <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider bg-surface-variant px-3 py-1 rounded-full w-fit mb-1">
            Flame Tracker
          </span>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined fill text-primary text-2xl">local_fire_department</span>
            Streak Center
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-0.5 max-w-xl">
            Keep the flame alive by completing at least one quest a day. Miss a day and it resets to zero.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter mb-gutter">
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined fill text-2xl">local_fire_department</span>
          </div>
          <div className="flex flex-col">
            <span className="font-stat-counter text-stat-counter text-on-surface">{current}</span>
            <span className="font-label-caps text-label-caps text-outline uppercase">Current Streak (days)</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-secondary-container text-on-secondary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined fill text-2xl">military_tech</span>
          </div>
          <div className="flex flex-col">
            <span className="font-stat-counter text-stat-counter text-on-surface">{longest}</span>
            <span className="font-label-caps text-label-caps text-outline uppercase">Longest Streak (days)</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-tertiary-container text-on-tertiary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined fill text-2xl">event_available</span>
          </div>
          <div className="flex flex-col">
            <span className="font-stat-counter text-stat-counter text-on-surface">{completedDays}/30</span>
            <span className="font-label-caps text-label-caps text-outline uppercase">Active Days (30D)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter items-start">
        <div className="xl:col-span-7 bg-surface-container-lowest rounded-2xl shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="font-headline-sm text-headline-sm text-on-surface">Last 30 Days</span>
            <span className="flex items-center gap-1.5 font-label-caps text-label-caps text-outline uppercase">
              <span className="w-2.5 h-2.5 rounded-sm bg-tertiary-container inline-block" /> Completed
              <span className="w-2.5 h-2.5 rounded-sm bg-surface-container inline-block ml-2" /> Missed
            </span>
          </div>
          <StreakCalendar days={last30Days} />
        </div>

        <div className="xl:col-span-5 bg-surface-container-lowest rounded-2xl shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="font-headline-sm text-headline-sm text-on-surface">Streak Milestones</span>
            {nextMilestone && (
              <span className="font-label-caps text-label-caps text-primary font-bold">
                Next: {nextMilestone.days}-Day
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {milestones.map((m) => (
              <MilestoneRow key={m.days} milestone={m} currentStreak={current} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
