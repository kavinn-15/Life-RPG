import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please provide a valid email format (e.g. hero@domain.com).';
    }
    if (!password) {
      errs.password = 'Password is required.';
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
      await authService.login(email, password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 600);
    } catch (err) {
      setServerError(err.message || 'Authentication failed. Verify credentials.');
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('alex@liferpg.app');
    setPassword('rpgmaster123');
    setErrors({});
    setLoading(true);
    try {
      await authService.login('alex@liferpg.app', 'rpgmaster123');
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (err) {
      setServerError(err.message || 'Demo login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-primary-container selection:text-white">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-primary/20 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-tertiary/10 blur-[100px] pointer-events-none rounded-full" />

      {/* Brand header */}
      <Link to="/" className="flex items-center gap-3 mb-8 z-10">
        <div className="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center shadow-[0_4px_0_#4029ba]">
          <span className="material-symbols-outlined text-on-primary text-[28px]">swords</span>
        </div>
        <div className="flex flex-col text-left">
          <span className="text-headline-md font-headline-md text-white tracking-tight leading-none">
            Life RPG
          </span>
          <span className="text-[10px] font-label-caps text-tertiary-fixed uppercase tracking-widest mt-1">
            Gateway Portal
          </span>
        </div>
      </Link>

      {/* Glass Card Container */}
      <div className="w-full max-w-md bg-ink-surface/90 border border-ink-border/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-headline-lg font-bold text-white tracking-tight">
            Return to the Realm
          </h1>
          <p className="font-body-md text-sm text-ink-muted mt-1">
            Enter your credentials to access today's quest board.
          </p>
        </div>

        {serverError && (
          <div className="mb-5 p-3 rounded-xl bg-error/15 border border-error/30 text-error font-body-sm text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{serverError}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 p-3 rounded-xl bg-tertiary/15 border border-tertiary/30 text-tertiary font-body-sm text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-base">check_circle</span>
            <span>Portal verified. Entering Life RPG...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block font-label-md text-xs text-ink-muted mb-1 font-semibold">
              Adventurer Email
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-3 text-ink-muted text-lg pointer-events-none">
                mail
              </span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                }}
                placeholder="alex@liferpg.app"
                className={`w-full pl-10 pr-4 py-2.5 bg-ink-rail border rounded-xl text-sm text-white placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.email ? 'border-error ring-1 ring-error' : 'border-ink-border'
                }`}
              />
            </div>
            {errors.email && (
              <p className="font-body-sm text-[11px] text-error mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="pass" className="font-label-md text-xs text-ink-muted font-semibold">
                Secret Password
              </label>
              <Link to="/forgot-password" className="font-label-md text-[11px] text-primary-fixed hover:underline">
                Forgot pass?
              </Link>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-3 text-ink-muted text-lg pointer-events-none">
                lock
              </span>
              <input
                id="pass"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                }}
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-2.5 bg-ink-rail border rounded-xl text-sm text-white placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.password ? 'border-error ring-1 ring-error' : 'border-ink-border'
                }`}
              />
            </div>
            {errors.password && (
              <p className="font-body-sm text-[11px] text-error mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="mt-2 w-full py-3 rounded-xl bg-primary-container text-on-primary font-label-lg text-sm font-bold shadow-[0_4px_0_#4029ba] hover:translate-y-0.5 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                <span>Opening Portal...</span>
              </>
            ) : (
              <>
                <span>Enter Nexus</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Demo One-Click Login */}
        <div className="mt-6 pt-5 border-t border-ink-border/60 flex flex-col gap-3 text-center">
          <span className="font-label-caps text-[10px] uppercase text-ink-muted tracking-wider">
            Reviewer Demo Access
          </span>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading || success}
            className="w-full py-2.5 rounded-xl bg-ink-rail hover:bg-ink-border text-white border border-ink-border text-xs font-label-lg font-bold transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base text-secondary">flash_on</span>
            <span>One-Click Login as "Alex" (Level 12)</span>
          </button>
        </div>

        {/* Register footer link */}
        <p className="text-center font-body-sm text-xs text-ink-muted mt-6">
          New to Life RPG?{' '}
          <Link to="/register" className="text-primary-fixed font-bold hover:underline">
            Forge an account
          </Link>
        </p>
      </div>
    </div>
  );
}
