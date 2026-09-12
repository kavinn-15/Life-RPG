// Production achievement service wired to Spring Boot backend.
// Manages achievement progress, unlocked badges, and claiming rewards.

import { api } from './apiClient';
import { CATEGORY_META, ACHIEVEMENT_CATEGORIES } from '../data/achievementData';

// GET /api/achievements
export async function getAchievements() {
  return api.get('/achievements');
}

// GET /api/achievements/:id
export async function getAchievementById(id) {
  return api.get(`/achievements/${id}`);
}

// POST /api/achievements/:id/unlock
export async function simulateUnlock(id) {
  return api.post(`/achievements/${id}/unlock`);
}

// POST /api/achievements/:id/claim
export async function claimAchievement(id) {
  return api.post(`/achievements/${id}/claim`);
}

export { CATEGORY_META, ACHIEVEMENT_CATEGORIES };

export default {
  getAchievements,
  getAchievementById,
  simulateUnlock,
  claimAchievement,
  CATEGORY_META,
  ACHIEVEMENT_CATEGORIES,
};
