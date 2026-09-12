import { useGame } from '../state/GameContext';

export default function ToastStack() {
  const { toasts } = useGame();

  return (
    <div className="fixed bottom-6 right-6 z-[70] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-toast-in pointer-events-auto flex items-center gap-2.5 bg-ink text-white pl-3 pr-5 py-3 rounded-full shadow-lg"
        >
          <span className="material-symbols-outlined fill text-tertiary-fixed text-xl">{toast.icon}</span>
          <span className="font-label-lg text-label-lg">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
