import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as domainService from '../services/domainService';
import DomainCard from '../components/DomainCard';
import CreateDomainModal from '../components/CreateDomainModal';

function DomainSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-gutter animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-surface-container-lowest rounded-2xl h-80 overflow-hidden flex flex-col">
          <div className="h-44 bg-surface-container" />
          <div className="p-4 flex flex-col gap-3">
            <div className="h-5 bg-surface-container rounded-md w-24" />
            <div className="h-4 bg-surface-container rounded-md w-full" />
            <div className="h-8 bg-surface-container rounded-md mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

const ATTRIBUTE_FILTERS = [
  'All Realms',
  'Strength',
  'Intelligence',
  'Focus',
  'Discipline',
  'Vitality',
  'Creativity',
];

export default function DomainsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [domains, setDomains] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Realms');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchDomains = () => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    domainService
      .getDomains()
      .then((data) => {
        if (cancelled) return;
        setDomains(data);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || 'Failed to map realm coordinates.');
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  };

  useEffect(() => {
    return fetchDomains();
  }, []);

  const handleDomainCreated = (newDomain) => {
    setDomains((prev) => {
      if (prev.some((d) => d.id === newDomain.id)) return prev;
      return [newDomain, ...prev];
    });
  };

  const filteredDomains = domains.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.tagline?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === 'All Realms' ||
      (d.primaryAttribute && d.primaryAttribute.some((attr) => attr.toLowerCase() === activeFilter.toLowerCase()));

    return matchesSearch && matchesFilter;
  });

  const totalQuests = domains.reduce((sum, d) => sum + (d.stats?.questsCompleted || 0), 0);
  const totalXp = domains.reduce((sum, d) => sum + (d.stats?.xpEarned || 0), 0);

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider bg-surface-variant px-3 py-1 rounded-full">
              Realm Map
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined fill text-primary text-2xl">public</span>
            Domains Explorer
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-0.5 max-w-xl">
            Every pursuit you track lives in a domain. Explore realms, level up your stats, or chart custom domains to match your lifestyle.
          </p>
        </div>
        <div className="flex items-center gap-4 shrink-0 flex-wrap">
          <div className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2 rounded-2xl shadow-sm">
            <span className="material-symbols-outlined fill text-tertiary-container text-2xl">
              check_circle
            </span>
            <div className="flex flex-col leading-tight">
              <span className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                {totalQuests}
              </span>
              <span className="font-label-caps text-label-caps text-outline uppercase text-[10px]">Quests Completed</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2 rounded-2xl shadow-sm">
            <span className="material-symbols-outlined fill text-secondary-container text-2xl">bolt</span>
            <div className="flex flex-col leading-tight">
              <span className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                {totalXp.toLocaleString()}
              </span>
              <span className="font-label-caps text-label-caps text-outline uppercase text-[10px]">Total XP</span>
            </div>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2.5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md shadow-sm hover:translate-y-0.5 active:translate-y-1 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-base">add_location_alt</span>
            <span>Add Custom Domain</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {ATTRIBUTE_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-label-md whitespace-nowrap transition-all ${
                activeFilter === f
                  ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border border-outline/5'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-lg pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Filter ${domains.length} domains...`}
            className="w-full pl-9 pr-4 py-2 bg-surface-container-lowest rounded-full font-body-sm text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary border border-outline/5 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-outline hover:text-on-surface text-sm"
            >
              close
            </button>
          )}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-surface-container-lowest rounded-2xl p-12 text-center flex flex-col items-center gap-4 shadow-sm border border-error/20 my-4">
          <div className="w-14 h-14 rounded-full bg-error/10 text-error flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">map_search</span>
          </div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Realm Cartography Error</h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md">{error}</p>
          <button
            onClick={fetchDomains}
            className="px-5 py-2.5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md shadow-sm hover:translate-y-0.5 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            Re-chart Realms
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && !error && <DomainSkeletonGrid />}

      {/* Empty state when searching and no domain found */}
      {!loading && !error && filteredDomains.length === 0 && (
        <div className="bg-surface-container-lowest rounded-3xl p-12 text-center flex flex-col items-center gap-4 shadow-sm border border-outline/5 my-4">
          <div className="w-16 h-16 rounded-3xl bg-primary-container/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">add_location_alt</span>
          </div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">
            Can't find {searchQuery ? `"${searchQuery}"` : 'your domain'}?
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
            Chart a brand new custom realm to track your specific hobby, career skill, athletic pursuit, or habit discipline.
          </p>
          <div className="flex items-center gap-3 mt-2 flex-wrap justify-center">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-6 py-2.5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md shadow-md hover:translate-y-0.5 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>Chart Custom Realm</span>
            </button>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('All Realms');
              }}
              className="px-5 py-2.5 rounded-full bg-surface hover:bg-surface-container text-on-surface font-label-md text-label-md transition-all"
            >
              View All Domains
            </button>
          </div>
        </div>
      )}

      {/* Grid of Domain Cards */}
      {!loading && !error && filteredDomains.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-gutter">
          {filteredDomains.map((domain) => (
            <DomainCard key={domain.id} domain={domain} />
          ))}
        </div>
      )}

      {/* Bottom Action Card */}
      <div className="mt-8 bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 border border-outline/5">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined fill text-secondary-container text-2xl">auto_fix_high</span>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-on-surface">Can't find what you're looking for?</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Chart a custom realm or forge a new quest directly in your active queue.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">add_location_alt</span>
            Add Realm
          </button>
          <Link
            to="/quests/new"
            className="px-5 py-2.5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md shadow-sm hover:translate-y-0.5 transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Forge a Quest
          </Link>
        </div>
      </div>

      {/* Create Custom Domain Modal */}
      <CreateDomainModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onDomainCreated={handleDomainCreated}
      />
    </>
  );
}
