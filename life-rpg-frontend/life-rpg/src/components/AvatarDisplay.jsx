export const VECTOR_AVATARS = [
  {
    id: 'cyan',
    label: 'Cyan',
    bg: '#00a8e8',
    renderSvg: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Background */}
        <circle cx="50" cy="50" r="50" fill="#00a8e8" />
        {/* Neck */}
        <rect x="44" y="60" width="12" height="15" fill="#f5cba7" rx="3" />
        {/* Face */}
        <ellipse cx="50" cy="46" rx="17" ry="20" fill="#ffdfcc" />
        {/* Hair Back */}
        <path d="M30 45 C30 25 70 25 70 45 C70 52 68 56 68 56 C68 56 65 34 50 34 C35 34 32 56 32 56 Z" fill="#6d4c41" />
        {/* Hair Top / Bangs */}
        <path d="M31 42 C33 26 67 26 69 42 C65 32 54 30 50 35 C46 30 35 32 31 42 Z" fill="#54382e" />
        {/* Shirt Collar / Torso */}
        <path d="M22 100 L26 78 C30 73 70 73 74 78 L78 100 Z" fill="#ffffff" />
        {/* Red Tie */}
        <polygon points="50,75 54,88 50,96 46,88" fill="#d32f2f" />
        <polygon points="47,74 53,74 52,77 48,77" fill="#b71c1c" />
        {/* Coat Lapels */}
        <path d="M22 100 L34 76 L44 80 L35 100 Z" fill="#e2e8f0" opacity="0.6" />
        <path d="M78 100 L66 76 L56 80 L65 100 Z" fill="#e2e8f0" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: 'rose',
    label: 'Rose',
    bg: '#e91e63',
    renderSvg: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Background */}
        <circle cx="50" cy="50" r="50" fill="#e91e63" />
        {/* Hair Back */}
        <path d="M24 55 C24 22 76 22 76 55 C76 80 68 85 68 85 L65 52 L35 52 L32 85 C32 85 24 80 24 55 Z" fill="#4a1c17" />
        {/* Neck */}
        <rect x="43" y="60" width="14" height="15" fill="#f5cba7" rx="3" />
        {/* Face */}
        <ellipse cx="50" cy="48" rx="16" ry="19" fill="#ffdfcc" />
        {/* Hair Bob Sides & Top */}
        <path d="M26 50 C26 26 74 26 74 50 C74 72 67 76 67 76 C67 60 64 34 50 34 C36 34 33 60 33 76 C33 76 26 72 26 50 Z" fill="#5c241c" />
        {/* Bangs */}
        <path d="M33 42 C38 34 62 34 67 42 C62 35 54 34 50 36 C46 34 38 35 33 42 Z" fill="#421813" />
        {/* Maroon Tunic / Cape */}
        <path d="M20 100 L26 74 C34 68 66 68 74 74 L80 100 Z" fill="#880e4f" />
        {/* White Triangular Collar */}
        <polygon points="50,83 40,68 60,68" fill="#ffffff" />
      </svg>
    ),
  },
  {
    id: 'teal',
    label: 'Teal',
    bg: '#00897b',
    renderSvg: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Background */}
        <circle cx="50" cy="50" r="50" fill="#00897b" />
        {/* Neck */}
        <rect x="44" y="60" width="12" height="15" fill="#e0b896" rx="3" />
        {/* Face */}
        <ellipse cx="50" cy="46" rx="16" ry="19" fill="#ffd8b3" />
        {/* Beard / Goatee */}
        <path d="M42 53 C42 67 58 67 58 53 C58 59 54 64 50 64 C46 64 42 59 42 53 Z" fill="#212121" />
        {/* Hair */}
        <path d="M30 44 C30 24 70 24 70 44 C67 28 62 26 50 26 C38 26 33 28 30 44 Z" fill="#212121" />
        {/* Dark Teal / Forest Tunic */}
        <path d="M22 100 L27 75 C35 70 65 70 73 75 L78 100 Z" fill="#004d40" />
        {/* White Inner Collar */}
        <polygon points="50,78 45,71 55,71" fill="#ffffff" />
      </svg>
    ),
  },
  {
    id: 'amber',
    label: 'Amber',
    bg: '#f59e0b',
    renderSvg: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Background */}
        <circle cx="50" cy="50" r="50" fill="#f59e0b" />
        {/* Long Hair Back */}
        <path d="M25 50 C25 24 75 24 75 50 L75 95 C75 95 68 100 68 80 L67 55 L33 55 L32 80 C32 100 25 95 25 95 Z" fill="#181818" />
        {/* Neck */}
        <rect x="44" y="58" width="12" height="15" fill="#f5cba7" rx="3" />
        {/* Face */}
        <ellipse cx="50" cy="46" rx="15" ry="18" fill="#ffdfcc" />
        {/* Long Straight Hair Front */}
        <path d="M28 46 C28 26 72 26 72 46 C72 68 68 85 66 85 C66 60 62 33 50 33 C38 33 34 60 34 85 C32 85 28 68 28 46 Z" fill="#222222" />
        {/* Navy Blue Tunic */}
        <path d="M24 100 L28 76 C36 71 64 71 72 76 L76 100 Z" fill="#1a237e" />
        {/* White Lapel */}
        <polygon points="50,82 42,70 58,70" fill="#ffffff" />
      </svg>
    ),
  },
  {
    id: 'crimson',
    label: 'Crimson',
    bg: '#c2185b',
    renderSvg: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Background */}
        <circle cx="50" cy="50" r="50" fill="#c2185b" />
        {/* Top Knot / Bun */}
        <circle cx="50" cy="22" r="9" fill="#2a1810" />
        {/* Neck */}
        <rect x="44" y="60" width="12" height="15" fill="#f5cba7" rx="3" />
        {/* Face */}
        <ellipse cx="50" cy="48" rx="15" ry="18" fill="#ffe0cc" />
        {/* Sleek Hair Style */}
        <path d="M30 46 C30 28 70 28 70 46 C67 33 60 30 50 30 C40 30 33 33 30 46 Z" fill="#382015" />
        {/* Crimson Robe */}
        <path d="M22 100 L27 75 C34 69 66 69 73 75 L78 100 Z" fill="#780b32" />
        {/* White Accent */}
        <polygon points="50,81 43,68 57,68" fill="#ffffff" />
      </svg>
    ),
  },
];

export default function AvatarDisplay({
  avatarUrl = null,
  avatarClass = 'rose',
  className = 'w-full h-full',
  alt = 'Character Avatar',
}) {
  // If user has a custom uploaded avatar image
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={alt}
        className={`${className} object-cover rounded-full`}
      />
    );
  }

  // Normalize style ID
  const normalized = (avatarClass || 'rose').toLowerCase().replace('style-', '');
  const matched =
    VECTOR_AVATARS.find((v) => v.id === normalized) ||
    VECTOR_AVATARS.find((v) => v.id === 'rose') ||
    VECTOR_AVATARS[0];

  return (
    <div className={`${className} rounded-full overflow-hidden flex items-center justify-center shrink-0`}>
      {matched.renderSvg()}
    </div>
  );
}
