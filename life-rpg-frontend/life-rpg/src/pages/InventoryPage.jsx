import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../state/GameContext';
import * as rewardService from '../services/rewardService';
import { REWARD_CATEGORY_META, getRewardCategoryMeta } from '../data/rewardData';
import inventoryHeroBanner from '../assets/inventory-hero-banner.png';

const CATEGORY_TABS = [
  { key: 'All', label: 'All Items' },
  { key: 'Theme', label: 'Themes' },
  { key: 'Avatar Frame', label: 'Frames' },
  { key: 'Title', label: 'Titles' },
  { key: 'Badge', label: 'Badges' },
  { key: 'Profile Decoration', label: 'Decorations' },
  { key: 'XP Boost', label: 'Boosts' },
  { key: 'Cosmetic', label: 'Cosmetics' },
];

const CATEGORY_BADGE_STYLES = {
  Badge: 'bg-[#ede9fe] text-[#6366f1] border border-[#ddd6fe]',
  'Profile Decoration': 'bg-[#fef3c7] text-[#d97706] border border-[#fde68a]',
  'Avatar Frame': 'bg-[#ffedd5] text-[#ea580c] border border-[#fed7aa]',
  Theme: 'bg-[#ede9fe] text-[#6366f1] border border-[#ddd6fe]',
  Title: 'bg-[#dcfce7] text-[#16a34a] border border-[#bbf7d0]',
  'XP Boost': 'bg-[#e0e7ff] text-[#4f46e5] border border-[#c7d2fe]',
  Cosmetic: 'bg-[#fce7f3] text-[#db2777] border border-[#fbcfe8]',
};

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-4 animate-pulse">
          <div className="flex items-start justify-between">
            <div className="w-20 h-20 rounded-2xl bg-slate-200" />
            <div className="w-16 h-6 rounded-full bg-slate-200" />
          </div>
          <div className="h-4 w-3/4 rounded-full bg-slate-200" />
          <div className="h-3 w-full rounded-full bg-slate-100" />
          <div className="h-10 w-full rounded-full bg-slate-200 mt-4" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ tab }) {
  return (
    <div className="bg-white rounded-3xl p-12 shadow-sm border border-slate-100 flex flex-col items-center text-center gap-3 my-4">
      <div className="w-16 h-16 rounded-full bg-purple-50 text-primary flex items-center justify-center">
        <span className="material-symbols-outlined text-3xl">inventory_2</span>
      </div>
      <h3 className="text-xl font-extrabold text-slate-900">
        {tab === 'All' ? 'Your backpack is currently empty' : `No ${tab} items in your pack`}
      </h3>
      <p className="text-sm text-slate-500 max-w-md">
        Unlock premium themes, frames, badges, and titles in the Loot Vault using your hard-earned gold.
      </p>
      <Link
        to="/loot-vault"
        className="mt-3 px-6 py-2.5 rounded-full bg-[#5046e5] text-white font-bold text-sm shadow-md hover:bg-[#4338ca] hover:shadow-lg transition-all flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-base">redeem</span>
        Browse Loot Vault
      </Link>
    </div>
  );
}

function InventoryCard({ item, equipped, onToggle }) {
  const badgeStyle = CATEGORY_BADGE_STYLES[item?.category] || 'bg-[#ede9fe] text-[#6366f1] border border-[#ddd6fe]';
  const meta = getRewardCategoryMeta(item?.category);

  return (
    <div
      className={[
        'bg-white rounded-2xl p-5 border shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group',
        equipped ? 'border-[#5046e5]/40 ring-2 ring-[#5046e5]/20 bg-[#fcfcff]' : 'border-[#e8e7f2]',
      ].join(' ')}
    >
      <div>
        {/* Card Header: Icon/Image & Category Pill */}
        <div className="flex items-start justify-between gap-3">
          <div className="w-20 h-20 rounded-2xl bg-[#faf9fe] border border-slate-100/80 p-1 flex items-center justify-center shrink-0 shadow-inner overflow-hidden">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className={`w-full h-full rounded-xl flex items-center justify-center ${meta.accentClass}`}>
                <span className="material-symbols-outlined text-3xl">{item.icon || 'diamond'}</span>
              </div>
            )}
          </div>

          <span className={`text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap ${badgeStyle}`}>
            {item.category}
          </span>
        </div>

        {/* Card Details */}
        <div className="mt-4 mb-2">
          <h3 className="font-bold text-base text-slate-900 tracking-tight leading-snug group-hover:text-[#5046e5] transition-colors line-clamp-1">
            {item.name}
          </h3>
          <p className="text-xs text-slate-500 font-normal leading-relaxed mt-1 min-h-[36px] line-clamp-2">
            {item.description}
          </p>
        </div>
      </div>

      {/* Action Button: Equip / Equipped */}
      <div className="pt-3">
        <button
          onClick={() => onToggle(item)}
          className={[
            'w-full py-2.5 px-4 rounded-full font-bold text-sm shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer',
            equipped
              ? 'bg-[#10b981] hover:bg-[#059669] text-white shadow-[#10b981]/25 hover:shadow-lg'
              : 'bg-[#5046e5] hover:bg-[#4338ca] text-white shadow-[#5046e5]/25 hover:shadow-lg',
          ].join(' ')}
        >
          <span className="material-symbols-outlined text-lg">
            {equipped ? 'check_circle' : 'add_circle'}
          </span>
          {equipped ? 'Equipped' : 'Equip'}
        </button>
      </div>
    </div>
  );
}

export default function InventoryPage() {
  const { equippedItems, toggleEquip } = useGame();
  const [loading, setLoading] = useState(true);
  const [rewards, setRewards] = useState([]);
  const [tab, setTab] = useState('All');

  useEffect(() => {
    let cancelled = false;
    rewardService.getRewards().then((data) => {
      if (cancelled) return;
      setRewards(data);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const owned = useMemo(() => (Array.isArray(rewards) ? rewards.filter((r) => r?.owned) : []), [rewards]);

  const filtered = useMemo(() => {
    if (tab === 'All') return owned;
    const tabNorm = tab.toLowerCase().replace(/[\s_-]+/g, '');
    return owned.filter((r) => String(r?.category || '').toLowerCase().replace(/[\s_-]+/g, '') === tabNorm);
  }, [owned, tab]);

  const equippedCount = Object.keys(equippedItems || {}).length;

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto pb-12">
      {/* Top Hero Banner Section */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-[#e4e2f5] shadow-sm bg-gradient-to-r from-[#ebe8fb] via-[#e5e1fa] to-[#dcd8f6] min-h-[220px] lg:min-h-[240px] flex items-center p-6 sm:p-8 lg:p-10">
        {/* Background Panoramic Landscape Artwork */}
        <div
          className="absolute inset-0 bg-cover bg-right sm:bg-center opacity-90 pointer-events-none"
          style={{
            backgroundImage: `url(${inventoryHeroBanner})`,
            backgroundPosition: 'right 20% center',
            backgroundSize: 'cover',
          }}
        />

        {/* Soft gradient wash to ensure text readability on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#eceafb]/95 via-[#eceafb]/75 to-transparent pointer-events-none" />

        {/* Hero Content Grid */}
        <div className="relative z-10 w-full flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Text Column */}
          <div className="flex flex-col max-w-xl">
            <div className="inline-flex items-center mb-2.5">
              <span className="bg-[#ede9fe] text-[#5046e5] text-[11px] font-bold tracking-wider px-3.5 py-1 rounded-full uppercase border border-[#ddd6fe]/60 shadow-sm">
                YOUR BACKPACK
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span className="text-[#5046e5]">🎒</span>
              Inventory
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed mt-2 max-w-md">
              Everything you've claimed from the Loot Vault lives here. Equip a look and it carries across the app.
            </p>
          </div>

          {/* Center Handwritten Script Slogan (Visible on Large Screens) */}
          <div className="hidden xl:flex flex-col items-start justify-center pr-12 select-none pointer-events-none">
            <span className="font-['Caveat',cursive] text-2xl lg:text-3xl text-[#4f46e5] font-bold leading-tight drop-shadow-sm -rotate-2">
              Collect
            </span>
            <span className="font-['Caveat',cursive] text-2xl lg:text-3xl text-[#4f46e5] font-bold leading-tight drop-shadow-sm -rotate-1 pl-2">
              Equip
            </span>
            <span className="font-['Caveat',cursive] text-2xl lg:text-3xl text-[#4f46e5] font-bold leading-tight drop-shadow-sm rotate-1 pl-4">
              Express
            </span>
            <span className="font-['Caveat',cursive] text-2xl lg:text-3xl text-[#4f46e5] font-bold leading-tight drop-shadow-sm rotate-2 pl-6">
              Progress
            </span>
          </div>

          {/* Right Stats Box Widget */}
          <div className="shrink-0 self-start lg:self-center">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl px-5 py-4 sm:px-6 sm:py-5 shadow-sm border border-slate-200/90 flex items-center gap-6 sm:gap-8">
              {/* Items Owned Stat */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl fill">inventory_2</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-slate-900 leading-none">
                    {owned.length}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                    ITEMS OWNED
                  </span>
                </div>
              </div>

              <div className="w-px h-8 bg-slate-200" />

              {/* Equipped Stat */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl fill">check_circle</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-slate-900 leading-none">
                    {equippedCount}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                    EQUIPPED
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pill Bar */}
      <div className="flex items-center bg-[#f1f0fb] rounded-full p-1 gap-1 w-fit max-w-full overflow-x-auto border border-[#e4e2f5] shadow-sm">
        {CATEGORY_TABS.map((t) => {
          const isActive = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={[
                'px-4 sm:px-5 py-2 rounded-full font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer',
                isActive
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/50',
              ].join(' ')}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Inventory Item Cards Grid */}
      {loading ? (
        <SkeletonGrid />
      ) : filtered.length === 0 ? (
        <EmptyState tab={tab} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <InventoryCard
              key={item.id}
              item={item}
              equipped={equippedItems[item.category] === item.id}
              onToggle={toggleEquip}
            />
          ))}
        </div>
      )}
    </div>
  );
}
