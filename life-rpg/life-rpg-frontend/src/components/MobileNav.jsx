import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useGame } from '../state/GameContext';

const MORE_LINKS = [
  { to: '/progress', label: 'Progress & Analytics', icon: 'insights' },
  { to: '/daily-missions', label: 'Daily Missions', icon: 'event_available' },
  { to: '/streak', label: 'Streak Center', icon: 'local_fire_department' },
  { to: '/achievements', label: 'Achievements', icon: 'emoji_events' },
  { to: '/loot-vault', label: 'Loot Vault', icon: 'redeem' },
  { to: '/inventory', label: 'Inventory & Relics', icon: 'backpack' },
  { to: '/notifications', label: 'Dispatches', icon: 'notifications' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
  { to: '/support', label: 'Codex Guide', icon: 'menu_book' },
  { to: '/landing', label: 'World Landing', icon: 'public' },
];

export default function MobileNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { unreadNotificationsCount } = useGame();
  const location = useLocation();

  // Close drawer on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Handle Escape key to close menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    if (menuOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  const navItemClass = ({ isActive }) =>
    `flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all ${
      isActive
        ? 'text-primary font-bold'
        : 'text-on-surface-variant hover:text-on-surface'
    }`;

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav
        aria-label="Mobile navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-container-lowest/95 backdrop-blur-xl border-t border-outline/10 z-50 flex items-center justify-around px-2 shadow-[0_-4px_20px_rgba(20,19,43,0.08)]"
      >
        <NavLink to="/adventure" className={navItemClass}>
          <span className="material-symbols-outlined text-[22px]">explore</span>
          <span className="text-[10px] font-label-caps mt-0.5">Adventure</span>
        </NavLink>

        <NavLink to="/quests" className={navItemClass}>
          <span className="material-symbols-outlined text-[22px]">task_alt</span>
          <span className="text-[10px] font-label-caps mt-0.5">Quests</span>
        </NavLink>

        <NavLink to="/domains" className={navItemClass}>
          <span className="material-symbols-outlined text-[22px]">public</span>
          <span className="text-[10px] font-label-caps mt-0.5">Domains</span>
        </NavLink>

        <NavLink to="/character" className={navItemClass}>
          <span className="material-symbols-outlined text-[22px]">person</span>
          <span className="text-[10px] font-label-caps mt-0.5">Hero</span>
        </NavLink>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Open menu"
          className="flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl text-on-surface-variant hover:text-on-surface relative"
        >
          <span className="material-symbols-outlined text-[22px]">
            {menuOpen ? 'close' : 'grid_view'}
          </span>
          <span className="text-[10px] font-label-caps mt-0.5">More</span>
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-error ring-1 ring-surface-container-lowest" />
          )}
        </button>
      </nav>

      {/* Slide-over Drawer for extra pages */}
      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Extended realm navigation"
          className="lg:hidden fixed inset-0 z-40 bg-ink/70 backdrop-blur-sm flex flex-col justify-end animate-fadeIn"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="bg-surface-container-lowest rounded-t-3xl p-6 max-h-[75vh] overflow-y-auto shadow-2xl flex flex-col gap-4 border-t border-outline/10 mb-16"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">travel_explore</span>
                <span className="font-headline-sm text-headline-sm text-on-surface">Realm Codex</span>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {MORE_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors font-label-md text-xs text-on-surface font-semibold"
                >
                  <span className="material-symbols-outlined text-primary text-lg">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
