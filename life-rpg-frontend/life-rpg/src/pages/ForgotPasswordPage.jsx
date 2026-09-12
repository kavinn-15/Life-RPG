import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';
import './LandingPage.css';
import './LoginPage.css';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const cardRef = useRef(null);

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

  // 3D Tilt interactive effect matching Landing Page & Login Page
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const onMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -5;
      const rotY = ((x - cx) / cx) * 5;

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
    const sanitized = value.replace(/\D/g, '');
    if (sanitized.length > 1) {
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
    if (!pass) return { score: 0, text: 'Empty', color: 'bg-slate-600' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 25, text: 'Weak', color: '#ff5c77' };
    if (score === 2 || score === 3) return { score: 60, text: 'Medium', color: '#f59e0b' };
    return { score: 100, text: 'Strong', color: '#10b981' };
  };

  const strength = getPasswordStrength(newPassword);

  return (
    <div className="landing-container auth-container">
      {/* Site-wide Atmospheric Background System */}
      <div className="site-photo" />
      <div className="site-overlay" />

      {/* Atmospheric Beam & Sparks */}
      <div className="landing-beam" />
      <div className="landing-spark" style={{ left: '22%', animationDelay: '0.4s' }} />
      <div className="landing-spark" style={{ left: '48%', animationDelay: '2.1s' }} />
      <div className="landing-spark" style={{ left: '74%', animationDelay: '3.9s' }} />

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
            <Link to="/login" className="auth-nav-link">
              <span className="material-symbols-outlined text-base">login</span>
              <span>Login</span>
            </Link>
            <Link to="/register" className="auth-btn-nav">
              <span className="material-symbols-outlined text-base">person_add</span>
              <span>Register</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="auth-content-layer">
        {/* Rank Chip */}
        <div className="auth-rank-chip">
          <span>ACCOUNT RECOVERY</span>
          <span>•</span>
          <b>SECURITY PROTOCOL</b>
        </div>

        {/* Auth Glass Card */}
        <div ref={cardRef} className="auth-card tilt-3d">
          {/* Step Progress Tracker */}
          <div className="auth-steps-bar">
            {[
              { num: 1, label: 'Email' },
              { num: 2, label: 'OTP' },
              { num: 3, label: 'Reset' },
              { num: 4, label: 'Done' },
            ].map((item, idx, arr) => {
              const isCompleted = step > item.num;
              const isCurrent = step === item.num;
              return (
                <div key={item.num} className="auth-step-item">
                  <div className="auth-step-node-wrap">
                    <div
                      className={`auth-step-node ${
                        isCompleted ? 'completed' : isCurrent ? 'active' : ''
                      }`}
                    >
                      {isCompleted ? (
                        <span className="material-symbols-outlined text-sm">check</span>
                      ) : (
                        item.num
                      )}
                    </div>
                    <span className={`auth-step-label ${isCurrent ? 'active' : ''}`}>
                      {item.label}
                    </span>
                  </div>
                  {idx < arr.length - 1 && (
                    <div className={`auth-step-line ${step > item.num ? 'completed' : ''}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Dynamic Feedback Alerts */}
          {errorMsg && (
            <div className="auth-alert-error">
              <span className="material-symbols-outlined text-lg">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {infoMsg && (
            <div className="auth-alert-success">
              <span className="material-symbols-outlined text-lg">info</span>
              <span>{infoMsg}</span>
            </div>
          )}

          {/* STEP 1: Enter Email */}
          {step === 1 && (
            <div>
              <div className="text-center">
                <h1 className="auth-title">
                  RECOVER <span>CIPHER</span>
                </h1>
                <p className="auth-subtitle">
                  Enter your registered adventurer email to dispatch a 6-digit OTP verification code.
                </p>
              </div>

              <form onSubmit={handleRequestOtp}>
                <div className="auth-field">
                  <div className="auth-label-row">
                    <label htmlFor="reset-email" className="auth-label">
                      Adventurer Email Address
                    </label>
                  </div>
                  <div className="auth-input-wrapper">
                    <span className="material-symbols-outlined auth-input-icon">mail</span>
                    <input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="adventurer@example.com"
                      autoFocus
                      required
                      className="auth-input"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="auth-btn-primary"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                      <span>Dispatching Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Send OTP Code</span>
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
              <div className="text-center">
                <h1 className="auth-title">
                  ENTER <span>OTP CODE</span>
                </h1>
                <p className="auth-subtitle">
                  We've sent a 6-digit security code to{' '}
                  <span style={{ color: 'var(--blue, #4fb8ff)', fontWeight: 600 }}>{email}</span>.
                </p>
              </div>

              <form onSubmit={handleVerifyOtp}>
                <div className="auth-field">
                  <div className="auth-label-row">
                    <label className="auth-label">6-Digit Verification Code</label>
                  </div>
                  <div className="auth-otp-row" onPaste={handleOtpPaste}>
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
                        className={`auth-otp-box ${val ? 'filled' : ''}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Resend timer */}
                <div className="flex items-center justify-between text-xs mb-4" style={{ color: 'var(--text-mid, #a9b3cc)' }}>
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">timer</span>
                    {timer > 0 ? (
                      <span>
                        Resend in <b style={{ color: '#ffffff' }}>{timer}s</b>
                      </span>
                    ) : (
                      <span style={{ color: '#10b981', fontWeight: 600 }}>Ready to resend</span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={!canResend || loading}
                    className="auth-link-sm"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: canResend && !loading ? 'pointer' : 'not-allowed',
                      opacity: canResend && !loading ? 1 : 0.4,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span className="material-symbols-outlined text-sm">refresh</span>
                    Resend
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading || otpValues.join('').length !== 6}
                  className="auth-btn-primary"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify Code</span>
                      <span className="material-symbols-outlined text-lg">verified_user</span>
                    </>
                  )}
                </button>

                <div className="text-center mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setErrorMsg('');
                      setInfoMsg('');
                    }}
                    className="auth-link-sm"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }}
                  >
                    ← Change email address
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: Reset Password */}
          {step === 3 && (
            <div>
              <div className="text-center">
                <h1 className="auth-title">
                  FORGE NEW <span>PASSWORD</span>
                </h1>
                <p className="auth-subtitle">
                  Set a strong security cipher for your adventurer profile.
                </p>
              </div>

              <form onSubmit={handleResetPassword}>
                <div className="auth-field">
                  <div className="auth-label-row">
                    <label htmlFor="new-pass" className="auth-label">
                      New Secret Password
                    </label>
                  </div>
                  <div className="auth-input-wrapper">
                    <span className="material-symbols-outlined auth-input-icon">lock</span>
                    <input
                      id="new-pass"
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      autoFocus
                      required
                      className="auth-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="auth-input-toggle"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <span className="material-symbols-outlined text-base">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>

                  {newPassword && (
                    <div className="auth-strength-meter">
                      <div className="auth-strength-info">
                        <span>Cipher Strength:</span>
                        <b style={{ color: strength.color }}>{strength.text}</b>
                      </div>
                      <div className="auth-strength-bar">
                        <div
                          className="auth-strength-fill"
                          style={{ width: `${strength.score}%`, backgroundColor: strength.color }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="auth-field">
                  <div className="auth-label-row">
                    <label htmlFor="confirm-pass" className="auth-label">
                      Confirm New Password
                    </label>
                  </div>
                  <div className="auth-input-wrapper">
                    <span className="material-symbols-outlined auth-input-icon">lock_clock</span>
                    <input
                      id="confirm-pass"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      required
                      className="auth-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="auth-input-toggle"
                      title={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      <span className="material-symbols-outlined text-base">
                        {showConfirmPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="auth-btn-primary"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                      <span>Saving New Password...</span>
                    </>
                  ) : (
                    <>
                      <span>Update Password</span>
                      <span className="material-symbols-outlined text-lg">check_circle</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* STEP 4: Success View */}
          {step === 4 && (
            <div className="text-center py-2">
              <div className="auth-success-icon-wrap">
                <span className="material-symbols-outlined text-3xl">shield_locked</span>
              </div>

              <h1 className="auth-title">
                CIPHER <span>RESTORED</span>
              </h1>
              <p className="auth-subtitle">
                Your password has been successfully updated. Your adventurer profile is now securely protected.
              </p>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="auth-btn-primary mt-4"
              >
                <span>Proceed to Login</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>
          )}

          {/* Footer Back Link */}
          {step !== 4 && (
            <div className="auth-footer-text">
              <span>Remembered your password?</span>
              <Link to="/login" className="auth-footer-link">
                Return to Login
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

