import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGame } from '../state/GameContext';
import { domains } from '../data/domainData';
import * as characterService from '../services/characterService';
import { getStoredUser } from '../services/apiClient';
import './LandingPage.css';
import './OnboardingPage.css';

const AVATAR_OPTIONS = [
  {
    id: 'cyber-nomad',
    name: 'Cyber Nomad',
    icon: 'terminal',
    bonus: '+INT // +CODE',
    desc: 'Code architecture, nocturnal focus, terminal mastery, and deep systems engineering.',
  },
  {
    id: 'iron-paladin',
    name: 'Iron Paladin',
    icon: 'fitness_center',
    bonus: '+STR // +END',
    desc: 'Unshakeable physical discipline, heavy compound reps, and high cardiovascular grit.',
  },
  {
    id: 'astral-monk',
    name: 'Astral Monk',
    icon: 'self_improvement',
    bonus: '+WIS // +ZEN',
    desc: 'Mindfulness, stillness, emotional regulation, and deep nervous system mastery.',
  },
  {
    id: 'grand-scholar',
    name: 'Grand Scholar',
    icon: 'school',
    bonus: '+INT // +SYNTH',
    desc: 'Knowledge synthesis, relentless research, mental models, and lifelong polymath learning.',
  },
  {
    id: 'venture-ranger',
    name: 'Venture Ranger',
    icon: 'trending_up',
    bonus: '+FIN // +STRAT',
    desc: 'Financial sovereignty, strategic compounding, resource allocation, and market foresight.',
  },
];

const TITLE_SUGGESTIONS = [
  'Cyber Nomad',
  'Iron Paladin',
  'Grand Scholar',
  'Astral Monk',
  'Agile Architect',
  'Shadow Operative',
  'Venture Ranger',
];

const STEPS = [
  { num: 1, label: 'Identity' },
  { num: 2, label: 'Realms' },
  { num: 3, label: 'Rhythm' },
  { num: 4, label: 'Archetype' },
  { num: 5, label: 'Genesis' },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const game = useGame();
  const setGameState = game?.setState;
  const pushToast = game?.pushToast;

  const cardRef = useRef(null);
  const [step, setStep] = useState(1);

  // Character Configuration State
  const [characterName, setCharacterName] = useState(() => getStoredUser()?.name || '');
  const [characterTitle, setCharacterTitle] = useState('Cyber Nomad');
  const [selectedDomains, setSelectedDomains] = useState(['programming', 'fitness', 'reading']);
  const [dailyGoal, setDailyGoal] = useState(3);
  const [preferredDifficulty, setPreferredDifficulty] = useState('Medium');
  const [lifeObjective, setLifeObjective] = useState(
    'Build unshakeable daily compounding habits and master full-stack systems engineering.'
  );
  const [selectedAvatar, setSelectedAvatar] = useState('cyber-nomad');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Interactive 3D Tilt Effect matching Landing Page
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const onMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -3;
      const rotY = ((x - cx) / cx) * 3;

      el.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-2px)`;
    };

    const onMouseLeave = () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    };

    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);

    return () => {
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  const toggleDomain = (id) => {
    setSelectedDomains((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((d) => d !== id) : prev) : [...prev, id]
    );
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    const updatedData = {
      playerName: characterName.trim() || 'Adventurer',
      title: characterTitle.trim() || 'Novice Seeker',
      dailyGoal,
      preferredDifficulty,
      mainObjective: lifeObjective,
      avatarClass: selectedAvatar,
      favoriteDomains: selectedDomains,
    };

    try {
      await characterService.updateCharacter(updatedData);
      if (setGameState) {
        setGameState((prev) => ({
          ...prev,
          ...updatedData,
        }));
      }
      if (pushToast) {
        pushToast('Character Genesis Complete! Welcome to Life RPG.', 'stars');
      }
      navigate('/adventure');
    } catch (err) {
      console.warn('Character update fallback:', err);
      if (setGameState) {
        setGameState((prev) => ({
          ...prev,
          ...updatedData,
        }));
      }
      navigate('/adventure');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeArchetype = AVATAR_OPTIONS.find((a) => a.id === selectedAvatar) || AVATAR_OPTIONS[0];

  return (
    <div className="onboarding-container">
      {/* Site Background & Atmospheric Gradients */}
      <div className="onboarding-site-photo" />
      <div className="onboarding-site-overlay" />

      {/* Top Navigation */}
      <header className="onboarding-nav">
        <div className="onboarding-nav-wrap">
          <Link to="/" className="onboarding-brand">
            <img src="/logo.png" alt="Life RPG Emblem" className="onboarding-brand-mark" />
            <span>LIFE RPG</span>
          </Link>

          <div className="onboarding-nav-badge">
            <span className="material-symbols-outlined text-[16px]">shield</span>
            <span>Genesis Protocol</span>
          </div>
        </div>
      </header>

      {/* Content Layer */}
      <main className="onboarding-content-layer">
        <div ref={cardRef} className="onboarding-card">
          {/* Step Pipeline Tracker */}
          <div className="onboarding-pipeline">
            <div className="onboarding-step-nodes">
              {STEPS.map((s, idx) => {
                const isCompleted = step > s.num;
                const isActive = step === s.num;
                return (
                  <div key={s.num} style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                      className={`onboarding-node ${isActive ? 'active' : ''} ${
                        isCompleted ? 'completed' : ''
                      }`}
                    >
                      {isCompleted ? (
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      ) : (
                        `0${s.num}`
                      )}
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div
                        className={`onboarding-connector ${step > s.num ? 'completed' : ''}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="onboarding-rank-chip">
              PHASE <b>0{step} // 05</b>
            </div>
          </div>

          {/* STEP 1: Hero Identity */}
          {step === 1 && (
            <section className="onboarding-step-view">
              <div className="onboarding-header">
                <div className="onboarding-rank-chip">
                  STEP 01 // <b>IDENTITY PROTOCOL</b>
                </div>
                <h1 className="onboarding-title">
                  Name Your <span>Heroic Soul</span>
                </h1>
                <p className="onboarding-subtitle">
                  Inscribe your adventurer handle and initial class title that will echo across quest boards and leaderboards.
                </p>
              </div>

              <div className="onboarding-field">
                <label className="onboarding-label">Adventurer Name</label>
                <div className="onboarding-input-wrapper">
                  <span className="material-symbols-outlined onboarding-input-icon">person</span>
                  <input
                    type="text"
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                    placeholder="e.g. Rowan Vance"
                    className="onboarding-input"
                  />
                </div>
              </div>

              <div className="onboarding-field">
                <label className="onboarding-label">Character Class Title</label>
                <div className="onboarding-input-wrapper">
                  <span className="material-symbols-outlined onboarding-input-icon">military_tech</span>
                  <input
                    type="text"
                    value={characterTitle}
                    onChange={(e) => setCharacterTitle(e.target.value)}
                    placeholder="e.g. Cyber Nomad, Agile Architect"
                    className="onboarding-input"
                  />
                </div>
                <div className="onboarding-quick-tags">
                  {TITLE_SUGGESTIONS.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setCharacterTitle(sug)}
                      className="onboarding-tag-btn"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* STEP 2: Realm & Domain Alignment */}
          {step === 2 && (
            <section className="onboarding-step-view">
              <div className="onboarding-header">
                <div className="onboarding-rank-chip">
                  STEP 02 // <b>REALM ALIGNMENT</b>
                </div>
                <h1 className="onboarding-title">
                  Choose Your <span>Life Realms</span>
                </h1>
                <p className="onboarding-subtitle">
                  Select {selectedDomains.length} of {domains.length} realms to prioritize. Your quest feed and attribute progression will revolve around these spheres.
                </p>
              </div>

              <div className="onboarding-domain-grid">
                {domains.map((d) => {
                  const isSelected = selectedDomains.includes(d.id);
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => toggleDomain(d.id)}
                      className={`onboarding-domain-tile ${isSelected ? 'selected' : ''}`}
                    >
                      <div className="onboarding-domain-header">
                        <div className="onboarding-domain-icon">
                          <span className="material-symbols-outlined">{d.icon}</span>
                        </div>
                        {isSelected && (
                          <span className="material-symbols-outlined onboarding-domain-check">
                            check_circle
                          </span>
                        )}
                      </div>
                      <div className="onboarding-domain-name">{d.name}</div>
                      <div className="onboarding-domain-desc">{d.tagline || d.description}</div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* STEP 3: Rhythm & Ambition */}
          {step === 3 && (
            <section className="onboarding-step-view">
              <div className="onboarding-header">
                <div className="onboarding-rank-chip">
                  STEP 03 // <b>DISCIPLINE & QUOTA</b>
                </div>
                <h1 className="onboarding-title">
                  Set Your <span>Quest Rhythm</span>
                </h1>
                <p className="onboarding-subtitle">
                  Calibrate a sustainable daily pace to trigger compounding progress without burnout.
                </p>
              </div>

              <div className="onboarding-field">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="onboarding-label" style={{ marginBottom: 0 }}>Daily Quota</label>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--blue)' }}>
                    {dailyGoal} Quests / Day
                  </span>
                </div>
                <div className="onboarding-slider-track">
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={dailyGoal}
                    onChange={(e) => setDailyGoal(Number(e.target.value))}
                    className="onboarding-range"
                  />
                  <div className="onboarding-slider-labels">
                    <span>1 (Casual)</span>
                    <span>3 (Balanced)</span>
                    <span>6 (Hardcore)</span>
                  </div>
                </div>
              </div>

              <div className="onboarding-field">
                <label className="onboarding-label">Preferred Default Difficulty</label>
                <div className="onboarding-diff-grid">
                  {['Easy', 'Medium', 'Hard', 'Epic'].map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setPreferredDifficulty(diff)}
                      className={`onboarding-diff-btn ${
                        preferredDifficulty === diff ? `selected-${diff}` : ''
                      }`}
                    >
                      <span>{diff}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="onboarding-field">
                <label className="onboarding-label">Primary North Star Objective</label>
                <textarea
                  rows="2"
                  value={lifeObjective}
                  onChange={(e) => setLifeObjective(e.target.value)}
                  placeholder="What is your North Star goal for this campaign?"
                  className="onboarding-textarea"
                />
              </div>
            </section>
          )}

          {/* STEP 4: Archetype Selection */}
          {step === 4 && (
            <section className="onboarding-step-view">
              <div className="onboarding-header">
                <div className="onboarding-rank-chip">
                  STEP 04 // <b>CLASS ARCHETYPE</b>
                </div>
                <h1 className="onboarding-title">
                  Choose Your <span>Archetype</span>
                </h1>
                <p className="onboarding-subtitle">
                  Select the hero class that reflects your lifestyle philosophy and primary stat multipliers.
                </p>
              </div>

              <div className="onboarding-archetype-list">
                {AVATAR_OPTIONS.map((av) => {
                  const isSelected = selectedAvatar === av.id;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedAvatar(av.id)}
                      className={`onboarding-archetype-card ${isSelected ? 'selected' : ''}`}
                    >
                      <div className="onboarding-archetype-icon">
                        <span className="material-symbols-outlined">{av.icon}</span>
                      </div>
                      <div className="onboarding-archetype-info">
                        <div className="onboarding-archetype-title-row">
                          <span className="onboarding-archetype-name">{av.name}</span>
                          <span className="onboarding-archetype-bonus">{av.bonus}</span>
                        </div>
                        <p className="onboarding-archetype-desc">{av.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* STEP 5: Final Character Genesis */}
          {step === 5 && (
            <section className="onboarding-step-view onboarding-summary-container">
              <div className="onboarding-genesis-emblem">
                <span className="material-symbols-outlined text-[38px]">auto_awesome</span>
              </div>

              <div>
                <div className="onboarding-rank-chip" style={{ marginBottom: '10px' }}>
                  GENESIS // <b>CHARACTER FORGED</b>
                </div>
                <h1 className="onboarding-title" style={{ margin: 0 }}>
                  Ready to Ascend, <span>{characterName || 'Adventurer'}</span>
                </h1>
                <p className="onboarding-subtitle" style={{ marginTop: '8px', maxWidth: '520px' }}>
                  Your soul profile, daily quest pipeline, and starting attribute matrix are synthesized. Step into the realm.
                </p>
              </div>

              <div className="onboarding-dossier-card">
                <div className="onboarding-dossier-item">
                  <span className="onboarding-dossier-label">Hero Identity</span>
                  <span className="onboarding-dossier-value highlight">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    {characterName}
                  </span>
                </div>

                <div className="onboarding-dossier-item">
                  <span className="onboarding-dossier-label">Class Archetype</span>
                  <span className="onboarding-dossier-value">
                    <span className="material-symbols-outlined text-[18px]">
                      {activeArchetype.icon}
                    </span>
                    {characterTitle} ({activeArchetype.name})
                  </span>
                </div>

                <div className="onboarding-dossier-item">
                  <span className="onboarding-dossier-label">Daily Rhythm & Difficulty</span>
                  <span className="onboarding-dossier-value">
                    <span className="material-symbols-outlined text-[18px]">event_repeat</span>
                    {dailyGoal} Quests / Day · {preferredDifficulty}
                  </span>
                </div>

                <div className="onboarding-dossier-item">
                  <span className="onboarding-dossier-label">Active Realms</span>
                  <span className="onboarding-dossier-value highlight">
                    <span className="material-symbols-outlined text-[18px]">hub</span>
                    {selectedDomains.length} Realms Aligned
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* Footer Action Buttons */}
          <footer className="onboarding-footer">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="onboarding-btn-back"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>Previous</span>
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="onboarding-btn-continue"
              >
                <span>Proceed</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                disabled={isSubmitting}
                className="onboarding-btn-launch"
              >
                <span className="material-symbols-outlined text-[20px]">swords</span>
                <span>{isSubmitting ? 'Forging Soul...' : 'Enter Life RPG'}</span>
              </button>
            )}
          </footer>
        </div>
      </main>
    </div>
  );
}
