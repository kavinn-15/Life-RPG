import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const [emailStatus, setEmailStatus] = useState({ checking: false, available: null, message: '' });

  const checkEmailLive = async (emailVal) => {
    const clean = emailVal.trim().toLowerCase();
    if (!clean || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setEmailStatus({ checking: false, available: null, message: '' });
      return;
    }
    setEmailStatus({ checking: true, available: null, message: '' });
    try {
      const res = await authService.checkEmail(clean);
      if (res?.exists) {
        setEmailStatus({
          checking: false,
          available: false,
          message: 'An adventurer with this email already exists.',
        });
        setErrors((prev) => ({ ...prev, email: 'This email is already registered. Please login instead.' }));
      } else {
        setEmailStatus({
          checking: false,
          available: true,
          message: 'Email is available for registration.',
        });
        setErrors((prev) => ({ ...prev, email: null }));
      }
    } catch {
      setEmailStatus({ checking: false, available: null, message: '' });
    }
  };

  const validate = () => {
    const errs = {};
    if (!name.trim()) {
      errs.name = 'Adventurer handle / name is required.';
    }
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Enter a valid email address (e.g. hero@domain.com).';
    } else if (emailStatus.available === false) {
      errs.email = 'This email is already registered. Please login instead.';
    }
    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
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
      await authService.register(name.trim(), email.trim(), password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/onboarding');
      }, 600);
    } catch (err) {
      setServerError(err.message || 'Registration failed.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-primary-container selection:text-white">
      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-primary/20 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-tertiary/10 blur-[100px] pointer-events-none rounded-full" />

      {/* Brand header */}
      <Link to="/" className="flex items-center gap-3 mb-8 z-10 group">
        <div className="w-12 h-12 rounded-2xl bg-ink-card border border-primary/40 flex items-center justify-center p-0.5 shadow-[0_0_20px_rgba(110,86,248,0.4)] group-hover:shadow-[0_0_25px_rgba(56,189,248,0.6)] transition-all overflow-hidden">
          <img
            src="/logo.png"
            alt="Life RPG Logo"
            className="w-full h-full object-cover rounded-xl transform scale-110 group-hover:scale-125 transition-transform duration-300"
          />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-headline-md font-headline-md text-white tracking-tight leading-none group-hover:text-primary transition-colors">
            Life RPG
          </span>
          <span className="text-[10px] font-label-caps text-tertiary-fixed uppercase tracking-widest mt-1">
            Character Genesis
          </span>
        </div>
      </Link>

      {/* Glass Card Container */}
      <div className="w-full max-w-md bg-ink-surface/90 border border-ink-border/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-headline-lg font-bold text-white tracking-tight">
            Create Adventurer Account
          </h1>
          <p className="font-body-md text-sm text-ink-muted mt-1">
            Begin converting real-world effort into RPG ascendancy.
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
            <span>Character soul forged! Directing to onboarding...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div>
            <label htmlFor="name" className="block font-label-md text-xs text-ink-muted mb-1 font-semibold">
              Adventurer Name / Alias
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-3 text-ink-muted text-lg pointer-events-none">
                person
              </span>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                }}
                placeholder="e.g. Alex Mercer"
                className={`w-full pl-10 pr-4 py-2.5 bg-ink-rail border rounded-xl text-sm text-white placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.name ? 'border-error ring-1 ring-error' : 'border-ink-border'
                }`}
              />
            </div>
            {errors.name && (
              <p className="font-body-sm text-[11px] text-error mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="reg-email" className="font-label-md text-xs text-ink-muted font-semibold">
                Email Address
              </label>
              {emailStatus.checking && (
                <span className="text-[10px] text-ink-muted flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs animate-spin">progress_activity</span>
                  Checking...
                </span>
              )}
              {emailStatus.available === true && !errors.email && (
                <span className="text-[10px] text-tertiary flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-xs">check_circle</span>
                  Available
                </span>
              )}
              {emailStatus.available === false && (
                <span className="text-[10px] text-error flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-xs">error</span>
                  Already Registered
                </span>
              )}
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-3 text-ink-muted text-lg pointer-events-none">
                mail
              </span>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                  if (e.target.value.includes('@') && e.target.value.includes('.')) {
                    checkEmailLive(e.target.value);
                  }
                }}
                onBlur={(e) => checkEmailLive(e.target.value)}
                placeholder="alex@liferpg.app"
                className={`w-full pl-10 pr-10 py-2.5 bg-ink-rail border rounded-xl text-sm text-white placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.email || emailStatus.available === false
                    ? 'border-error ring-1 ring-error'
                    : emailStatus.available === true
                    ? 'border-tertiary/60 ring-1 ring-tertiary/40'
                    : 'border-ink-border'
                }`}
              />
              {emailStatus.available === true && (
                <span className="material-symbols-outlined absolute right-3 top-3 text-tertiary text-lg pointer-events-none">
                  verified
                </span>
              )}
            </div>
            {errors.email && (
              <p className="font-body-sm text-[11px] text-error mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="reg-pass" className="block font-label-md text-xs text-ink-muted mb-1 font-semibold">
              Create Password (min. 6 characters)
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-3 text-ink-muted text-lg pointer-events-none">
                lock
              </span>
              <input
                id="reg-pass"
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

          <div>
            <label htmlFor="confirm-pass" className="block font-label-md text-xs text-ink-muted mb-1 font-semibold">
              Confirm Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-3 text-ink-muted text-lg pointer-events-none">
                lock_reset
              </span>
              <input
                id="confirm-pass"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }));
                }}
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-2.5 bg-ink-rail border rounded-xl text-sm text-white placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.confirmPassword ? 'border-error ring-1 ring-error' : 'border-ink-border'
                }`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="font-body-sm text-[11px] text-error mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="mt-3 w-full py-3 rounded-xl bg-primary-container text-on-primary font-label-lg text-sm font-bold shadow-[0_4px_0_#4029ba] hover:translate-y-0.5 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                <span>Forging Character...</span>
              </>
            ) : (
              <>
                <span>Begin Character Creation</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center font-body-sm text-xs text-ink-muted mt-6">
          Already forged?{' '}
          <Link to="/login" className="text-primary-fixed font-bold hover:underline">
            Sign into your portal
          </Link>
        </p>
      </div>
    </div>
  );
}
