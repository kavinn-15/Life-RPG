import { useState, useRef } from 'react';
import { useGame } from '../state/GameContext';
import { PRESET_AVATARS } from '../data/presetAvatars';

export default function AvatarModal({ isOpen, onClose }) {
  const { state, updateAvatar, pushToast } = useGame();
  const [previewUrl, setPreviewUrl] = useState(state.avatarUrl || '');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      pushToast('Please select a valid image file (PNG, JPG, WebP, etc.).', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      pushToast('Image file size should be less than 5MB.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (dataUrl) {
        setPreviewUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApply = async () => {
    await updateAvatar(previewUrl || null);
    onClose();
  };

  const handleRemove = async () => {
    setPreviewUrl('');
    await updateAvatar(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col gap-6 relative animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-xl">account_circle</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-lg font-bold text-on-surface">Customize Avatar Photo</h2>
              <p className="font-body-sm text-xs text-on-surface-variant">Update your hero portrait across the realm.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Current Preview */}
        <div className="flex flex-col items-center justify-center gap-3 py-2">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-primary-container ring-4 ring-primary/20 shadow-lg overflow-hidden flex items-center justify-center">
              {previewUrl ? (
                <img src={previewUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-on-primary text-5xl">person</span>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-full bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">photo_camera</span>
              <span className="text-[10px] font-bold mt-0.5">Upload</span>
            </button>
          </div>
          <span className="font-label-md text-xs font-semibold text-on-surface">
            {state.playerName} · LVL {state.level}
          </span>
        </div>

        {/* Upload Button */}
        <div className="flex flex-col gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 px-4 bg-primary text-on-primary font-label-md text-xs font-bold rounded-xl shadow-[0_2px_0_#4029ba] hover:translate-y-[1px] transition-transform flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">upload</span>
            Upload Image From Computer
          </button>
        </div>

        {/* Presets */}
        <div className="flex flex-col gap-2.5">
          <label className="font-label-caps text-[10px] text-outline uppercase tracking-wider font-bold">
            Or Choose Vector Character Avatar (5 Styles)
          </label>
          <div className="grid grid-cols-5 gap-2.5">
            {PRESET_AVATARS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPreviewUrl(p.url)}
                className={`group relative flex flex-col items-center gap-1.5 p-1 rounded-2xl transition-all hover:scale-105 cursor-pointer ${
                  previewUrl === p.url
                    ? 'bg-primary/10 ring-2 ring-primary'
                    : 'hover:bg-surface-container'
                }`}
                title={p.name}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm border border-outline-variant/30 flex items-center justify-center">
                  <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <span className="font-label-caps text-[9px] text-on-surface font-semibold truncate max-w-[54px] text-center">
                  {p.name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-surface-container">
          {previewUrl ? (
            <button
              type="button"
              onClick={handleRemove}
              className="font-label-caps text-xs text-error hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
              Reset Default
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-label-md text-xs hover:bg-surface-container-high transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2 rounded-xl bg-primary-container text-on-primary font-label-md text-xs font-bold shadow-sm hover:translate-y-0.5 transition-transform"
            >
              Save Avatar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
