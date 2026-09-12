import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { VAULT_RELICS, RELIC_SLOTS } from '../data/vaultArmoryData';

const CATEGORIES = ['All', 'Artifact', 'Booster', 'Title', 'Legendary'];

export default function VaultArmoryModal({
  isOpen,
  onClose,
  equippedRelics = [],
  onEquipRelic,
  initialTargetSlot = null,
}) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [targetSlot, setTargetSlot] = useState(initialTargetSlot);

  useEffect(() => {
    setTargetSlot(initialTargetSlot);
  }, [initialTargetSlot]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredRelics = useMemo(() => {
    return VAULT_RELICS.filter((r) => {
      const matchSearch =
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.bonus.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase()) ||
        r.slot.toLowerCase().includes(search.toLowerCase());

      const matchCategory =
        category === 'All'
          ? true
          : category === 'Legendary'
          ? r.rarity === 'Legendary'
          : r.category === category;

      const matchSlot = targetSlot ? r.slot === targetSlot : true;

      return matchSearch && matchCategory && matchSlot;
    });
  }, [search, category, targetSlot]);

  const isRelicEquipped = (relic) => {
    return equippedRelics.some(
      (eq) => eq.name === relic.name || eq.slot === relic.slot && eq.name === relic.name
    );
  };

  const getEquippedInSlot = (slotName) => {
    return equippedRelics.find((r) => r.slot === slotName);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="bg-surface-container-lowest rounded-3xl max-w-4xl w-full shadow-2xl border border-primary/20 flex flex-col overflow-hidden max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-surface-container/80 flex items-center justify-between bg-surface-container-low/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-primary-container text-on-primary flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-2xl">inventory_2</span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-extrabold flex items-center gap-2">
                    Vault Armory &amp; Relic Forge
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Equip unlocked relics into your 3 active neural sockets to amplify XP flow.
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex flex-col gap-6">
              {/* Equipped Sockets Bar */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-label-caps text-label-caps text-outline uppercase font-bold tracking-wider">
                    Active Neural Sockets (3 Slots)
                  </span>
                  {targetSlot && (
                    <button
                      onClick={() => setTargetSlot(null)}
                      className="text-label-sm font-label-sm text-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">filter_alt_off</span>
                      Showing {targetSlot} (Show All)
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {RELIC_SLOTS.map((slotName) => {
                    const eq = getEquippedInSlot(slotName);
                    const isTarget = targetSlot === slotName;
                    return (
                      <div
                        key={slotName}
                        onClick={() => setTargetSlot(isTarget ? null : slotName)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                          isTarget
                            ? 'bg-primary-container/10 border-primary ring-2 ring-primary/40'
                            : eq
                            ? 'bg-surface border-surface-container-high hover:border-primary/40'
                            : 'bg-surface/50 border-dashed border-outline/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-label-caps text-[11px] text-outline uppercase font-bold truncate">
                            {slotName}
                          </span>
                          {eq ? (
                            <span className="px-2 py-0.5 rounded-md bg-tertiary-container/30 text-tertiary font-label-caps text-[10px] font-extrabold">
                              SOCKETED
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-surface-container text-outline font-label-caps text-[10px]">
                              EMPTY
                            </span>
                          )}
                        </div>

                        {eq ? (
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-2xl shrink-0">
                              {eq.icon || 'military_tech'}
                            </span>
                            <div className="min-w-0">
                              <h4 className="font-label-md text-label-md text-on-surface font-bold truncate">
                                {eq.name}
                              </h4>
                              <p className="font-body-xs text-body-xs text-tertiary font-bold truncate">
                                {eq.bonus}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <p className="font-body-sm text-body-sm text-outline italic">No relic equipped</p>
                        )}

                        <div className="text-right">
                          <span className="text-[11px] font-label-sm text-primary hover:underline">
                            {isTarget ? 'Filtered' : 'Filter / Swap'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="flex items-center bg-surface-container rounded-full p-1 gap-1 overflow-x-auto w-full sm:w-auto">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-colors cursor-pointer ${
                        category === cat
                          ? 'bg-surface-container-lowest text-on-surface font-bold shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                    search
                  </span>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search 18 relics..."
                    className="w-full bg-surface-container pl-9 pr-4 py-2 rounded-full text-label-md text-on-surface placeholder:text-outline border border-transparent focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Relics Catalog Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredRelics.map((relic) => {
                  const equipped = isRelicEquipped(relic);
                  return (
                    <div
                      key={relic.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                        equipped
                          ? 'bg-surface border-primary/40 ring-1 ring-primary/30'
                          : 'bg-surface border-surface-container-high/60 hover:border-primary/30 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${relic.accentColor}`}
                          >
                            <span className="material-symbols-outlined text-xl">{relic.icon}</span>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-label-lg text-label-lg text-on-surface font-bold truncate">
                                {relic.name}
                              </h4>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-label-caps text-[10px] text-outline uppercase font-semibold">
                                {relic.slot}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-outline/50" />
                              <span
                                className={`font-label-caps text-[10px] font-extrabold ${
                                  relic.rarity === 'Legendary'
                                    ? 'text-primary'
                                    : relic.rarity === 'Epic'
                                    ? 'text-secondary'
                                    : relic.rarity === 'Rare'
                                    ? 'text-tertiary'
                                    : 'text-outline'
                                }`}
                              >
                                {relic.rarity}
                              </span>
                            </div>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-lg bg-surface-container font-label-caps text-[11px] text-tertiary font-black shrink-0">
                          {relic.bonus}
                        </span>
                      </div>

                      <p className="font-body-xs text-body-xs text-on-surface-variant">
                        {relic.description}
                      </p>

                      <div className="pt-2 border-t border-surface-container/60 flex items-center justify-between gap-2">
                        <span className="font-label-caps text-[10px] text-outline uppercase">
                          Socket Affinity: {relic.category}
                        </span>
                        <button
                          type="button"
                          onClick={() => onEquipRelic(relic)}
                          className={`px-4 py-1.5 rounded-full font-label-sm text-label-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            equipped
                              ? 'bg-surface-container text-tertiary border border-tertiary/30 hover:bg-surface-container-high'
                              : 'bg-primary-container text-on-primary shadow-sm hover:translate-y-0.5 active:translate-y-1'
                          }`}
                        >
                          <span className="material-symbols-outlined text-base">
                            {equipped ? 'check_circle' : 'add_circle'}
                          </span>
                          {equipped ? 'Socketed' : 'Equip Relic'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredRelics.length === 0 && (
                <div className="py-12 flex flex-col items-center justify-center text-center gap-2">
                  <span className="material-symbols-outlined text-4xl text-outline">search_off</span>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface">No relics found</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">
                    Try adjusting your search query or removing the slot filter.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-surface-container-low/50 border-t border-surface-container/80 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 text-on-surface-variant font-body-xs text-body-xs">
                <span className="material-symbols-outlined text-tertiary text-base">info</span>
                <span>Active relic modifiers automatically apply to all quest completions.</span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to="/loot-vault"
                  onClick={onClose}
                  className="px-4 py-2 rounded-full bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">storefront</span>
                  Forge in Loot Vault
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-full bg-primary-container text-on-primary font-label-md text-label-md font-bold shadow-sm hover:translate-y-0.5 transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
