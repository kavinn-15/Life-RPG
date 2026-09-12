// Production progress service wired to Spring Boot backend with fallback data.
// Manages analytics, XP charts, heatmap activity, and streak records.

import { api } from './apiClient';
import {
  weeklyXpHistory as mockWeekly,
  monthlyXpHistory as mockMonthly,
  topDomainsByXp as mockTopDomains,
  attributeGrowthHistory as mockAttributeGrowth,
  productiveDayHeatmap as mockProductiveDays,
  questCompletionStats as mockCompletionStats,
  streakHistory as mockStreakHistory,
  streakMilestones as mockStreakMilestones,
  levelHistory as mockLevelHistory,
} from '../data/progressData';

// GET /api/progress/history
export async function getProgressHistory() {
  try {
    const res = await api.get('/progress/history');
    if (res) return res;
  } catch (err) {
    console.warn('API getProgressHistory failed, using fallback data:', err);
  }
  return {
    weeklyXpHistory: mockWeekly,
    monthlyXpHistory: mockMonthly,
    topDomainsByXp: mockTopDomains,
    attributeGrowthHistory: mockAttributeGrowth,
    productiveDayHeatmap: mockProductiveDays,
    questCompletionStats: mockCompletionStats,
    streakHistory: mockStreakHistory,
    streakMilestones: mockStreakMilestones,
    levelHistory: mockLevelHistory,
  };
}

// GET /api/progress/xp/weekly
export async function getWeeklyHistory() {
  try {
    const res = await api.get('/progress/xp/weekly');
    if (res) return res;
  } catch {
    // fallback
  }
  return mockWeekly;
}

// GET /api/progress/xp/monthly
export async function getMonthlyHistory() {
  try {
    const res = await api.get('/progress/xp/monthly');
    if (res) return res;
  } catch {
    // fallback
  }
  return mockMonthly;
}

// GET /api/progress/domains/top
export async function getTopDomains() {
  try {
    const res = await api.get('/progress/domains/top');
    if (res) return res;
  } catch {
    // fallback
  }
  return mockTopDomains;
}

// GET /api/progress/attributes/growth
export async function getAttributeGrowth() {
  try {
    const res = await api.get('/progress/attributes/growth');
    if (res) return res;
  } catch {
    // fallback
  }
  return mockAttributeGrowth;
}

// GET /api/progress/productivity
export async function getProductiveDays() {
  try {
    const res = await api.get('/progress/productivity');
    if (res) return res;
  } catch {
    // fallback
  }
  return mockProductiveDays;
}

// GET /api/progress/completion-stats
export async function getCompletionStats() {
  try {
    const res = await api.get('/progress/completion-stats');
    if (res) return res;
  } catch {
    // fallback
  }
  return mockCompletionStats;
}

// GET /api/progress/streak
export async function getStreakHistory() {
  try {
    const res = await api.get('/progress/streak');
    if (res) return res;
  } catch {
    // fallback
  }
  return mockStreakHistory;
}

// GET /api/progress/streak/milestones
export async function getStreakMilestones() {
  try {
    const res = await api.get('/progress/streak/milestones');
    if (res) return res;
  } catch {
    // fallback
  }
  return mockStreakMilestones;
}

export default {
  getProgressHistory,
  getWeeklyHistory,
  getMonthlyHistory,
  getTopDomains,
  getAttributeGrowth,
  getProductiveDays,
  getCompletionStats,
  getStreakHistory,
  getStreakMilestones,
};
