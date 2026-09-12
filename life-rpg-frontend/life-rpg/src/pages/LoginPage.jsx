import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';
import './LandingPage.css';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  // 3D Tilt interactive effect matching Landing Page
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const onMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -6;
      const rotY = ((x - cx) / cx) * 6;

      el.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-2px)`;
      el.style.setProperty('--mx', `${(x / rect.width) * 100}%`);
      el.style.setProperty('--my', `${(y / rect.height) * 100}%`);
    };

    const onMouseLeave = () => {
      el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    };

    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);

    return () => {
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Adventurer email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please provide a valid email (e.g. hero@domain.com).';
    }
    if (!password) {
      errs.password = 'Secret cipher (password) is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await authService.login(email.trim(), password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 600);
    } catch (err) {
      setServerError(err.message || 'Authentication failed. Please verify credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="landing-container auth-container">
      {/* Site-wide Background System */}
      <div className="site-photo" />
      <div className="site-overlay" />

      {/* Atmospheric Beam & Sparks */}
      <div className="landing-beam" />
      <div className="landing-spark" style={{ left: '25%', animationDelay: '0s' }} />
      <div className="landing-spark" style={{ left: '42%', animationDelay: '1.6s' }} />
      <div className="landing-spark" style={{ left: '58%', animationDelay: '3.2s' }} />
      <div className="landing-spark" style={{ left: '76%', animationDelay: '4.7s' }} />

      {/* Top Header Navigation */}
      <header className="auth-nav">
        <div className="auth-nav-wrap">
          <Link to="/" className="landing-brand auth-brand">
            <img src="/logo.png" alt="Life RPG Emblem" className="landing-brand-mark" />
            <span>LIFE RPG</span>
          </Link>

          <div className="auth-nav-links">
            <Link to="/" className="auth-nav-link">
              <span className="material-symbols-outlined text-base">home</span>
              <span>Home</span>
            </Link>
            <Link to="/register" className="auth-btn-nav">
              <span className="material-symbols-outlined text-base">person_add</span>
              <span>Register</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Login Main Form Layer */}
      <main className="auth-content-layer">
        <div className="auth-rank-chip">
          <span>PORTAL ACCESS</span>
          <span>•</span>
          <b>REALM AUTHENTICATION</b>
        </div>

        {/* Auth Glass Card */}
        <div ref={cardRef} className="auth-card tilt-3d">
          <div className="text-center">
            <h1 className="auth-title">
              WELCOME BACK, <span>HERO</span>
            </h1>
            <p className="auth-subtitle">
              Enter your credentials to re-enter your life quest log.
            </p>
          </div>

          {/* Server Feedback Alerts */}
          {serverError && (
            <div className="auth-alert-error">
              <span className="material-symbols-outlined text-lg">error</span>
              <span>{serverError}</span>
            </div>
          )}

          {success && (
            <div className="auth-alert-success">
              <span className="material-symbols-outlined text-lg">verified</span>
              <span>Authentication approved! Entering realm...</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="email" className="auth-label">
                Adventurer Email
              </label>
              <div className="auth-input-wrapper">
                <span className="material-symbols-outlined auth-input-icon">mail</span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                  }}
                  placeholder="adventurer@example.com"
                  autoComplete="email"
                  className={`auth-input ${errors.email ? 'auth-input-error' : ''}`}
                />
              </div>
              {errors.email && (
                <div className="auth-field-error">
                  <span className="material-symbols-outlined text-sm">warning</span>
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            <div className="auth-field">
              <div className="auth-label-row">
                <label htmlFor="pass" className="auth-label">
                  Secret Password
                </label>
                <Link to="/forgot-password" className="auth-link-sm">
                  Forgot?
                </Link>
              </div>
              <div className="auth-input-wrapper">
                <span className="material-symbols-outlined auth-input-icon">lock</span>
                <input
                  id="pass"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                  }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`auth-input ${errors.password ? 'auth-input-error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth-input-toggle"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined text-base">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {errors.password && (
                <div className="auth-field-error">
                  <span className="material-symbols-outlined text-sm">warning</span>
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="auth-btn-primary"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                  <span>Opening Portal...</span>
                </>
              ) : (
                <>
                  <span>Enter Realm</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Registration Footer */}
          <div className="auth-footer-text">
            <span>New to the realm?</span>
            <Link to="/register" className="auth-footer-link">
              Forge an Account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
