import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../state/GameContext';
import * as rewardService from '../services/rewardService';
import { REWARD_CATEGORY_META, getRewardCategoryMeta } from '../data/rewardData';
import { Chip } from '../components/Chip';

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

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-gutter">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm flex flex-col gap-3">
          <div className="w-12 h-12 rounded-2xl bg-surface-container animate-pulse" />
          <div className="h-3.5 w-3/4 rounded-full bg-surface-container animate-pulse" />
          <div className="h-3 w-full rounded-full bg-surface-container animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-12 shadow-sm flex flex-col items-center text-center gap-2">
      <span className="material-symbols-outlined text-4xl text-outline">inventory_2</span>
      <h3 className="font-headline-sm text-headline-sm text-on-surface">Your pack is empty</h3>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
        No unlocked loot yet. Visit the Loot Vault to spend your earned gold on themes, badges, and titles.
      </p>
      <Link
        to="/loot-vault"
        className="mt-1 px-5 py-2.5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md shadow-sm hover:translate-y-0.5 transition-all flex items-center gap-1.5"
      >
        <span className="material-symbols-outlined text-base">redeem</span>
        Open Loot Vault
      </Link>
    </div>
  );
}

function InventoryCard({ item, equipped, onToggle }) {
  const meta = getRewardCategoryMeta(item?.category);

  return (
    <div
      className={[
        'rounded-2xl p-5 shadow-sm flex flex-col gap-3 transition-all',
        equipped ? 'bg-surface-container-lowest ring-2 ring-primary/40' : 'bg-surface-container-lowest',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-2">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${meta.accentClass}`}>
          <span className="material-symbols-outlined fill text-xl">{item.icon}</span>
        </div>
        {equipped ? (
          <Chip className="text-tertiary bg-tertiary-fixed">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            Equipped
          </Chip>
        ) : (
          <Chip className={meta.chipClass}>{item.category}</Chip>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-label-lg text-label-lg text-on-surface">{item.name}</span>
        <p className="font-body-sm text-body-sm text-on-surface-variant">{item.description}</p>
      </div>
      <button
        onClick={() => onToggle(item)}
        className={[
          'mt-auto w-full py-2.5 rounded-full font-label-md text-label-md shadow-sm transition-all flex items-center justify-center gap-1.5',
          equipped
            ? 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            : 'bg-primary-container text-on-primary hover:translate-y-0.5 active:translate-y-1',
        ].join(' ')}
      >
        <span className="material-symbols-outlined text-base">{equipped ? 'remove_circle' : 'add_circle'}</span>
        {equipped ? 'Unequip' : 'Equip'}
      </button>
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
    <>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider bg-surface-variant px-3 py-1 rounded-full">
              Your Backpack
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined fill text-primary text-2xl">backpack</span>
            Inventory
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-0.5 max-w-xl">
            Everything you've claimed from the Loot Vault lives here. Equip a look and it carries across the app.
          </p>
        </div>
        <div className="flex items-center gap-6 shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined fill text-tertiary-container text-2xl">inventory_2</span>
            <div className="flex flex-col leading-tight">
              <span className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                {owned.length}
              </span>
              <span className="font-label-caps text-label-caps text-outline uppercase">Items Owned</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined fill text-secondary-container text-2xl">check_circle</span>
            <div className="flex flex-col leading-tight">
              <span className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                {equippedCount}
              </span>
              <span className="font-label-caps text-label-caps text-outline uppercase">Equipped</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex bg-surface-container rounded-full p-1 gap-1 w-fit overflow-x-auto mb-6">
        {CATEGORY_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={[
              'px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors',
              tab === t.key
                ? 'bg-surface-container-lowest text-on-surface shadow-sm font-bold'
                : 'text-on-surface-variant hover:text-on-surface',
            ].join(' ')}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <SkeletonGrid />
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-gutter">
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
    </>
  );
}
