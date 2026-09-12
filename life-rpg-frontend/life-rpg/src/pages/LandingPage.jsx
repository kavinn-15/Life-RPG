import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getToken } from '../services/apiClient';
import './LandingPage.css';

const STATS_DATA = [
  { name: 'Strength', fill: 72, stat: '72 / 100', domain: 'Fitness & Physical Conditioning' },
  { name: 'Intellect', fill: 88, stat: '88 / 100', domain: 'Architecture & System Design' },
  { name: 'Discipline', fill: 94, stat: '94 / 100', domain: 'Habit Formation & Focus' },
  { name: 'Wisdom', fill: 65, stat: '65 / 100', domain: 'Mindfulness & Mental Models' },
];

const STEPS_DATA = [
  {
    step: '1',
    title: 'Create a quest',
    desc: 'Add a real task — gym, study, reading, budgeting — and tag it to an attribute stat.',
  },
  {
    step: '2',
    title: 'Complete it',
    desc: 'Mark it done in the real world. No proof-of-work friction, just an honest checkbox.',
  },
  {
    step: '3',
    title: 'Earn XP & gold',
    desc: 'Your character earns experience, levels up skills, and accumulates vault gold on the spot.',
  },
  {
    step: '4',
    title: 'Rank up',
    desc: 'Stats climb, tier levels increase, and exclusive loot vault rewards unlock as you progress.',
  },
];

const FEATURED_DOMAINS = [
  {
    id: 'programming',
    name: 'Programming',
    tagline: 'Architecture & Codecraft',
    icon: 'terminal',
    desc: 'Master software engineering, system design, and algorithmic thinking.',
  },
  {
    id: 'fitness',
    name: 'Fitness',
    tagline: 'Strength & Conditioning',
    icon: 'fitness_center',
    desc: 'Forge physical power, endurance, mobility, and cardiovascular health.',
  },
  {
    id: 'reading',
    name: 'Reading',
    tagline: 'Intellect & Synthesis',
    icon: 'auto_stories',
    desc: 'Expand intellect, comprehension, and mental models through daily reading.',
  },
  {
    id: 'finance',
    name: 'Finance',
    tagline: 'Wealth & Sovereignty',
    icon: 'trending_up',
    desc: 'Build financial literacy, wealth accumulation, and resource management.',
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness',
    tagline: 'Inner Stillness & Clarity',
    icon: 'self_improvement',
    desc: 'Cultivate mental stillness, emotional regulation, and deep presence.',
  },
  {
    id: 'productivity',
    name: 'Productivity',
    tagline: 'Deep Work & Systems',
    icon: 'bolt',
    desc: 'Master time blocking, deep work rituals, and distraction elimination.',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(getToken()));
  }, []);

  // 3D Tilt interactive effect matching the user's specification
  useEffect(() => {
    const container = pageRef.current;
    if (!container) return;

    const els = container.querySelectorAll('.tilt-3d');
    const listeners = [];

    els.forEach((el) => {
      const maxTilt =
        el.classList.contains('landing-step') ||
        el.classList.contains('landing-stat-card') ||
        el.classList.contains('landing-domain-card')
          ? 7
          : 10;

      const onMouseMove = (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const px = (x / r.width) * 100;
        const py = (y / r.height) * 100;
        const rx = (y / r.height - 0.5) * -2 * maxTilt;
        const ry = (x / r.width - 0.5) * 2 * maxTilt;
        el.style.setProperty('--mx', `${px}%`);
        el.style.setProperty('--my', `${py}%`);
        el.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px) scale(1.03)`;
      };

      const onMouseLeave = () => {
        el.style.transform = 'perspective(700px) rotateX(0) rotateY(0) translateY(0) scale(1)';
      };

      el.addEventListener('mousemove', onMouseMove);
      el.addEventListener('mouseleave', onMouseLeave);
      listeners.push({ el, onMouseMove, onMouseLeave });
    });

    return () => {
      listeners.forEach(({ el, onMouseMove, onMouseLeave }) => {
        el.removeEventListener('mousemove', onMouseMove);
        el.removeEventListener('mouseleave', onMouseLeave);
      });
    };
  }, []);

  const handleStartAdventure = () => {
    if (isLoggedIn) {
      navigate('/adventure');
    } else {
      navigate('/register');
    }
  };

  const handleAuthButton = () => {
    if (isLoggedIn) {
      navigate('/adventure');
    } else {
      navigate('/login');
    }
  };

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div ref={pageRef} className="landing-container">
      {/* Continuous Site-wide Background */}
      <div className="site-photo" aria-hidden="true" />
      <div className="site-overlay" aria-hidden="true" />

      <div className="content-layer">
        {/* Navigation Bar */}
        <nav className="landing-nav" aria-label="Main Navigation">
          <div className="landing-wrap">
            <Link to="/" className="landing-brand">
              <img src="/logo.png" alt="Life RPG Emblem" className="landing-brand-mark" />
              <span>LIFE RPG</span>
            </Link>

            <div className="landing-nav-links">
              <a href="#about" onClick={(e) => scrollToSection(e, 'about')}>
                About
              </a>
              <a href="#how" onClick={(e) => scrollToSection(e, 'how')}>
                How it works
              </a>
              <a href="#domains" onClick={(e) => scrollToSection(e, 'domains')}>
                Domains
              </a>
              <Link to="/support">Codex Guide</Link>
              <button
                type="button"
                className="landing-btn-login tilt-3d"
                onClick={handleAuthButton}
              >
                {isLoggedIn ? 'Dashboard' : 'Log In'}
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="landing-hero">
          <div className="landing-beam" aria-hidden="true" />
          <div className="landing-spark" style={{ left: '48%', animationDelay: '0s' }} aria-hidden="true" />
          <div className="landing-spark" style={{ left: '51%', animationDelay: '1.5s' }} aria-hidden="true" />
          <div className="landing-spark" style={{ left: '53%', animationDelay: '3s' }} aria-hidden="true" />
          <div className="landing-spark" style={{ left: '47%', animationDelay: '4.5s' }} aria-hidden="true" />

          <div className="landing-hero-inner">
            <div className="landing-rank-chip tilt-3d">
              RANK <b>E</b> &nbsp;→&nbsp; RANK <b>S</b>
            </div>

            <h1>
              Your life is the game.<br />
              Start <span>leveling up.</span>
            </h1>

            <p>
              Turn workouts, study sessions, and daily habits into quests. Earn XP, grow your stats, and rank up — for real.
            </p>

            <div className="landing-cta-row">
              <button
                type="button"
                className="landing-btn landing-btn-primary tilt-3d"
                onClick={handleStartAdventure}
              >
                Start Adventure
              </button>
              <a
                href="#how"
                className="landing-btn landing-btn-ghost tilt-3d"
                onClick={(e) => scrollToSection(e, 'how')}
              >
                See how it works
              </a>
            </div>
          </div>
        </header>

        {/* About Section */}
        <section className="landing-section landing-about" id="about">
          <div className="landing-wrap">
            <div className="landing-about-grid">
              <div className="landing-about-copy">
                <div className="landing-eyebrow">What is Life RPG</div>
                <h2 style={{ fontSize: '32px', marginBottom: '18px', color: 'var(--text-hi)' }}>
                  Your habits, tracked like a character sheet.
                </h2>
                <p>
                  Every task you complete — a workout, a chapter read, a study session — feeds XP into a stat that
                  matters. Strength grows from fitness. Intellect grows from study. Discipline grows from consistency.
                </p>
                <p>
                  No streak lost to a forgotten checkbox, no goal that fades in a month. Just steady, visible progress,
                  the way a good game makes progress feel.
                </p>
              </div>

              <div>
                {STATS_DATA.map((item) => (
                  <div key={item.name} className="landing-stat-card tilt-3d">
                    <div>
                      <span className="landing-stat-name">{item.name}</span>
                      <div style={{ fontSize: '11px', color: 'var(--text-low)', marginTop: '2px' }}>
                        {item.domain}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-hi)' }}>
                        {item.stat}
                      </span>
                      <div className="landing-stat-bar-track">
                        <div className="landing-stat-bar-fill" style={{ width: `${item.fill}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="landing-section" id="how">
          <div className="landing-wrap">
            <div className="landing-section-head">
              <div className="landing-eyebrow">How it works</div>
              <h2>Four steps from task to level-up.</h2>
              <p>A frictionless feedback loop designed to reward real-world consistency.</p>
            </div>
          </div>

          <div className="landing-wrap">
            <div className="landing-steps">
              {STEPS_DATA.map((s) => (
                <div key={s.step} className="landing-step tilt-3d">
                  <div className="landing-step-icon">{s.step}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Specialized Domains Realm Section */}
        <section className="landing-section" id="domains" style={{ borderTop: '1px solid var(--panel-border)', background: 'rgba(8, 11, 20, 0.45)' }}>
          <div className="landing-wrap">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '48px' }}>
              <div className="landing-section-head" style={{ marginBottom: 0 }}>
                <div className="landing-eyebrow">15 Life Realms</div>
                <h2>Explore specialized disciplines.</h2>
                <p>Every realm bolsters specific attributes on your multi-axis character matrix.</p>
              </div>
              <Link
                to="/domains"
                className="landing-btn landing-btn-ghost tilt-3d"
                style={{ padding: '12px 28px', fontSize: '14px' }}
              >
                View All 15 Realms →
              </Link>
            </div>

            <div className="landing-domains-grid">
              {FEATURED_DOMAINS.map((d) => (
                <div key={d.id} className="landing-domain-card tilt-3d">
                  <div>
                    <div className="landing-domain-icon">
                      <span className="material-symbols-outlined text-xl">{d.icon}</span>
                    </div>
                    <h3 style={{ fontSize: '20px', color: 'var(--text-hi)', marginBottom: '4px' }}>
                      {d.name}
                    </h3>
                    <div style={{ fontSize: '12px', color: 'var(--blue)', fontWeight: 600, marginBottom: '10px' }}>
                      {d.tagline}
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-low)', lineHeight: 1.5 }}>
                      {d.desc}
                    </p>
                  </div>
                  <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid rgba(90, 140, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link
                      to={`/domains/${d.id}`}
                      style={{ fontSize: '13px', color: 'var(--blue)', fontWeight: 600 }}
                    >
                      Inspect Realm & Quests →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="landing-final-cta">
          <div className="landing-wrap">
            <h2>Ready to turn your to-do list into a character sheet?</h2>
            <button
              type="button"
              className="landing-btn landing-btn-primary tilt-3d"
              onClick={handleStartAdventure}
            >
              Start Adventure
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="landing-footer">
          <div className="landing-wrap" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '24px' }}>
            <div className="landing-footer-top">
              <img src="/logo.png" alt="Life RPG Logo" style={{ height: '40px', borderRadius: '10px' }} />
              <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '20px', letterSpacing: '0.05em' }}>
                LIFE RPG
              </span>
            </div>

            <div className="landing-footer-bottom">
              <div className="landing-footer-note">© 2026 Life RPG. All rights reserved. Level Up Reality.</div>
              <div className="landing-footer-links">
                <a href="#about" onClick={(e) => scrollToSection(e, 'about')}>About</a>
                <a href="#how" onClick={(e) => scrollToSection(e, 'how')}>How it works</a>
                <a href="#domains" onClick={(e) => scrollToSection(e, 'domains')}>Domains</a>
                <Link to="/support">Codex Guide</Link>
                <Link to="/login">Sign In</Link>
                <Link to="/register">Register</Link>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href="mailto:support@liferpg.app">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
