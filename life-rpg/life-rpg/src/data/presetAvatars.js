// Built-in minimalist flat vector character avatars inspired by modern UI avatar systems.
// Crisp, instant-loading SVGs with vibrant circular backdrops and stylish gender-neutral & character designs.

const encodeSvg = (svg) => `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;

export const PRESET_AVATARS = [
  {
    id: 'avatar-cyan-pro',
    name: 'Cyan Executive',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <circle cx="100" cy="100" r="100" fill="#00A8E8"/>
        <!-- Neck & Collar -->
        <rect x="86" y="115" width="28" height="30" fill="#F8C39B"/>
        <!-- Shirt & Tie -->
        <path d="M40 200 C40 150 70 135 100 135 C130 135 160 150 160 200 Z" fill="#FFFFFF"/>
        <polygon points="100,135 108,145 100,195 92,145" fill="#E63946"/>
        <polygon points="90,135 100,148 100,135" fill="#E2E8F0"/>
        <polygon points="110,135 100,148 100,135" fill="#CBD5E1"/>
        <!-- Head & Face -->
        <ellipse cx="100" cy="92" rx="36" ry="44" fill="#F8C39B"/>
        <path d="M64 92 C64 122 80 136 100 136 C120 136 136 122 136 92 Z" fill="#F8C39B"/>
        <!-- Hair -->
        <path d="M62 82 C62 50 82 36 100 36 C118 36 138 50 138 82 C138 88 135 92 133 92 C131 78 126 62 108 60 C90 58 75 70 66 92 C63 92 62 88 62 82 Z" fill="#4A2E18"/>
      </svg>
    `),
  },
  {
    id: 'avatar-magenta-chic',
    name: 'Rose Scholar',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <circle cx="100" cy="100" r="100" fill="#FF1493"/>
        <!-- Hair Back -->
        <path d="M54 75 C54 40 80 32 100 32 C120 32 146 40 146 75 C146 115 152 145 138 160 C130 140 132 110 132 90 C132 90 68 90 68 90 C68 110 70 140 62 160 C48 145 54 115 54 75 Z" fill="#3D1A10"/>
        <!-- Neck -->
        <rect x="88" y="112" width="24" height="28" fill="#FAD2B0"/>
        <!-- Suit & Blouse -->
        <path d="M42 200 C42 155 70 135 100 135 C130 135 158 155 158 200 Z" fill="#9B111E"/>
        <polygon points="100,135 116,160 84,160" fill="#FFFFFF"/>
        <!-- Face -->
        <ellipse cx="100" cy="90" rx="34" ry="42" fill="#FAD2B0"/>
        <!-- Hair Front Frame -->
        <path d="M64 78 C64 45 80 36 100 36 C120 36 136 45 136 78 C136 105 132 125 125 135 C122 108 124 75 100 70 C76 75 78 108 75 135 C68 125 64 105 64 78 Z" fill="#4B2317"/>
      </svg>
    `),
  },
  {
    id: 'avatar-teal-nomad',
    name: 'Teal Vanguard',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <circle cx="100" cy="100" r="100" fill="#00B894"/>
        <!-- Neck -->
        <rect x="86" y="114" width="28" height="28" fill="#E8B588"/>
        <!-- Sweater & Inner Shirt -->
        <path d="M40 200 C40 152 70 136 100 136 C130 136 160 152 160 200 Z" fill="#1B4D3E"/>
        <polygon points="100,136 112,154 88,154" fill="#FFFFFF"/>
        <!-- Face & Ears -->
        <ellipse cx="100" cy="92" rx="35" ry="42" fill="#E8B588"/>
        <!-- Beard -->
        <path d="M68 95 C68 126 82 138 100 138 C118 138 132 126 132 95 C132 108 122 130 100 130 C78 130 68 108 68 95 Z" fill="#2D1E16"/>
        <ellipse cx="100" cy="116" rx="9" ry="5" fill="#2D1E16"/>
        <!-- Modern Hair -->
        <path d="M64 80 C64 48 82 34 100 34 C118 34 136 48 136 80 C136 85 133 88 131 88 C128 72 122 55 100 55 C78 55 72 72 69 88 C67 88 64 85 64 80 Z" fill="#2D1E16"/>
      </svg>
    `),
  },
  {
    id: 'avatar-yellow-specialist',
    name: 'Amber Specialist',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <circle cx="100" cy="100" r="100" fill="#FFB703"/>
        <!-- Hair Back -->
        <path d="M58 80 C58 40 80 32 100 32 C120 32 142 40 142 80 C142 125 146 165 132 175 C124 145 128 110 128 90 C128 90 72 90 72 90 C72 110 76 145 68 175 C54 165 58 125 58 80 Z" fill="#1E1B18"/>
        <!-- Neck -->
        <rect x="88" y="112" width="24" height="28" fill="#F8C39B"/>
        <!-- Collared Polo -->
        <path d="M42 200 C42 154 70 134 100 134 C130 134 158 154 158 200 Z" fill="#023E8A"/>
        <polygon points="100,134 114,152 86,152" fill="#FFFFFF"/>
        <!-- Face -->
        <ellipse cx="100" cy="90" rx="34" ry="42" fill="#F8C39B"/>
        <!-- Hair Front / Bangs -->
        <path d="M66 78 C66 45 80 35 100 35 C120 35 134 45 134 78 C134 105 130 125 125 138 C122 105 125 68 102 65 C85 62 76 80 72 138 C68 125 66 105 66 78 Z" fill="#1E1B18"/>
      </svg>
    `),
  },
  {
    id: 'avatar-coral-bun',
    name: 'Crimson Innovator',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <circle cx="100" cy="100" r="100" fill="#E63946"/>
        <!-- Top Bun -->
        <circle cx="100" cy="34" r="18" fill="#201A18"/>
        <!-- Neck -->
        <rect x="88" y="112" width="24" height="28" fill="#FAD2B0"/>
        <!-- High Collar Blazer -->
        <path d="M42 200 C42 154 70 134 100 134 C130 134 158 154 158 200 Z" fill="#49111C"/>
        <polygon points="100,134 110,165 90,165" fill="#FAD2B0"/>
        <!-- Face -->
        <ellipse cx="100" cy="92" rx="33" ry="42" fill="#FAD2B0"/>
        <!-- Sleek Hair Cut -->
        <path d="M67 85 C67 48 80 40 100 40 C120 40 133 48 133 85 C133 90 130 92 128 92 C125 75 118 55 100 55 C82 55 75 75 72 92 C70 92 67 90 67 85 Z" fill="#201A18"/>
      </svg>
    `),
  },
];
