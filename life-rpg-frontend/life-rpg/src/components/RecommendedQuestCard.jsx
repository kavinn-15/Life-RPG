import { useState } from 'react';
import { useGame } from '../state/GameContext';

export default function RecommendedQuestCard({ quest }) {
  const { grantRewards, pushToast } = useGame();
  const [accepted, setAccepted] = useState(false);

  if (!quest) return null;

  const handleAccept = () => {
    if (accepted) return;
    setAccepted(true);
    grantRewards({ xp: quest.xp || 50, statKey: quest.statKey || 'discipline', statAmount: quest.statAmount || 3 });
    pushToast(`Quest accepted: ${quest.title}`, 'play_arrow');
  };

  const iconWrapClass = quest.iconWrapClass || 'bg-secondary-fixed text-secondary';
  const icon = quest.icon || 'auto_awesome';
  const category = quest.category || quest.domain || 'Recommended';
  const categoryClass = quest.categoryClass || 'text-secondary-fixed';
  const statChipClass = quest.statChipClass || 'bg-surface-variant text-on-surface-variant';
  const statLabel = quest.statLabel || '+3 Stat';

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div className="flex flex-col gap-3">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${iconWrapClass}`}>
          <span className="material-symbols-outlined fill text-2xl">{icon}</span>
        </div>
        <div>
          <span className={`font-label-caps text-label-caps font-bold uppercase tracking-wider ${categoryClass}`}>
            {category}
          </span>
          <h3 className="font-headline-sm text-base font-bold text-on-surface mt-1">{quest.title}</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5">{quest.description}</p>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-surface-container-high/40 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-label-caps text-label-caps text-primary bg-primary-fixed px-2 py-0.5 rounded-full font-bold">
            +{quest.xp || 50} XP
          </span>
          <span className={`font-label-caps text-label-caps px-2 py-0.5 rounded-full font-bold ${statChipClass}`}>
            {statLabel}
          </span>
        </div>
        <button
          className={[
            'w-full py-2.5 rounded-full font-label-md text-label-md transition-colors flex items-center justify-center gap-1.5',
            accepted ? 'bg-tertiary-container text-on-tertiary' : `bg-surface-container text-on-surface ${quest.hoverClass || 'hover:bg-primary-container hover:text-on-primary'}`,
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
