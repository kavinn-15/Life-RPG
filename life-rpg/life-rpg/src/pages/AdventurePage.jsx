import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../state/GameContext';
import * as questService from '../services/questService';
import FeaturedQuestCard from '../components/FeaturedQuestCard';
import ContinueQuestCard from '../components/ContinueQuestCard';
import RecommendedQuestCard from '../components/RecommendedQuestCard';
import DailyQuestsPanel from '../components/DailyQuestsPanel';
import { SpotlightPanel, LeaderboardPanel } from '../components/SidePanels';

function AdventureLoading() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 bg-surface-container-lowest rounded-2xl shadow-sm p-16 min-h-[50vh]">
      <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
      <p className="font-body-md text-body-md text-on-surface-variant">Loading today's quests...</p>
    </div>
  );
}

export default function AdventurePage() {
  const { state } = useGame();
  const [loading, setLoading] = useState(true);
  const [quests, setQuests] = useState({ featuredQuest: null, continueQuests: [], recommendedQuests: [] });

  useEffect(() => {
    let cancelled = false;
    questService.getQuests()
      .then((data) => {
        if (cancelled) return;
        const featuredQuest = data?.featuredQuest ?? null;
        const continueQuests = Array.isArray(data?.continueQuests) ? data.continueQuests : [];
        const recommendedQuests = Array.isArray(data?.recommendedQuests) ? data.recommendedQuests : [];
        setQuests({ featuredQuest, continueQuests, recommendedQuests });
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Could not fetch adventure quests:', err);
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const continueList = quests.continueQuests || [];
  const recommendedList = quests.recommendedQuests || [];

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider bg-surface-variant px-3 py-1 rounded-full">
              Active Campaign • Level {state.level}
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            Welcome back, {state.playerName || 'Adventurer'} — {state.title || 'Novice'}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-0.5">
            Ready to level up your real life today? Complete daily missions and forge new skills.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/character"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container-lowest text-on-surface font-label-lg text-label-lg shadow-sm hover:shadow-md transition-all"
          >
            <span className="material-symbols-outlined fill text-primary text-xl">stars</span>
            <span>Character Sheet</span>
          </Link>
          <div className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2.5 rounded-full shadow-sm">
            <span className="material-symbols-outlined fill text-tertiary-container text-xl">check_circle</span>
            <span className="font-label-lg text-label-lg text-on-surface">
              {state.questsCompletedToday ?? 0} / {state.questsTotalToday ?? 0} Completed
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <AdventureLoading />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter items-start">
          <div className="xl:col-span-8 flex flex-col gap-8">
            <FeaturedQuestCard quest={quests.featuredQuest} />

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-2xl">timelapse</span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">Continue Quests</h2>
                </div>
                {continueList.length > 0 && (
                  <Link to="/quests" className="font-label-md text-label-md text-primary hover:underline">
                    View All ({continueList.length})
                  </Link>
                )}
              </div>
              {continueList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                  {continueList.map((q) => (
                    <ContinueQuestCard key={q.id} quest={q} />
                  ))}
                </div>
              ) : (
                <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-outline text-2xl">pending_actions</span>
                    <span className="font-body-md text-body-md text-on-surface-variant">
                      No active quests in progress. Start a mission from the Quest Board!
                    </span>
                  </div>
                  <Link
                    to="/quests"
                    className="px-4 py-2 rounded-full bg-primary-container text-on-primary font-label-md text-label-md shrink-0 shadow-sm"
                  >
                    Quest Board
                  </Link>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined fill text-secondary-container text-2xl">
                    auto_awesome
                  </span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">Recommended Quests For You</h2>
                </div>
                <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider hidden sm:inline">
                  Algorithmic Match
                </span>
              </div>
              {recommendedList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                  {recommendedList.map((q) => (
                    <RecommendedQuestCard key={q.id} quest={q} />
                  ))}
                </div>
              ) : (
                <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-outline text-2xl">explore</span>
                    <span className="font-body-md text-body-md text-on-surface-variant">
                      Discover new skill trees and domain quests tailored to your build.
                    </span>
                  </div>
                  <Link
                    to="/domains"
                    className="px-4 py-2 rounded-full bg-secondary-container text-on-secondary font-label-md text-label-md shrink-0 shadow-sm"
                  >
                    Explore Domains
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="xl:col-span-4 flex flex-col gap-gutter">
            <DailyQuestsPanel />
            <SpotlightPanel />
            <LeaderboardPanel playerLevel={state.level} playerXp={state.totalXp || state.xp || 0} />
          </div>
        </div>
      )}
    </>
  );
}
