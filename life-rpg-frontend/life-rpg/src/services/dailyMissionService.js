// Production daily-missions service wired to Spring Boot backend.
// Serves daily mission objectives, progress tracking, and reward claims.

import { api } from './apiClient';

// GET /api/missions/daily
export async function getDailyMissions() {
  return api.get('/missions/daily');
}

// POST /api/missions/daily/:id/claim
export async function claimDailyMission(id) {
  return api.post(`/missions/daily/${id}/claim`);
}

export default { getDailyMissions, claimDailyMission };
