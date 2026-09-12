import { useState } from 'react';
import { useGame } from '../state/GameContext';
import AvatarModal from './AvatarModal';

export default function CharacterHeader() {
  const { state } = useGame();
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);

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
            <div className="relative group">
              <button
                type="button"
                onClick={() => setAvatarModalOpen(true)}
                className="w-20 h-20 rounded-2xl bg-primary-container flex items-center justify-center text-on-primary shadow-lg ring-4 ring-surface-container-lowest overflow-hidden cursor-pointer group-hover:scale-105 transition-transform"
                title="Click to change your avatar photo"
              >
                {state.avatarUrl ? (
                  <img src={state.avatarUrl} alt={state.playerName} className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-4xl">person</span>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity rounded-2xl">
                  <span className="material-symbols-outlined text-xl">photo_camera</span>
                  <span className="text-[9px] font-bold">Edit</span>
                </div>
              </button>
              <span className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-secondary-container text-on-secondary flex items-center justify-center font-label-caps text-label-caps font-extrabold ring-2 ring-surface-container-lowest shadow-sm pointer-events-none">
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
                  onClick={() => setAvatarModalOpen(true)}
                  className="px-2.5 py-1 rounded-full bg-surface-container text-primary font-label-caps text-[11px] font-bold hover:bg-primary hover:text-on-primary transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                  title="Change Profile Photo"
                >
                  <span className="material-symbols-outlined text-sm">photo_camera</span>
                  Change Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AvatarModal isOpen={avatarModalOpen} onClose={() => setAvatarModalOpen(false)} />
    </>
  );
}
