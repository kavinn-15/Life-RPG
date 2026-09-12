import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  // Steps: 1 = Email Input, 2 = OTP Verification, 3 = Reset Password, 4 = Success
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  // Resend OTP cooldown timer
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // References for OTP input focus handling
  const otpInputRefs = useRef([]);

  useEffect(() => {
    let interval = null;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (step === 2 && timer === 0) {
      setCanResend(true);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timer]);

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMsg('Adventurer email is required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMsg('Please enter a valid email format (e.g. hero@domain.com).');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.forgotPassword(cleanEmail);
      setInfoMsg(res?.message || 'A 6-digit OTP code has been sent to your Gmail inbox.');
      setStep(2);
      setTimer(60);
      setCanResend(false);
      // Auto focus the first OTP input
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 200);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send OTP code. Please check your email and try again.');
    } finally {
      setLoading(false);
    }
  };

  // OTP Input change handler
  const handleOtpChange = (index, value) => {
    // Only numeric
    const sanitized = value.replace(/\D/g, '');
    if (sanitized.length > 1) {
      // Pasted multiple digits
      const chars = sanitized.slice(0, 6).split('');
      const newOtp = [...otpValues];
      chars.forEach((c, idx) => {
        if (index + idx < 6) {
          newOtp[index + idx] = c;
        }
      });
      setOtpValues(newOtp);
      const nextIdx = Math.min(index + chars.length, 5);
      otpInputRefs.current[nextIdx]?.focus();
      return;
    }

    const newOtp = [...otpValues];
    newOtp[index] = sanitized;
    setOtpValues(newOtp);
    setErrorMsg('');

    if (sanitized && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otpValues];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || '';
    }
    setOtpValues(newOtp);
    const targetIdx = Math.min(pastedData.length, 5);
    otpInputRefs.current[targetIdx]?.focus();
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    const fullOtp = otpValues.join('');
    if (fullOtp.length !== 6) {
      setErrorMsg('Please enter all 6 digits of the OTP code.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.verifyOtp(email, fullOtp);
      setInfoMsg(res?.message || 'OTP code verified! Please choose a new password.');
      setStep(3);
    } catch (err) {
      setErrorMsg(err.message || 'Invalid or expired OTP code. Please verify and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend || loading) return;
    setErrorMsg('');
    setInfoMsg('');
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setInfoMsg('A new 6-digit OTP code has been dispatched to your Gmail inbox.');
      setTimer(60);
      setCanResend(false);
      setOtpValues(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    } catch (err) {
      setErrorMsg(err.message || 'Unable to resend OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (!newPassword) {
      setErrorMsg('New password is required.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('Password must contain at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const fullOtp = otpValues.join('');
      await authService.resetPassword(email, fullOtp, newPassword);
      setStep(4);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update password. Please retry the process.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate password strength indicator
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, text: 'Empty', color: 'bg-ink-border' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 25, text: 'Weak', color: 'bg-error' };
    if (score === 2 || score === 3) return { score: 60, text: 'Medium', color: 'bg-amber-500' };
    return { score: 100, text: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(newPassword);

  return (
    <div className="min-h-screen bg-ink flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-primary-container selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[360px] bg-primary/20 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[320px] h-[320px] bg-tertiary/10 blur-[110px] pointer-events-none rounded-full" />

      {/* Brand header */}
      <Link to="/" className="flex items-center gap-3 mb-8 z-10">
        <div className="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center shadow-[0_4px_0_#4029ba]">
          <span className="material-symbols-outlined text-on-primary text-[28px]">lock_reset</span>
        </div>
        <div className="flex flex-col text-left">
          <span className="text-headline-md font-headline-md text-white tracking-tight leading-none">
            Life RPG
          </span>
          <span className="text-[10px] font-label-caps text-tertiary-fixed uppercase tracking-widest mt-1">
            Account Recovery Portal
          </span>
        </div>
      </Link>

      {/* Main Glass Card */}
      <div className="w-full max-w-md bg-ink-surface/90 border border-ink-border/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative z-10">
        {/* Step Progress Tracker */}
        <div className="flex items-center justify-between mb-8 px-2">
          {[
            { num: 1, label: 'Email' },
            { num: 2, label: 'Verify OTP' },
            { num: 3, label: 'New Password' },
            { num: 4, label: 'Restored' },
          ].map((item, idx, arr) => {
            const isCompleted = step > item.num;
            const isCurrent = step === item.num;
            return (
              <div key={item.num} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCompleted
                        ? 'bg-tertiary text-ink shadow-[0_0_12px_rgba(20,241,149,0.5)]'
                        : isCurrent
                        ? 'bg-primary-container text-on-primary ring-4 ring-primary/25 shadow-[0_0_12px_rgba(100,70,240,0.5)]'
                        : 'bg-ink-rail text-ink-muted border border-ink-border'
                    }`}
                  >
                    {isCompleted ? (
                      <span className="material-symbols-outlined text-base">check</span>
                    ) : (
                      item.num
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-label-caps uppercase tracking-wider mt-1.5 ${
                      isCurrent ? 'text-primary-fixed font-bold' : 'text-ink-muted'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                {idx < arr.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 mb-4 rounded transition-all ${
                      step > item.num ? 'bg-tertiary' : 'bg-ink-border/60'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Dynamic Alerts */}
        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-error/15 border border-error/30 text-error font-body-sm text-xs flex items-center gap-2 animate-fadeIn">
            <span className="material-symbols-outlined text-base shrink-0">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {infoMsg && (
          <div className="mb-5 p-3 rounded-xl bg-primary/15 border border-primary/30 text-primary-fixed font-body-sm text-xs flex items-center gap-2 animate-fadeIn">
            <span className="material-symbols-outlined text-base shrink-0">info</span>
            <span>{infoMsg}</span>
          </div>
        )}

        {/* STEP 1: Enter Email */}
        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-headline-lg font-bold text-white tracking-tight">
                Reset Forgotten Password
              </h1>
              <p className="font-body-md text-sm text-ink-muted mt-1.5">
                Enter your adventurer email address. We'll send a 6-digit OTP verification code to your Gmail.
              </p>
            </div>

            <form onSubmit={handleRequestOtp} className="flex flex-col gap-4">
              <div>
                <label htmlFor="reset-email" className="block font-label-md text-xs text-ink-muted mb-1.5 font-semibold">
                  Adventurer Email Address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-3 text-ink-muted text-lg pointer-events-none">
                    mail
                  </span>
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@liferpg.app"
                    autoFocus
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-ink-rail border border-ink-border rounded-xl text-sm text-white placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full py-3 rounded-xl bg-primary-container text-on-primary font-label-lg text-sm font-bold shadow-[0_4px_0_#4029ba] hover:translate-y-0.5 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                    <span>Dispatching OTP to Gmail...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <span className="material-symbols-outlined text-lg">forward_to_inbox</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: Verify OTP */}
        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-headline-lg font-bold text-white tracking-tight">
                Enter 6-Digit Code
              </h1>
              <p className="font-body-md text-sm text-ink-muted mt-1.5">
                We've sent a one-time verification code to{' '}
                <span className="text-white font-medium underline decoration-primary/50">{email}</span>.
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
              {/* Segmented 6-digit OTP Inputs */}
              <div>
                <label className="block font-label-md text-xs text-ink-muted mb-2.5 font-semibold text-center">
                  Verification Code
                </label>
                <div className="flex justify-between gap-2" onPaste={handleOtpPaste}>
                  {otpValues.map((val, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpInputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={val}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className={`w-12 h-13 text-center text-xl font-bold bg-ink-rail border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all ${
                        val ? 'border-primary/80 bg-primary/5 text-primary-fixed' : 'border-ink-border'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Countdown & Resend Section */}
              <div className="flex items-center justify-between text-xs font-body-sm px-1">
                <span className="text-ink-muted flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-ink-muted">timer</span>
                  {timer > 0 ? (
                    <span>
                      Resend in <span className="text-white font-mono font-bold">{timer}s</span>
                    </span>
                  ) : (
                    <span className="text-tertiary font-medium">Ready to resend</span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={!canResend || loading}
                  className="text-primary-fixed hover:underline font-bold disabled:opacity-40 disabled:hover:no-underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span>
                  Resend Code
                </button>
              </div>

              <div className="flex flex-col gap-2.5 mt-2">
                <button
                  type="submit"
                  disabled={loading || otpValues.join('').length !== 6}
                  className="w-full py-3 rounded-xl bg-primary-container text-on-primary font-label-lg text-sm font-bold shadow-[0_4px_0_#4029ba] hover:translate-y-0.5 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                      <span>Verifying Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify Code</span>
                      <span className="material-symbols-outlined text-lg">verified_user</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setErrorMsg('');
                    setInfoMsg('');
                  }}
                  className="w-full py-2 text-xs font-label-md text-ink-muted hover:text-white transition-colors text-center"
                >
                  Wrong email address? Change email
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: Reset Password */}
        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-headline-lg font-bold text-white tracking-tight">
                Create New Password
              </h1>
              <p className="font-body-md text-sm text-ink-muted mt-1.5">
                Set a secure password for your adventurer profile.
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
              {/* New Password */}
              <div>
                <label htmlFor="new-pass" className="block font-label-md text-xs text-ink-muted mb-1 font-semibold">
                  New Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-3 text-ink-muted text-lg pointer-events-none">
                    lock
                  </span>
                  <input
                    id="new-pass"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    autoFocus
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-ink-rail border border-ink-border rounded-xl text-sm text-white placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-ink-muted hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>

                {/* Password strength bar */}
                {newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-[11px] font-body-sm text-ink-muted mb-1">
                      <span>Password Strength:</span>
                      <span className="font-bold text-white">{strength.text}</span>
                    </div>
                    <div className="w-full bg-ink-rail rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full ${strength.color} transition-all duration-300`}
                        style={{ width: `${strength.score}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirm-pass" className="block font-label-md text-xs text-ink-muted mb-1 font-semibold">
                  Confirm New Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-3 text-ink-muted text-lg pointer-events-none">
                    lock_clock
                  </span>
                  <input
                    id="confirm-pass"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-ink-rail border border-ink-border rounded-xl text-sm text-white placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-ink-muted hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showConfirmPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full py-3 rounded-xl bg-primary-container text-on-primary font-label-lg text-sm font-bold shadow-[0_4px_0_#4029ba] hover:translate-y-0.5 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                    <span>Saving New Password...</span>
                  </>
                ) : (
                  <>
                    <span>Reset Password</span>
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 4: Success View */}
        {step === 4 && (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-3xl bg-tertiary/20 border-2 border-tertiary flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_rgba(20,241,149,0.3)]">
              <span className="material-symbols-outlined text-tertiary text-4xl">shield_locked</span>
            </div>

            <h1 className="text-2xl font-headline-lg font-bold text-white tracking-tight mb-2">
              Password Restored!
            </h1>
            <p className="font-body-md text-sm text-ink-muted mb-6 leading-relaxed">
              Your password has been successfully updated. Your Life RPG adventurer profile is now securely protected.
            </p>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full py-3 rounded-xl bg-primary-container text-on-primary font-label-lg text-sm font-bold shadow-[0_4px_0_#4029ba] hover:translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Login</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        )}

        {/* Return to login link footer */}
        {step !== 4 && (
          <div className="mt-6 pt-5 border-t border-ink-border/60 text-center">
            <Link
              to="/login"
              className="font-body-sm text-xs text-ink-muted hover:text-white transition-colors inline-flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>Back to Login</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
