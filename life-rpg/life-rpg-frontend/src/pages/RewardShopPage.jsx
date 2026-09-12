import { useEffect, useMemo, useState } from 'react';
import { useGame } from '../state/GameContext';
import * as rewardService from '../services/rewardService';
import { REWARD_CATEGORY_META, REWARD_CATEGORIES, getRewardCategoryMeta } from '../data/rewardData';
import { Chip } from '../components/Chip';

const CATEGORY_TABS = [{ key: 'All', label: 'All' }, ...REWARD_CATEGORIES.map((c) => ({ key: c, label: c }))];

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-gutter">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm flex flex-col gap-3">
          <div className="w-12 h-12 rounded-2xl bg-surface-container animate-pulse" />
          <div className="h-3.5 w-3/4 rounded-full bg-surface-container animate-pulse" />
          <div className="h-3 w-full rounded-full bg-surface-container animate-pulse" />
          <div className="h-8 w-full rounded-full bg-surface-container animate-pulse mt-2" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ categoryTab }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-12 shadow-sm flex flex-col items-center text-center gap-2">
      <span className="material-symbols-outlined text-4xl text-outline">redeem</span>
      <h3 className="font-headline-sm text-headline-sm text-on-surface">The vault is bare</h3>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
        No {categoryTab === 'All' ? 'items' : categoryTab.toLowerCase() + ' items'} have been stocked in this wing
        of the Loot Vault yet.
      </p>
    </div>
  );
}

function RewardCard({ item, gold, onPurchase, pending }) {
  const meta = getRewardCategoryMeta(item?.category);
  const canAfford = gold >= item.price;

  let buttonLabel = 'Purchase';
  let buttonDisabled = false;
  let buttonClass = 'bg-primary-container text-on-primary hover:translate-y-0.5';

  if (item.owned) {
    buttonLabel = 'Owned';
    buttonDisabled = true;
    buttonClass = 'bg-surface-container text-on-surface-variant';
  } else if (!canAfford) {
    buttonLabel = 'Not Enough Gold';
    buttonDisabled = true;
    buttonClass = 'bg-surface-container text-outline';
  } else if (pending) {
    buttonLabel = 'Purchasing...';
    buttonDisabled = true;
    buttonClass = 'bg-primary-container text-on-primary opacity-70';
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${meta.accentClass}`}>
          <span className="material-symbols-outlined fill text-xl">{item.icon}</span>
        </div>
        <Chip className={meta.chipClass}>{item.category}</Chip>
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-label-lg text-label-lg text-on-surface">{item.name}</span>
        <p className="font-body-sm text-body-sm text-on-surface-variant">{item.description}</p>
      </div>
      <div className="flex items-center justify-between mt-auto pt-1">
        <span className="flex items-center gap-1 font-stat-counter text-base text-secondary font-extrabold">
          <span className="material-symbols-outlined fill text-lg">paid</span>
          {item.price.toLocaleString()}
        </span>
        <button
          onClick={() => onPurchase(item)}
          disabled={buttonDisabled}
          className={`px-4 py-2 rounded-full font-label-md text-label-md shadow-sm transition-all flex items-center gap-1.5 shrink-0 ${buttonClass} ${
            buttonDisabled ? 'cursor-not-allowed' : 'active:translate-y-1'
          }`}
        >
          {item.owned && <span className="material-symbols-outlined text-base">check_circle</span>}
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

export default function RewardShopPage() {
  const { state, spendGold, pushToast } = useGame();
  const [loading, setLoading] = useState(true);
  const [rewards, setRewards] = useState([]);
  const [categoryTab, setCategoryTab] = useState('All');
  const [pendingId, setPendingId] = useState(null);
  const [goldPulse, setGoldPulse] = useState(false);

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

  const filtered = useMemo(
    () => (categoryTab === 'All' ? rewards : rewards.filter((r) => r.category === categoryTab)),
    [rewards, categoryTab]
  );

  const ownedCount = rewards.filter((r) => r.owned).length;

  const handlePurchase = async (item) => {
    if (item.owned || state.gold < item.price || pendingId) return;
    setPendingId(item.id);
    try {
      const updated = await rewardService.purchaseReward(item.id);
      setRewards((prev) => prev.map((r) => (r.id === item.id ? updated : r)));
      spendGold(item.price);
      setGoldPulse(true);
      setTimeout(() => setGoldPulse(false), 550);
      pushToast(`Purchased ${item.name}!`, 'redeem');
    } catch (err) {
      pushToast(err.message ?? 'Purchase failed', 'error');
    } finally {
      setPendingId(null);
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider bg-surface-variant px-3 py-1 rounded-full">
              The Loot Vault
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined fill text-primary text-2xl">redeem</span>
            Reward Shop
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-0.5 max-w-xl">
            Spend Gold earned from quests on themes, titles, frames, and boosts. Everything you buy is yours to
            equip from the Inventory.
          </p>
        </div>
        <div className="flex items-center gap-6 shrink-0">
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm px-5 py-3 flex items-center gap-3">
            <span className="material-symbols-outlined fill text-secondary text-3xl">paid</span>
            <div className="flex flex-col leading-tight">
              <span
                className={`font-stat-counter text-stat-counter text-secondary ${goldPulse ? 'animate-gold-deduct' : ''}`}
              >
                {state.gold.toLocaleString()}
              </span>
              <span className="font-label-caps text-label-caps text-outline uppercase">Gold Available</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined fill text-tertiary-container text-2xl">inventory_2</span>
            <div className="flex flex-col leading-tight">
              <span className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                {ownedCount} / {rewards.length || '—'}
              </span>
              <span className="font-label-caps text-label-caps text-outline uppercase">Items Owned</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex bg-surface-container rounded-full p-1 gap-1 w-fit overflow-x-auto mb-6">
        {CATEGORY_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setCategoryTab(t.key)}
            className={[
              'px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors',
              categoryTab === t.key
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
        <EmptyState categoryTab={categoryTab} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-gutter">
          {filtered.map((item) => (
            <RewardCard
              key={item.id}
              item={item}
              gold={state.gold}
              onPurchase={handlePurchase}
              pending={pendingId === item.id}
            />
          ))}
        </div>
      )}
    </>
  );
}
