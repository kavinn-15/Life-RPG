import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGame } from '../state/GameContext';
import * as questService from '../services/questService';
import * as domainService from '../services/domainService';
import { resolveDomainId } from '../utils/domainStats';

function LoadingState() {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-16 shadow-sm flex flex-col items-center text-center gap-3 min-h-[50vh]">
      <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
      <p className="font-body-md text-body-md text-on-surface-variant">Pulling up the quest contract...</p>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-16 shadow-sm flex flex-col items-center text-center gap-3 min-h-[50vh]">
      <span className="material-symbols-outlined text-4xl text-outline">search_off</span>
      <h1 className="font-headline-lg text-headline-lg text-on-surface">Quest not found</h1>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
        This quest may have already been completed or removed from the queue.
      </p>
      <Link
        to="/quests"
        className="mt-2 px-5 py-2.5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md shadow-sm hover:translate-y-0.5 transition-all"
      >
        Back to Quest Board
      </Link>
    </div>
  );
}

export default function QuestDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { grantRewards, pushToast } = useGame();

  const [loading, setLoading] = useState(true);
  const [quest, setQuest] = useState(null);
  const [domain, setDomain] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [milestones, setMilestones] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([questService.getQuestById(id), questService.getActiveQuests(), domainService.getDomains()])
      .then(([foundQuest, activeQuests = [], domains = []]) => {
        if (cancelled) return;
        setQuest(foundQuest);
        const inActiveList = Array.isArray(activeQuests) && activeQuests.some((q) => q.id === id);
        setIsActive(inActiveList || Boolean(foundQuest));
        setMilestones(foundQuest?.milestones ?? []);
        if (foundQuest) {
          const domainId = foundQuest.domainId ?? resolveDomainId(foundQuest.domain, domains);
          setDomain(domains.find((d) => d.id === domainId) ?? null);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Failed to load quest details:', err);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const doneCount = milestones.filter((m) => m.done).length;
  const pct = useMemo(() => {
    if (milestones.length) return Math.round((doneCount / milestones.length) * 100);
    return quest?.progress ?? quest?.sprintPct ?? 0;
  }, [milestones, doneCount, quest]);

  const toggleMilestone = (mId) => {
    const updated = milestones.map((m) => (m.id === mId ? { ...m, done: !m.done } : m));
    setMilestones(updated);
    const done = updated.filter((m) => m.done).length;
    const newPct = updated.length ? Math.round((done / updated.length) * 100) : 0;
    questService.updateQuest(id, {
      subtasks: updated,
      milestones: updated,
      progressPct: newPct,
      progress: newPct,
      progressLabel: `${newPct}% (${done}/${updated.length})`,
      status: newPct === 100 ? 'COMPLETED' : 'ACTIVE',
    });
  };

  const handleComplete = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const result = await questService.completeQuest(id);
      const xpVal = Number(result?.xpReward ?? result?.xp ?? quest?.rewardXp ?? quest?.xp ?? 100);
      const goldVal = Number(result?.goldReward ?? result?.gold ?? quest?.rewardGold ?? quest?.gold ?? 50);
      const statKey = result?.attributeKey ?? result?.statKey ?? quest?.statKey ?? 'discipline';
      const statAmount = Number(result?.statAmount ?? quest?.statAmount ?? 3);
      grantRewards({ xp: xpVal, gold: goldVal, statKey, statAmount, questTitle: quest?.title });
      pushToast(`${quest?.title || 'Quest'} complete · +${xpVal} XP, +${goldVal} Gold`, 'celebration');
      navigate('/quests');
    } catch (err) {
      console.warn('Error completing quest:', err);
      // Local completion fallback
      questService.completeQuest(id);
      const xpVal = Number(quest?.rewardXp ?? quest?.xp ?? 100);
      const goldVal = Number(quest?.rewardGold ?? quest?.gold ?? 50);
      grantRewards({ xp: xpVal, gold: goldVal, questTitle: quest?.title });
      pushToast(`${quest?.title || 'Quest'} complete · +${xpVal} XP`, 'celebration');
      navigate('/quests');
    } finally {
      setBusy(false);
    }
  };

  const handleAddToActive = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const created = await questService.createQuest(quest);
      pushToast(`${created.title} added to your active queue`, 'auto_awesome');
      navigate(`/quests/${created.id}`);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (busy) return;
    if (!window.confirm(`Delete "${quest.title}"? This can't be undone.`)) return;
    setBusy(true);
    try {
      await questService.deleteQuest(id);
      pushToast(`${quest.title} deleted`, 'delete');
      navigate('/quests');
    } catch {
      pushToast("Can't delete a quest that isn't in your active queue", 'info');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <LoadingState />;
  if (!quest) return <NotFoundState />;

  const heroImage = quest.imageUrl || domain?.heroImageUrl;

  return (
    <>
      <Link
        to="/quests"
        className="inline-flex items-center gap-1.5 font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors mb-4 w-fit"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Quest Board
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter items-start">
        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="relative rounded-2xl overflow-hidden shadow-md min-h-[220px] flex flex-col justify-end">
            {heroImage ? (
              <img src={heroImage} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
            ) : (
              <div className="absolute inset-0 bg-surface-container" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/10" />
            <div className="relative z-10 p-6 flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-label-caps text-label-caps text-white/80 uppercase tracking-wider">
                  {quest.domain}
                </span>
                {quest.difficultyClass && (
                  <span className={`px-2.5 py-0.5 rounded-full font-label-caps text-label-caps uppercase ${quest.difficultyClass}`}>
                    {quest.difficulty}
                  </span>
                )}
                {!isActive && (
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container-lowest/90 text-on-surface-variant font-label-caps text-label-caps uppercase backdrop-blur-sm">
                    Preview
                  </span>
                )}
              </div>
              <h1 className="font-headline-lg text-headline-lg text-white tracking-tight">{quest.title}</h1>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <p className="font-body-md text-body-md text-on-surface-variant">
              {quest.description || 'No description provided for this quest.'}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-label-caps text-label-caps text-primary bg-primary-fixed px-2 py-0.5 rounded-full font-extrabold">
                +{quest.xp ?? 0} XP
              </span>
              <span className="font-label-caps text-label-caps text-secondary-container bg-[#FFF8E6] px-2 py-0.5 rounded-full font-extrabold">
                +{quest.gold ?? 0} Gold
              </span>
              {quest.statLabel && (
                <span className="font-label-caps text-label-caps text-tertiary bg-tertiary-fixed px-2 py-0.5 rounded-full font-extrabold">
                  {quest.statLabel}
                </span>
              )}
              {quest.timeRemaining && (
                <span className="flex items-center gap-1 font-label-caps text-label-caps text-outline">
                  <span className="material-symbols-outlined text-xs">schedule</span>
                  {quest.timeRemaining}
                </span>
              )}
            </div>

            {milestones.length > 0 && (
              <div className="flex flex-col gap-2 pt-2">
                {quest.milestoneLabel && (
                  <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">
                    {quest.milestoneLabel}
                  </span>
                )}
                {milestones.map((m) => (
                  <label
                    key={m.id}
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => toggleMilestone(m.id)}
                  >
                    <input
                      readOnly
                      checked={m.done}
                      type="checkbox"
                      className="w-5 h-5 rounded-lg accent-tertiary-container cursor-pointer"
                    />
                    <span
                      className={`font-body-sm text-body-sm ${
                        m.done ? 'text-on-surface-variant line-through opacity-70' : 'text-on-surface'
                      }`}
                    >
                      {m.label}
                    </span>
                  </label>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <span className="font-label-md text-label-md text-on-surface-variant whitespace-nowrap">
                Progress
              </span>
              <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-container rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="font-label-md text-label-md text-on-surface font-bold whitespace-nowrap">
                {pct}%
              </span>
            </div>
          </div>

          {domain && (
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex items-center gap-4">
              <span className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${domain.accentClass}`}>
                <span className="material-symbols-outlined fill text-2xl">{domain.icon}</span>
              </span>
              <div className="flex flex-col">
                <span className="font-label-lg text-label-lg text-on-surface">Streak Contribution</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Completing this keeps your {domain.name} streak alive — currently{' '}
                  <b className="text-on-surface">{domain.stats.streak} days</b>.
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="xl:col-span-4 flex flex-col gap-3 xl:sticky xl:top-24">
          {isActive ? (
            <>
              <button
                onClick={handleComplete}
                disabled={busy}
                className="w-full py-3.5 rounded-full font-label-lg text-label-lg shadow-md transition-all flex items-center justify-center gap-2 bg-primary-container text-on-primary hover:translate-y-0.5 disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-lg">check_circle</span>
                {busy ? 'Working...' : 'Complete Quest'}
              </button>
              <Link
                to={`/quests/${id}/edit`}
                className="w-full py-3 rounded-full font-label-md text-label-md text-on-surface bg-surface-container hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">edit</span>
                Edit Quest
              </Link>
              <button
                onClick={handleDelete}
                disabled={busy}
                className="w-full py-3 rounded-full font-label-md text-label-md text-error hover:bg-error-container/40 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-base">delete</span>
                Delete Quest
              </button>
            </>
          ) : (
            <>
              <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm">
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  This is a preview quest — add it to your active queue to complete, edit, or delete it.
                </p>
              </div>
              <button
                onClick={handleAddToActive}
                disabled={busy}
                className="w-full py-3.5 rounded-full font-label-lg text-label-lg shadow-md transition-all flex items-center justify-center gap-2 bg-primary-container text-on-primary hover:translate-y-0.5 disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-lg">add_task</span>
                {busy ? 'Adding...' : 'Add to Active Queue'}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
