import { useState } from 'react';
import { useGame } from '../state/GameContext';

export default function CharacterHeader() {
  const { state, simulateLevelUp } = useGame();
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    try {
      await simulateLevelUp();
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="relative bg-surface-container-lowest rounded-2xl shadow-md overflow-hidden">
      <div className="h-28 bg-ink relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 120">
          <path d="M0,60 C150,110 350,10 500,55 C650,95 750,40 800,55 L800,0 L0,0 Z" fill="#1C1A3A" />
        </svg>
        <span className="absolute top-4 right-6 font-label-caps text-label-caps text-tertiary-fixed uppercase tracking-widest flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed inline-block" />
          Sync: Live Proof-of-Work
        </span>
      </div>
      <div className="px-6 sm:px-8 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10">
        <div className="flex items-end gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-primary-container flex items-center justify-center text-on-primary shadow-lg ring-4 ring-surface-container-lowest">
              <span className="material-symbols-outlined text-4xl">person</span>
            </div>
            <span className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-secondary-container text-on-secondary flex items-center justify-center font-label-caps text-label-caps font-extrabold ring-2 ring-surface-container-lowest">
              {state.level}
            </span>
          </div>
          <div className="flex flex-col pb-1">
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Rank: Senior Discipline // {state.title} ·{' '}
              <span className="text-tertiary font-bold">KINETIC STATE ACTIVE</span>
            </span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              {state.playerName}
            </h1>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSimulate}
          disabled={isSimulating}
          className="px-5 py-2.5 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg shadow-md hover:translate-y-0.5 active:translate-y-1 transition-all flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-70"
        >
          <span className={`material-symbols-outlined fill text-lg ${isSimulating ? 'animate-spin' : ''}`}>
            {isSimulating ? 'progress_activity' : 'bolt'}
          </span>
          {isSimulating ? 'Ascending...' : 'Simulate Level Up'}
        </button>
      </div>
    </div>
  );
}
