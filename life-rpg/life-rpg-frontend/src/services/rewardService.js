// Production reward and inventory service wired to Spring Boot backend.
// Manages shop catalog, gold-based purchases, and equipped inventory items.

import { api } from './apiClient';
import { REWARD_CATEGORY_META, REWARD_CATEGORIES, rewards as defaultRewards } from '../data/rewardData';

// Map for quick lookup of reward item images & metadata
const rewardMap = new Map(defaultRewards.map((r) => [r.id, r]));

function enrichReward(item) {
  if (!item) return item;
  const local = rewardMap.get(item.id);
  return {
    ...item,
    image: item.image || local?.image,
    category: item.category || local?.category || 'Cosmetic',
    icon: item.icon || local?.icon || 'diamond',
  };
}

// GET /api/rewards
export async function getRewards() {
  try {
    const data = await api.get('/rewards');
    if (Array.isArray(data) && data.length > 0) {
      return data.map(enrichReward);
    }
    return defaultRewards;
  } catch (err) {
    console.warn('Backend rewards fetch failed, using local rewards catalog', err);
    return defaultRewards;
  }
}

// GET /api/rewards/:id
export async function getRewardById(id) {
  try {
    const item = await api.get(`/rewards/${id}`);
    return enrichReward(item);
  } catch {
    return enrichReward(rewardMap.get(id));
  }
}

// POST /api/rewards/:id/purchase
export async function purchaseReward(id) {
  return api.post(`/rewards/${id}/purchase`);
}

// GET /api/inventory
export async function getInventory() {
  try {
    const data = await api.get('/inventory');
    if (Array.isArray(data) && data.length > 0) {
      return data.map(enrichReward);
    }
    return defaultRewards.filter((r) => r.owned);
  } catch {
    return defaultRewards.filter((r) => r.owned);
  }
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
