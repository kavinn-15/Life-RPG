import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGame } from '../state/GameContext';
import * as domainService from '../services/domainService';
import * as achievementService from '../services/achievementService';
import { Chip } from '../components/Chip';
import AttributeCard from '../components/AttributeCard';
import RecommendedQuestCard from '../components/RecommendedQuestCard';
import { getDomainProgressPct, toRecommendedQuest, capitalize } from '../utils/domainStats';

const RECENT_ACTIVITY_TIMES = ['2h ago', 'Yesterday', '3 days ago', 'Last week'];

function LoadingState() {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-16 shadow-sm flex flex-col items-center text-center gap-3 min-h-[50vh]">
      <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
      <p className="font-body-md text-body-md text-on-surface-variant">Loading domain intel...</p>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-16 shadow-sm flex flex-col items-center text-center gap-3 min-h-[50vh]">
      <span className="material-symbols-outlined text-4xl text-outline">explore_off</span>
      <h1 className="font-headline-lg text-headline-lg text-on-surface">Domain not found</h1>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
        This realm doesn't exist yet, or the link is out of date.
      </p>
      <Link
        to="/domains"
        className="mt-2 px-5 py-2.5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md shadow-sm hover:translate-y-0.5 transition-all"
      >
        Back to Domains
      </Link>
    </div>
  );
}

export default function DomainDetailsPage() {
  const { domainId } = useParams();
  const { state } = useGame();
  const [loading, setLoading] = useState(true);
  const [domain, setDomain] = useState(null);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([domainService.getDomainById(domainId), achievementService.getAchievements()]).then(
      ([domainResult, achievementResult]) => {
        if (cancelled) return;
        setDomain(domainResult);
        setAchievements(achievementResult);
        setLoading(false);
      }
    );
    return () => {
      cancelled = true;
    };
  }, [domainId]);

  if (loading) return <LoadingState />;
  if (!domain) return <NotFoundState />;

  const pct = getDomainProgressPct(domain.stats);
  const growthAttributes = state.attributes.filter((a) => domain.primaryAttribute.includes(a.key));
  const relatedAchievements = achievements.filter((a) => a.domain === domain.name).slice(0, 3);
  const recommended = domain.quests.slice(0, 3).map((q, i) => toRecommendedQuest(domain, q, i));

  return (
    <>
      <Link
        to="/domains"
        className="inline-flex items-center gap-1.5 font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors mb-4 w-fit"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Domains Explorer
      </Link>

      <div className="relative rounded-2xl overflow-hidden shadow-md mb-8 min-h-[280px] flex flex-col justify-end">
        <img
          src={domain.heroImageUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/10" />
        <div className="relative z-10 p-6 sm:p-8 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-md ${domain.accentClass}`}>
              <span className="material-symbols-outlined fill text-2xl">{domain.icon}</span>
            </div>
            {domain.primaryAttribute.map((attr) => (
              <Chip key={attr} className={domain.chipClass}>
                {capitalize(attr)}
              </Chip>
            ))}
            <Chip className="bg-surface-container-lowest/90 text-on-surface backdrop-blur-sm ml-auto">
              Domain LVL {domain.stats.domainLevel}
            </Chip>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-white tracking-tight">{domain.name}</h1>
          <p className="font-body-lg text-body-lg text-white/85 max-w-2xl">{domain.description}</p>
          <div className="flex flex-wrap items-center gap-6 mt-2">
            <div className="flex flex-col">
              <span className="font-stat-counter text-2xl font-extrabold text-white">
                {domain.stats.questsCompleted}
              </span>
              <span className="font-label-caps text-label-caps text-white/70 uppercase">Quests Completed</span>
            </div>
            <div className="flex flex-col">
              <span className="font-stat-counter text-2xl font-extrabold text-white">
                {domain.stats.xpEarned.toLocaleString()}
              </span>
              <span className="font-label-caps text-label-caps text-white/70 uppercase">Total XP</span>
            </div>
            <div className="flex flex-col">
              <span className="font-stat-counter text-2xl font-extrabold text-white">
                {domain.stats.streak}
              </span>
              <span className="font-label-caps text-label-caps text-white/70 uppercase">Current Streak</span>
            </div>
            <div className="flex-1 min-w-[160px] flex flex-col gap-1">
              <div className="flex items-center justify-between text-label-caps font-label-caps text-white/70">
                <span>Domain Progress</span>
                <span className="font-bold text-white">{pct}%</span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-tertiary-fixed rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter items-start">
        <div className="xl:col-span-8 flex flex-col gap-8">
          {growthAttributes.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">trending_up</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Attribute Growth</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {growthAttributes.map((attr) => (
                  <AttributeCard key={attr.key} attribute={attr} />
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined fill text-secondary-container text-2xl">
                  auto_awesome
                </span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Recommended Quests</h2>
              </div>
              <Link
                to={`/quests/new?domain=${domain.id}`}
                className="font-label-md text-label-md text-primary hover:underline cursor-pointer whitespace-nowrap"
              >
                Forge Another
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
              {recommended.map((q) => (
                <RecommendedQuestCard key={q.id} quest={q} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined fill text-tertiary-container text-2xl">emoji_events</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Related Achievements</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter">
              {relatedAchievements.length > 0
                ? relatedAchievements.map((a) => (
                    <div
                      key={a.id}
                      className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm flex flex-col items-center text-center gap-2"
                    >
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                          a.unlocked ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-surface-container text-outline'
                        }`}
                      >
                        <span className="material-symbols-outlined fill text-2xl">{a.icon}</span>
                      </div>
                      <span className="font-label-lg text-label-lg text-on-surface">{a.title}</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">{a.description}</span>
                      <Chip className={a.unlocked ? 'text-tertiary bg-tertiary-fixed' : 'text-outline bg-surface-container'}>
                        {a.unlocked ? 'Unlocked' : 'Locked'}
                      </Chip>
                    </div>
                  ))
                : [0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm flex flex-col items-center text-center gap-2 opacity-70"
                    >
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-surface-container text-outline">
                        <span className="material-symbols-outlined text-2xl">lock</span>
                      </div>
                      <span className="font-label-lg text-label-lg text-on-surface">Achievement Locked</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Keep completing {domain.name} quests to unlock this medal.
                      </span>
                    </div>
                  ))}
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 flex flex-col gap-gutter">
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">history</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Recent Activity</h2>
            </div>
            <div className="flex flex-col divide-y divide-surface-container/60">
              {domain.quests.slice(0, 4).map((q, i) => (
                <div key={q.title} className="flex items-center justify-between py-3 gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${domain.accentClass}`}>
                      <span className="material-symbols-outlined text-lg">{domain.icon}</span>
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-lg text-label-lg text-on-surface truncate">{q.title}</span>
                      <span className="font-label-caps text-label-caps text-outline">
                        {RECENT_ACTIVITY_TIMES[i % RECENT_ACTIVITY_TIMES.length]}
                      </span>
                    </div>
                  </div>
                  <span className="font-label-caps text-label-caps text-tertiary font-extrabold shrink-0">
                    Logged
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
