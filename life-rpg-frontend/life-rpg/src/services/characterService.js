// Production character service wired to Spring Boot backend.
// Reads/writes character profile, attributes, relics, proof-of-work, and radar axes.

import { api } from './apiClient';
import { xpForLevel } from '../data/characterData';

// GET /api/character
export async function getCharacter() {
  return api.get('/character');
}

// PATCH /api/character
export async function updateCharacter(data) {
  return api.patch('/character', data);
}

// GET /api/character/attributes
export async function getAttributes() {
  return api.get('/character/attributes');
}

// PATCH /api/character/attributes/:key
export async function updateAttribute(key, data) {
  return api.patch(`/character/attributes/${key}`, data);
}

// GET /api/character/relics
export async function getRelics() {
  return api.get('/character/relics');
}

// GET /api/character/proof-of-work
export async function getProofOfWork() {
  return api.get('/character/proof-of-work');
}

// GET /api/character/milestone
export async function getNextMilestone() {
  return api.get('/character/milestone');
}

// GET /api/character/radar-axes
export async function getRadarAxes() {
  return api.get('/character/radar-axes');
}

export { xpForLevel };

export default {
  getCharacter,
  updateCharacter,
  getAttributes,
  updateAttribute,
  getRelics,
  getProofOfWork,
  getNextMilestone,
  getRadarAxes,
  xpForLevel,
};
