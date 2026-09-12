import { useEffect, useState } from 'react';
import { useGame } from '../state/GameContext';
import * as characterService from '../services/characterService';
import CharacterHeader from '../components/CharacterHeader';
import XPContinuumPanel from '../components/XPContinuumPanel';
import AttributeCard from '../components/AttributeCard';
import RadarChart from '../components/RadarChart';
import VaultArmoryModal from '../components/VaultArmoryModal';
import { VAULT_RELICS, RELIC_SLOTS } from '../data/vaultArmoryData';

const TABS = ['Overview', 'Attributes Matrix', 'Achievements & Medals', 'Inventory & Relics'];

function OverviewLoading() {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-16 shadow-sm flex flex-col items-center text-center gap-3">
      <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
      <p className="font-body-md text-body-md text-on-surface-variant">Loading character sheet...</p>
    </div>
  );
}

export default function CharacterPage() {
  const [tab, setTab] = useState('Overview');
  const { state, pushToast } = useGame();

  const [loading, setLoading] = useState(true);
  const [equippedRelics, setEquippedRelics] = useState([]);
  const [proofOfWorkFeed, setProofOfWorkFeed] = useState([]);
  const [nextMilestone, setNextMilestone] = useState(null);
  const [radarAxes, setRadarAxes] = useState([]);
  const [vaultModalOpen, setVaultModalOpen] = useState(false);
  const [targetRelicSlot, setTargetRelicSlot] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      characterService.getRelics().catch(() => []),
      characterService.getProofOfWork().catch(() => []),
      characterService.getNextMilestone().catch(() => null),
      characterService.getRadarAxes().catch(() => []),
    ]).then(([relics, proofOfWork, milestone, axes]) => {
      if (cancelled) return;
      setEquippedRelics(relics || []);
      setProofOfWorkFeed(proofOfWork || []);
      setNextMilestone(milestone);
      setRadarAxes(axes || []);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const attributes = state?.attributes || [];
  const totalAllocated = attributes.reduce((sum, a) => sum + (a.level || 1), 0);
  const totalWeeklyXp = attributes.reduce((sum, a) => sum + (a.weeklyXp || 0), 0);

  // Dynamic Archetype Calculation based on player's highest attributes
  const sortedAttrs = [...attributes].sort((a, b) => {
    const scoreA = (a.level || 1) * 1000 + (a.xp || a.currentXp || 0);
    const scoreB = (b.level || 1) * 1000 + (b.xp || b.currentXp || 0);
    return scoreB - scoreA;
  });
  const top1 = sortedAttrs[0];
  const top2 = sortedAttrs[1];

  let archetypeTitle = 'Technical & Intellectual Craft';
  let secondaryFocus = 'Physical & Mental Resilience';
  let dynamicClass = state?.characterClass || state?.title || 'Technomancer';

  if (top1) {
    const k1 = (top1.key || '').toLowerCase();
    if (k1 === 'strength' || k1 === 'vitality') {
      archetypeTitle = 'Physical Might & Kinetic Mastery';
      secondaryFocus = 'Endurance & Mental Fortitude';
      dynamicClass = 'Vanguard Juggernaut';
    } else if (k1 === 'creativity' || k1 === 'travel' || k1 === 'social') {
      archetypeTitle = 'Creative Vision & Polymath Exploration';
      secondaryFocus = 'Communication & Cultural Mastery';
      dynamicClass = 'Renaissance Visionary';
    } else if (k1 === 'discipline' || k1 === 'focus') {
      archetypeTitle = 'Deep Focus & Absolute Will';
      secondaryFocus = 'Strategic Execution & Precision';
      dynamicClass = 'Grandmaster Ascendant';
    } else {
      archetypeTitle = 'Technical & Intellectual Craft';
      secondaryFocus = 'Algorithmic Thinking & System Architecture';
      dynamicClass = 'Technomancer';
    }
  }

  const flowIndex = Math.min(
    9.9,
    Math.max(1.0, (totalAllocated / 10) * 0.5 + (state?.streak || 1) * 0.15 + (totalWeeklyXp > 0 ? 2.0 : 0.8))
  ).toFixed(1);

  // Radar Data calculation dynamically from live attributes
  const defaultRadarAxes = [
    { key: 'coding', label: 'CODING' },
    { key: 'strength', label: 'STR' },
    { key: 'intelligence', label: 'INTEL' },
    { key: 'discipline', label: 'DISC' },
    { key: 'focus', label: 'FOCUS' },
    { key: 'vitality', label: 'VITALITY' },
  ];
  const activeAxes = radarAxes && radarAxes.length > 0 ? radarAxes : defaultRadarAxes;
  const radarData = activeAxes.map((axis) => {
    const attr = attributes.find((a) => a.key?.toLowerCase() === axis.key?.toLowerCase());
    const pct = attr ? (attr.pct ?? attr.percentage ?? 0) : 0;
    const val = Math.max(15, Math.min(100, pct > 0 ? pct : ((attr?.level || 1) * 12)));
    return { label: axis.label, value: val };
  });

  const handleEquipRelic = (relic) => {
    setEquippedRelics((prev) => {
      const existing = prev.filter((r) => r.slot !== relic.slot);
      const updated = [
        ...existing,
        {
          slot: relic.slot,
          name: relic.name,
          bonus: relic.bonus,
          icon: relic.icon,
        },
      ];
      if (pushToast) {
        pushToast(`Socketed ${relic.name} (${relic.bonus})!`, 'check_circle');
      }
      return updated;
    });
  };

  const handleOpenArmory = (slot = null) => {
    setTargetRelicSlot(slot);
    setVaultModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <CharacterHeader />
        <XPContinuumPanel />

        <div className="flex bg-surface-container rounded-full p-1 gap-1 w-fit overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={[
                'px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors cursor-pointer',
                tab === t
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm font-bold'
                  : 'text-on-surface-variant hover:text-on-surface',
              ].join(' ')}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <OverviewLoading />
        ) : tab === 'Overview' ? (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter items-start">
            <div className="xl:col-span-8 flex flex-col gap-gutter">
              <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 flex flex-col gap-5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="flex items-center gap-2 font-headline-sm text-headline-sm text-on-surface">
                    <span className="material-symbols-outlined text-primary text-xl">tune</span>
                    10 Core Attributes Tracked
                  </span>
                  <span className="flex items-center gap-1.5 font-label-md text-label-md text-tertiary font-bold">
                    <span className="material-symbols-outlined text-base">trending_up</span>
                    +{totalWeeklyXp} XP / 7D Pace
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">
                    Core Attribute Spectrum
                  </span>
                  <span className="font-label-caps text-label-caps text-on-surface font-bold">
                    Allocated Stats: {totalAllocated} Total
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {attributes.map((attr) => (
                    <AttributeCard key={attr.key} attribute={attr} />
                  ))}
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row items-center gap-6">
                <div className="flex-1 flex flex-col gap-2">
                  <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">
                    Stat Distribution
                  </span>
                  <span className="font-headline-sm text-headline-sm text-on-surface">Archetype Equilibrium</span>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Your character skews strongly toward <b>{archetypeTitle}</b> with secondary emphasis in{' '}
                    <b>{secondaryFocus}</b>.
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="font-label-md text-label-md text-on-surface">
                      Class: <b className="text-primary">{dynamicClass}</b>
                    </span>
                    <span className="font-label-md text-label-md text-on-surface">
                      Flow Index <b className="text-primary">{flowIndex}</b>
                    </span>
                  </div>
                </div>
                <div className="shrink-0">
                  <RadarChart data={radarData} />
                </div>
              </div>
            </div>

            <div className="xl:col-span-4 flex flex-col gap-gutter">
              <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-headline-sm text-headline-sm text-on-surface">Equipped Relics &amp; Gear</span>
                  <span className="font-label-caps text-label-caps text-outline">{equippedRelics.length} Slots Full</span>
                </div>
                <div className="flex flex-col gap-3">
                  {equippedRelics.map((relic) => (
                    <div
                      key={relic.slot}
                      className="flex items-center gap-3 bg-surface rounded-xl p-3 justify-between"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="material-symbols-outlined fill text-primary text-xl shrink-0">
                          {relic.icon}
                        </span>
                        <div className="flex flex-col min-w-0">
                          <span className="font-label-caps text-label-caps text-outline uppercase">
                            {relic.slot}
                          </span>
                          <span className="font-label-lg text-label-lg text-on-surface truncate">{relic.name}</span>
                          <span className="font-body-sm text-body-sm text-tertiary">{relic.bonus}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenArmory(relic.slot)}
                        className="font-label-md text-label-md text-primary hover:underline shrink-0 cursor-pointer"
                      >
                        Swap
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenArmory(null)}
                  className="mt-1 w-full py-2.5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md hover:translate-y-0.5 active:translate-y-1 shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">inventory_2</span>
                  Open Vault Armory ({VAULT_RELICS.length} Relics)
                </button>
              </div>

              <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-headline-sm text-headline-sm text-on-surface">
                    <span className="material-symbols-outlined text-tertiary text-xl">sensors</span>
                    Verified Proof-of-Work
                  </span>
                  <span className="font-label-caps text-label-caps text-tertiary font-bold">Synced</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant -mt-2">
                  Real telemetry ingested via connected integrations. Real work automatically grants non-inflationary
                  XP.
                </p>
                <div className="flex flex-col divide-y divide-surface-container/60">
                  {proofOfWorkFeed.map((item) => (
                    <div key={item.source} className="flex items-center justify-between py-3 gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="material-symbols-outlined text-on-surface-variant text-xl shrink-0">
                          {item.icon}
                        </span>
                        <div className="flex flex-col min-w-0">
                          <span className="font-label-lg text-label-lg text-on-surface truncate">
                            {item.source}
                          </span>
                          <span className="font-label-caps text-label-caps text-outline">{item.detail}</span>
                        </div>
                      </div>
                      <span className="font-label-caps text-label-caps text-tertiary font-extrabold shrink-0">
                        {item.reward}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-label-caps font-label-caps text-outline">
                  <span>Last webhook: 4m ago</span>
                  <button className="text-primary hover:underline cursor-pointer">Manage Connectors</button>
                </div>
              </div>

              {nextMilestone && (
                <div className="bg-on-tertiary-container text-on-surface rounded-2xl p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-tertiary-fixed-dim/40 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined fill text-tertiary text-xl">flag</span>
                    <span className="font-label-caps text-label-caps text-tertiary uppercase font-bold tracking-wider">
                      Next Milestone
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">{nextMilestone.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                    {nextMilestone.description}
                  </p>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden mt-4">
                    <div
                      className="h-full bg-tertiary-container rounded-full transition-all duration-500"
                      style={{ width: `${nextMilestone.pct}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : tab === 'Attributes Matrix' ? (
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-2xl">analytics</span>
                  Full Core Attributes Matrix
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  10 comprehensive physiological, intellectual, and discipline stats calibrated in real-time.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 rounded-lg bg-primary-container/20 text-primary font-label-md text-label-md font-bold">
                  {totalAllocated} Allocated Levels
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-tertiary-container/20 text-tertiary font-label-md text-label-md font-bold">
                  +{totalWeeklyXp} 7D XP Growth
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {attributes.map((attr) => (
                <div key={attr.key} className="bg-surface rounded-2xl p-5 flex flex-col gap-3 border border-surface-container-high/60 shadow-sm hover:border-primary/30 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-container/30 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined">{attr.icon || 'tune'}</span>
                      </div>
                      <div>
                        <h3 className="font-label-lg text-label-lg text-on-surface font-bold">{attr.label || attr.displayName || attr.key}</h3>
                        <span className="font-body-xs text-body-xs text-on-surface-variant">Core Spectrum Node</span>
                      </div>
                    </div>
                    <span className="font-headline-sm text-headline-sm text-primary font-black">
                      LVL {attr.level || 1}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-label-sm font-label-sm text-on-surface-variant pt-2 border-t border-surface-container/60">
                    <span>Current XP: <b>{Number(attr.xp ?? attr.currentXp ?? 0).toLocaleString()}</b></span>
                    <span>7D Pace: <b className="text-tertiary">+{attr.weeklyXp || 0} XP</b></span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-label-caps font-label-caps text-outline">
                      <span>Threshold to LVL {(attr.level || 1) + 1}</span>
                      <span className="font-bold text-on-surface">{attr.pct ?? 0}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-container rounded-full transition-all duration-500"
                        style={{ width: `${attr.pct ?? 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : tab === 'Inventory & Relics' ? (
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-2xl">inventory_2</span>
                  Vault Armory &amp; Relic Sockets
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  Socket unlocked artifacts, titles, and multipliers to amplify your XP throughput.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenArmory(null)}
                className="px-5 py-2.5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md font-bold shadow-sm hover:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">tune</span>
                Open Relic Forge Modal
              </button>
            </div>

            {/* Sockets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {RELIC_SLOTS.map((slotName) => {
                const eq = equippedRelics.find((r) => r.slot === slotName);
                return (
                  <div
                    key={slotName}
                    className="bg-surface rounded-2xl p-5 flex flex-col justify-between gap-4 border border-surface-container-high/80 shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-label-caps text-[11px] text-outline uppercase font-bold">
                          {slotName}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-tertiary-container/20 text-tertiary font-label-caps text-[10px] font-bold">
                          {eq ? 'ACTIVE' : 'EMPTY'}
                        </span>
                      </div>
                      {eq ? (
                        <div className="flex items-center gap-3 mt-2">
                          <div className="w-12 h-12 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center text-2xl">
                            <span className="material-symbols-outlined fill">{eq.icon}</span>
                          </div>
                          <div>
                            <h4 className="font-label-lg text-label-lg text-on-surface font-bold">{eq.name}</h4>
                            <p className="font-body-xs text-body-xs text-tertiary font-bold">{eq.bonus}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="font-body-sm text-body-sm text-outline italic mt-2">No relic equipped in this slot.</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenArmory(slotName)}
                      className="w-full py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">swap_horiz</span>
                      {eq ? 'Swap Relic' : 'Equip Relic'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Catalog */}
            <div className="pt-2">
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">
                Available Vault Relics ({VAULT_RELICS.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {VAULT_RELICS.map((relic) => {
                  const isEq = equippedRelics.some((r) => r.name === relic.name);
                  return (
                    <div
                      key={relic.id}
                      className={`bg-surface rounded-2xl p-4 flex flex-col justify-between gap-3 border transition-all ${
                        isEq ? 'border-primary/40 ring-1 ring-primary/20' : 'border-surface-container-high/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${relic.accentColor}`}>
                            <span className="material-symbols-outlined">{relic.icon}</span>
                          </div>
                          <div>
                            <h4 className="font-label-md text-label-md text-on-surface font-bold">{relic.name}</h4>
                            <span className="font-label-caps text-[10px] text-outline">{relic.slot}</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-surface-container font-label-caps text-[10px] text-tertiary font-black">
                          {relic.bonus}
                        </span>
                      </div>
                      <p className="font-body-xs text-body-xs text-on-surface-variant">{relic.description}</p>
                      <button
                        type="button"
                        onClick={() => handleEquipRelic(relic)}
                        className={`w-full py-2 rounded-xl font-label-sm text-label-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isEq
                            ? 'bg-surface-container text-tertiary hover:bg-surface-container-high'
                            : 'bg-primary-container text-on-primary hover:translate-y-0.5'
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">
                          {isEq ? 'check_circle' : 'add_circle'}
                        </span>
                        {isEq ? 'Socketed' : 'Equip to ' + relic.slot}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-surface-container-lowest rounded-2xl p-10 shadow-sm flex flex-col items-center text-center gap-2">
            <span className="material-symbols-outlined text-4xl text-outline">construction</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">{tab} is being forged</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
              This section of the character sheet is coming soon. Check back after your next quest cycle.
            </p>
          </div>
        )}
      </div>

      <VaultArmoryModal
        isOpen={vaultModalOpen}
        onClose={() => setVaultModalOpen(false)}
        equippedRelics={equippedRelics}
        onEquipRelic={handleEquipRelic}
        initialTargetSlot={targetRelicSlot}
      />
    </>
  );
}
