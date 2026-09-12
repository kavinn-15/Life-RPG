import { Link } from 'react-router-dom';
import { Chip } from './Chip';
import { getDomainProgressPct } from '../utils/domainStats';

export default function DomainCard({ domain }) {
  const pct = getDomainProgressPct(domain.stats);

  return (
    <Link
      to={`/domains/${domain.id}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-surface-container-lowest shadow-sm hover:shadow-[0_20px_45px_-10px_rgba(83,65,205,0.35)] transition-shadow duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
    >
      <div className="relative h-44 sm:h-48 overflow-hidden">
        <img
          src={domain.heroImageUrl}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent opacity-80" />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-md ${domain.accentClass}`}
          >
            <span className="material-symbols-outlined fill text-xl">{domain.icon}</span>
          </div>
        </div>
        <div className="absolute top-3 right-3">
          <Chip className="bg-surface-container-lowest/90 text-on-surface backdrop-blur-sm">
            LVL {domain.stats.domainLevel}
          </Chip>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-headline-sm text-headline-sm text-white leading-tight drop-shadow-sm">
            {domain.name}
          </h3>
          <p className="font-body-sm text-body-sm text-white/80 line-clamp-1 mt-0.5">{domain.tagline}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {domain.primaryAttribute.map((attr) => (
            <Chip key={attr} className={domain.chipClass}>
              {attr.charAt(0).toUpperCase() + attr.slice(1)}
            </Chip>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 text-center">
          <div className="flex-1 flex flex-col">
            <span className="font-stat-counter text-lg font-extrabold text-on-surface">
              {domain.stats.questsCompleted}
            </span>
            <span className="font-label-caps text-label-caps text-outline uppercase">Quests</span>
          </div>
          <div className="w-px h-8 bg-surface-container-high" />
          <div className="flex-1 flex flex-col">
            <span className="font-stat-counter text-lg font-extrabold text-on-surface">
              {domain.stats.xpEarned.toLocaleString()}
            </span>
            <span className="font-label-caps text-label-caps text-outline uppercase">XP Earned</span>
          </div>
          <div className="w-px h-8 bg-surface-container-high" />
          <div className="flex-1 flex flex-col">
            <span className="font-stat-counter text-lg font-extrabold text-on-surface">
              {domain.stats.streak}
            </span>
            <span className="font-label-caps text-label-caps text-outline uppercase">Streak</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-label-caps font-label-caps text-outline">
            <span>Domain Progress</span>
            <span className="font-bold text-on-surface">{pct}%</span>
          </div>
          <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-container rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
