import { Link, useSearchParams } from 'react-router-dom';
import QuestForm from '../components/QuestForm';

export default function CreateQuestPage() {
  const [searchParams] = useSearchParams();
  const presetDomainId = searchParams.get('domain') ?? undefined;

  return (
    <>
      <Link
        to="/quests"
        className="inline-flex items-center gap-1.5 font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors mb-4 w-fit"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Quest Board
      </Link>

      <div className="flex flex-col mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider bg-surface-variant px-3 py-1 rounded-full">
            Contract Generation Desk
          </span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight flex items-center gap-2">
          <span className="material-symbols-outlined fill text-primary text-2xl">auto_fix_high</span>
          Forge a New Quest
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-0.5 max-w-xl">
          Pick a domain and the form fills in sensible defaults — tweak anything before minting it into
          your active queue.
        </p>
      </div>

      <QuestForm mode="create" presetDomainId={presetDomainId} />
    </>
  );
}
