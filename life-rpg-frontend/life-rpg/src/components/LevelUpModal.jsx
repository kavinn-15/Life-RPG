import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../state/GameContext';

export default function LevelUpModal() {
  const { levelUpInfo, clearLevelUp, state } = useGame();
  const open = Boolean(levelUpInfo);

  // Keyboard accessibility: Escape key closes the modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open) clearLevelUp();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, clearLevelUp]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label="Level Up Modal"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/75 backdrop-blur-md p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) clearLevelUp();
          }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350, duration: 0.3 }}
            className="bg-surface-container-lowest rounded-3xl p-8 max-w-md w-full shadow-[0_25px_60px_-15px_rgba(83,65,205,0.4)] text-center flex flex-col items-center relative overflow-hidden border border-primary/20"
          >
            {/* Ambient background glow */}
            <div className="w-56 h-56 rounded-full bg-primary/20 blur-3xl absolute -top-20 -left-20 pointer-events-none" />
            <div className="w-56 h-56 rounded-full bg-secondary/15 blur-3xl absolute -bottom-20 -right-20 pointer-events-none" />

            {/* Glowing Icon */}
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center text-on-primary shadow-[0_10px_25px_-5px_rgba(83,65,205,0.5)] mb-4"
            >
              <span className="material-symbols-outlined fill text-4xl">military_tech</span>
            </motion.div>

            <span className="font-label-caps text-label-caps text-primary tracking-widest uppercase mb-1 font-bold">
              Ascendance Reached
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-black">
              LEVEL UP!
            </h2>
            <p className="font-headline-sm text-headline-sm text-secondary-container font-extrabold mt-1">
              Level {levelUpInfo?.level ?? state.level} Unlocked
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2 px-2">
              Sensational pace, {state.playerName}! Your real-world abilities have permanently compounded.
            </p>

            <div className="grid grid-cols-3 gap-2.5 w-full my-5">
              <div className="bg-surface-container rounded-xl p-3 flex flex-col items-center">
                <span className="font-label-caps text-[10px] text-outline uppercase font-bold">INTELLECT</span>
                <span className="font-stat-counter text-stat-counter text-primary font-bold mt-0.5">+4</span>
              </div>
              <div className="bg-surface-container rounded-xl p-3 flex flex-col items-center">
                <span className="font-label-caps text-[10px] text-outline uppercase font-bold">STAMINA</span>
                <span className="font-stat-counter text-stat-counter text-tertiary font-bold mt-0.5">+2</span>
              </div>
              <div className="bg-surface-container rounded-xl p-3 flex flex-col items-center">
                <span className="font-label-caps text-[10px] text-outline uppercase font-bold">BONUS GOLD</span>
                <span className="font-stat-counter text-stat-counter text-secondary font-bold mt-0.5">
                  +{levelUpInfo?.gold ?? 50}
                </span>
              </div>
            </div>

            <button
              type="button"
              autoFocus
              className="w-full py-3.5 px-6 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg font-bold shadow-[0_4px_0_#4029ba] hover:translate-y-0.5 active:translate-y-1 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={clearLevelUp}
            >
              Claim Ascendance &amp; Resume
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
