export function Chip({ children, className = '' }) {
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full font-label-caps text-label-caps font-bold inline-flex items-center gap-1 ${className}`}
    >
      {children}
    </span>
  );
}

export function ProgressBar({ pct, className = '', trackClassName = 'bg-surface-container' }) {
  return (
    <div className={`w-full h-2 rounded-full overflow-hidden ${trackClassName}`}>
      <div
        className={`h-full rounded-full transition-all duration-500 ${className}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
