// Quadratic leveling curve: XP required for level N = 100 * N^2
export const xpForLevel = (level) => 100 * level * level;

export const initialAttributes = [
  { key: 'coding', label: 'Coding', icon: 'code', level: 14, xp: 2850, weeklyXp: 120, nextThreshold: 15, pct: 82 },
  { key: 'strength', label: 'Strength', icon: 'fitness_center', level: 8, xp: 1920, weeklyXp: 180, nextThreshold: 9, pct: 72 },
  { key: 'intelligence', label: 'Intelligence', icon: 'psychology', level: 11, xp: 2100, weeklyXp: 45, nextThreshold: 12, pct: 84 },
  { key: 'discipline', label: 'Discipline', icon: 'shield', level: 9, xp: 1600, weeklyXp: 90, nextThreshold: 10, pct: 65 },
  { key: 'knowledge', label: 'Knowledge', icon: 'menu_book', level: 9, xp: 1450, weeklyXp: 35, nextThreshold: 10, pct: 58 },
  { key: 'focus', label: 'Focus', icon: 'center_focus_strong', level: 10, xp: 1700, weeklyXp: 85, nextThreshold: 11, pct: 80 },
  { key: 'vitality', label: 'Health & Vitality', icon: 'favorite', level: 8, xp: 1300, weeklyXp: 50, nextThreshold: 9, pct: 45 },
  { key: 'creativity', label: 'Creativity', icon: 'palette', level: 6, xp: 750, weeklyXp: 0, nextThreshold: 7, pct: 40, stable: true },
  { key: 'social', label: 'Social & Empathy', icon: 'groups', level: 5, xp: 620, weeklyXp: 0, nextThreshold: 6, pct: 30, needQuest: true },
  { key: 'travel', label: 'Experience & Travel', icon: 'flight_takeoff', level: 6, xp: 810, weeklyXp: 20, nextThreshold: 7, pct: 50 },
];

export const initialCharacter = {
  playerName: 'Alex',
  title: 'The Builder',
  level: 12,
  xp: 1850,
  gold: 2450,
  streak: 14,
  questsCompletedToday: 5,
  questsTotalToday: 8,
};

export const equippedRelics = [
  { slot: 'Active Title Slot', name: 'The Novice Vanguard', bonus: '+5% XP on Early Quests', icon: 'military_tech' },
  { slot: 'Artifact Slot', name: 'Obsidian Focus Ring', bonus: '+10% Deep Flow State', icon: 'diamond' },
  { slot: 'Booster Slot', name: 'Chronos Multiplier', bonus: '+25% Streak Buffer', icon: 'hourglass_top' },
];

export const proofOfWorkFeed = [
  { source: 'Strava Tempo Run', detail: '5.2 km • 24m 12s', reward: '+180 STR XP', icon: 'directions_run' },
  { source: 'GitHub Commits', detail: '3 PRs merged to main', reward: '+120 COD XP', icon: 'commit' },
  { source: 'Oura Deep Recovery', detail: '8.2 hrs • 91 Sleep Score', reward: '+50 VTL XP', icon: 'bedtime' },
];

export const nextMilestone = {
  title: 'Master Architect Ascendancy',
  description:
    'Unlock the dual-specialization node once Coding and Intelligence both surpass Level 15.',
  pct: 84,
};

export const radarAxes = [
  { key: 'coding', label: 'CODING' },
  { key: 'intelligence', label: 'INTEL' },
  { key: 'discipline', label: 'DISC' },
  { key: 'focus', label: 'FOCUS' },
  { key: 'strength', label: 'STR' },
];
