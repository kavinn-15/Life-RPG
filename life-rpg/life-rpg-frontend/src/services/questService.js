// Production quest service wired to Spring Boot backend.
// Manages quests, active queue, dailies, milestones, leaderboard, and completions.

import { api } from './apiClient';

// GET /api/quests
export async function getQuests() {
  return api.get('/quests');
}

// GET /api/quests/featured
export async function getFeaturedQuest() {
  return api.get('/quests/featured');
}

// GET /api/quests?section=continue
export async function getContinueQuests() {
  return api.get('/quests?section=continue');
}

// GET /api/quests?section=recommended
export async function getRecommendedQuests() {
  return api.get('/quests?section=recommended');
}

// GET /api/quests/daily
export async function getDailyQuests() {
  return api.get('/quests/daily');
}

// PATCH /api/quests/daily/:id
export async function toggleDailyQuest(id) {
  return api.patch(`/quests/daily/${id}`);
}

// GET /api/quests/active
export async function getActiveQuests() {
  return api.get('/quests/active');
}

// GET /api/leaderboard
export async function getLeaderboard() {
  return api.get('/leaderboard');
}

// GET /api/quests/:id
export async function getQuestById(id) {
  return api.get(`/quests/${id}`);
}

// POST /api/quests
export async function createQuest(data) {
  return api.post('/quests', data);
}

// PATCH /api/quests/:id
export async function updateQuest(id, data) {
  return api.patch(`/quests/${id}`, data);
}

// DELETE /api/quests/:id
export async function deleteQuest(id) {
  return api.delete(`/quests/${id}`);
}

// POST /api/quests/:id/complete
export async function completeQuest(id) {
  return api.post(`/quests/${id}/complete`);
}

// PATCH /api/quests/:questId/milestones/:milestoneId
export async function toggleMilestone(questId, milestoneId) {
  return api.patch(`/quests/${questId}/milestones/${milestoneId}`);
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
};
