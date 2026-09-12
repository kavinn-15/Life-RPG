import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as characterService from '../services/characterService';
import * as notificationService from '../services/notificationService';
import { xpForLevel } from '../services/characterService';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [levelUpInfo, setLevelUpInfo] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  // One equipped item id per reward category (e.g. { Theme: 'theme-midnight-aurora' }).
  // Lives on GameContext (rather than rewardService) since "equipped" is
  // player-session state, not shop/catalog data.
  const [equippedItems, setEquippedItems] = useState({});

  const loadCharacterData = useCallback(() => {
    setLoading(true);
    let cancelled = false;

    Promise.all([
      characterService.getCharacter(),
      characterService.getAttributes(),
      notificationService.getNotifications(),
    ])
      .then(([character, attributes, initialNotifs]) => {
        if (cancelled) return;
        setState({ ...character, attributes });
        setNotifications(initialNotifs || []);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.warn('Could not load live character, using default state:', err);
        setState((prev) => prev || {
          id: 1,
          playerName: 'Alex Mercer',
          title: 'Cyber Nomad',
          avatarClass: 'cyber-nomad',
          dailyGoal: 3,
          preferredDifficulty: 'Medium',
          mainObjective: 'Build unshakeable daily habits and master distributed systems engineering.',
          level: 12,
          xp: 400,
          totalXp: 14800,
          gold: 850,
          streak: 18,
          longestStreak: 24,
          questsCompletedToday: 2,
          questsTotalToday: 4,
          attributes: [],
        });
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return loadCharacterData();
  }, [loadCharacterData]);

  const xpNeeded = state ? xpForLevel(state.level) : 0;
  const xpPct = state ? Math.min(100, Math.round((state.xp / xpNeeded) * 100)) : 0;

  const pushToast = useCallback((message, icon = 'check_circle') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, icon }]);
    setTimeout(() => {
      setToasts((t) => t.filter((toast) => toast.id !== id));
    }, 3200);
  }, []);

  const addNotification = useCallback((data) => {
    return notificationService.addNotification(data).then((newNotif) => {
      setNotifications((prev) => [newNotif, ...prev]);
      return newNotif;
    });
  }, []);

  const markNotificationRead = useCallback((id) => {
    notificationService.markAsRead(id).then(() => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    });
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    notificationService.markAllAsRead().then(() => {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    });
  }, []);

  const clearNotifications = useCallback(() => {
    notificationService.clearAll().then(() => {
      setNotifications([]);
    });
  }, []);

  const grantRewards = useCallback(
    ({ xp = 0, gold = 0, statKey = null, statAmount = 0, questTitle = null }) => {
      setState((prev) => {
        if (!prev) return prev;
        let { level, xp: curXp } = prev;
        let newXp = curXp + xp;
        let leveledUp = false;
        let required = xpForLevel(level);
        while (newXp >= required) {
          newXp -= required;
          level += 1;
          leveledUp = true;
          required = xpForLevel(level);
        }

        const attributes = statKey
          ? prev.attributes.map((a) =>
              a.key === statKey
                ? { ...a, xp: a.xp + statAmount * 10, weeklyXp: a.weeklyXp + statAmount * 10 }
                : a
            )
          : prev.attributes;

        if (leveledUp) {
          setLevelUpInfo({ level, statKey, statAmount, gold });
          addNotification({
            type: 'level_up',
            title: `Ascended to Level ${level}!`,
            message: `Congratulations! You unlocked Level ${level}. New attribute potential awakened.`,
            icon: 'military_tech',
            iconColor: 'text-secondary-container bg-secondary-fixed',
            actionUrl: '/character',
            actionLabel: 'View Sheet',
          });
        }

        if (xp > 0 || gold > 0) {
          addNotification({
            type: 'quest_completed',
            title: questTitle ? `Quest Completed: ${questTitle}` : 'Quest Rewards Claimed',
            message: `Earned +${xp} XP and +${gold} Gold${statKey ? ` (+${statAmount} ${statKey})` : ''}.`,
            icon: 'task_alt',
            iconColor: 'text-primary bg-primary-fixed',
            actionUrl: '/quests',
            actionLabel: 'Quest Board',
          });
        }

        return {
          ...prev,
          level,
          xp: newXp,
          gold: prev.gold + gold,
          attributes,
          questsCompletedToday: (prev.questsCompletedToday ?? 0) + 1,
        };
      });
    },
    [addNotification]
  );

  const clearLevelUp = useCallback(() => setLevelUpInfo(null), []);

  // Deducts Gold from the player. Callers (e.g. RewardShopPage) are expected
  // to have already confirmed affordability via state.gold before calling.
  const spendGold = useCallback(
    (amount, itemName = null) => {
      setState((prev) => {
        if (!prev) return prev;
        const nextGold = Math.max(0, prev.gold - amount);
        return { ...prev, gold: nextGold };
      });
      addNotification({
        type: 'reward_purchased',
        title: itemName ? `Purchased: ${itemName}` : 'Loot Vault Transaction',
        message: `Deducted ${amount} Gold from your vault.`,
        icon: 'monetization_on',
        iconColor: 'text-secondary bg-secondary-fixed',
        actionUrl: '/inventory',
        actionLabel: 'Inspect Inventory',
      });
    },
    [addNotification]
  );

  // Toggles an owned item's equipped state within its category slot.
  // Equipping an item auto-unequips whatever else was in that slot;
  // equipping the already-equipped item unequips it.
  const toggleEquip = useCallback((item) => {
    setEquippedItems((prev) => {
      const isEquipped = prev[item.category] === item.id;
      const next = { ...prev };
      if (isEquipped) {
        delete next[item.category];
      } else {
        next[item.category] = item.id;
      }
      return next;
    });
  }, []);

  const unreadNotificationsCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const value = useMemo(
    () => ({
      state,
      setState,
      xpNeeded,
      xpPct,
      grantRewards,
      spendGold,
      levelUpInfo,
      clearLevelUp,
      toasts,
      pushToast,
      xpForLevel,
      equippedItems,
      toggleEquip,
      notifications,
      unreadNotificationsCount,
      addNotification,
      markNotificationRead,
      markAllNotificationsRead,
      clearNotifications,
      reloadState: loadCharacterData,
    }),
    [
      state,
      xpNeeded,
      xpPct,
      grantRewards,
      spendGold,
      levelUpInfo,
      clearLevelUp,
      toasts,
      pushToast,
      equippedItems,
      toggleEquip,
      notifications,
      unreadNotificationsCount,
      addNotification,
      markNotificationRead,
      markAllNotificationsRead,
      clearNotifications,
      loadCharacterData,
    ]
  );

  // Existing pages/components assume `state` is always populated once
  // rendered, so we gate the whole tree behind the initial character fetch
  // rather than pushing null-checks into every consumer.
  if (loading || !state) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
          <span className="font-label-md text-label-md text-on-surface-variant">Loading your character...</span>
        </div>
      </div>
    );
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within a GameProvider');
  return ctx;
}
