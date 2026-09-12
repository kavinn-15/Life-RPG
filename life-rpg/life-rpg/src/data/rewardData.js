// Mock reward/loot-vault data for Alex, backing rewardService.
// Prices are denominated in Gold, matching the currency already tracked on
// GameContext state and spent/earned throughout quest completion.
//
// `category` groups follow the same three-family accent token system used in
// domainData.js / achievementData.js so shop tabs and item badges drop
// straight into className props.

import midnightAuroraImg from '../assets/item-midnight-aurora.png';
import gildedFrameImg from '../assets/item-gilded-frame.png';
import noviceVanguardImg from '../assets/item-novice-vanguard.png';
import bronzeBadgeImg from '../assets/item-bronze-badge.png';
import laurelWreathImg from '../assets/item-laurel-wreath.png';

export const REWARD_CATEGORY_META = {
  Theme: {
    icon: 'palette',
    accentClass: 'bg-primary-container text-on-primary',
    chipClass: 'text-primary bg-primary-fixed',
  },
  'Avatar Frame': {
    icon: 'frame_inspect',
    accentClass: 'bg-secondary-container text-on-secondary',
    chipClass: 'text-secondary bg-secondary-fixed',
  },
  Title: {
    icon: 'military_tech',
    accentClass: 'bg-tertiary-container text-on-tertiary',
    chipClass: 'text-tertiary bg-tertiary-fixed',
  },
  Badge: {
    icon: 'workspace_premium',
    accentClass: 'bg-primary-container text-on-primary',
    chipClass: 'text-primary bg-primary-fixed',
  },
  'Profile Decoration': {
    icon: 'auto_awesome',
    accentClass: 'bg-secondary-container text-on-secondary',
    chipClass: 'text-secondary bg-secondary-fixed',
  },
  'XP Boost': {
    icon: 'bolt',
    accentClass: 'bg-tertiary-container text-on-tertiary',
    chipClass: 'text-tertiary bg-tertiary-fixed',
  },
  Cosmetic: {
    icon: 'diamond',
    accentClass: 'bg-primary-container text-on-primary',
    chipClass: 'text-primary bg-primary-fixed',
  },
};

export const REWARD_CATEGORIES = Object.keys(REWARD_CATEGORY_META);

export function getRewardCategoryMeta(category) {
  if (!category) return REWARD_CATEGORY_META.Theme;
  const str = String(category);
  if (REWARD_CATEGORY_META[str]) return REWARD_CATEGORY_META[str];
  const normalized = str.toLowerCase().replace(/[\s_-]+/g, '');
  for (const [k, v] of Object.entries(REWARD_CATEGORY_META)) {
    if (k.toLowerCase().replace(/[\s_-]+/g, '') === normalized) {
      return v;
    }
  }
  return REWARD_CATEGORY_META.Theme;
}

export const rewards = [
  // --- Themes ---
  {
    id: 'theme-midnight-aurora',
    name: 'Midnight Aurora Theme',
    description: 'A deep-indigo interface skin with a slow aurora shimmer.',
    icon: 'palette',
    category: 'Theme',
    price: 450,
    owned: true,
    image: midnightAuroraImg,
  },
  {
    id: 'theme-sunfire-dawn',
    name: 'Sunfire Dawn Theme',
    description: 'Warm amber gradients across every panel.',
    icon: 'palette',
    category: 'Theme',
    price: 450,
    owned: false,
  },
  {
    id: 'theme-forest-grove',
    name: 'Forest Grove Theme',
    description: 'A calm, mossy green skin for long focus sessions.',
    icon: 'palette',
    category: 'Theme',
    price: 400,
    owned: false,
  },

  // --- Avatar Frames ---
  {
    id: 'frame-gilded',
    name: 'Gilded Avatar Frame',
    description: 'A polished gold border for your character portrait.',
    icon: 'frame_inspect',
    category: 'Avatar Frame',
    price: 250,
    owned: true,
    image: gildedFrameImg,
  },
  {
    id: 'frame-obsidian',
    name: 'Obsidian Frame',
    description: 'Sleek matte-black frame with a faint violet edge glow.',
    icon: 'frame_inspect',
    category: 'Avatar Frame',
    price: 300,
    owned: false,
  },
  {
    id: 'frame-celestial-halo',
    name: 'Celestial Halo Frame',
    description: 'A slow-rotating ring of stars around your portrait.',
    icon: 'frame_inspect',
    category: 'Avatar Frame',
    price: 650,
    owned: false,
  },

  // --- Titles ---
  {
    id: 'title-novice-vanguard',
    name: 'The Novice Vanguard',
    description: 'Equipable title. +5% XP on Early Quests.',
    icon: 'military_tech',
    category: 'Title',
    price: 350,
    owned: true,
    image: noviceVanguardImg,
  },
  {
    id: 'title-technomancer',
    name: 'The Technomancer',
    description: 'Equipable title. +8% XP on Programming quests.',
    icon: 'code',
    category: 'Title',
    price: 750,
    owned: false,
  },
  {
    id: 'title-iron-sentinel',
    name: 'The Iron Sentinel',
    description: 'Equipable title. +8% XP on Fitness quests.',
    icon: 'shield',
    category: 'Title',
    price: 750,
    owned: false,
  },
  {
    id: 'title-archmage-discipline',
    name: 'Archmage of Discipline',
    description: 'Equipable title. +10% XP on Streak days.',
    icon: 'auto_stories',
    category: 'Title',
    price: 900,
    owned: false,
  },

  // --- Badges ---
  {
    id: 'badge-bronze-completionist',
    name: 'Bronze Completionist Badge',
    description: 'Displayed on your profile next to your name.',
    icon: 'workspace_premium',
    category: 'Badge',
    price: 200,
    owned: true,
    image: bronzeBadgeImg,
  },
  {
    id: 'badge-streak-sentinel',
    name: 'Streak Sentinel Badge',
    description: 'A flame-rimmed badge for the streak-obsessed.',
    icon: 'local_fire_department',
    category: 'Badge',
    price: 300,
    owned: false,
  },
  {
    id: 'badge-domain-master',
    name: 'Domain Master Badge',
    description: 'Shows off deep investment across every domain.',
    icon: 'public',
    category: 'Badge',
    price: 550,
    owned: false,
  },

  // --- Profile Decorations ---
  {
    id: 'decoration-flame-aura',
    name: 'Animated Flame Aura',
    description: 'A subtle animated flame behind your portrait.',
    icon: 'auto_awesome',
    category: 'Profile Decoration',
    price: 500,
    owned: false,
  },
  {
    id: 'decoration-starfield',
    name: 'Starfield Backdrop',
    description: 'A slow-drifting starfield behind your profile card.',
    icon: 'auto_awesome',
    category: 'Profile Decoration',
    price: 500,
    owned: false,
  },
  {
    id: 'decoration-laurel-wreath',
    name: 'Laurel Wreath Border',
    description: 'A classic laurel wreath framing your profile card.',
    icon: 'auto_awesome',
    category: 'Profile Decoration',
    price: 400,
    owned: true,
    image: laurelWreathImg,
  },

  // --- XP Boost effects ---
  {
    id: 'boost-double-xp',
    name: '24hr Double XP Charm',
    description: 'Doubles all XP earned for the next 24 hours.',
    icon: 'bolt',
    category: 'XP Boost',
    price: 500,
    owned: false,
  },
  {
    id: 'boost-weekend-surge',
    name: 'Weekend XP Surge',
    description: '+50% XP on all quests completed over the weekend.',
    icon: 'bolt',
    category: 'XP Boost',
    price: 350,
    owned: false,
  },
  {
    id: 'boost-attribute-elixir',
    name: 'Attribute Focus Elixir',
    description: '+30% XP toward a single attribute of your choice for 24h.',
    icon: 'bolt',
    category: 'XP Boost',
    price: 300,
    owned: false,
  },

  // --- Cosmetics ---
  {
    id: 'cosmetic-chromatic-nameplate',
    name: 'Chromatic Nameplate',
    description: 'Your display name shifts through a slow color gradient.',
    icon: 'diamond',
    category: 'Cosmetic',
    price: 600,
    owned: false,
  },
  {
    id: 'cosmetic-holographic-card',
    name: 'Holographic Card Skin',
    description: 'A shimmering holo-foil finish for your character card.',
    icon: 'diamond',
    category: 'Cosmetic',
    price: 700,
    owned: false,
  },
  {
    id: 'cosmetic-pixel-pet',
    name: 'Pixel Companion Pet',
    description: 'A tiny pixel-art companion that follows your cursor.',
    icon: 'diamond',
    category: 'Cosmetic',
    price: 850,
    owned: false,
  },
];
