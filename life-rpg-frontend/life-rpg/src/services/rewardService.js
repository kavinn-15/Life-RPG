// Production reward and inventory service wired to Spring Boot backend.
// Manages shop catalog, gold-based purchases, and equipped inventory items.

import { api } from './apiClient';
import { REWARD_CATEGORY_META, REWARD_CATEGORIES } from '../data/rewardData';

// GET /api/rewards
export async function getRewards() {
  return api.get('/rewards');
}

// GET /api/rewards/:id
export async function getRewardById(id) {
  return api.get(`/rewards/${id}`);
}

// POST /api/rewards/:id/purchase
export async function purchaseReward(id) {
  return api.post(`/rewards/${id}/purchase`);
}

// GET /api/inventory
export async function getInventory() {
  return api.get('/inventory');
}

// POST /api/inventory/:id/equip
export async function equipItem(id) {
  return api.post(`/inventory/${id}/equip`);
}

// POST /api/inventory/:id/unequip
export async function unequipItem(id) {
  return api.post(`/inventory/${id}/unequip`);
}

export { REWARD_CATEGORY_META, REWARD_CATEGORIES };

export default {
  getRewards,
  getRewardById,
  purchaseReward,
  getInventory,
  equipItem,
  unequipItem,
  REWARD_CATEGORY_META,
  REWARD_CATEGORIES,
};
