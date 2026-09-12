export default function PlaceholderPage({ title, icon = 'auto_awesome' }) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-3 bg-surface-container-lowest rounded-2xl shadow-sm p-16 min-h-[50vh]">
      <span className="material-symbols-outlined text-5xl text-primary">{icon}</span>
      <h1 className="font-headline-lg text-headline-lg text-on-surface">{title}</h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
        This realm hasn't been forged yet. The Adventure, Quests, and Character screens are fully playable — this
        one is on the roadmap.
      </p>
    </div>
  );
}
