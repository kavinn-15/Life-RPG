// Production achievement service wired to Spring Boot backend with fallback data.
// Manages achievement progress, unlocked badges, claiming rewards, and local state persistence.

import { api } from './apiClient';
import { CATEGORY_META, ACHIEVEMENT_CATEGORIES, achievements as fallbackAchievements } from '../data/achievementData';

const UNLOCKED_KEY = 'liferpg_unlocked_achievements';

export function getLocalUnlockedMap() {
  try {
    const raw = localStorage.getItem(UNLOCKED_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveLocalUnlockedMap(map) {
  try {
    localStorage.setItem(UNLOCKED_KEY, JSON.stringify(map));
  } catch (e) {
    console.warn('Could not save achievements locally:', e);
  }
}

export function evaluateAchievements(gameState, quests = []) {
  const localMap = getLocalUnlockedMap();
  const completedCount = quests.filter((q) => q.progressPct === 100 || q.status === 'COMPLETED').length;
  const level = gameState?.level || 1;
  const gold = gameState?.gold || 0;
  const streak = gameState?.streak || 0;

  let changed = false;

  if (completedCount >= 1 && !localMap['first-quest']) {
    localMap['first-quest'] = true;
    changed = true;
  }
  if (completedCount >= 100 && !localMap['century-club']) {
    localMap['century-club'] = true;
    changed = true;
  }
  if (completedCount >= 5 && !localMap['quest-marathon']) {
    localMap['quest-marathon'] = true;
    changed = true;
  }
  if (streak >= 14 && !localMap['coding-streak-14']) {
    localMap['coding-streak-14'] = true;
    changed = true;
  }
  if (streak >= 30 && !localMap['streak-vanguard']) {
    localMap['streak-vanguard'] = true;
    changed = true;
  }
  if (level >= 5 && !localMap['novice-ascendant']) {
    localMap['novice-ascendant'] = true;
    changed = true;
  }
  if (level >= 10 && !localMap['veteran-adventurer']) {
    localMap['veteran-adventurer'] = true;
    changed = true;
  }
  if (level >= 15 && !localMap['kafka-milestone']) {
    localMap['kafka-milestone'] = true;
    changed = true;
  }
  if (gold >= 100 && !localMap['first-fortune']) {
    localMap['first-fortune'] = true;
    changed = true;
  }
  if (gold >= 1000 && !localMap['gold-hoarder']) {
    localMap['gold-hoarder'] = true;
    changed = true;
  }

  if (changed) {
    saveLocalUnlockedMap(localMap);
  }
  return localMap;
}

function normalizeAchievement(a, localMap) {
  const isLocalUnlocked = localMap[a.id];
  const isUnlocked = Boolean(a.unlocked || isLocalUnlocked);
  const target = Number(a.progress?.target ?? a.target ?? 1);
  const current = isUnlocked ? target : Number(a.progress?.current ?? a.current ?? 0);
  const xpReward = Number(a.reward?.xp ?? a.xp ?? a.rewardXp ?? 50);
  const goldReward = Number(a.reward?.gold ?? a.gold ?? a.rewardGold ?? 25);

  return {
    ...a,
    unlocked: isUnlocked,
    category: a.category || 'Quest',
    icon: a.icon || 'emoji_events',
    progress: {
      current,
      target,
    },
    reward: {
      xp: xpReward,
      gold: goldReward,
    },
  };
}

// GET /api/achievements
export async function getAchievements(gameState = null, quests = null) {
  let localMap = getLocalUnlockedMap();
  if (gameState || quests) {
    localMap = evaluateAchievements(gameState, quests || []);
  }

  const completedCount = quests ? quests.filter((q) => q.progressPct === 100 || q.status === 'COMPLETED').length : 0;
  const level = gameState?.level || 1;
  const gold = gameState?.gold || 0;
  const streak = gameState?.streak || 0;

  try {
    const res = await api.get('/achievements');
    if (res && Array.isArray(res) && res.length > 0) {
      return res.map((a) => {
        let current = Number(a.progress?.current ?? a.current ?? 0);
        const target = Number(a.progress?.target ?? a.target ?? 1);

        if (a.id === 'first-quest') current = Math.max(current, completedCount);
        if (a.id === 'century-club') current = Math.max(current, completedCount);
        if (a.id === 'novice-ascendant') current = Math.max(current, level);
        if (a.id === 'veteran-adventurer') current = Math.max(current, level);
        if (a.id === 'first-fortune') current = Math.max(current, gold);
        if (a.id === 'coding-streak-14') current = Math.max(current, streak);

        const isUnlocked = Boolean(a.unlocked || localMap[a.id] || current >= target);
        if (isUnlocked && !localMap[a.id]) {
          localMap[a.id] = true;
          saveLocalUnlockedMap(localMap);
        }

        return normalizeAchievement(
          { ...a, unlocked: isUnlocked, progress: { current: isUnlocked ? target : current, target } },
          localMap
        );
      });
    }
  } catch (err) {
    console.warn('API getAchievements failed, using fallback achievements:', err);
  }

  return fallbackAchievements.map((a) => {
    let current = Number(a.progress?.current ?? a.current ?? 0);
    const target = Number(a.progress?.target ?? a.target ?? 1);

    if (a.id === 'first-quest') current = Math.max(current, completedCount);
    if (a.id === 'century-club') current = Math.max(current, completedCount);
    if (a.id === 'novice-ascendant') current = Math.max(current, level);
    if (a.id === 'veteran-adventurer') current = Math.max(current, level);
    if (a.id === 'first-fortune') current = Math.max(current, gold);
    if (a.id === 'coding-streak-14') current = Math.max(current, streak);

    const isUnlocked = Boolean(a.unlocked || localMap[a.id] || current >= target);
    if (isUnlocked && !localMap[a.id]) {
      localMap[a.id] = true;
      saveLocalUnlockedMap(localMap);
    }

    return normalizeAchievement(
      { ...a, unlocked: isUnlocked, progress: { current: isUnlocked ? target : current, target } },
      localMap
    );
  });
}

// GET /api/achievements/:id
export async function getAchievementById(id) {
  const list = await getAchievements();
  return list.find((a) => a.id === id) || null;
}

// POST /api/achievements/:id/unlock
export async function simulateUnlock(id) {
  const localMap = getLocalUnlockedMap();
  localMap[id] = true;
  saveLocalUnlockedMap(localMap);

  try {
    const res = await api.post(`/achievements/${id}/unlock`);
    if (res && res.id) {
      return normalizeAchievement(res, localMap);
    }
  } catch (err) {
    console.warn(`API simulateUnlock(${id}) failed, applying local unlock:`, err);
  }

  const existing = fallbackAchievements.find((a) => a.id === id) || {
    id,
    title: 'Achievement Unlocked',
    description: 'Unlocked by hero actions.',
    category: 'Quest',
    icon: 'emoji_events',
    target: 1,
    current: 1,
    reward: { xp: 100, gold: 50 },
  };

  return normalizeAchievement(existing, localMap);
}

// POST /api/achievements/:id/claim
export async function claimAchievement(id) {
  const localMap = getLocalUnlockedMap();
  localMap[id] = true;
  saveLocalUnlockedMap(localMap);

  try {
    return await api.post(`/achievements/${id}/claim`);
  } catch {
    return { success: true, id };
  }
}

export { CATEGORY_META, ACHIEVEMENT_CATEGORIES };

export default {
  getAchievements,
  getAchievementById,
  simulateUnlock,
  claimAchievement,
  evaluateAchievements,
  getLocalUnlockedMap,
  saveLocalUnlockedMap,
  CATEGORY_META,
  ACHIEVEMENT_CATEGORIES,
};
