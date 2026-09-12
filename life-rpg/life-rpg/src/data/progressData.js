// Mock progress-history data for Alex, backing progressService.
// Shaped for time-series charts (weekly XP, monthly XP, quest completion rates,
// top domains, productive days heatmap, and attribute growth) on the Progress analytics dashboard.

export const weeklyXpHistory = [
  { week: 'W1 (May 05)', fullDate: '2025-05-05', xp: 420, gold: 180, questsCompleted: 7, target: 400 },
  { week: 'W2 (May 12)', fullDate: '2025-05-12', xp: 490, gold: 210, questsCompleted: 8, target: 400 },
  { week: 'W3 (May 19)', fullDate: '2025-05-19', xp: 560, gold: 240, questsCompleted: 9, target: 450 },
  { week: 'W4 (May 26)', fullDate: '2025-05-26', xp: 390, gold: 160, questsCompleted: 6, target: 450 },
  { week: 'W5 (Jun 02)', fullDate: '2025-06-02', xp: 610, gold: 280, questsCompleted: 11, target: 500 },
  { week: 'W6 (Jun 09)', fullDate: '2025-06-09', xp: 705, gold: 320, questsCompleted: 13, target: 500 },
  { week: 'W7 (Jun 16)', fullDate: '2025-06-16', xp: 580, gold: 250, questsCompleted: 10, target: 500 },
  { week: 'W8 (Jun 23)', fullDate: '2025-06-23', xp: 650, gold: 290, questsCompleted: 12, target: 550 },
  { week: 'W9 (Jun 30)', fullDate: '2025-06-30', xp: 740, gold: 340, questsCompleted: 14, target: 550 },
  { week: 'W10 (Jul 07)', fullDate: '2025-07-07', xp: 680, gold: 300, questsCompleted: 12, target: 600 },
  { week: 'W11 (Jul 14)', fullDate: '2025-07-14', xp: 820, gold: 380, questsCompleted: 15, target: 600 },
  { week: 'W12 (Jul 21)', fullDate: '2025-07-21', xp: 890, gold: 410, questsCompleted: 16, target: 600 },
];

export const monthlyXpHistory = [
  { month: 'Feb', xp: 1750, gold: 780, questsCompleted: 31 },
  { month: 'Mar', xp: 2100, gold: 920, questsCompleted: 38 },
  { month: 'Apr', xp: 2400, gold: 1050, questsCompleted: 42 },
  { month: 'May', xp: 2680, gold: 1190, questsCompleted: 46 },
  { month: 'Jun', xp: 3200, gold: 1420, questsCompleted: 54 },
  { month: 'Jul', xp: 3750, gold: 1680, questsCompleted: 61 },
];

export const topDomainsByXp = [
  { name: 'Programming', domain: 'programming', xp: 18400, color: '#6c5ce7', icon: 'code' },
  { name: 'Fitness', domain: 'fitness', xp: 9200, color: '#00cec9', icon: 'fitness_center' },
  { name: 'Sports', domain: 'sports', xp: 6100, color: '#e17055', icon: 'sports_cricket' },
  { name: 'Career', domain: 'career', xp: 5300, color: '#0984e3', icon: 'work' },
  { name: 'Education', domain: 'education', xp: 4100, color: '#a29bfe', icon: 'school' },
  { name: 'Health', domain: 'health', xp: 3900, color: '#00b894', icon: 'favorite' },
  { name: 'Reading', domain: 'reading', xp: 3700, color: '#fdcb6e', icon: 'menu_book' },
  { name: 'Meditation', domain: 'meditation', xp: 2500, color: '#6c5ce7', icon: 'self_improvement' },
];

export const attributeGrowthHistory = [
  { attribute: 'Coding', current: 84, previous: 62, fullMark: 100 },
  { attribute: 'Discipline', current: 78, previous: 55, fullMark: 100 },
  { attribute: 'Strength', current: 72, previous: 58, fullMark: 100 },
  { attribute: 'Focus', current: 80, previous: 66, fullMark: 100 },
  { attribute: 'Vitality', current: 74, previous: 52, fullMark: 100 },
  { attribute: 'Knowledge', current: 69, previous: 50, fullMark: 100 },
  { attribute: 'Creativity', current: 65, previous: 48, fullMark: 100 },
];

export const productiveDayHeatmap = [
  { day: 'Mon', time: 'Morning', value: 3 },
  { day: 'Mon', time: 'Afternoon', value: 2 },
  { day: 'Mon', time: 'Evening', value: 4 },
  { day: 'Mon', time: 'Night', value: 1 },
  { day: 'Tue', time: 'Morning', value: 4 },
  { day: 'Tue', time: 'Afternoon', value: 3 },
  { day: 'Tue', time: 'Evening', value: 5 },
  { day: 'Tue', time: 'Night', value: 2 },
  { day: 'Wed', time: 'Morning', value: 2 },
  { day: 'Wed', time: 'Afternoon', value: 3 },
  { day: 'Wed', time: 'Evening', value: 3 },
  { day: 'Wed', time: 'Night', value: 1 },
  { day: 'Thu', time: 'Morning', value: 5 },
  { day: 'Thu', time: 'Afternoon', value: 4 },
  { day: 'Thu', time: 'Evening', value: 4 },
  { day: 'Thu', time: 'Night', value: 3 },
  { day: 'Fri', time: 'Morning', value: 3 },
  { day: 'Fri', time: 'Afternoon', value: 2 },
  { day: 'Fri', time: 'Evening', value: 2 },
  { day: 'Fri', time: 'Night', value: 0 },
  { day: 'Sat', time: 'Morning', value: 4 },
  { day: 'Sat', time: 'Afternoon', value: 5 },
  { day: 'Sat', time: 'Evening', value: 3 },
  { day: 'Sat', time: 'Night', value: 1 },
  { day: 'Sun', time: 'Morning', value: 3 },
  { day: 'Sun', time: 'Afternoon', value: 4 },
  { day: 'Sun', time: 'Evening', value: 5 },
  { day: 'Sun', time: 'Night', value: 2 },
];

export const dayOfWeekStats = [
  { day: 'Mon', quests: 38, avgXp: 520 },
  { day: 'Tue', quests: 46, avgXp: 610 },
  { day: 'Wed', quests: 32, avgXp: 440 },
  { day: 'Thu', quests: 54, avgXp: 720 },
  { day: 'Fri', quests: 28, avgXp: 390 },
  { day: 'Sat', quests: 48, avgXp: 640 },
  { day: 'Sun', quests: 44, avgXp: 580 },
];

export const questCompletionStats = {
  totalCompleted: 290,
  totalAssigned: 324,
  completionRatePct: 89.5,
  onTimeRatePct: 94.2,
  averageQuestsPerDay: 3.9,
  streakDays: 14,
  bestStreakDays: 31,
};

export const levelHistory = [
  { level: 9, reachedOn: '2025-03-14' },
  { level: 10, reachedOn: '2025-04-22' },
  { level: 11, reachedOn: '2025-05-30' },
  { level: 12, reachedOn: '2025-07-10' },
];

export const streakHistory = {
  current: 14,
  longest: 31,
  last30Days: [
    1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  ],
};

export const streakMilestones = [
  { days: 3, title: 'Spark', icon: 'local_fire_department', badgeReward: 'Bronze Completionist Badge' },
  { days: 7, title: 'Kindling', icon: 'whatshot', badgeReward: 'Ember Streak Badge' },
  { days: 14, title: 'Steady Flame', icon: 'local_fire_department', badgeReward: 'Streak Sentinel Badge' },
  { days: 30, title: 'Bonfire', icon: 'whatshot', badgeReward: 'Streak Vanguard Medal' },
  { days: 60, title: 'Wildfire', icon: 'local_fire_department', badgeReward: 'Wildfire Title' },
  { days: 100, title: 'Eternal Flame', icon: 'bolt', badgeReward: 'Unbreakable Medal' },
];
