import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../state/GameContext';

const FILTERS = [
  { key: 'all', label: 'All Dispatches' },
  { key: 'unread', label: 'Unread' },
  { key: 'quests', label: 'Quests' },
  { key: 'milestones', label: 'Milestones & Levels' },
  { key: 'loot', label: 'Loot & Shop' },
];

export default function NotificationsPage() {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    unreadNotificationsCount,
  } = useGame();

  const [activeFilter, setActiveFilter] = useState('all');

  const filteredNotifications = notifications.filter((notif) => {
    if (activeFilter === 'unread') return !notif.read;
    if (activeFilter === 'quests') return notif.type === 'quest_completed' || notif.type === 'daily_mission_completed';
    if (activeFilter === 'milestones') {
      return (
        notif.type === 'level_up' ||
        notif.type === 'streak_milestone' ||
        notif.type === 'achievement_unlocked' ||
        notif.type === 'domain_milestone'
      );
    }
    if (activeFilter === 'loot') return notif.type === 'reward_purchased';
    return true;
  });

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider bg-surface-variant px-3 py-1 rounded-full">
              Dispatch Terminal
            </span>
            {unreadNotificationsCount > 0 && (
              <span className="bg-error text-white font-label-caps text-xs px-2.5 py-0.5 rounded-full font-bold animate-pulse">
                {unreadNotificationsCount} New
              </span>
            )}
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined fill text-primary text-2xl">notifications</span>
            Notifications &amp; Activity Log
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-0.5">
            Real-time feed of level-ups, quest completions, badge unlocks, and realm dispatches.
          </p>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {unreadNotificationsCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="px-3.5 py-2 rounded-full bg-surface-container-lowest hover:bg-surface-container text-primary font-label-md text-xs shadow-sm border border-outline/10 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">done_all</span>
              Mark All Read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearNotifications}
              className="px-3.5 py-2 rounded-full bg-surface-container-lowest hover:bg-error/10 hover:text-error text-on-surface-variant font-label-md text-xs shadow-sm border border-outline/10 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">delete_sweep</span>
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {FILTERS.map((f) => {
          const isActive = activeFilter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-4 py-2 rounded-full font-label-md text-xs whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container border border-outline/5'
              }`}
            >
              {f.label}
              {f.key === 'unread' && unreadNotificationsCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-error text-white text-[10px] font-bold">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl p-16 text-center flex flex-col items-center gap-3 shadow-sm border border-outline/5">
          <div className="w-16 h-16 rounded-full bg-surface-variant text-outline flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">notifications_paused</span>
          </div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">The Scroll of Echoes is Quiet</h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
            {activeFilter === 'unread'
              ? 'All caught up! No unread dispatches pending your attention.'
              : 'No notification records match this filter yet. Complete quests and explore domains to generate logs.'}
          </p>
          <Link
            to="/quests"
            className="mt-2 px-5 py-2.5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md shadow-sm hover:translate-y-0.5 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">swords</span>
            Undertake a Quest
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => !notif.read && markNotificationRead(notif.id)}
              className={`group flex items-start justify-between gap-4 p-4 rounded-2xl transition-all border ${
                notif.read
                  ? 'bg-surface-container-lowest border-outline/5 hover:border-outline/20'
                  : 'bg-primary-fixed/20 border-primary/30 shadow-[0_4px_16px_rgba(83,65,205,0.08)]'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                    notif.iconColor || 'text-primary bg-primary-fixed'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">{notif.icon || 'notifications'}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-label-lg text-label-lg font-bold text-on-surface">
                      {notif.title}
                    </h3>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-primary inline-block shrink-0" />
                    )}
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 break-words">
                    {notif.message}
                  </p>
                  <span className="font-label-caps text-[11px] text-outline mt-1.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">schedule</span>
                    {notif.timestamp}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-center">
                {notif.actionUrl && (
                  <Link
                    to={notif.actionUrl}
                    className="px-3.5 py-1.5 rounded-full bg-surface-variant hover:bg-primary-container hover:text-on-primary text-on-surface font-label-md text-xs transition-all shadow-sm flex items-center gap-1"
                  >
                    <span>{notif.actionLabel || 'View'}</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </Link>
                )}
                {!notif.read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markNotificationRead(notif.id);
                    }}
                    title="Mark as read"
                    className="w-8 h-8 rounded-full flex items-center justify-center text-outline hover:text-primary hover:bg-surface-variant transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">check</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
