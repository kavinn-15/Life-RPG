import { useEffect, useState, useMemo } from 'react';
import { useGame } from '../state/GameContext';
import * as characterService from '../services/characterService';
import {
  initialAttributes,
  equippedRelics as defaultRelics,
  proofOfWorkFeed as defaultPow,
  nextMilestone as defaultMilestone,
  radarAxes as defaultAxes,
} from '../data/characterData';
import CharacterHeader from '../components/CharacterHeader';
import XPContinuumPanel from '../components/XPContinuumPanel';
import AttributeCard from '../components/AttributeCard';
import RadarChart from '../components/RadarChart';

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
  const { state } = useGame();

  const [loading, setLoading] = useState(true);
  const [equippedRelics, setEquippedRelics] = useState(defaultRelics);
  const [proofOfWorkFeed, setProofOfWorkFeed] = useState(defaultPow);
  const [nextMilestone, setNextMilestone] = useState(defaultMilestone);
  const [radarAxes, setRadarAxes] = useState(defaultAxes);
  const [filterAttr, setFilterAttr] = useState('All');

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([
      characterService.getRelics(),
      characterService.getProofOfWork(),
      characterService.getNextMilestone(),
      characterService.getRadarAxes(),
    ])
      .then(([relicsRes, powRes, milestoneRes, axesRes]) => {
        if (cancelled) return;
        if (relicsRes.status === 'fulfilled' && Array.isArray(relicsRes.value) && relicsRes.value.length > 0) {
          setEquippedRelics(relicsRes.value);
        }
        if (powRes.status === 'fulfilled' && Array.isArray(powRes.value) && powRes.value.length > 0) {
          setProofOfWorkFeed(powRes.value);
        }
        if (milestoneRes.status === 'fulfilled' && milestoneRes.value) {
          setNextMilestone(milestoneRes.value);
        }
        if (axesRes.status === 'fulfilled' && Array.isArray(axesRes.value) && axesRes.value.length > 0) {
          setRadarAxes(axesRes.value);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Character API fallback triggered:', err);
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const attributesList = useMemo(() => {
    if (state?.attributes && Array.isArray(state.attributes) && state.attributes.length > 0) {
      return state.attributes;
    }
    return initialAttributes;
  }, [state?.attributes]);

  const totalAllocated = useMemo(() => {
    return attributesList.reduce((sum, a) => sum + (Number(a.level) || 0), 0);
  }, [attributesList]);

  const radarData = useMemo(() => {
    const axes = Array.isArray(radarAxes) && radarAxes.length > 0 ? radarAxes : defaultAxes;
    return axes.map((axis) => {
      const attr = attributesList.find((a) => a.key === axis.key);
      return { label: axis.label, value: attr ? (Number(attr.pct) || 50) : 50 };
    });
  }, [radarAxes, attributesList]);

  const filteredAttributes = useMemo(() => {
    if (filterAttr === 'Core') return attributesList.slice(0, 5);
    if (filterAttr === 'Growth') return attributesList.filter((a) => (Number(a.weeklyXp) || 0) > 0);
    if (filterAttr === 'Needs Quest') return attributesList.filter((a) => a.needQuest || (Number(a.weeklyXp) || 0) === 0);
    return attributesList;
  }, [attributesList, filterAttr]);

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
                'px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors',
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
                    {attributesList.length} Core Attributes Tracked
                  </span>
                  <span className="flex items-center gap-1.5 font-label-md text-label-md text-tertiary font-bold">
                    <span className="material-symbols-outlined text-base">trending_up</span>
                    +605 XP / 7D Pace
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
                  {attributesList.map((attr) => (
                    <AttributeCard key={attr.key || attr.label} attribute={attr} />
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
                    Your character skews strongly toward <b>Technical &amp; Intellectual Craft</b> with secondary
                    emphasis in Physical Resilience.
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="font-label-md text-label-md text-on-surface">
                      Class: <b className="text-primary">Technomancer</b>
                    </span>
                    <span className="font-label-md text-label-md text-on-surface">
                      Flow Index <b className="text-primary">9.2</b>
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
                  {equippedRelics.map((relic, idx) => (
                    <div
                      key={relic.slot || idx}
                      className="flex items-center gap-3 bg-surface rounded-xl p-3 justify-between"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="material-symbols-outlined fill text-primary text-xl shrink-0">
                          {relic.icon || 'military_tech'}
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
                        onClick={() => setTab('Inventory & Relics')}
                        className="font-label-md text-label-md text-primary hover:underline shrink-0"
                      >
                        Swap
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setTab('Inventory & Relics')}
                  className="mt-1 w-full py-2.5 rounded-full bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">inventory_2</span>
                  Open Vault Armory ({equippedRelics.length} Equipped)
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
                  {proofOfWorkFeed.map((item, idx) => (
                    <div key={item.source || idx} className="flex items-center justify-between py-3 gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="material-symbols-outlined text-on-surface-variant text-xl shrink-0">
                          {item.icon || 'insights'}
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
                  <span>Last sync: moments ago</span>
                  <span className="text-primary text-xs font-semibold">Integrations Active</span>
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
                      style={{ width: `${Math.min(100, Math.max(0, nextMilestone.pct || 0))}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : tab === 'Attributes Matrix' ? (
          <div className="flex flex-col gap-6">
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">Full Attribute Matrix</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Track skill levels, weekly velocity, and next mastery gates across all life domains.
                  </p>
                </div>
                <div className="flex bg-surface-container rounded-full p-1 gap-1">
                  {['All', 'Core', 'Growth', 'Needs Quest'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilterAttr(f)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        filterAttr === f ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-2">
                {filteredAttributes.map((attr) => (
                  <AttributeCard key={attr.key || attr.label} attribute={attr} />
                ))}
              </div>
            </div>
          </div>
        ) : tab === 'Achievements & Medals' ? (
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Character Medals &amp; Crests</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Medals awarded for sustained streaks, multi-domain mastery, and milestone ascensions.
                </p>
              </div>
              <span className="font-label-caps text-xs text-tertiary bg-tertiary-fixed px-3 py-1.5 rounded-full font-extrabold">
                12 Unlocked
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'Grand Architect', desc: 'Reached Level 10+ in Coding & Logic', tier: 'Gold Crest', icon: 'military_tech', color: 'text-amber-500 bg-amber-500/10' },
                { title: 'Iron Discipline', desc: 'Maintained a 14-day consecutive active streak', tier: 'Diamond Tier', icon: 'local_fire_department', color: 'text-orange-500 bg-orange-500/10' },
                { title: 'Scholar of Wisdom', desc: 'Completed 50+ research and knowledge quests', tier: 'Platinum Tier', icon: 'psychology', color: 'text-indigo-500 bg-indigo-500/10' },
                { title: 'Flowstate Master', desc: 'Maintained 9.0+ flow state rating for 7 days', tier: 'Gold Crest', icon: 'bolt', color: 'text-purple-500 bg-purple-500/10' },
                { title: 'Early Vanguard', desc: 'First week orientation and core habit seeding', tier: 'Silver Medal', icon: 'workspace_premium', color: 'text-cyan-500 bg-cyan-500/10' },
                { title: 'Habit Titan', desc: '100 total quests successfully validated', tier: 'Epic Trophy', icon: 'emoji_events', color: 'text-emerald-500 bg-emerald-500/10' },
              ].map((medal) => (
                <div key={medal.title} className="p-4 rounded-2xl bg-surface border border-surface-container flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${medal.color}`}>
                    <span className="material-symbols-outlined text-2xl">{medal.icon}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-outline">{medal.tier}</span>
                    <span className="font-label-lg font-bold text-on-surface">{medal.title}</span>
                    <p className="text-xs text-on-surface-variant mt-0.5">{medal.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Relics &amp; Inventory Armory</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Equip relics and boosters to amplify your daily XP velocity and streak protection.
                </p>
              </div>
              <span className="font-label-caps text-xs text-primary bg-primary-fixed px-3 py-1.5 rounded-full font-bold">
                {equippedRelics.length} Active Slots
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {equippedRelics.map((relic, idx) => (
                <div key={relic.slot || idx} className="bg-surface rounded-2xl p-5 flex flex-col gap-3 border border-surface-container">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-xs text-outline uppercase">{relic.slot}</span>
                    <span className="material-symbols-outlined text-primary text-xl">{relic.icon || 'military_tech'}</span>
                  </div>
                  <div>
                    <h3 className="font-label-lg font-bold text-on-surface">{relic.name}</h3>
                    <p className="text-xs text-tertiary font-medium mt-0.5">{relic.bonus}</p>
                  </div>
                  <div className="pt-2 mt-auto border-t border-surface-container flex items-center justify-between">
                    <span className="text-[11px] text-on-surface-variant">Status: <b className="text-tertiary font-semibold">Equipped</b></span>
                    <span className="text-xs text-primary font-bold">Slot Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

