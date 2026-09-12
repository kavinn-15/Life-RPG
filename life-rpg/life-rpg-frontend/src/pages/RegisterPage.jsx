import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getPasswordStrength(password) {
  if (!password) {
    return {
      score: 0,
      label: 'Not set',
      color: 'bg-ink-border',
      textColor: 'text-ink-muted',
    };
  }

  let score = 0;

  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) {
    return {
      score,
      label: 'Weak',
      color: 'bg-error',
      textColor: 'text-red-300',
    };
  }

  if (score <= 3) {
    return {
      score,
      label: 'Good',
      color: 'bg-secondary-fixed-dim',
      textColor: 'text-secondary-fixed-dim',
    };
  }

  return {
    score,
    label: 'Strong',
    color: 'bg-tertiary-fixed',
    textColor: 'text-tertiary-fixed',
  };
}

function PasswordRequirement({ valid, children }) {
  return (
    <div
      className={`flex items-center gap-1.5 text-[11px] transition-colors ${
        valid ? 'text-tertiary-fixed' : 'text-ink-muted'
      }`}
    >
      <span className="material-symbols-outlined text-[14px]">
        {valid ? 'check_circle' : 'radio_button_unchecked'}
      </span>

      <span>{children}</span>
    </div>
  );
}

function FieldError({ children }) {
  if (!children) return null;

  return (
    <p
      className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-red-300"
      role="alert"
    >
      <span className="material-symbols-outlined text-[14px]">
        error
      </span>

      {children}
    </p>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordStrength = useMemo(
    () => getPasswordStrength(password),
    [password]
  );

  const passwordRules = useMemo(
    () => ({
      minimum: password.length >= 6,
      longEnough: password.length >= 10,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[^A-Za-z0-9]/.test(password),
    }),
    [password]
  );

  const isFormReady =
    name.trim().length >= 2 &&
    name.trim().length <= 50 &&
    EMAIL_PATTERN.test(email.trim()) &&
    password.length >= 6 &&
    password.length <= 100 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const clearFieldError = (field) => {
    setErrors((previous) => {
      if (!previous[field]) return previous;

      const next = { ...previous };
      delete next[field];

      return next;
    });
  };

  const validate = () => {
    const nextErrors = {};

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      nextErrors.name = 'Adventurer name is required.';
    } else if (trimmedName.length < 2) {
      nextErrors.name = 'Name must contain at least 2 characters.';
    } else if (trimmedName.length > 50) {
      nextErrors.name =
        'Name must contain 50 characters or fewer.';
    }

    if (!trimmedEmail) {
      nextErrors.email = 'Email address is required.';
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!password) {
      nextErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      nextErrors.password =
        'Password must contain at least 6 characters.';
    } else if (password.length > 100) {
      nextErrors.password =
        'Password must contain 100 characters or fewer.';
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword =
        'Please confirm your password.';
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword =
        'Passwords do not match.';
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setServerError('');

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      await authService.register(
        name.trim(),
        email.trim().toLowerCase(),
        password
      );

      setSuccess(true);

      window.setTimeout(() => {
        navigate('/onboarding');
      }, 700);
    } catch (error) {
      setServerError(
        error?.message ||
          'Registration failed. Please try again.'
      );

      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080b14] text-white selection:bg-primary-container selection:text-white">

      {/* ============================================================
          SAME BACKGROUND AS LANDING PAGE
         ============================================================ */}

      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/bg.png')",
          backgroundPosition: 'center 30%',
        }}
      />

      {/* Landing page style overlay */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(
              ellipse 70% 50% at 50% 0%,
              rgba(79, 184, 255, 0.12),
              transparent 60%
            ),
            linear-gradient(
              180deg,
              rgba(8, 11, 20, 0.35) 0%,
              rgba(8, 11, 20, 0.50) 30%,
              rgba(8, 11, 20, 0.68) 60%,
              rgba(8, 11, 20, 0.85) 100%
            )
          `,
        }}
      />

      {/* Soft glow behind registration box */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-1/2 top-1/2 z-0 h-[520px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[150px]"
      />

      {/* ============================================================
          CONTENT
         ============================================================ */}

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-8 sm:px-6">

        {/* ========================================================
            BRAND
           ======================================================== */}

        <Link
          to="/"
          aria-label="Return to Life RPG home"
          className="mb-7 flex items-center gap-3 transition-transform duration-200 hover:-translate-y-0.5"
        >
          <img
            src="/logo.png"
            alt="Life RPG"
            className="h-12 w-12 rounded-2xl object-cover shadow-[0_4px_0_#4029ba]"
          />

          <div className="flex flex-col">
            <span className="font-headline-md text-[24px] font-bold leading-none tracking-tight text-white">
              Life RPG
            </span>

            <span className="mt-1 text-[10px] font-label-caps uppercase tracking-[0.18em] text-tertiary-fixed">
              Character Genesis
            </span>
          </div>
        </Link>

        {/* ========================================================
            REGISTRATION BOX
            RPG / HUD INSPIRED BOX
           ======================================================== */}

        <section className="relative w-full max-w-[470px]">

          {/* Very subtle external glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-3 bg-[#536dff]/5 blur-2xl"
          />

          {/* ======================================================
              OUTER TECHNICAL BORDER

              The clip-path creates the diagonal cut corners
              inspired by your reference image.
             ====================================================== */}

          <div
            className="relative"
            style={{
              clipPath:
                'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
              background:
                'linear-gradient(135deg, rgba(78,111,255,0.50), rgba(87,72,170,0.30), rgba(78,111,255,0.40))',
              padding: '1px',
            }}
          >

            {/* ==================================================
                INNER BOX
               ================================================== */}

            <div
              className="relative overflow-hidden bg-[#11162a]/95 px-5 py-6 backdrop-blur-xl sm:px-7 sm:py-7"
              style={{
                clipPath:
                  'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)',
              }}
            >

              {/* Very subtle top technical line */}
              <div
                aria-hidden="true"
                className="absolute left-8 right-8 top-0 h-px bg-gradient-to-r from-transparent via-[#6d83ff]/70 to-transparent"
              />

              {/* Subtle bottom-right accent */}
              <div
                aria-hidden="true"
                className="absolute bottom-0 right-0 h-px w-24 bg-[#526bff]/50"
              />

              {/* ==================================================
                  HEADER
                 ================================================== */}

              <div className="mb-6 text-center">

                <div className="mb-3 flex justify-center">
                  <span className="inline-flex items-center gap-2 border border-[#5064bd]/30 bg-[#171d35]/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#aeb8d4]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#4fb8ff] shadow-[0_0_8px_rgba(79,184,255,0.8)]" />

                    Character Genesis
                  </span>
                </div>

                <h1 className="font-headline-lg text-[27px] font-extrabold tracking-tight text-white sm:text-[30px]">
                  Create Adventurer Account
                </h1>

                <p className="mx-auto mt-2 max-w-[390px] text-[13px] leading-5 text-[#a9b3cc]">
                  Begin converting real-world effort into RPG
                  ascendancy.
                </p>
              </div>

              {/* ==================================================
                  SERVER ERROR
                 ================================================== */}

              {serverError && (
                <div
                  role="alert"
                  className="mb-5 flex items-start gap-3 border border-red-400/20 bg-red-500/10 p-3"
                >
                  <span className="material-symbols-outlined mt-0.5 text-[18px] text-red-300">
                    error
                  </span>

                  <div className="min-w-0">
                    <p className="text-xs font-bold text-red-200">
                      Registration failed
                    </p>

                    <p className="mt-0.5 text-[11px] leading-4 text-red-300/90">
                      {serverError}
                    </p>
                  </div>
                </div>
              )}

              {/* ==================================================
                  SUCCESS
                 ================================================== */}

              {success && (
                <div
                  role="status"
                  aria-live="polite"
                  className="mb-5 flex items-start gap-3 border border-tertiary-fixed/20 bg-tertiary-fixed/10 p-3"
                >
                  <span className="material-symbols-outlined mt-0.5 text-[18px] text-tertiary-fixed">
                    check_circle
                  </span>

                  <div>
                    <p className="text-xs font-bold text-tertiary-fixed">
                      Character forged
                    </p>

                    <p className="mt-0.5 text-[11px] leading-4 text-tertiary-fixed/80">
                      Opening Character Genesis...
                    </p>
                  </div>
                </div>
              )}

              {/* ==================================================
                  FORM
                 ================================================== */}

              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-4"
              >

                {/* ==================================================
                    NAME
                   ================================================== */}

                <div>
                  <label
                    htmlFor="register-name"
                    className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.07em] text-[#a9b3cc]"
                  >
                    Adventurer Name / Alias
                  </label>

                  <div className="relative">
                    <span className="material-symbols-outlined pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[19px] text-[#6c7796]">
                      person
                    </span>

                    <input
                      id="register-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      maxLength={50}
                      value={name}
                      onChange={(event) => {
                        setName(event.target.value);
                        clearFieldError('name');
                        setServerError('');
                      }}
                      placeholder="e.g. Alex Mercer"
                      disabled={loading || success}
                      aria-invalid={Boolean(errors.name)}
                      className={`h-12 w-full border bg-[#11162a]/90 pl-11 pr-4 text-sm font-medium text-white outline-none transition-all placeholder:text-[#6c7796] disabled:cursor-not-allowed disabled:opacity-50 ${
                        errors.name
                          ? 'border-red-400/60 ring-2 ring-red-400/10'
                          : 'border-white/[0.10] hover:border-[#4fb8ff]/30 focus:border-[#4fb8ff]/70 focus:ring-2 focus:ring-[#4fb8ff]/10'
                      }`}
                    />
                  </div>

                  <FieldError>
                    {errors.name}
                  </FieldError>
                </div>

                {/* ==================================================
                    EMAIL
                   ================================================== */}

                <div>
                  <label
                    htmlFor="register-email"
                    className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.07em] text-[#a9b3cc]"
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <span className="material-symbols-outlined pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[19px] text-[#6c7796]">
                      mail
                    </span>

                    <input
                      id="register-email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        clearFieldError('email');
                        setServerError('');
                      }}
                      placeholder="alex@liferpg.app"
                      disabled={loading || success}
                      aria-invalid={Boolean(errors.email)}
                      className={`h-12 w-full border bg-[#11162a]/90 pl-11 pr-4 text-sm font-medium text-white outline-none transition-all placeholder:text-[#6c7796] disabled:cursor-not-allowed disabled:opacity-50 ${
                        errors.email
                          ? 'border-red-400/60 ring-2 ring-red-400/10'
                          : 'border-white/[0.10] hover:border-[#4fb8ff]/30 focus:border-[#4fb8ff]/70 focus:ring-2 focus:ring-[#4fb8ff]/10'
                      }`}
                    />
                  </div>

                  <FieldError>
                    {errors.email}
                  </FieldError>
                </div>

                {/* ==================================================
                    PASSWORD
                   ================================================== */}

                <div>
                  <div className="mb-1.5 flex items-center justify-between gap-3">
                    <label
                      htmlFor="register-password"
                      className="block text-[11px] font-bold uppercase tracking-[0.07em] text-[#a9b3cc]"
                    >
                      Create Password
                    </label>

                    <span className="text-[10px] text-[#6c7796]">
                      Minimum 6 characters
                    </span>
                  </div>

                  <div className="relative">
                    <span className="material-symbols-outlined pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[19px] text-[#6c7796]">
                      lock
                    </span>

                    <input
                      id="register-password"
                      name="password"
                      type={
                        showPassword
                          ? 'text'
                          : 'password'
                      }
                      autoComplete="new-password"
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        clearFieldError('password');
                        clearFieldError(
                          'confirmPassword'
                        );
                        setServerError('');
                      }}
                      placeholder="Create a secure password"
                      disabled={loading || success}
                      aria-invalid={Boolean(errors.password)}
                      className={`h-12 w-full border bg-[#11162a]/90 pl-11 pr-12 text-sm font-medium text-white outline-none transition-all placeholder:text-[#6c7796] disabled:cursor-not-allowed disabled:opacity-50 ${
                        errors.password
                          ? 'border-red-400/60 ring-2 ring-red-400/10'
                          : 'border-white/[0.10] hover:border-[#4fb8ff]/30 focus:border-[#4fb8ff]/70 focus:ring-2 focus:ring-[#4fb8ff]/10'
                      }`}
                    />

                    <button
                      type="button"
                      aria-label={
                        showPassword
                          ? 'Hide password'
                          : 'Show password'
                      }
                      onClick={() =>
                        setShowPassword(
                          (value) => !value
                        )
                      }
                      disabled={loading || success}
                      className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-[#6c7796] transition-colors hover:bg-white/5 hover:text-white disabled:opacity-40"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showPassword
                          ? 'visibility_off'
                          : 'visibility'}
                      </span>
                    </button>
                  </div>

                  {/* Password strength */}
                  <div className="mt-2.5">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#6c7796]">
                        Password strength
                      </span>

                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider ${passwordStrength.textColor}`}
                      >
                        {passwordStrength.label}
                      </span>
                    </div>

                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(
                        (segment) => (
                          <div
                            key={segment}
                            className={`h-1 flex-1 transition-all duration-200 ${
                              segment <=
                              passwordStrength.score
                                ? passwordStrength.color
                                : 'bg-[#25243f]'
                            }`}
                          />
                        )
                      )}
                    </div>
                  </div>

                  {/* Password rules */}
                  <div className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-1.5">
                    <PasswordRequirement
                      valid={
                        passwordRules.minimum
                      }
                    >
                      6+ characters
                    </PasswordRequirement>

                    <PasswordRequirement
                      valid={
                        passwordRules.longEnough
                      }
                    >
                      10+ characters
                    </PasswordRequirement>

                    <PasswordRequirement
                      valid={
                        passwordRules.uppercase
                      }
                    >
                      Uppercase letter
                    </PasswordRequirement>

                    <PasswordRequirement
                      valid={
                        passwordRules.number
                      }
                    >
                      Number
                    </PasswordRequirement>

                    <PasswordRequirement
                      valid={
                        passwordRules.symbol
                      }
                    >
                      Special character
                    </PasswordRequirement>
                  </div>

                  <FieldError>
                    {errors.password}
                  </FieldError>
                </div>

                {/* ==================================================
                    CONFIRM PASSWORD
                   ================================================== */}

                <div>
                  <label
                    htmlFor="register-confirm-password"
                    className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.07em] text-[#a9b3cc]"
                  >
                    Confirm Password
                  </label>

                  <div className="relative">
                    <span className="material-symbols-outlined pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[19px] text-[#6c7796]">
                      verified_user
                    </span>

                    <input
                      id="register-confirm-password"
                      name="confirmPassword"
                      type={
                        showConfirmPassword
                          ? 'text'
                          : 'password'
                      }
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(event) => {
                        setConfirmPassword(
                          event.target.value
                        );
                        clearFieldError(
                          'confirmPassword'
                        );
                        setServerError('');
                      }}
                      placeholder="Re-enter your password"
                      disabled={loading || success}
                      aria-invalid={Boolean(
                        errors.confirmPassword
                      )}
                      className={`h-12 w-full border bg-[#11162a]/90 pl-11 pr-12 text-sm font-medium text-white outline-none transition-all placeholder:text-[#6c7796] disabled:cursor-not-allowed disabled:opacity-50 ${
                        errors.confirmPassword
                          ? 'border-red-400/60 ring-2 ring-red-400/10'
                          : confirmPassword &&
                              password ===
                                confirmPassword
                            ? 'border-tertiary-fixed/40 ring-2 ring-tertiary-fixed/10'
                            : 'border-white/[0.10] hover:border-[#4fb8ff]/30 focus:border-[#4fb8ff]/70 focus:ring-2 focus:ring-[#4fb8ff]/10'
                      }`}
                    />

                    <button
                      type="button"
                      aria-label={
                        showConfirmPassword
                          ? 'Hide confirmation password'
                          : 'Show confirmation password'
                      }
                      onClick={() =>
                        setShowConfirmPassword(
                          (value) => !value
                        )
                      }
                      disabled={loading || success}
                      className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-[#6c7796] transition-colors hover:bg-white/5 hover:text-white disabled:opacity-40"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showConfirmPassword
                          ? 'visibility_off'
                          : 'visibility'}
                      </span>
                    </button>
                  </div>

                  {confirmPassword &&
                    password === confirmPassword &&
                    !errors.confirmPassword && (
                      <p className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-tertiary-fixed">
                        <span className="material-symbols-outlined text-[14px]">
                          check_circle
                        </span>

                        Passwords match.
                      </p>
                    )}

                  <FieldError>
                    {errors.confirmPassword}
                  </FieldError>
                </div>

                {/* ==================================================
                    SUBMIT BUTTON
                   ================================================== */}

                <button
                  type="submit"
                  disabled={loading || success}
                  className="group relative mt-1 flex h-[52px] w-full items-center justify-center gap-2 overflow-hidden bg-gradient-to-r from-[#4fb8ff] to-[#9b7bff] px-5 text-sm font-extrabold text-[#050810] shadow-[0_5px_0_#3f35a8] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_7px_0_#3f35a8] active:translate-y-0 active:shadow-[0_3px_0_#3f35a8] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 -left-20 w-16 skew-x-[-18deg] bg-white/25 transition-transform duration-700 group-hover:translate-x-[520px]"
                  />

                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[19px]">
                        progress_activity
                      </span>

                      <span>
                        Forging Character...
                      </span>
                    </>
                  ) : success ? (
                    <>
                      <span className="material-symbols-outlined text-[19px]">
                        check_circle
                      </span>

                      <span>
                        Character Forged
                      </span>
                    </>
                  ) : (
                    <>
                      <span>
                        Begin Character Creation
                      </span>

                      <span className="material-symbols-outlined text-[19px] transition-transform duration-200 group-hover:translate-x-1">
                        arrow_forward
                      </span>
                    </>
                  )}
                </button>

                {/* Form status */}
                <div className="flex items-center justify-center gap-2">
                  <span
                    className={`h-1.5 w-1.5 transition-all ${
                      isFormReady
                        ? 'bg-[#5be6a1] shadow-[0_0_8px_rgba(91,230,161,0.8)]'
                        : 'bg-[#6c7796]/60'
                    }`}
                  />

                  <span className="text-[10px] text-[#6c7796]">
                    {isFormReady
                      ? 'Genesis sequence ready'
                      : 'Complete all required fields to continue'}
                  </span>
                </div>
              </form>

              {/* ==================================================
                  FOOTER
                 ================================================== */}

              <div className="mt-6 border-t border-white/[0.08] pt-5 text-center">
                <p className="text-xs text-[#a9b3cc]">
                  Already forged?

                  <Link
                    to="/login"
                    className="ml-1 font-bold text-[#9b7bff] transition-colors hover:text-white hover:underline"
                  >
                    Sign into your portal
                  </Link>
                </p>

                <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-[#6c7796]">
                  <span className="material-symbols-outlined text-[13px]">
                    lock
                  </span>

                  <span>
                    Your credentials are securely transmitted.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            BOTTOM STATUS
           ======================================================== */}

        <div className="mt-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-white/40">
          <span>Genesis</span>

          <span className="h-1 w-1 bg-white/20" />

          <span>Stage 01</span>

          <span className="h-1 w-1 bg-white/20" />

          <span>Portal Registration</span>
        </div>
      </div>
    </main>
  );
}