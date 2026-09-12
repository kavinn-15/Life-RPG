import { useState } from 'react';
import { useGame } from '../state/GameContext';

export default function ContinueQuestCard({ quest }) {
  const { grantRewards, pushToast } = useGame();
  const [status, setStatus] = useState('idle'); // idle | syncing | done

  if (!quest) return null;

  const handleComplete = () => {
    if (status !== 'idle') return;
    setStatus('syncing');
    setTimeout(() => {
      setStatus('done');
      grantRewards({ xp: quest.xp || 50, gold: quest.gold || 20, statKey: quest.statKey || 'discipline', statAmount: 3 });
      pushToast(`${quest.title} complete · +${quest.xp || 50} XP`);
    }, 700);
  };

  const progress = quest.progress ?? 0;
  const domainClass = quest.domainClass || 'bg-primary-fixed text-primary';
  const domain = quest.domain || 'Quest';
  const icon = quest.icon || 'task_alt';

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div className="flex gap-4">
        <div className="w-16 h-16 rounded-xl shrink-0 bg-surface-container-high flex items-center justify-center text-primary">
          <span className="material-symbols-outlined fill text-3xl">{icon}</span>
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className={`px-2.5 py-0.5 rounded-full font-label-caps text-label-caps ${domainClass}`}>
              {domain}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-label-caps text-label-caps text-primary bg-primary-fixed px-2 py-0.5 rounded-full font-extrabold">
                +{quest.xp || 50} XP
              </span>
              <span className="font-label-caps text-label-caps text-secondary-container bg-[#FFF8E6] px-2 py-0.5 rounded-full font-extrabold">
                +{quest.gold || 20} G
              </span>
            </div>
          </div>
          <h3 className="font-headline-sm text-base font-bold text-on-surface truncate">{quest.title}</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1 mt-0.5">
            {quest.description}
          </p>
        </div>
      </div>
      <div className="mt-4 pt-3 flex items-center justify-between gap-3">
        <div className="flex-1 flex flex-col gap-1">
          <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${quest.progressClass || 'bg-primary'}`}
              style={{ width: `${status === 'done' ? 100 : progress}%` }}
            />
          </div>
          <span className="font-label-caps text-label-caps text-outline">
            {status === 'done' ? 'Complete!' : quest.progressLabel || `${progress}% Completed`}
          </span>
        </div>
        <button
          className={[
            'px-4 py-2 rounded-full font-label-md text-label-md transition-colors flex items-center gap-1 shrink-0',
            status === 'done'
              ? 'bg-tertiary-container text-on-tertiary'
              : 'bg-surface-container text-primary hover:bg-primary-container hover:text-on-primary',
          ].join(' ')}
          onClick={handleComplete}
          disabled={status !== 'idle'}
        >
          <span className={`material-symbols-outlined text-base ${status === 'syncing' ? 'animate-spin' : ''}`}>
            {status === 'syncing' ? 'refresh' : status === 'done' ? 'done_all' : 'check'}
          </span>
          <span>{status === 'syncing' ? 'Syncing...' : status === 'done' ? 'Done!' : 'Complete'}</span>
        </button>
      </div>
    </div>
  );
}
