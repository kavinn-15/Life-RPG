import { useState } from 'react';
import { useGame } from '../state/GameContext';

export default function RecommendedQuestCard({ quest }) {
  const { grantRewards, pushToast } = useGame();
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    if (accepted) return;
    setAccepted(true);
    grantRewards({ xp: quest.xp, statKey: quest.statKey, statAmount: quest.statAmount });
    pushToast(`Quest accepted: ${quest.title}`, 'play_arrow');
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div className="flex flex-col gap-3">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${quest.iconWrapClass}`}>
          <span className="material-symbols-outlined fill text-2xl">{quest.icon}</span>
        </div>
        <div>
          <span className={`font-label-caps text-label-caps font-bold uppercase tracking-wider ${quest.categoryClass}`}>
            {quest.category}
          </span>
          <h3 className="font-headline-sm text-base font-bold text-on-surface mt-1">{quest.title}</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5">{quest.description}</p>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-surface-container-high/40 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-label-caps text-label-caps text-primary bg-primary-fixed px-2 py-0.5 rounded-full font-bold">
            +{quest.xp} XP
          </span>
          <span className={`font-label-caps text-label-caps px-2 py-0.5 rounded-full font-bold ${quest.statChipClass}`}>
            {quest.statLabel}
          </span>
        </div>
        <button
          className={[
            'w-full py-2.5 rounded-full font-label-md text-label-md transition-colors flex items-center justify-center gap-1.5',
            accepted ? 'bg-tertiary-container text-on-tertiary' : `bg-surface-container text-on-surface ${quest.hoverClass}`,
          ].join(' ')}
          onClick={handleAccept}
          disabled={accepted}
        >
          <span className="material-symbols-outlined text-base">{accepted ? 'done_all' : 'play_arrow'}</span>
          <span>{accepted ? 'Accepted' : 'Accept Quest'}</span>
        </button>
      </div>
    </div>
  );
}
