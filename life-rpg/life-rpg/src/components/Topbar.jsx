import { Link, useNavigate } from 'react-router-dom';
import { useGame } from '../state/GameContext';

export default function Topbar() {
  const { state, xpNeeded, xpPct, unreadNotificationsCount } = useGame();
  const navigate = useNavigate();
  const ringCircumference = 2 * Math.PI * 14;
  const ringOffset = ringCircumference * (1 - xpPct / 100);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate('/quests');
  };

  return (
    <header className="fixed top-0 lg:left-[260px] left-0 right-0 h-20 bg-surface/85 backdrop-blur-xl z-40 shadow-[0_1px_8px_rgba(20,19,43,0.04)]">
      <div className="h-20 w-full px-3 sm:px-6 flex items-center justify-between gap-2.5 lg:gap-4">
        {/* Left: Mobile Brand & Welcome / Desktop Search */}
        <div className="flex items-center gap-3 lg:gap-4 min-w-0 flex-1 max-w-xl">
          {/* Mobile brand mark */}
          <Link to="/" className="lg:hidden flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-on-primary text-xl">swords</span>
            </div>
            <span className="font-headline-sm text-sm font-bold text-on-surface sm:inline hidden">
              Life RPG
            </span>
          </Link>

          {/* Welcome greeting */}
          <div className="hidden md:flex flex-col shrink-0">
            <span className="font-label-md text-label-md text-on-surface-variant leading-tight">Ready for quests?</span>
            <span className="font-headline-sm text-headline-sm text-on-surface font-extrabold truncate max-w-[150px] lg:max-w-[190px] xl:max-w-[230px] 2xl:max-w-none">
              Welcome back, 👋 {state.playerName}
            </span>
          </div>

          {/* Search Bar (flexes cleanly without overflowing) */}
          <form onSubmit={handleSearchSubmit} className="relative items-center hidden lg:flex flex-1 min-w-[160px] max-w-[280px]">
            <span className="material-symbols-outlined absolute left-3.5 text-outline text-[19px] pointer-events-none">
              search
            </span>
            <input
              className="w-full pl-10 pr-12 py-2 bg-surface-container-lowest border border-outline-variant/40 rounded-full font-body-sm text-body-sm text-on-surface shadow-[0_2px_6px_rgba(20,19,43,0.04)] focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all"
              placeholder="Search quests..."
              type="text"
            />
            <button
              className="absolute right-1 px-2.5 py-1 bg-primary-container text-on-primary font-label-caps text-[11px] font-bold rounded-full shadow-[0_2px_0_#4029ba] hover:translate-y-[1px] transition-transform"
              type="submit"
            >
              GO
            </button>
          </form>
        </div>

        {/* Right: Quick Stats & Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Streak pill */}
          <Link
            to="/streak"
            className="flex items-center gap-1.5 bg-[#FFF2E2] border border-[#FFE0B2]/60 px-2.5 sm:px-3 py-1.5 rounded-full shadow-[0_2px_6px_rgba(20,19,43,0.03)] hover:scale-105 transition-transform shrink-0"
            title="View Streak Center"
          >
            <span className="material-symbols-outlined fill text-secondary text-[18px]">
              local_fire_department
            </span>
            <span className="font-label-lg text-xs text-secondary font-bold whitespace-nowrap">
              {state.streak} <span className="hidden 2xl:inline">Days</span>
            </span>
          </Link>

          {/* Level badge */}
          <Link
            to="/character"
            className="flex items-center gap-1.5 sm:gap-2 bg-surface-container-lowest border border-outline-variant/40 px-2.5 py-1 rounded-full shadow-[0_2px_6px_rgba(20,19,43,0.04)] hover:scale-105 transition-transform shrink-0"
            title="View Character Sheet"
          >
            <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
              <svg className="w-7 h-7 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" fill="none" r="14" stroke="#e3dfff" strokeWidth="3.5" />
                <circle
                  cx="18"
                  cy="18"
                  fill="none"
                  r="14"
                  stroke="#6c5ce7"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringOffset}
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
              </svg>
              <span className="absolute font-label-caps text-[9px] font-extrabold text-primary">
                {state.level}
              </span>
            </div>
            <span className="font-label-caps text-[11px] text-on-surface font-extrabold tracking-wide pr-1 whitespace-nowrap">
              LVL {state.level}
            </span>
          </Link>

          {/* XP progress bar (Desktop) */}
          <div className="hidden xl:flex flex-col justify-center gap-0.5 bg-surface-container-lowest border border-outline-variant/40 px-3 py-1 rounded-full shadow-[0_2px_6px_rgba(20,19,43,0.04)] w-32 2xl:w-40 shrink-0">
            <div className="flex items-center justify-between text-label-caps font-label-caps text-[10px] leading-none">
              <span className="text-primary font-extrabold">XP</span>
              <span className="text-on-surface-variant font-bold">
                {state.xp.toLocaleString()} / {xpNeeded.toLocaleString()}
              </span>
            </div>
            <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden mt-0.5">
              <div
                className="h-full bg-primary-container rounded-full transition-all duration-500"
                style={{ width: `${xpPct}%` }}
              />
            </div>
          </div>

          {/* Gold pill */}
          <Link
            to="/loot-vault"
            className="flex items-center gap-1.5 bg-[#FFF8E6] border border-[#FFE699]/50 px-2.5 sm:px-3 py-1.5 rounded-full shadow-[0_2px_6px_rgba(20,19,43,0.03)] hover:scale-105 transition-transform shrink-0"
            title="Visit Loot Vault"
          >
            <span className="material-symbols-outlined fill text-secondary-container text-[18px]">
              monetization_on
            </span>
            <span className="font-label-lg text-xs text-secondary-container font-bold whitespace-nowrap">
              {state.gold.toLocaleString()} G
            </span>
          </Link>

          {/* Notifications button */}
          <Link
            to="/notifications"
            className="relative w-9 h-9 rounded-full bg-surface-container-lowest border border-outline-variant/40 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors shadow-[0_2px_6px_rgba(20,19,43,0.04)] shrink-0"
            title="View Dispatches"
            aria-label="View Dispatches"
          >
            <span className="material-symbols-outlined text-[19px]">notifications</span>
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-error ring-2 ring-surface-container-lowest flex items-center justify-center" />
            )}
          </Link>

          {/* Character avatar */}
          <Link
            to="/character"
            className="flex items-center gap-2 pl-0.5 cursor-pointer group shrink-0"
            title="Character Sheet"
            aria-label="Character Sheet"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-[0_2px_0_#4029ba] group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-on-primary text-[19px]">person</span>
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-tertiary-container ring-2 ring-surface-container-lowest" />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
