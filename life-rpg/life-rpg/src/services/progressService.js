// Production progress service wired to Spring Boot backend.
// Manages analytics, XP charts, heatmap activity, and streak records.

import { api } from './apiClient';

// GET /api/progress/history
export async function getProgressHistory() {
  return api.get('/progress/history');
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
