import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useGame } from '../state/GameContext';
import AvatarDisplay from './AvatarDisplay';

export default function Topbar() {
  const {
    state,
    xpNeeded,
    xpPct,
    unreadNotificationsCount,
  } = useGame();

  const navigate = useNavigate();
  const location = useLocation();

  // Dynamic greeting based on route
  let subtitle = 'Ready for an adventure?';
  let title = `Choose your path, ${state.playerName || 'Adventurer'}!`;
  let iconName = 'explore';

  if (location.pathname.startsWith('/quests')) {
    subtitle = 'Ready for real progress?';
    title = `Choose your next quest, ${state.playerName || 'Adventurer'}!`;
    iconName = 'adjust';
  } else if (location.pathname.startsWith('/daily-missions')) {
    subtitle = 'Ready for daily glory?';
    title = `Execute your missions, ${state.playerName || 'Adventurer'}!`;
    iconName = 'swords';
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    navigate('/quests');
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-40 h-20 border-b border-[#e9e8f4] bg-white/95 shadow-[0_2px_12px_rgba(25,24,60,0.03)] backdrop-blur-xl lg:left-[260px]">
      <div className="flex h-20 items-center justify-between gap-3 px-4 sm:px-6">

        {/* ======================================================
            LEFT: GREETING WITH COMPASS/TARGET ICON
           ====================================================== */}

        <div className="flex min-w-0 flex-1 items-center gap-4">
          {/* Mobile logo */}
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 lg:hidden"
          >
            <img
              src="/logo.png"
              alt="Life RPG Logo"
              className="h-9 w-9 rounded-xl object-cover shadow-sm ring-1 ring-[#5b4be2]/20"
            />
          </Link>

          {/* Greeting */}
          <div className="hidden min-w-0 flex-col md:flex shrink-0">
            <span className="text-[11px] font-semibold leading-4 text-[#757691]">
              {subtitle}
            </span>

            <div className="flex items-center gap-1.5">
              <span className="truncate text-[17px] font-extrabold leading-5 text-[#16163f]">
                {title}
              </span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#16163f]/20 text-[#16163f] text-[12px]">
                <span className="material-symbols-outlined text-[13px]">
                  {iconName}
                </span>
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative hidden max-w-[340px] flex-1 lg:flex"
          >
            <span className="material-symbols-outlined pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-[#8e8fa6]">
              search
            </span>

            <input
              type="text"
              placeholder="Search quests, domains, or adventures..."
              className="h-10 w-full rounded-full border border-[#e2e1ee] bg-[#f8f7fe]/70 pl-10 pr-14 text-[12px] font-medium text-[#202048] shadow-[0_2px_6px_rgba(20,19,45,0.03)] outline-none transition-all placeholder:text-[#9c9cb0] focus:border-primary-container focus:bg-white focus:ring-2 focus:ring-primary-container/10"
            />

            <button
              type="submit"
              className="absolute right-1 top-1/2 flex h-8 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#5b4be2] text-[11px] font-extrabold text-white shadow-sm transition-all hover:bg-[#4d3dd4]"
            >
              GO
            </button>
          </form>
        </div>

        {/* ======================================================
            RIGHT STATS (MATCHING REFERENCE PILLS)
           ====================================================== */}

        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">

          {/* 1. Streak Pill */}
          <Link
            to="/streak"
            className="flex items-center gap-1.5 rounded-full border border-[#f5dfc3] bg-[#fff2e2] px-3 py-1.5 shadow-[0_2px_6px_rgba(20,19,43,0.03)] transition-transform hover:scale-105"
            title="Active Streak"
          >
            <span className="material-symbols-outlined fill text-[18px] text-[#c96216]">
              local_fire_department
            </span>
            <span className="text-[12px] font-extrabold text-[#2c2016]">
              {state.streak || 18}
            </span>
          </Link>

          {/* 2. Level Pill with Crown */}
          <Link
            to="/character"
            className="hidden items-center gap-1.5 rounded-full border border-[#ded8fd] bg-[#f0effe] px-3 py-1.5 shadow-[0_2px_6px_rgba(20,19,43,0.03)] transition-transform hover:scale-105 sm:flex"
            title="Player Level"
          >
            <span className="material-symbols-outlined text-[17px] text-[#5547c8]">
              workspace_premium
            </span>
            <span className="text-[11.5px] font-extrabold text-[#1c1a40]">
              LVL {state.level || 12}
            </span>
          </Link>

          {/* 3. XP Progress Gauge */}
          <div className="hidden flex-col justify-center gap-0.5 rounded-full border border-[#e4e3f0] bg-white px-3.5 py-1.5 shadow-[0_2px_6px_rgba(20,19,43,0.03)] w-36 xl:w-44 shrink-0 sm:flex">
            <div className="flex items-center justify-between text-[10px] leading-none">
              <span className="font-extrabold text-[#5b4be2]">XP</span>
              <span className="font-bold text-[#6a6b86]">
                {(state.xp ?? 400).toLocaleString()} / {(xpNeeded ?? 14400).toLocaleString()}
              </span>
            </div>

            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-[#ebeaf4] mt-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#5b4be2] to-[#8b79f2] transition-all duration-500"
                style={{ width: `${xpPct ?? 28}%` }}
              />
            </div>
          </div>

          {/* 4. Gold Pill */}
          <Link
            to="/loot-vault"
            className="hidden items-center gap-1.5 rounded-full border border-[#f6e5b5] bg-[#fff8e6] px-3 py-1.5 shadow-[0_2px_6px_rgba(20,19,43,0.03)] transition-transform hover:scale-105 sm:flex"
            title="Loot Vault"
          >
            <span className="material-symbols-outlined fill text-[17px] text-[#cca019]">
              monetization_on
            </span>
            <span className="text-[11.5px] font-extrabold text-[#2a2210]">
              {(state.gold ?? 850).toLocaleString()} G
            </span>
          </Link>

          {/* 5. Notifications Bell Button */}
          <Link
            to="/notifications"
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#e4e3f0] bg-white text-[#63647f] shadow-[0_2px_6px_rgba(20,19,43,0.04)] transition-colors hover:bg-[#f4f3ff] hover:text-primary"
          >
            <span className="material-symbols-outlined text-[18px]">
              notifications
            </span>
            {unreadNotificationsCount > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-error ring-2 ring-white" />
            )}
          </Link>

          {/* 6. Character Profile Avatar */}
          <Link
            to="/character"
            aria-label="Character Sheet"
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#5b4be2] shadow-[0_2px_0_#4029ba] transition-transform hover:scale-105 overflow-hidden"
          >
            <AvatarDisplay
              avatarUrl={state?.avatarUrl}
              avatarClass={state?.avatarClass}
              className="w-full h-full"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}