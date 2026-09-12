// Production progress service wired to Spring Boot backend.
// Manages analytics, XP charts, heatmap activity, and streak records.

import { api } from './apiClient';
import {
  weeklyXpHistory,
  monthlyXpHistory,
  topDomainsByXp,
  attributeGrowthHistory,
  productiveDayHeatmap,
  questCompletionStats,
  levelHistory,
  streakHistory,
  streakMilestones,
} from '../data/progressData';

// GET /api/progress/history
export async function getProgressHistory() {
  try {
    const data = await api.get('/progress/history');
    if (data && typeof data === 'object') {
      return {
        weeklyXpHistory: data.weeklyXpHistory || weeklyXpHistory,
        monthlyXpHistory: data.monthlyXpHistory || monthlyXpHistory,
        topDomainsByXp: data.topDomainsByXp || topDomainsByXp,
        attributeGrowthHistory: data.attributeGrowthHistory || attributeGrowthHistory,
        productiveDayHeatmap: data.productiveDayHeatmap || productiveDayHeatmap,
        questCompletionStats: data.questCompletionStats || questCompletionStats,
        levelHistory: data.levelHistory || levelHistory,
        streakHistory: data.streakHistory || streakHistory,
        streakMilestones: data.streakMilestones || streakMilestones,
      };
    }
  } catch (err) {
    console.warn('Backend progress history failed, using fallback mock data', err);
  }
  return {
    weeklyXpHistory,
    monthlyXpHistory,
    topDomainsByXp,
    attributeGrowthHistory,
    productiveDayHeatmap,
    questCompletionStats,
    levelHistory,
    streakHistory,
    streakMilestones,
  };
}

// GET /api/progress/xp/weekly
export async function getWeeklyHistory() {
  return api.get('/progress/xp/weekly');
}

// GET /api/progress/xp/monthly
export async function getMonthlyHistory() {
  return api.get('/progress/xp/monthly');
}

// GET /api/progress/domains/top
export async function getTopDomains() {
  return api.get('/progress/domains/top');
}

// GET /api/progress/attributes/growth
export async function getAttributeGrowth() {
  return api.get('/progress/attributes/growth');
}

// GET /api/progress/productivity
export async function getProductiveDays() {
  return api.get('/progress/productivity');
}

// GET /api/progress/completion-stats
export async function getCompletionStats() {
  return api.get('/progress/completion-stats');
}

// GET /api/progress/streak
export async function getStreakHistory() {
  return api.get('/progress/streak');
}

// GET /api/progress/streak/milestones
export async function getStreakMilestones() {
  return api.get('/progress/streak/milestones');
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
