import { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    q: 'How does the Experience (XP) & Leveling curve work?',
    a: 'Your level requirement scales non-linearly using the formula: XP Required = round(100 * Level^1.4). Every completed quest yields XP towards your overall player level, plus specialized affinity points that rank up your domain levels and specific character attributes.',
  },
  {
    q: 'What are the 15 Life Domains?',
    a: 'Life RPG organizes real-world activities into 15 distinct realms: Sports, Fitness, Programming, Education, Reading, Health, Finance, Music, Creativity, Career, Meditation, Personal Development, Gaming, Social, and Travel. Each domain maps to core RPG attributes like Strength, Focus, Discipline, and Intelligence.',
  },
  {
    q: 'How do Streaks and Daily Missions work?',
    a: 'Completing at least one active quest in a 24-hour cycle advances your daily streak. Milestones at 3, 7, 14, 30, 60, and 100 days unlock exclusive badges, cosmetic titles, and Gold bonuses. Daily missions reset at midnight local time.',
  },
  {
    q: 'What can I spend Gold on in the Loot Vault?',
    a: 'Gold earned from completing quests can be redeemed in the Loot Vault for vanity themes (e.g. Midnight Aurora, Cyber Neon), avatar frames, character titles, profile badges, and streak shields.',
  },
  {
    q: 'Can I create custom quests with my own rewards?',
    a: 'Yes! Use the "Forge a Quest" button located on the Quests Board or Domains Explorer. Selecting a domain automatically tailors recommended XP, Gold rewards, and primary attributes.',
  },
  {
    q: 'Does Life RPG store my data in a cloud server?',
    a: 'Currently, the application runs on a high-speed simulated REST service layer in your browser session. Future updates will introduce full cloud persistence and wearable device synchronizations (Oura, Apple Health, Whoop).',
  },
];

const SHORTCUTS = [
  { key: 'Tab / Shift+Tab', desc: 'Navigate forward and backward through interactive elements' },
  { key: 'Enter / Space', desc: 'Activate selected buttons, toggles, and quest checkoffs' },
  { key: 'Escape', desc: 'Close any active modal, dialog, or drawer overlay' },
  { key: 'Arrow Keys', desc: 'Switch tabs and navigate category pill filters' },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider bg-surface-variant px-3 py-1 rounded-full">
            Archive Codex
          </span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight flex items-center gap-2">
          <span className="material-symbols-outlined fill text-primary text-2xl">menu_book</span>
          Life RPG Codex &amp; Guide
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-0.5">
          Everything you need to master your real-life progression mechanics, formulas, and realm lore.
        </p>
      </div>

      {/* Quick Start Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline/5 flex flex-col gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center font-bold">
            1
          </div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface">Forge Quests</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Convert real-life obligations, study blocks, workouts, and habits into quantifiable quests with difficulty ratings.
          </p>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline/5 flex flex-col gap-2">
          <div className="w-10 h-10 rounded-xl bg-secondary-fixed text-secondary flex items-center justify-center font-bold">
            2
          </div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface">Claim Rewards</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Mark quests complete as you execute them in real life. Instantly collect XP, Gold, and attribute boosts.
          </p>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline/5 flex flex-col gap-2">
          <div className="w-10 h-10 rounded-xl bg-tertiary-fixed text-tertiary flex items-center justify-center font-bold">
            3
          </div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface">Ascend Realms</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Watch your polygon attribute chart expand across 15 domains. Unlock titles, badges, and rare cosmetics.
          </p>
        </div>
      </div>

      {/* Mechanics Breakdown */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline/5 flex flex-col gap-4">
        <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl">functions</span>
          Progression Mathematics
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
          <div className="p-4 bg-surface-container rounded-xl flex flex-col gap-1">
            <span className="font-label-caps text-label-caps text-outline uppercase">Level Up Curve</span>
            <span className="font-mono text-sm font-bold text-primary">XP(L) = 100 × (Level)^1.4</span>
            <p className="font-body-sm text-xs text-on-surface-variant mt-1">
              Guarantees fast early milestones (Lvl 1-5) while ensuring veteran levels reflect true enduring dedication.
            </p>
          </div>

          <div className="p-4 bg-surface-container rounded-xl flex flex-col gap-1">
            <span className="font-label-caps text-label-caps text-outline uppercase">Attribute Distribution</span>
            <span className="font-mono text-sm font-bold text-secondary">StatXP = StatAmount × 10</span>
            <p className="font-body-sm text-xs text-on-surface-variant mt-1">
              Every quest directs bonus points to its primary attribute (e.g. Strength for Fitness, Intelligence for Code).
            </p>
          </div>
        </div>
      </div>

      {/* Keyboard Accessibility Cheat Sheet */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline/5 flex flex-col gap-4">
        <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-tertiary text-xl">keyboard</span>
          Keyboard Navigation Reference
        </h2>
        <div className="divide-y divide-surface-container">
          {SHORTCUTS.map((sc) => (
            <div key={sc.key} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm">
              <span className="font-mono text-xs bg-surface-variant px-2.5 py-1 rounded-md text-primary font-bold self-start">
                {sc.key}
              </span>
              <span className="font-body-sm text-on-surface-variant">{sc.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline/5 flex flex-col gap-4">
        <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl">help</span>
          Frequently Asked Questions
        </h2>
        <div className="divide-y divide-surface-container">
          {FAQS.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={faq.q} className="py-3">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 text-left font-label-lg text-label-lg font-semibold text-on-surface hover:text-primary transition-colors"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <span
                    className={`material-symbols-outlined text-outline transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {isOpen && (
                  <p className="font-body-md text-body-md text-on-surface-variant mt-2 pl-1 leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer link to quest board */}
      <div className="bg-gradient-to-r from-primary-container to-secondary-container rounded-2xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <h3 className="font-headline-md text-headline-md font-bold">Ready to embark?</h3>
          <p className="font-body-md text-white/80">Turn knowledge into action on today's quest board.</p>
        </div>
        <Link
          to="/"
          className="px-6 py-3 rounded-full bg-white text-ink font-label-lg font-bold shadow-md hover:scale-105 transition-all shrink-0"
        >
          Return to Adventure
        </Link>
      </div>
    </div>
  );
}
