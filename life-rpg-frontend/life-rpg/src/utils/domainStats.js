// Domains don't carry an explicit "progress to next domain level" field —
// only cumulative xpEarned + domainLevel. This derives a stable 0-100 bar
// from xpEarned so DomainsPage and DomainDetailsPage render identical
// progress without duplicating the formula.
export function getDomainProgressPct(stats) {
  if (!stats) return 0;
  return Math.min(100, Math.round((stats.xpEarned % 1000) / 10));
}

const HOVER_CLASS = {
  primary: 'hover:bg-primary-container hover:text-on-primary',
  secondary: 'hover:bg-secondary-container hover:text-on-secondary',
  tertiary: 'hover:bg-tertiary-container hover:text-on-tertiary',
};

export const capitalize = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : str);

// Older mock quests only carry a free-text domain label ("Sports &
// Athletics", "Reading & Lore") rather than a real domainId. Match on the
// first word against the real domain list so those quests can still be
// linked back to a domain's hero image/accent/stats.
export function resolveDomainId(domainLabel, domains) {
  if (!domainLabel) return undefined;
  const firstWord = domainLabel.split(/[\s&]/)[0]?.toLowerCase();
  const exact = domains.find((d) => d.name.toLowerCase() === domainLabel.toLowerCase());
  if (exact) return exact.id;
  const fuzzy = domains.find((d) => d.name.toLowerCase().startsWith(firstWord));
  return fuzzy?.id;
}

// Adapts a domain's seed quest (title/description only) into the shape
// RecommendedQuestCard expects, reusing the domain's accent token family so
// the card matches the domain's own color language.
export function toRecommendedQuest(domain, quest, index) {
  const statKey = domain.primaryAttribute[0];
  const span = domain.xpRange.max - domain.xpRange.min;
  const xp = Math.round(domain.xpRange.min + (span * (index + 1)) / (domain.quests.length + 1));

  return {
    id: `${domain.id}-seed-${index}`,
    category: `${domain.name} • ${domain.difficultyDefault}`,
    categoryClass: `text-${domain.accent}`,
    icon: domain.icon,
    iconWrapClass: domain.accentClass,
    title: quest.title,
    description: quest.description,
    xp,
    statLabel: `+3 ${capitalize(statKey)}`,
    statChipClass: domain.chipClass,
    hoverClass: HOVER_CLASS[domain.accent] ?? HOVER_CLASS.primary,
    statKey,
    statAmount: 3,
  };
}
