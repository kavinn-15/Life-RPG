import { useEffect, useState } from 'react';
import { useGame } from '../state/GameContext';
import * as characterService from '../services/characterService';
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
  const [equippedRelics, setEquippedRelics] = useState([]);
  const [proofOfWorkFeed, setProofOfWorkFeed] = useState([]);
  const [nextMilestone, setNextMilestone] = useState(null);
  const [radarAxes, setRadarAxes] = useState([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      characterService.getRelics(),
      characterService.getProofOfWork(),
      characterService.getNextMilestone(),
      characterService.getRadarAxes(),
    ]).then(([relics, proofOfWork, milestone, axes]) => {
      if (cancelled) return;
      setEquippedRelics(relics);
      setProofOfWorkFeed(proofOfWork);
      setNextMilestone(milestone);
      setRadarAxes(axes);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const totalAllocated = state.attributes.reduce((sum, a) => sum + a.level, 0);
  const radarData = radarAxes.map((axis) => {
    const attr = state.attributes.find((a) => a.key === axis.key);
    return { label: axis.label, value: attr ? attr.pct : 0 };
  });

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
                    10 Core Attributes Tracked
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
                  {state.attributes.map((attr) => (
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
                  <span className="font-label-caps text-label-caps text-outline">3 Slots Full</span>
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
                      <button className="font-label-md text-label-md text-primary hover:underline shrink-0">
                        Swap
                      </button>
                    </div>
                  ))}
                </div>
                <button className="mt-1 w-full py-2.5 rounded-full bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1.5">
                  <span className="material-symbols-outlined text-base">inventory_2</span>
                  Open Vault Armory (18 Relics)
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
                  <button className="text-primary hover:underline">Manage Connectors</button>
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
                      className="h-full bg-tertiary-container rounded-full"
                      style={{ width: `${nextMilestone.pct}%` }}
                    />
                  </div>
                </div>
              )}
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
    </>
  );
}
