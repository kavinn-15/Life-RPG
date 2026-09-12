import { useState, useRef } from 'react';
import AvatarDisplay, { VECTOR_AVATARS } from './AvatarDisplay';

export default function CustomizeAvatarModal({
  isOpen,
  onClose,
  currentAvatarUrl,
  currentAvatarClass,
  playerName = 'Adventurer',
  playerLevel = 1,
  onSave,
}) {
  const [selectedUrl, setSelectedUrl] = useState(currentAvatarUrl || null);
  const [selectedStyle, setSelectedStyle] = useState(currentAvatarClass || 'rose');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Please choose an image under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectVector = (styleId) => {
    setSelectedUrl(null); // Clear custom upload if picking vector
    setSelectedStyle(styleId);
  };

  const handleResetDefault = () => {
    setSelectedUrl(null);
    setSelectedStyle('rose');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        avatarUrl: selectedUrl,
        avatarClass: selectedStyle,
      });
      onClose();
    } catch (err) {
      console.error('Error saving avatar:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="avatar-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/75 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#e8e7f2] flex flex-col gap-6 relative animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5b4be2] flex items-center justify-center text-white shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[22px]">badge</span>
            </div>
            <div>
              <h2
                id="avatar-modal-title"
                className="text-[18px] font-black tracking-tight text-[#16163f] leading-snug"
              >
                Customize Avatar Photo
              </h2>
              <p className="text-[12px] text-[#6b6c8a] font-medium">
                Update your hero portrait across the realm.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f3f2fa] flex items-center justify-center text-[#686985] hover:text-[#18183c] hover:bg-[#e7e6f4] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Hero Avatar Preview Section */}
        <div className="flex flex-col items-center justify-center pt-1">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full ring-4 ring-[#f43f5e] shadow-[0_0_24px_rgba(244,63,94,0.35)] p-1 bg-white flex items-center justify-center">
            <AvatarDisplay
              avatarUrl={selectedUrl}
              avatarClass={selectedStyle}
              className="w-full h-full rounded-full"
            />
          </div>
          <p className="mt-3 text-[14px] font-extrabold text-[#17173f]">
            {playerName} · LVL {playerLevel}
          </p>
        </div>

        {/* Upload Button */}
        <div>
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
            className="w-full py-3 px-4 rounded-2xl bg-[#5b4be2] text-white font-extrabold text-[13.5px] flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(91,75,226,0.35)] hover:bg-[#4d3dd4] active:scale-[0.99] transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">upload</span>
            <span>Upload Image From Computer</span>
          </button>
        </div>

        {/* 5 Vector Styles Selection */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#757691]">
            Or Choose Vector Character Avatar (5 Styles)
          </span>
          <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
            {VECTOR_AVATARS.map((av) => {
              const isSelected = !selectedUrl && selectedStyle === av.id;
              return (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => handleSelectVector(av.id)}
                  className={[
                    'flex flex-col items-center justify-center p-2 rounded-2xl transition-all border text-center',
                    isSelected
                      ? 'border-[#5b4be2] bg-[#f0effe] shadow-sm ring-1 ring-[#5b4be2]/20'
                      : 'border-[#eae9f5] bg-[#faf9fe] hover:bg-[#f3f2fb] hover:border-[#dedcf0]',
                  ].join(' ')}
                >
                  <div className="w-11 h-11 rounded-full overflow-hidden shadow-xs mb-1.5 flex items-center justify-center">
                    {av.renderSvg()}
                  </div>
                  <span className="text-[11px] font-bold text-[#1f2048]">
                    {av.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#f0eff8] mt-1">
          <button
            type="button"
            onClick={handleResetDefault}
            className="flex items-center gap-1.5 text-[12.5px] font-bold text-[#dc2626] hover:text-[#b91c1c] transition-colors"
          >
            <span className="material-symbols-outlined text-[17px]">delete</span>
            <span>Reset Default</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-[#f0effe] text-[#5547c8] hover:bg-[#e4e1fd] font-extrabold text-[12.5px] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 rounded-full bg-[#5b4be2] text-white font-extrabold text-[12.5px] shadow-[0_3px_0_#4029ba] hover:bg-[#4d3dd4] active:translate-y-0.5 transition-all disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Avatar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
