import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../state/GameContext';
import * as domainService from '../services/domainService';
import * as questService from '../services/questService';
import { capitalize } from '../utils/domainStats';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Epic'];
const FREQUENCIES = ['Once', 'Daily', 'Weekly', 'Custom'];

const DIFFICULTY_CLASS = {
  Easy: 'bg-surface-variant text-on-surface-variant',
  Medium: 'bg-secondary-fixed text-on-secondary-fixed',
  Hard: 'bg-tertiary-fixed text-on-tertiary-fixed',
  Epic: 'bg-error-container text-on-error-container',
};

function SegmentedField({ label, options, value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-label-md text-label-md text-on-surface-variant">{label}</span>
      <div className="flex bg-surface rounded-full p-1 gap-1 flex-wrap">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-pressed={value === opt}
            className={[
              'flex-1 min-w-[64px] py-2 rounded-full font-label-md text-label-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
              value === opt
                ? 'bg-surface-container-lowest text-on-surface shadow-sm font-bold'
                : 'text-on-surface-variant hover:text-on-surface',
            ].join(' ')}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function QuestForm({ mode, questId, initialQuest, presetDomainId }) {
  const navigate = useNavigate();
  const { state, pushToast } = useGame();

  const [domains, setDomains] = useState([]);
  const [loadingDomains, setLoadingDomains] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const isEdit = mode === 'edit';

  const [title, setTitle] = useState(initialQuest?.title ?? '');
  const [description, setDescription] = useState(initialQuest?.description ?? '');
  const [domainId, setDomainId] = useState(initialQuest?.domainId ?? '');
  const [difficulty, setDifficulty] = useState(initialQuest?.difficulty ?? 'Medium');
  const [duration, setDuration] = useState(initialQuest?.duration ?? '');
  const [frequency, setFrequency] = useState(initialQuest?.frequency ?? 'Once');
  const [xp, setXp] = useState(initialQuest?.xp ?? 0);
  const [gold, setGold] = useState(initialQuest?.gold ?? 0);
  const [primaryAttribute, setPrimaryAttribute] = useState(initialQuest?.statKey ?? '');
  const [deadline, setDeadline] = useState(initialQuest?.deadline ?? '');
  const [reminder, setReminder] = useState(initialQuest?.reminder ?? '');
  const [imageUrl, setImageUrl] = useState(initialQuest?.imageUrl ?? '');

  // "Touched" fields opt out of domain-change auto-fill so editing an
  // existing quest (or a value the user already picked) never gets clobbered
  // when the domain select changes. Everything starts untouched in create
  // mode; edit mode starts pre-touched since real values already exist.
  const [touched, setTouched] = useState({
    xp: isEdit,
    gold: isEdit,
    attribute: isEdit,
    image: isEdit,
    difficulty: isEdit,
  });

  useEffect(() => {
    let cancelled = false;
    domainService.getDomains().then((data) => {
      if (cancelled) return;
      setDomains(data);
      setLoadingDomains(false);
      if (!isEdit && !domainId) {
        const initial = data.find((d) => d.id === presetDomainId) ?? data[0];
        if (initial) applyDomainDefaults(initial, {});
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedDomain = useMemo(() => domains.find((d) => d.id === domainId) ?? null, [domains, domainId]);

  function applyDomainDefaults(domain, currentTouched) {
    setDomainId(domain.id);
    if (!currentTouched.xp) setXp(Math.round((domain.xpRange.min + domain.xpRange.max) / 2));
    if (!currentTouched.gold) setGold(Math.round((domain.goldRange.min + domain.goldRange.max) / 2));
    if (!currentTouched.attribute) setPrimaryAttribute(domain.primaryAttribute[0]);
    if (!currentTouched.image) setImageUrl(domain.heroImageUrl);
    if (!currentTouched.difficulty) setDifficulty(domain.difficultyDefault);
  }

  const handleDomainChange = (newId) => {
    const domain = domains.find((d) => d.id === newId);
    if (!domain) return;
    applyDomainDefaults(domain, touched);
  };

  const markTouched = (field) => setTouched((t) => (t[field] ? t : { ...t, [field]: true }));

  const handleSuggestedQuest = (q) => {
    setTitle(q.title);
    setDescription(q.description);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !selectedDomain) return;

    setSubmitting(true);
    const payload = {
      title: title.trim(),
      description: description.trim(),
      domain: selectedDomain.name,
      domainId: selectedDomain.id,
      icon: selectedDomain.icon,
      difficulty,
      difficultyClass: DIFFICULTY_CLASS[difficulty],
      duration,
      frequency,
      timeRemaining: duration ? `${duration} Remaining` : undefined,
      xp: Number(xp) || 0,
      gold: Number(gold) || 0,
      statKey: primaryAttribute,
      statLabel: primaryAttribute ? `+3 ${capitalize(primaryAttribute)}` : undefined,
      deadline: deadline || null,
      reminder: reminder || null,
      imageUrl: imageUrl || selectedDomain.heroImageUrl,
    };

    try {
      if (isEdit) {
        const updated = await questService.updateQuest(questId, payload);
        pushToast(`${updated.title} updated`, 'edit');
        navigate(`/quests/${updated.id}`);
      } else {
        const created = await questService.createQuest(payload);
        pushToast(`Quest forged: ${created.title} · +${created.xp} XP`, 'auto_awesome');
        navigate(`/quests/${created.id}`);
      }
    } catch (err) {
      pushToast(err.message || 'Something went wrong', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const previewImage = imageUrl || selectedDomain?.heroImageUrl;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter items-start">
        <div className="xl:col-span-8 flex flex-col gap-5">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col gap-5">
            <label className="flex flex-col gap-1.5">
              <span className="font-label-md text-label-md text-on-surface-variant">Quest Title</span>
              <input
                id="quest-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-surface rounded-2xl border border-surface-container-high focus:outline-none focus:ring-4 focus:ring-primary/15 font-body-sm text-body-sm text-on-surface"
                placeholder="Name your quest"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="font-label-md text-label-md text-on-surface-variant">Description</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 bg-surface rounded-2xl border border-surface-container-high focus:outline-none focus:ring-4 focus:ring-primary/15 font-body-sm text-body-sm text-on-surface resize-none"
                placeholder="What does completing this quest involve?"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="font-label-md text-label-md text-on-surface-variant">Domain</span>
              <select
                value={domainId}
                onChange={(e) => handleDomainChange(e.target.value)}
                disabled={loadingDomains}
                required
                className="w-full px-4 py-2.5 bg-surface rounded-2xl border border-surface-container-high focus:outline-none focus:ring-4 focus:ring-primary/15 font-body-sm text-body-sm text-on-surface"
              >
                {domains.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </label>

            <SegmentedField label="Difficulty" options={DIFFICULTIES} value={difficulty} onChange={(v) => { markTouched('difficulty'); setDifficulty(v); }} />
            <SegmentedField label="Frequency" options={FREQUENCIES} value={frequency} onChange={setFrequency} />

            <label className="flex flex-col gap-1.5">
              <span className="font-label-md text-label-md text-on-surface-variant">Estimated Duration</span>
              <input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface rounded-2xl border border-surface-container-high focus:outline-none focus:ring-4 focus:ring-primary/15 font-body-sm text-body-sm text-on-surface"
                placeholder="e.g. 45 minutes"
              />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="font-label-md text-label-md text-on-surface-variant">XP Reward</span>
                <input
                  type="number"
                  min="0"
                  value={xp}
                  onChange={(e) => { markTouched('xp'); setXp(e.target.value); }}
                  className="w-full px-4 py-2.5 bg-surface rounded-2xl border border-surface-container-high focus:outline-none focus:ring-4 focus:ring-primary/15 font-body-sm text-body-sm text-on-surface"
                />
                {selectedDomain && (
                  <span className="font-label-caps text-label-caps text-outline">
                    Suggested: {selectedDomain.xpRange.min}–{selectedDomain.xpRange.max} XP
                  </span>
                )}
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="font-label-md text-label-md text-on-surface-variant">Gold Reward</span>
                <input
                  type="number"
                  min="0"
                  value={gold}
                  onChange={(e) => { markTouched('gold'); setGold(e.target.value); }}
                  className="w-full px-4 py-2.5 bg-surface rounded-2xl border border-surface-container-high focus:outline-none focus:ring-4 focus:ring-primary/15 font-body-sm text-body-sm text-on-surface"
                />
                {selectedDomain && (
                  <span className="font-label-caps text-label-caps text-outline">
                    Suggested: {selectedDomain.goldRange.min}–{selectedDomain.goldRange.max} Gold
                  </span>
                )}
              </label>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="font-label-md text-label-md text-on-surface-variant">Primary Attribute</span>
              <select
                value={primaryAttribute}
                onChange={(e) => { markTouched('attribute'); setPrimaryAttribute(e.target.value); }}
                className="w-full px-4 py-2.5 bg-surface rounded-2xl border border-surface-container-high focus:outline-none focus:ring-4 focus:ring-primary/15 font-body-sm text-body-sm text-on-surface"
              >
                {state.attributes.map((a) => (
                  <option key={a.key} value={a.key}>
                    {a.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="font-label-md text-label-md text-on-surface-variant">Deadline (optional)</span>
                <input
                  type="date"
                  value={deadline ?? ''}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface rounded-2xl border border-surface-container-high focus:outline-none focus:ring-4 focus:ring-primary/15 font-body-sm text-body-sm text-on-surface"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="font-label-md text-label-md text-on-surface-variant">Reminder (optional)</span>
                <input
                  type="datetime-local"
                  value={reminder ?? ''}
                  onChange={(e) => setReminder(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface rounded-2xl border border-surface-container-high focus:outline-none focus:ring-4 focus:ring-primary/15 font-body-sm text-body-sm text-on-surface"
                />
              </label>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="font-label-md text-label-md text-on-surface-variant">Quest Image (optional)</span>
              <input
                value={imageUrl}
                onChange={(e) => { markTouched('image'); setImageUrl(e.target.value); }}
                className="w-full px-4 py-2.5 bg-surface rounded-2xl border border-surface-container-high focus:outline-none focus:ring-4 focus:ring-primary/15 font-body-sm text-body-sm text-on-surface"
                placeholder="Defaults to the domain's hero image"
              />
            </label>
          </div>

          {selectedDomain && selectedDomain.quests.length > 0 && (
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col gap-3">
              <span className="font-label-md text-label-md text-on-surface-variant">
                Suggested Quests in {selectedDomain.name}
              </span>
              <div className="flex flex-col gap-2">
                {selectedDomain.quests.map((q) => (
                  <button
                    key={q.title}
                    type="button"
                    onClick={() => handleSuggestedQuest(q)}
                    className="text-left px-4 py-3 rounded-2xl bg-surface hover:bg-surface-container transition-colors flex flex-col gap-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <span className="font-label-lg text-label-lg text-on-surface">{q.title}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">
                      {q.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="xl:col-span-4 flex flex-col gap-gutter xl:sticky xl:top-24">
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="relative h-40">
              {previewImage ? (
                <img src={previewImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-surface-container" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
              {selectedDomain && (
                <div
                  className={`absolute top-3 left-3 w-10 h-10 rounded-2xl flex items-center justify-center shadow-md ${selectedDomain.accentClass}`}
                >
                  <span className="material-symbols-outlined fill text-xl">{selectedDomain.icon}</span>
                </div>
              )}
              <span className="absolute bottom-3 left-4 font-headline-sm text-base font-bold text-white">
                {title || 'Untitled Quest'}
              </span>
            </div>
            <div className="p-5 flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-label-caps text-label-caps text-primary bg-primary-fixed px-2 py-0.5 rounded-full font-extrabold">
                  +{Number(xp) || 0} XP
                </span>
                <span className="font-label-caps text-label-caps text-secondary-container bg-[#FFF8E6] px-2 py-0.5 rounded-full font-extrabold">
                  +{Number(gold) || 0} Gold
                </span>
                {selectedDomain && (
                  <span className={`px-2.5 py-0.5 rounded-full font-label-caps text-label-caps uppercase ${DIFFICULTY_CLASS[difficulty]}`}>
                    {difficulty}
                  </span>
                )}
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3">
                {description || 'Add a description so future-you remembers the plan.'}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={submitting || loadingDomains}
              className="w-full py-3.5 rounded-full font-label-lg text-label-lg shadow-md transition-all flex items-center justify-center gap-2 bg-primary-container text-on-primary hover:translate-y-0.5 disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-lg">{isEdit ? 'save' : 'bolt'}</span>
              <span>{submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Forge Quest'}</span>
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full py-3 rounded-full font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
