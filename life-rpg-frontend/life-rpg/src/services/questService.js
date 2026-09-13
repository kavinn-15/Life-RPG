// Production quest service wired to Spring Boot backend with localStorage persistence.
// Manages quests, active queue, dailies, milestones, leaderboard, and completions.

import { api } from './apiClient';
import {
  featuredQuest as mockFeatured,
  continueQuests as mockContinue,
  recommendedQuests as mockRecommended,
  initialDailyQuests as mockDaily,
  activeQuestQueue as mockActiveQueue,
  leaderboard as mockLeaderboard,
  allMockQuests,
} from '../data/questData';

const QUESTS_STORAGE_KEY = 'liferpg_quests_state';

export const INITIAL_QUESTS_DATA = [
  {
    id: 'heavy-pull',
    title: 'Heavy Compound Pull Session',
    domain: 'FITNESS',
    domainColor: 'green',
    difficulty: 'HARD',
    diffColor: 'red',
    time: '60m',
    icon: 'fitness_center',
    iconBg: '#dcfce7',
    iconColor: '#15803d',
    rewardXp: 220,
    rewardGold: 70,
    progressPct: 33,
    progressLabel: '33% (1/3)',
    subtasks: [
      { id: 1, text: '15-minute dynamic hip and posterior-chain warm-up', done: true },
      { id: 2, text: 'Hit 405 lbs x 5 reps (RPE 8.5)', done: false },
      { id: 3, text: 'Pendlay rows 4×8 + hamstring cooldown', done: false },
    ],
  },
  {
    id: 'kafka-architecture',
    title: 'Kafka Event Streaming Architecture',
    domain: 'PROGRAMMING',
    domainColor: 'blue',
    difficulty: 'HARD',
    diffColor: 'red',
    time: '45m',
    icon: 'code',
    iconBg: '#ede9fe',
    iconColor: '#6366f1',
    rewardXp: 280,
    rewardGold: 50,
    progressPct: 50,
    progressLabel: '50% (2/4)',
    subtasks: [
      { id: 1, text: 'Read system design notes', done: true },
      { id: 2, text: 'Implement event consumer with retry logic', done: true },
      { id: 3, text: 'Write architectural summary', done: false },
    ],
  },
  {
    id: 'asset-rebalancing',
    title: 'Asset Rebalancing & Dividend Review',
    domain: 'FINANCE',
    domainColor: 'green',
    difficulty: 'MEDIUM',
    diffColor: 'amber',
    time: '40m',
    icon: 'payments',
    iconBg: '#fef3c7',
    iconColor: '#d97706',
    rewardXp: 140,
    rewardGold: 50,
    progressPct: 67,
    progressLabel: '67% (2/3)',
    subtasks: [
      { id: 1, text: 'Calculate quarterly savings percentage target', done: true },
      { id: 2, text: 'Execute automated index fund buy orders', done: true },
      { id: 3, text: 'Review REIT allocations', done: false },
    ],
  },
  {
    id: 'ddia-consensus',
    title: 'DDIA: Consistency and Consensus',
    domain: 'READING',
    domainColor: 'blue',
    difficulty: 'MEDIUM',
    diffColor: 'indigo',
    time: '30m',
    icon: 'auto_stories',
    iconBg: '#dbeafe',
    iconColor: '#2563eb',
    rewardXp: 130,
    rewardGold: 45,
    progressPct: 50,
    progressLabel: '50% (1/2)',
    subtasks: [
      { id: 1, text: 'Read pages 321 to 354 on linearizability', done: true },
      { id: 2, text: 'Draft Obsidian note on Byzantine fault tolerance', done: false },
    ],
  },
];

export function getStoredQuests() {
  try {
    const raw = localStorage.getItem(QUESTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return INITIAL_QUESTS_DATA;
}

export function saveStoredQuests(quests) {
  try {
    localStorage.setItem(QUESTS_STORAGE_KEY, JSON.stringify(quests));
  } catch (e) {
    console.warn('Could not save quests to localStorage:', e);
  }
}

// GET /api/quests
export async function getQuests() {
  const localList = getStoredQuests();
  try {
    const res = await api.get('/quests');
    if (res) {
      if (Array.isArray(res) && res.length > 0) return res;
      if (res.allQuests && Array.isArray(res.allQuests) && res.allQuests.length > 0) {
        return res.allQuests;
      }
    }
  } catch (err) {
    console.warn('API getQuests failed, using stored local data:', err);
  }
  return localList;
}

// GET /api/quests/featured
export async function getFeaturedQuest() {
  try {
    return await api.get('/quests/featured');
  } catch {
    return mockFeatured;
  }
}

// GET /api/quests?section=continue
export async function getContinueQuests() {
  try {
    return await api.get('/quests?section=continue');
  } catch {
    return mockContinue;
  }
}

// GET /api/quests?section=recommended
export async function getRecommendedQuests() {
  try {
    return await api.get('/quests?section=recommended');
  } catch {
    return mockRecommended;
  }
}

// GET /api/quests/daily
export async function getDailyQuests() {
  try {
    return await api.get('/quests/daily');
  } catch {
    return mockDaily;
  }
}

// PATCH /api/quests/daily/:id
export async function toggleDailyQuest(id) {
  try {
    return await api.patch(`/quests/daily/${id}`);
  } catch {
    return { success: true };
  }
}

// GET /api/quests/active
export async function getActiveQuests() {
  try {
    const res = await api.get('/quests/active');
    if (res && Array.isArray(res) && res.length > 0) return res;
  } catch (err) {
    console.warn('API getActiveQuests failed, using stored quests:', err);
  }
  return getStoredQuests().filter((q) => q.progressPct < 100);
}

// GET /api/leaderboard
export async function getLeaderboard() {
  try {
    return await api.get('/leaderboard');
  } catch {
    return mockLeaderboard;
  }
}

// GET /api/quests/:id
export async function getQuestById(id) {
  const localList = getStoredQuests();
  const localMatch = localList.find((q) => String(q.id).toLowerCase() === String(id).toLowerCase());

  try {
    const res = await api.get(`/quests/${id}`);
    if (res) {
      if (localMatch && localMatch.progressPct === 100) {
        return { ...res, progressPct: 100, progress: 100, status: 'COMPLETED' };
      }
      return res;
    }
  } catch (err) {
    console.warn(`API getQuestById(${id}) failed, checking local list:`, err);
  }

  if (localMatch) return localMatch;

  const match =
    allMockQuests.find((q) => String(q.id).toLowerCase() === String(id).toLowerCase()) ||
    mockActiveQueue.find((q) => String(q.id).toLowerCase() === String(id).toLowerCase());
  return match || null;
}

// POST /api/quests
export async function createQuest(data) {
  const domainKey = (data.domain || 'FITNESS').toUpperCase();
  const diffKey = (data.difficulty || 'MEDIUM').toUpperCase();

  const domainColors = {
    FITNESS: 'green',
    HEALTH: 'green',
    SPORTS: 'green',
    PROGRAMMING: 'blue',
    CODE: 'blue',
    FINANCE: 'amber',
    READING: 'blue',
    MIND: 'pink',
    CAREER: 'amber',
    CREATIVITY: 'pink',
    EDUCATION: 'blue',
    MEDITATION: 'amber',
    TRAVEL: 'green',
    SOCIAL: 'pink',
    GAMING: 'pink',
  };
  const diffColors = {
    EASY: 'green',
    MEDIUM: 'amber',
    HARD: 'red',
    EPIC: 'red',
  };

  const domainColor = data.domainColor || domainColors[domainKey] || 'blue';
  const diffColor = data.diffColor || diffColors[diffKey] || 'amber';

  const xpVal = Number(data.rewardXp ?? data.xp ?? 100);
  const goldVal = Number(data.rewardGold ?? data.gold ?? 50);
  const timeVal = data.time || data.duration || '30m';

  const subtasks =
    data.subtasks && Array.isArray(data.subtasks) && data.subtasks.length > 0
      ? data.subtasks
      : [
          { id: 1, text: data.title || 'Complete quest objective', done: false },
          { id: 2, text: 'Log reflections and confirm completion', done: false },
        ];

  const doneCount = subtasks.filter((st) => st.done).length;
  const progressPct =
    data.progressPct ??
    data.progress ??
    (subtasks.length ? Math.round((doneCount / subtasks.length) * 100) : 0);

  const newQuest = {
    ...data,
    id: data.id || `quest-${Date.now()}`,
    title: data.title || 'Untitled Quest',
    domain: domainKey,
    domainColor,
    difficulty: diffKey,
    diffColor,
    time: timeVal,
    duration: timeVal,
    rewardXp: xpVal,
    xp: xpVal,
    rewardGold: goldVal,
    gold: goldVal,
    icon: data.icon || 'star',
    iconBg: data.iconBg || '#ede9fe',
    iconColor: data.iconColor || '#6366f1',
    progressPct,
    progress: progressPct,
    progressLabel: data.progressLabel || `${progressPct}% (${doneCount}/${subtasks.length})`,
    subtasks,
    status: data.status || (progressPct === 100 ? 'COMPLETED' : 'ACTIVE'),
  };

  const list = [newQuest, ...getStoredQuests()];
  saveStoredQuests(list);

  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('liferpg_quests_updated', { detail: newQuest }));
    }
  } catch (e) {
    console.warn('Could not dispatch liferpg_quests_updated event:', e);
  }

  try {
    const res = await api.post('/quests', newQuest);
    if (res && res.id) return { ...newQuest, ...res };
  } catch (err) {
    console.warn('API createQuest failed, saved locally:', err);
  }

  return newQuest;
}

// PATCH /api/quests/:id
export async function updateQuest(id, data) {
  const list = getStoredQuests().map((q) => (q.id === id ? { ...q, ...data } : q));
  saveStoredQuests(list);

  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('liferpg_quests_updated', { detail: data }));
    }
  } catch {}

  try {
    return await api.patch(`/quests/${id}`, data);
  } catch {
    return { id, ...data };
  }
}

// DELETE /api/quests/:id
export async function deleteQuest(id) {
  const list = getStoredQuests().filter((q) => q.id !== id);
  saveStoredQuests(list);

  try {
    return await api.delete(`/quests/${id}`);
  } catch {
    return { success: true };
  }
}

// POST /api/quests/:id/complete
export async function completeQuest(id) {
  // Mark completed in persistent storage
  const list = getStoredQuests().map((q) => {
    if (q.id === id) {
      const subtasks = (q.subtasks || []).map((st) => ({ ...st, done: true }));
      return {
        ...q,
        subtasks,
        progressPct: 100,
        progress: 100,
        progressLabel: subtasks.length ? `100% (${subtasks.length}/${subtasks.length})` : '100%',
        status: 'COMPLETED',
        completed: true,
      };
    }
    return q;
  });
  saveStoredQuests(list);

  try {
    const res = await api.post(`/quests/${id}/complete`);
    return res;
  } catch {
    const quest = await getQuestById(id);
    return {
      xp: quest?.rewardXp || quest?.xp || 100,
      gold: quest?.rewardGold || quest?.gold || 50,
      statKey: quest?.statKey || 'discipline',
      statAmount: quest?.statAmount || 3,
    };
  }
}

// PATCH /api/quests/:questId/milestones/:milestoneId
export async function toggleMilestone(questId, milestoneId) {
  try {
    return await api.patch(`/quests/${questId}/milestones/${milestoneId}`);
  } catch {
    return { success: true };
  }
}

export default {
  getQuests,
  getFeaturedQuest,
  getContinueQuests,
  getRecommendedQuests,
  getDailyQuests,
  toggleDailyQuest,
  getActiveQuests,
  getLeaderboard,
  getQuestById,
  createQuest,
  updateQuest,
  deleteQuest,
  completeQuest,
  toggleMilestone,
  getStoredQuests,
  saveStoredQuests,
};
