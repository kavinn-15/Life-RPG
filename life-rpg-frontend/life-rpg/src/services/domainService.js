// Production domain service wired to Spring Boot backend with fallback data.
// Manages life development domains and domain-specific quests/achievements.

import { api } from './apiClient';
import { domains as mockDomains } from '../data/domainData';

// GET /api/domains
export async function getDomains() {
  try {
    const res = await api.get('/domains');
    if (res && Array.isArray(res) && res.length > 0) return res;
  } catch (err) {
    console.warn('API getDomains failed, using mock data:', err);
  }
  return mockDomains;
}

// GET /api/domains/:id
export async function getDomainById(id) {
  try {
    const res = await api.get(`/domains/${id}`);
    if (res) return res;
  } catch (err) {
    console.warn(`API getDomainById(${id}) failed:`, err);
  }
  return mockDomains.find((d) => d.id === id) || null;
}

// GET /api/domains/:id/achievements
export async function getDomainAchievements(id) {
  try {
    return await api.get(`/domains/${id}/achievements`);
  } catch {
    return [];
  }
}

// GET /api/domains/:id/quests
export async function getDomainQuests(id) {
  try {
    return await api.get(`/domains/${id}/quests`);
  } catch {
    const domain = mockDomains.find((d) => d.id === id);
    return domain?.quests || [];
  }
}

export default {
  getDomains,
  getDomainById,
  getDomainAchievements,
  getDomainQuests,
};
