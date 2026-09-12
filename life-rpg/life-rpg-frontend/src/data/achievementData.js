// Mock achievement/medal data for Alex, backing achievementService.
// Mirrors the badge language already used across CharacterPage (relics,
// milestones) and DomainDetailsPage (locked medal cards). `domain` is kept
// (nullable) purely so DomainDetailsPage's existing
// `achievements.filter(a => a.domain === domain.name)` lookup keeps working
// for the achievements that are actually domain-scoped.
//
// `category` groups follow the same three-family accent token system used in
// domainData.js (ACCENTS) so tabs/badges drop straight into className props.

export const CATEGORY_META = {
  Quest: {
    icon: 'task_alt',
    accentClass: 'bg-primary-container text-on-primary',
    chipClass: 'text-primary bg-primary-fixed',
    softClass: 'bg-surface-variant text-primary',
  },
  QUEST: {
    icon: 'task_alt',
    accentClass: 'bg-primary-container text-on-primary',
    chipClass: 'text-primary bg-primary-fixed',
    softClass: 'bg-surface-variant text-primary',
  },
  Streak: {
    icon: 'local_fire_department',
    accentClass: 'bg-secondary-container text-on-secondary',
    chipClass: 'text-secondary bg-secondary-fixed',
    softClass: 'bg-secondary-fixed text-on-secondary-fixed',
  },
  STREAK: {
    icon: 'local_fire_department',
    accentClass: 'bg-secondary-container text-on-secondary',
    chipClass: 'text-secondary bg-secondary-fixed',
    softClass: 'bg-secondary-fixed text-on-secondary-fixed',
  },
  Domain: {
    icon: 'public',
    accentClass: 'bg-tertiary-container text-on-tertiary',
    chipClass: 'text-tertiary bg-tertiary-fixed',
    softClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
  },
  DOMAIN: {
    icon: 'public',
    accentClass: 'bg-tertiary-container text-on-tertiary',
    chipClass: 'text-tertiary bg-tertiary-fixed',
    softClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
  },
  Level: {
    icon: 'military_tech',
    accentClass: 'bg-primary-container text-on-primary',
    chipClass: 'text-primary bg-primary-fixed',
    softClass: 'bg-surface-variant text-primary',
  },
  LEVEL: {
    icon: 'military_tech',
    accentClass: 'bg-primary-container text-on-primary',
    chipClass: 'text-primary bg-primary-fixed',
    softClass: 'bg-surface-variant text-primary',
  },
  Gold: {
    icon: 'paid',
    accentClass: 'bg-secondary-container text-on-secondary',
    chipClass: 'text-secondary bg-secondary-fixed',
    softClass: 'bg-secondary-fixed text-on-secondary-fixed',
  },
  GOLD: {
    icon: 'paid',
    accentClass: 'bg-secondary-container text-on-secondary',
    chipClass: 'text-secondary bg-secondary-fixed',
    softClass: 'bg-secondary-fixed text-on-secondary-fixed',
  },
  Attribute: {
    icon: 'fitness_center',
    accentClass: 'bg-tertiary-container text-on-tertiary',
    chipClass: 'text-tertiary bg-tertiary-fixed',
    softClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
  },
  ATTRIBUTE: {
    icon: 'fitness_center',
    accentClass: 'bg-tertiary-container text-on-tertiary',
    chipClass: 'text-tertiary bg-tertiary-fixed',
    softClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
  },
};

export const ACHIEVEMENT_CATEGORIES = ['Quest', 'Streak', 'Domain', 'Level', 'Gold', 'Attribute'];

export function getCategoryMeta(category) {
  if (!category) return CATEGORY_META.Quest;
  const str = String(category);
  if (CATEGORY_META[str]) return CATEGORY_META[str];
  const normalized = str.toLowerCase().replace(/[\s_-]+/g, '');
  for (const [k, v] of Object.entries(CATEGORY_META)) {
    if (k.toLowerCase().replace(/[\s_-]+/g, '') === normalized) {
      return v;
    }
  }
  return CATEGORY_META.Quest;
}

export const achievements = [
  // --- Quest ---
  {
    id: 'first-quest',
    title: 'First Steps',
    description: 'Complete your very first quest.',
    icon: 'flag',
    category: 'Quest',
    domain: null,
    unlocked: true,
    progress: { current: 1, target: 1 },
    reward: { xp: 25, gold: 10 },
  },
  {
    id: 'century-club',
    title: 'Century Club',
    description: 'Complete 100 quests, of any kind, over your whole journey.',
    icon: 'workspace_premium',
    category: 'Quest',
    domain: null,
    unlocked: false,
    progress: { current: 62, target: 100 },
    reward: { xp: 400, gold: 150 },
  },
  {
    id: 'quest-marathon',
    title: 'Quest Marathon',
    description: 'Complete 10 quests in a single day.',
    icon: 'timelapse',
    category: 'Quest',
    domain: null,
    unlocked: false,
    progress: { current: 4, target: 10 },
    reward: { xp: 150, gold: 60 },
  },

  // --- Streak ---
  {
    id: 'coding-streak-14',
    title: 'Fourteen Nights of Code',
    description: 'Log a Programming quest 14 days in a row.',
    icon: 'local_fire_department',
    category: 'Streak',
    domain: 'Programming',
    unlocked: true,
    progress: { current: 14, target: 14 },
    reward: { xp: 150, gold: 75 },
  },
  {
    id: 'streak-vanguard',
    title: 'Streak Vanguard',
    description: 'Keep any daily streak alive for 30 days straight.',
    icon: 'whatshot',
    category: 'Streak',
    domain: null,
    unlocked: false,
    progress: { current: 14, target: 30 },
    reward: { xp: 300, gold: 120 },
  },
  {
    id: 'unbreakable',
    title: 'Unbreakable',
    description: 'Reach a 100-day streak without a single missed day.',
    icon: 'bolt',
    category: 'Streak',
    domain: null,
    unlocked: false,
    progress: { current: 14, target: 100 },
    reward: { xp: 750, gold: 300 },
  },

  // --- Domain ---
  {
    id: 'reading-25-books',
    title: 'Lorekeeper',
    description: 'Finish 25 books tracked under the Reading domain.',
    icon: 'auto_stories',
    category: 'Domain',
    domain: 'Reading',
    unlocked: false,
    progress: { current: 11, target: 25 },
    reward: { xp: 200, gold: 90 },
  },
  {
    id: 'globetrotter',
    title: 'Globetrotter',
    description: 'Complete a Travel quest in 5 different cities.',
    icon: 'flight_takeoff',
    category: 'Domain',
    domain: 'Travel',
    unlocked: false,
    progress: { current: 2, target: 5 },
    reward: { xp: 175, gold: 100 },
  },
  {
    id: 'social-butterfly',
    title: 'Social Butterfly',
    description: 'Complete 10 Social quests in a single month.',
    icon: 'groups',
    category: 'Domain',
    domain: 'Social',
    unlocked: false,
    progress: { current: 6, target: 10 },
    reward: { xp: 60, gold: 40 },
  },

  // --- Level ---
  {
    id: 'novice-ascendant',
    title: 'Novice Ascendant',
    description: 'Reach character Level 5.',
    icon: 'military_tech',
    category: 'Level',
    domain: null,
    unlocked: true,
    progress: { current: 5, target: 5 },
    reward: { xp: 50, gold: 25 },
  },
  {
    id: 'veteran-adventurer',
    title: 'Veteran Adventurer',
    description: 'Reach character Level 15.',
    icon: 'stars',
    category: 'Level',
    domain: null,
    unlocked: false,
    progress: { current: 12, target: 15 },
    reward: { xp: 300, gold: 150 },
  },
  {
    id: 'kafka-milestone',
    title: 'Master Architect Ascendancy',
    description: 'Surpass Level 25 to unlock the dual-specialization node.',
    icon: 'diamond',
    category: 'Level',
    domain: 'Programming',
    unlocked: false,
    progress: { current: 12, target: 25 },
    reward: { xp: 800, gold: 400 },
  },

  // --- Gold ---
  {
    id: 'first-fortune',
    title: 'First Fortune',
    description: 'Hold 500 Gold in your vault at once.',
    icon: 'paid',
    category: 'Gold',
    domain: null,
    unlocked: true,
    progress: { current: 500, target: 500 },
    reward: { xp: 40, gold: 0 },
  },
  {
    id: 'gold-hoarder',
    title: 'Gold Hoarder',
    description: 'Earn 5,000 Gold in total across your journey.',
    icon: 'savings',
    category: 'Gold',
    domain: null,
    unlocked: false,
    progress: { current: 2450, target: 5000 },
    reward: { xp: 250, gold: 200 },
  },
  {
    id: 'vault-tycoon',
    title: 'Vault Tycoon',
    description: 'Earn 10,000 Gold in total across your journey.',
    icon: 'account_balance',
    category: 'Gold',
    domain: null,
    unlocked: false,
    progress: { current: 2450, target: 10000 },
    reward: { xp: 500, gold: 500 },
  },

  // --- Attribute ---
  {
    id: 'strength-lvl-8',
    title: 'Iron Foundation',
    description: 'Reach Strength attribute level 8.',
    icon: 'fitness_center',
    category: 'Attribute',
    domain: 'Fitness',
    unlocked: true,
    progress: { current: 8, target: 8 },
    reward: { xp: 100, gold: 50 },
  },
  {
    id: 'mind-over-matter',
    title: 'Mind Over Matter',
    description: 'Reach Intelligence attribute level 15.',
    icon: 'psychology',
    category: 'Attribute',
    domain: null,
    unlocked: false,
    progress: { current: 11, target: 15 },
    reward: { xp: 220, gold: 110 },
  },
  {
    id: 'renaissance-adventurer',
    title: 'Renaissance Adventurer',
    description: 'Bring all 10 core attributes to at least level 10.',
    icon: 'hub',
    category: 'Attribute',
    domain: null,
    unlocked: false,
    progress: { current: 5, target: 10 },
    reward: { xp: 600, gold: 300 },
  },
];
