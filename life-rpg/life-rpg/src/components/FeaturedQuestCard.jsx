export default function FeaturedQuestCard({ quest }) {
  return (
    <div className="relative bg-surface-container-lowest rounded-2xl shadow-md overflow-hidden p-6 sm:p-8 flex flex-col justify-between min-h-[300px]">
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 800 400">
          <path d="M0,100 C150,200 350,-50 500,80 C650,210 750,50 800,90 L800,400 L0,400 Z" fill="#e3dfff" />
          <path
            d="M0,220 C200,320 450,150 600,240 C700,300 750,210 800,220 L800,400 L0,400 Z"
            fill="#c6bfff"
            opacity="0.4"
          />
          <circle cx="700" cy="90" fill="#6ffbbe" opacity="0.25" r="140" />
        </svg>
      </div>
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-primary-container text-on-primary font-label-caps text-label-caps uppercase tracking-wider">
            {quest.domain}
          </span>
          <span className="px-3 py-1 rounded-full bg-error-container text-on-error-container font-label-caps text-label-caps uppercase tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">bolt</span> {quest.difficulty}
          </span>
          <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider sm:ml-auto">
            {quest.moduleLabel}
          </span>
        </div>
        <div className="max-w-xl">
          <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight">{quest.title}</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 line-clamp-2">
            {quest.description}
          </p>
        </div>
      </div>
      <div className="relative z-10 mt-6 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="w-full sm:w-1/2 flex flex-col gap-2">
          <div className="flex justify-between items-center text-label-md font-label-md">
            <span className="text-on-surface-variant">Quest Progress</span>
            <span className="text-primary font-extrabold">{quest.progress}%</span>
          </div>
          <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-primary-container rounded-full transition-all duration-500"
              style={{ width: `${quest.progress}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="w-full sm:w-auto px-6 py-3 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg shadow-md hover:translate-y-0.5 active:translate-y-1 transition-all flex items-center justify-center gap-2">
            <span>Continue Quest</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
