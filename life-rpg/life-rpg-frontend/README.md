# Life RPG — React Rebuild

A React (Vite + Tailwind) rebuild of the "Life RPG" Stitch prototype: Adventure dashboard, Quests board, and Character sheet, wired up with shared, interactive game state (XP, gold, level, streaks, attributes).

## Setup

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## What's implemented

- **Adventure** (`/`) — featured quest, continue quests, recommended quests, daily quest checklist, leaderboard. Completing/accepting quests grants real XP & Gold that update the header instantly.
- **Quests** (`/quests`) — tabbed quest board (Active fully built; other tabs are stubs), milestone checklists, and a working "Quest Forge" panel that computes XP/Gold live from difficulty + time settings.
- **Character** (`/character`) — XP/level formula panel, 10-attribute grid, SVG radar chart, equipped relics, proof-of-work feed, next milestone. Overview tab fully built; other tabs stubbed.
- Sidebar links not yet built (Domains, Progress, Streak, Achievements, Loot Vault, Inventory, Community, Settings) route to a placeholder page rather than 404ing.
- Leveling up (crossing the XP threshold, `100 × level²`) triggers the Level Up modal from anywhere in the app.

## Notes

- The original prototype's hotlinked Google-hosted photos were replaced with icon tiles so the app has no external image dependencies.
- Design tokens (colors, type scale, radii, spacing) are ported 1:1 from the prototype's `DESIGN.md` into `tailwind.config.js`.
