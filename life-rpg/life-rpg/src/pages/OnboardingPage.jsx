import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../state/GameContext';
import { domains } from '../data/domainData';
import * as characterService from '../services/characterService';

const AVATAR_OPTIONS = [
  { id: 'cyber-nomad', name: 'Cyber Nomad', icon: 'terminal', desc: 'Code architecture, nocturnal focus, terminal mastery' },
  { id: 'iron-paladin', name: 'Iron Paladin', icon: 'fitness_center', desc: 'Discipline, physical conditioning, heavy compound reps' },
  { id: 'astral-monk', name: 'Astral Monk', icon: 'self_improvement', desc: 'Mindfulness, stillness, nervous system regulation' },
  { id: 'grand-scholar', name: 'Grand Scholar', icon: 'school', desc: 'Knowledge synthesis, deep research, lifelong learning' },
  { id: 'venture-ranger', name: 'Venture Ranger', icon: 'trending_up', desc: 'Financial sovereignty, strategy, high-yield moves' },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { setState, pushToast } = useGame();

  const [step, setStep] = useState(1);
  const [characterName, setCharacterName] = useState('Alex Mercer');
  const [characterTitle, setCharacterTitle] = useState('Cyber Nomad');
  const [selectedDomains, setSelectedDomains] = useState(['programming', 'fitness', 'reading']);
  const [dailyGoal, setDailyGoal] = useState(3);
  const [preferredDifficulty, setPreferredDifficulty] = useState('Medium');
  const [lifeObjective, setLifeObjective] = useState('Build unshakeable daily habits and master distributed systems engineering.');
  const [selectedAvatar, setSelectedAvatar] = useState('cyber-nomad');

  const toggleDomain = (id) => {
    setSelectedDomains((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((d) => d !== id) : prev) : [...prev, id]
    );
  };

  const handleComplete = async () => {
    const updatedData = {
      playerName: characterName,
      title: characterTitle,
      dailyGoal,
      preferredDifficulty,
      mainObjective: lifeObjective,
      avatarClass: selectedAvatar,
      favoriteDomains: selectedDomains,
    };

    try {
      await characterService.updateCharacter(updatedData);
      setState((prev) => ({
        ...prev,
        ...updatedData,
      }));
      pushToast('Character Genesis Complete! Welcome to Life RPG.', 'stars');
      navigate('/');
    } catch {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-ink flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-primary-container selection:text-white">
      {/* Glow aura */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/20 blur-[140px] pointer-events-none rounded-full" />

      {/* Brand */}
      <div className="flex items-center gap-3 mb-6 z-10">
        <div className="w-10 h-10 rounded-2xl bg-primary-container flex items-center justify-center shadow-[0_4px_0_#4029ba]">
          <span className="material-symbols-outlined text-on-primary text-[24px]">swords</span>
        </div>
        <span className="text-xl font-headline-md font-bold text-white tracking-tight">
          Life RPG Character Forge
        </span>
      </div>

      {/* Card Container */}
      <div className="w-full max-w-2xl bg-ink-surface/95 border border-ink-border/80 backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-2xl relative z-10 flex flex-col">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-ink-border/60">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-8 bg-primary-container'
                    : s < step
                    ? 'w-4 bg-tertiary'
                    : 'w-4 bg-ink-rail'
                }`}
              />
            ))}
          </div>
          <span className="font-label-caps text-xs text-ink-muted">
            Step {step} of 5
          </span>
        </div>

        {/* STEP 1: Name & Character Title */}
        {step === 1 && (
          <div className="flex flex-col gap-5 animate-fadeIn">
            <div>
              <span className="text-xs font-label-caps uppercase text-primary-fixed tracking-wider">
                Step 1: Identity
              </span>
              <h2 className="text-2xl font-headline-lg font-bold text-white mt-1">
                Name Your Character
              </h2>
              <p className="font-body-md text-sm text-ink-muted mt-1">
                Choose the name and heroic title that will be etched across your quest boards and leaderboards.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block font-label-md text-xs text-ink-muted mb-1 font-semibold">
                  Character Name
                </label>
                <input
                  type="text"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  placeholder="e.g. Alex Mercer"
                  className="w-full px-4 py-3 bg-ink-rail border border-ink-border rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <div>
                <label className="block font-label-md text-xs text-ink-muted mb-1 font-semibold">
                  Initial Title / Class
                </label>
                <input
                  type="text"
                  value={characterTitle}
                  onChange={(e) => setCharacterTitle(e.target.value)}
                  placeholder="e.g. Cyber Nomad, Ironbound Monk, Agile Architect"
                  className="w-full px-4 py-3 bg-ink-rail border border-ink-border rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Favorite Domains Selection */}
        {step === 2 && (
          <div className="flex flex-col gap-5 animate-fadeIn">
            <div>
              <span className="text-xs font-label-caps uppercase text-primary-fixed tracking-wider">
                Step 2: Core Realms
              </span>
              <h2 className="text-2xl font-headline-lg font-bold text-white mt-1">
                Select Your Favorite Domains
              </h2>
              <p className="font-body-md text-sm text-ink-muted mt-1">
                Pick 2 to 5 life realms you want to prioritize. We'll tailor your initial quest feed around these.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {domains.map((d) => {
                const isSelected = selectedDomains.includes(d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => toggleDomain(d.id)}
                    className={`p-3 rounded-xl text-left border transition-all flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-primary-container/20 border-primary text-white shadow-sm'
                        : 'bg-ink-rail border-ink-border/60 text-ink-muted hover:border-ink-border hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="material-symbols-outlined text-lg">{d.icon}</span>
                      {isSelected && (
                        <span className="material-symbols-outlined text-sm text-primary-fixed">check_circle</span>
                      )}
                    </div>
                    <span className="font-label-lg text-xs font-bold">{d.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Goals & Difficulty */}
        {step === 3 && (
          <div className="flex flex-col gap-5 animate-fadeIn">
            <div>
              <span className="text-xs font-label-caps uppercase text-primary-fixed tracking-wider">
                Step 3: Rhythm &amp; Ambition
              </span>
              <h2 className="text-2xl font-headline-lg font-bold text-white mt-1">
                Daily Goal &amp; Objective
              </h2>
              <p className="font-body-md text-sm text-ink-muted mt-1">
                Set a sustainable quest rhythm to build enduring compounding habits.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block font-label-md text-xs text-ink-muted mb-2 font-semibold">
                  Daily Quests Quota: <span className="text-primary-fixed font-bold">{dailyGoal} Quests / Day</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(Number(e.target.value))}
                  className="w-full accent-primary h-2 bg-ink-rail rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-ink-muted mt-1">
                  <span>1 (Casual)</span>
                  <span>3 (Balanced)</span>
                  <span>6 (Hardcore)</span>
                </div>
              </div>

              <div>
                <label className="block font-label-md text-xs text-ink-muted mb-1 font-semibold">
                  Preferred Default Difficulty
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['Easy', 'Medium', 'Hard', 'Epic'].map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setPreferredDifficulty(diff)}
                      className={`py-2 rounded-xl text-xs font-label-md transition-all border ${
                        preferredDifficulty === diff
                          ? 'bg-primary-container text-on-primary font-bold border-primary'
                          : 'bg-ink-rail text-ink-muted border-ink-border hover:text-white'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-label-md text-xs text-ink-muted mb-1 font-semibold">
                  Your Primary Life Objective
                </label>
                <textarea
                  rows="2"
                  value={lifeObjective}
                  onChange={(e) => setLifeObjective(e.target.value)}
                  placeholder="What is your North Star goal for this campaign?"
                  className="w-full px-4 py-2.5 bg-ink-rail border border-ink-border rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Avatar Style Selection */}
        {step === 4 && (
          <div className="flex flex-col gap-5 animate-fadeIn">
            <div>
              <span className="text-xs font-label-caps uppercase text-primary-fixed tracking-wider">
                Step 4: Archetype
              </span>
              <h2 className="text-2xl font-headline-lg font-bold text-white mt-1">
                Select Your Character Class Archetype
              </h2>
              <p className="font-body-md text-sm text-ink-muted mt-1">
                Choose the archetype that matches your preferred life philosophy.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              {AVATAR_OPTIONS.map((av) => {
                const isSelected = selectedAvatar === av.id;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatar(av.id)}
                    className={`p-3.5 rounded-2xl text-left border transition-all flex items-center gap-4 ${
                      isSelected
                        ? 'bg-primary-container/20 border-primary text-white shadow-md'
                        : 'bg-ink-rail border-ink-border/60 text-ink-muted hover:border-ink-border hover:text-white'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-primary text-white' : 'bg-ink-border text-ink-muted'
                      }`}
                    >
                      <span className="material-symbols-outlined text-2xl">{av.icon}</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-lg text-sm font-bold text-white">{av.name}</span>
                      <span className="font-body-sm text-xs text-ink-muted">{av.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: Final Summary & Begin Adventure */}
        {step === 5 && (
          <div className="flex flex-col gap-6 text-center items-center animate-fadeIn py-2">
            <div className="w-16 h-16 rounded-3xl bg-primary-container flex items-center justify-center text-white shadow-[0_6px_0_#4029ba]">
              <span className="material-symbols-outlined text-3xl">auto_awesome</span>
            </div>

            <div>
              <h2 className="text-3xl font-headline-lg font-bold text-white tracking-tight">
                Your adventure begins now.
              </h2>
              <p className="font-body-md text-sm text-ink-muted mt-1 max-w-md mx-auto">
                Welcome to Life RPG, <span className="text-white font-bold">{characterName}</span>. Your character sheet and initial quest feed have been forged.
              </p>
            </div>

            <div className="w-full bg-ink-rail p-4 rounded-2xl border border-ink-border/80 text-left grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-ink-muted block uppercase text-[10px] font-label-caps">Archetype</span>
                <span className="text-white font-bold">{characterTitle}</span>
              </div>
              <div>
                <span className="text-ink-muted block uppercase text-[10px] font-label-caps">Daily Quota</span>
                <span className="text-white font-bold">{dailyGoal} Quests / Day</span>
              </div>
              <div>
                <span className="text-ink-muted block uppercase text-[10px] font-label-caps">Difficulty</span>
                <span className="text-white font-bold">{preferredDifficulty}</span>
              </div>
              <div>
                <span className="text-ink-muted block uppercase text-[10px] font-label-caps">Selected Domains</span>
                <span className="text-primary-fixed font-bold">{selectedDomains.length} Active Realms</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-5 border-t border-ink-border/60 flex items-center justify-between gap-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="px-5 py-2.5 rounded-full text-xs font-label-lg text-ink-muted hover:text-white transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="px-6 py-2.5 rounded-full bg-primary-container text-on-primary text-xs font-label-lg font-bold shadow-[0_4px_0_#4029ba] hover:translate-y-0.5 transition-all flex items-center gap-1.5"
            >
              <span>Continue</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleComplete}
              className="px-8 py-3 rounded-full bg-primary-container text-on-primary text-sm font-label-lg font-bold shadow-[0_6px_0_#4029ba] hover:translate-y-0.5 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">swords</span>
              <span>Enter Life RPG</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
