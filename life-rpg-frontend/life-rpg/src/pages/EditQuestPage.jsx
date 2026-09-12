import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as questService from '../services/questService';
import * as domainService from '../services/domainService';
import QuestForm from '../components/QuestForm';
import { resolveDomainId } from '../utils/domainStats';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Epic'];

function toFormQuest(quest, domains) {
  return {
    title: quest.title ?? '',
    description: quest.description ?? '',
    domainId: resolveDomainId(quest.domain, domains),
    difficulty: DIFFICULTIES.includes(quest.difficulty) ? quest.difficulty : 'Medium',
    duration: quest.duration ?? (quest.timeRemaining ? quest.timeRemaining.split(' ')[0] : ''),
    frequency: quest.frequency ?? 'Once',
    xp: quest.xp ?? 0,
    gold: quest.gold ?? 0,
    statKey: quest.statKey ?? '',
    deadline: quest.deadline ?? '',
    reminder: quest.reminder ?? '',
    imageUrl: quest.imageUrl ?? '',
  };
}

function LoadingState() {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-16 shadow-sm flex flex-col items-center text-center gap-3 min-h-[50vh]">
      <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
      <p className="font-body-md text-body-md text-on-surface-variant">Loading quest contract...</p>
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

export default function EditQuestPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [formQuest, setFormQuest] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([questService.getQuestById(id), domainService.getDomains()])
      .then(([quest, domains = []]) => {
        if (cancelled) return;
        setFormQuest(quest ? toFormQuest(quest, domains) : null);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Failed to load quest for editing:', err);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <LoadingState />;
  if (!formQuest) return <NotFoundState />;

  return (
    <>
      <Link
        to={`/quests/${id}`}
        className="inline-flex items-center gap-1.5 font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors mb-4 w-fit"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Quest Details
      </Link>

      <div className="flex flex-col mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider bg-surface-variant px-3 py-1 rounded-full">
            Contract Amendment
          </span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight flex items-center gap-2">
          <span className="material-symbols-outlined fill text-primary text-2xl">edit</span>
          Edit Quest
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-0.5 max-w-xl">
          Update the details below — changing domains refreshes suggested rewards you haven't customized.
        </p>
      </div>

      <QuestForm mode="edit" questId={id} initialQuest={formQuest} />
    </>
  );
}
