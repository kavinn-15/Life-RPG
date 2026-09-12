import { useState } from 'react';
import { useGame } from '../state/GameContext';
import AvatarDisplay from './AvatarDisplay';
import CustomizeAvatarModal from './CustomizeAvatarModal';

export default function CharacterHeader() {
  const { state, updateAvatar } = useGame();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
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
            {/* Avatar with click-to-edit and level badge */}
            <div
              className="relative group cursor-pointer"
              onClick={() => setModalOpen(true)}
              title="Click to customize avatar photo"
            >
              <div className="w-20 h-20 rounded-full ring-4 ring-white shadow-xl overflow-hidden bg-surface-container flex items-center justify-center relative transition-transform group-hover:scale-105">
                <AvatarDisplay
                  avatarUrl={state.avatarUrl}
                  avatarClass={state.avatarClass}
                  className="w-full h-full"
                />
                <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
                  <span className="material-symbols-outlined text-white text-2xl drop-shadow">photo_camera</span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setModalOpen(true);
                }}
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#5b4be2] text-white flex items-center justify-center shadow-md hover:bg-[#4d3dd4] transition-transform hover:scale-110"
                title="Change Avatar"
              >
                <span className="material-symbols-outlined text-[13px]">edit</span>
              </button>
              <span className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-secondary-container text-on-secondary flex items-center justify-center font-label-caps text-[11px] font-extrabold ring-2 ring-surface-container-lowest shadow-sm">
                {state.level}
              </span>
            </div>
            <div className="flex flex-col pb-1">
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Rank: Senior Discipline // {state.title} ·{' '}
                <span className="text-tertiary font-bold">KINETIC STATE ACTIVE</span>
              </span>
              <div className="flex items-center gap-3">
                <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                  {state.playerName}
                </h1>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="px-3 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-md text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm text-primary">photo_camera</span>
                  <span>Edit Portrait</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CustomizeAvatarModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        currentAvatarUrl={state.avatarUrl}
        currentAvatarClass={state.avatarClass}
        playerName={state.playerName}
        playerLevel={state.level}
        onSave={updateAvatar}
      />
    </>
  );
}
