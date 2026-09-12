import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../state/GameContext';
import * as domainService from '../services/domainService';

const AVAILABLE_ICONS = [
  { id: 'music_note', label: 'Music' },
  { id: 'palette', label: 'Art & Design' },
  { id: 'sports_esports', label: 'Gaming & Strategy' },
  { id: 'psychology', label: 'Mind & Intellect' },
  { id: 'restaurant', label: 'Culinary & Cooking' },
  { id: 'mic', label: 'Public Speaking' },
  { id: 'menu_book', label: 'Lore & Reading' },
  { id: 'science', label: 'Science & Lab' },
  { id: 'fitness_center', label: 'Athletics' },
  { id: 'local_florist', label: 'Gardening & Nature' },
  { id: 'construction', label: 'Maker & Craft' },
  { id: 'theater_comedy', label: 'Drama & Expression' },
  { id: 'savings', label: 'Commerce' },
  { id: 'code', label: 'Programming' },
  { id: 'school', label: 'Academia' },
  { id: 'self_improvement', label: 'Meditation' },
  { id: 'flight', label: 'Travel & Exploration' },
  { id: 'emoji_events', label: 'Championship' },
];

const ATTRIBUTES = [
  'Creativity',
  'Intelligence',
  'Discipline',
  'Focus',
  'Wisdom',
  'Strength',
  'Agility',
  'Vitality',
  'Charisma',
  'Resilience',
];

const DEFAULT_BANNER = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80';

export default function CreateDomainModal({ isOpen, onClose, onDomainCreated }) {
  const { pushToast, grantRewards } = useGame();

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('palette');
  const [selectedAttrs, setSelectedAttrs] = useState(['Creativity', 'Focus']);
  const [difficulty, setDifficulty] = useState('Medium');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [imageFileName, setImageFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const toggleAttribute = (attr) => {
    setSelectedAttrs((prev) =>
      prev.includes(attr) ? prev.filter((a) => a !== attr) : [...prev, attr]
    );
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setHeroImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    const payload = {
      name: name.trim(),
      tagline: tagline.trim() || `${name.trim()} Mastery & Craft`,
      description: description.trim() || `Custom habit and skill pursuit domain for ${name.trim()}.`,
      icon: selectedIcon,
      heroImageUrl: heroImageUrl || DEFAULT_BANNER,
      difficultyDefault: difficulty,
      primaryAttributes: selectedAttrs.length > 0 ? selectedAttrs : ['Wisdom', 'Focus'],
      xpMin: 50,
      xpMax: 200,
      goldMin: 20,
      goldMax: 60,
    };

    try {
      const created = await domainService.createDomain(payload);
      grantRewards({ xp: 50, gold: 25 });
      pushToast(`Realm charted: ${created.name}!`, 'public');
      if (onDomainCreated) {
        onDomainCreated(created);
      }
      onClose();
    } catch (err) {
      console.warn('Backend custom domain create error, applying local domain:', err);
      const fallbackDomain = {
        id: name.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-'),
        name: name.trim(),
        tagline: tagline.trim() || `${name.trim()} Mastery`,
        description: description.trim() || `Custom habit and skill realm.`,
        heroImageUrl: heroImageUrl || DEFAULT_BANNER,
        icon: selectedIcon,
        accent: '#8c7ae6',
        accentClass: 'bg-primary-container text-on-primary',
        chipClass: 'text-primary bg-primary-fixed',
        softClass: 'bg-primary-fixed-dim/30',
        difficultyDefault: difficulty,
        primaryAttribute: selectedAttrs.length > 0 ? selectedAttrs : ['Wisdom', 'Focus'],
        xpRange: { min: 50, max: 200 },
        goldRange: { min: 20, max: 60 },
        stats: { questsCompleted: 0, xpEarned: 0, domainLevel: 1, streak: 0 },
      };
      grantRewards({ xp: 50, gold: 25 });
      pushToast(`Realm charted: ${fallbackDomain.name}!`, 'public');
      if (onDomainCreated) {
        onDomainCreated(fallbackDomain);
      }
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const previewBanner = heroImageUrl || DEFAULT_BANNER;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-surface-container-lowest border border-outline/10 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-surface-container">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-xl">add_location_alt</span>
              </span>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Chart a New Realm</h2>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  Add a custom skill or habit domain to track your real-life mastery.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6 max-h-[75vh] overflow-y-auto">
            {/* Live Domain Card Preview */}
            <div className="bg-surface rounded-2xl p-4 border border-surface-container flex flex-col gap-2">
              <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">
                Live Realm Preview
              </span>
              <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm flex flex-col border border-outline/5">
                <div className="relative h-32 w-full overflow-hidden">
                  <img src={previewBanner} alt="Domain Banner Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />
                  <div className="absolute top-3 left-3 w-10 h-10 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined fill text-xl">{selectedIcon}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <h3 className="font-headline-sm text-lg font-bold text-white">
                        {name || 'Your New Domain'}
                      </h3>
                      <p className="font-body-sm text-xs text-white/80">
                        {tagline || 'Mastery, discipline & progressive milestones'}
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container-lowest/90 text-on-surface text-xs font-bold backdrop-blur-sm">
                      Level 1
                    </span>
                  </div>
                </div>
                <div className="p-3.5 flex flex-wrap items-center justify-between gap-2 bg-surface-container-lowest text-xs text-on-surface-variant">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {selectedAttrs.slice(0, 3).map((a) => (
                      <span key={a} className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps">
                        {a}
                      </span>
                    ))}
                  </div>
                  <span className="font-label-caps text-label-caps text-primary font-bold">
                    0 Quests • 0 XP
                  </span>
                </div>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="font-label-md text-label-md text-on-surface-variant">
                  Domain Name <span className="text-primary">*</span>
                </span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-surface rounded-2xl border border-surface-container-high focus:outline-none focus:ring-4 focus:ring-primary/15 font-body-sm text-body-sm text-on-surface"
                  placeholder="e.g. Music Production, Culinary Arts, Chess"
                />
              </label>

              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="font-label-md text-label-md text-on-surface-variant">Tagline / Sphere</span>
                <input
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface rounded-2xl border border-surface-container-high focus:outline-none focus:ring-4 focus:ring-primary/15 font-body-sm text-body-sm text-on-surface"
                  placeholder="e.g. Rhythm, Composition & Audio Mastery"
                />
              </label>

              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="font-label-md text-label-md text-on-surface-variant">Description</span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-surface rounded-2xl border border-surface-container-high focus:outline-none focus:ring-4 focus:ring-primary/15 font-body-sm text-body-sm text-on-surface resize-none"
                  placeholder="Describe what habits and practices this realm tracks..."
                />
              </label>
            </div>

            {/* Icon Picker */}
            <div className="flex flex-col gap-2">
              <span className="font-label-md text-label-md text-on-surface-variant">Choose Domain Crest Icon</span>
              <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
                {AVAILABLE_ICONS.map((ico) => (
                  <button
                    key={ico.id}
                    type="button"
                    title={ico.label}
                    onClick={() => setSelectedIcon(ico.id)}
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                      selectedIcon === ico.id
                        ? 'bg-primary-container text-on-primary ring-2 ring-primary shadow-sm scale-105'
                        : 'bg-surface hover:bg-surface-container text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">{ico.id}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Attributes */}
            <div className="flex flex-col gap-2">
              <span className="font-label-md text-label-md text-on-surface-variant">
                Associated Character Attributes (Pick 1–3)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {ATTRIBUTES.map((attr) => {
                  const active = selectedAttrs.includes(attr);
                  return (
                    <button
                      key={attr}
                      type="button"
                      onClick={() => toggleAttribute(attr)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-label-md transition-all ${
                        active
                          ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                          : 'bg-surface hover:bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {active ? '✓ ' : ''}{attr}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Banner Image Upload */}
            <div className="flex flex-col gap-2">
              <span className="font-label-md text-label-md text-on-surface-variant">Realm Banner Image (optional)</span>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3.5 bg-surface rounded-2xl border border-dashed border-surface-container-high">
                {heroImageUrl ? (
                  <div className="w-16 h-12 rounded-xl overflow-hidden shrink-0 border border-surface-container bg-surface-container-high">
                    <img src={heroImageUrl} alt="Banner" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-outline shrink-0">
                    <span className="material-symbols-outlined text-xl">image</span>
                  </div>
                )}
                <div className="flex-1 flex flex-col justify-center">
                  <span className="font-label-md text-label-md text-on-surface font-semibold text-xs truncate">
                    {imageFileName || (heroImageUrl ? 'Custom banner selected' : 'Upload custom wallpaper/photo')}
                  </span>
                  <span className="font-body-xs text-[11px] text-on-surface-variant">
                    Accepts any image format (PNG, JPG, WEBP, SVG, etc.).
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <label className="px-3.5 py-2 rounded-full bg-primary-container text-on-primary font-label-sm text-xs shadow-sm cursor-pointer hover:bg-primary transition-colors flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">upload_file</span>
                    <span>{heroImageUrl ? 'Change' : 'Browse File'}</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                  {heroImageUrl && (
                    <button
                      type="button"
                      onClick={() => { setHeroImageUrl(''); setImageFileName(''); }}
                      className="px-2.5 py-2 rounded-full bg-surface-container hover:bg-error-container hover:text-on-error-container text-on-surface-variant text-xs transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-container">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-high transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !name.trim()}
                className="px-6 py-2.5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md shadow-md hover:translate-y-0.5 active:translate-y-1 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">auto_fix_high</span>
                <span>{submitting ? 'Charting Realm...' : 'Forge Realm'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
