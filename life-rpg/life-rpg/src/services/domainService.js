// Production domain service wired to Spring Boot backend.
// Manages life development domains and domain-specific quests/achievements.

import { api } from './apiClient';

// GET /api/domains
export async function getDomains() {
  return api.get('/domains');
}

// GET /api/domains/:id
export async function getDomainById(id) {
  return api.get(`/domains/${id}`);
}

// GET /api/domains/:id/achievements
export async function getDomainAchievements(id) {
  return api.get(`/domains/${id}/achievements`);
}

// GET /api/domains/:id/quests
export async function getDomainQuests(id) {
  return api.get(`/domains/${id}/quests`);
}

// POST /api/domains
export async function createDomain(data) {
  return api.post('/domains', data);
}

export default {
  getDomains,
  getDomainById,
  getDomainAchievements,
  getDomainQuests,
  createDomain,
};
