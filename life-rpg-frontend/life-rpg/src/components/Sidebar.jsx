import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useGame } from '../state/GameContext';
import * as authService from '../services/authService';

const NAV_ITEMS = [
  { to: '/adventure', label: 'Adventure', icon: 'explore' },
  { to: '/quests', label: 'Quests', icon: 'task_alt' },
  { to: '/domains', label: 'Domains', icon: 'public' },
  { to: '/character', label: 'Character', icon: 'person' },
  { to: '/progress', label: 'Progress', icon: 'auto_graph' },
  { to: '/daily-missions', label: 'Daily Missions', icon: 'event_available' },
  { to: '/streak', label: 'Streak', icon: 'local_fire_department' },
  { to: '/achievements', label: 'Achievements', icon: 'emoji_events' },
  { to: '/loot-vault', label: 'Loot Vault', icon: 'storefront' },
  { to: '/inventory', label: 'Inventory', icon: 'inventory_2' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
];

function NavItem({ to, label, icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          'flex items-center gap-3 px-3.5 py-2.5 rounded-full transition-all group text-sm',
          isActive
            ? 'bg-[#5b4be2] text-white font-bold shadow-[0_4px_12px_rgba(91,75,226,0.35)]'
            : 'text-ink-muted hover:bg-ink-rail hover:text-white',
        ].join(' ')
      }
    >
      <span className="material-symbols-outlined text-[19px] group-hover:scale-110 transition-transform">
        {icon}
      </span>
      <span className="font-label-lg">{label}</span>
    </NavLink>
  );
}

export default function Sidebar() {
  const { unreadNotificationsCount, pushToast } = useGame();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    pushToast('Logged out of session.', 'logout');
    navigate('/login');
  };

  return (
    <aside
      aria-label="Sidebar navigation"
      className="hidden lg:flex fixed left-0 top-0 h-screen w-[260px] bg-ink z-50 flex-col justify-between overflow-y-auto px-4 py-5 shadow-[0_12px_24px_-4px_rgba(20,19,43,0.18)]"
    >
      <div className="flex flex-col gap-5">
        <Link to="/" className="flex items-center gap-3 px-2">
          <img
            src="/logo.png"
            alt="Life RPG Logo"
            className="w-10 h-10 rounded-2xl object-cover shadow-[0_3px_0_#4029ba] ring-1 ring-white/10"
          />
          <div className="flex flex-col">
            <span className="text-[17px] font-extrabold text-white tracking-tight leading-none">
              Life RPG
            </span>
            <span className="text-[9.5px] font-bold text-[#5be6a1] uppercase tracking-[0.14em] mt-1">
              Level Up Reality
            </span>
          </div>
        </Link>

        <nav className="flex flex-col gap-1" aria-label="Main menu">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.label} {...item} />
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-2 pt-3 bg-ink">
        {/* Floating motivational quote card */}
        <div className="p-3 rounded-2xl bg-[#141530] border border-white/5 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-[#5b4be2]/25 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#9f93ff] text-[16px]">landscape</span>
          </div>
          <p className="text-[10.5px] leading-tight text-white/70 italic">
            &quot;Every journey starts with a single step.&quot;
          </p>
        </div>

        {/* Bottom icon row */}
        <div className="flex items-center justify-around px-1 py-1 border-t border-ink-border/50">
          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              `p-2 rounded-full transition-colors relative ${isActive ? 'text-white bg-ink-rail' : 'text-ink-muted hover:bg-ink-rail hover:text-white'
              }`
            }
            title="Notifications"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-[19px]">notifications</span>
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error" />
            )}
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `p-2 rounded-full transition-colors ${isActive ? 'text-white bg-ink-rail' : 'text-ink-muted hover:bg-ink-rail hover:text-white'
              }`
            }
            title="Preferences"
            aria-label="Preferences"
          >
            <span className="material-symbols-outlined text-[19px]">tune</span>
          </NavLink>

          <NavLink
            to="/support"
            className={({ isActive }) =>
              `p-2 rounded-full transition-colors ${isActive ? 'text-white bg-ink-rail' : 'text-ink-muted hover:bg-ink-rail hover:text-white'
              }`
            }
            title="Support Codex"
            aria-label="Support Codex"
          >
            <span className="material-symbols-outlined text-[19px]">help</span>
          </NavLink>

          <button
            type="button"
            onClick={handleLogout}
            className="p-2 rounded-full text-ink-muted hover:bg-error/20 hover:text-error transition-colors"
            title="Log Out"
            aria-label="Log Out"
          >
            <span className="material-symbols-outlined text-[19px]">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}