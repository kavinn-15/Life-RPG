// Mock daily-mission data for Alex, backing dailyMissionService.
// `source` tells DailyMissionsPage which live GameContext field to read for
// `current` progress instead of the static `mockCurrent` below — so missions
// that map cleanly onto real state (quests completed today, etc.) stay in
// sync with the rest of the app rather than drifting out of date.
//
//   source: 'questsCompletedToday' -> current = state.questsCompletedToday
//   source: 'dailyQuestsRatio'     -> current = state.questsCompletedToday, target = state.questsTotalToday
//   source: null                   -> current = mockCurrent (no live counter exists yet)

export const dailyMissions = [
  {
    id: 'triple-threat',
    title: 'Triple Threat',
    description: 'Complete 3 quests today, of any domain or difficulty.',
    icon: 'task_alt',
    source: 'questsCompletedToday',
    target: 3,
    mockCurrent: null,
    rewardXp: 50,
    rewardGold: 20,
  },
  {
    id: 'full-house',
    title: 'Full House',
    description: "Clear every quest on today's board.",
    icon: 'checklist',
    source: 'dailyQuestsRatio',
    target: null,
    mockCurrent: null,
    rewardXp: 120,
    rewardGold: 60,
  },
  {
    id: 'xp-surge',
    title: 'XP Surge',
    description: 'Earn 200 XP from quests completed today.',
    icon: 'bolt',
    source: null,
    target: 200,
    mockCurrent: 140,
    rewardXp: 75,
    rewardGold: 25,
  },
  {
    id: 'keep-the-flame',
    title: 'Keep the Flame Alive',
    description: 'Complete at least 1 quest today to protect your streak.',
    icon: 'local_fire_department',
    source: 'questsCompletedToday',
    target: 1,
    mockCurrent: null,
    rewardXp: 30,
    rewardGold: 15,
  },
  {
    id: 'domain-diversifier',
    title: 'Domain Diversifier',
    description: 'Complete quests in 2 different domains today.',
    icon: 'public',
    source: null,
    target: 2,
    mockCurrent: 1,
    rewardXp: 90,
    rewardGold: 35,
  },
  {
    id: 'gold-rush',
    title: 'Gold Rush',
    description: 'Earn 100 Gold from quests completed today.',
    icon: 'paid',
    source: null,
    target: 100,
    mockCurrent: 60,
    rewardXp: 40,
    rewardGold: 0,
  },
];
