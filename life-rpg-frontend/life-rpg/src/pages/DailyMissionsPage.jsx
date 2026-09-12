import { useState, useEffect } from 'react';
import { useGame } from '../state/GameContext';
import dailyMissionsBanner from '../assets/daily-missions-banner.jpg';
import './DailyMissionsPage.css';

const MISSIONS_DATA = [
  {
    id: 'complete-3-quests',
    title: 'Complete 3 Quests',
    desc: 'Finish any 3 quests from your daily roster.',
    icon: 'task_alt',
    current: 0,
    target: 3,
    rewardXp: 150,
    rewardGold: 50,
  },
  {
    id: 'progress-2-domains',
    title: 'Progress in 2 Domains',
    desc: 'Complete at least one quest in 2 distinct domains.',
    icon: 'category',
    current: 0,
    target: 2,
    rewardXp: 120,
    rewardGold: 40,
  },
  {
    id: 'earn-100-gold',
    title: 'Earn 100 Gold',
    desc: 'Bank 100 Gold from quest rewards and bonus bonuses.',
    icon: 'monetization_on',
    current: 0,
    target: 100,
    rewardXp: 90,
    rewardGold: 50,
  },
  {
    id: 'complete-5-milestones',
    title: 'Complete 5 Milestones',
    desc: 'Check off 5 individual milestone sub-tasks.',
    icon: 'checklist',
    current: 0,
    target: 5,
    rewardXp: 110,
    rewardGold: 35,
  },
  {
    id: 'complete-before-12pm',
    title: 'Complete 1 Quest Before 12 PM',
    desc: 'Knock out any quest in the morning hours.',
    icon: 'light_mode',
    current: 0,
    target: 1,
    rewardXp: 80,
    rewardGold: 25,
  },
  {
    id: 'earn-200-xp',
    title: 'Earn 200 XP',
    desc: 'Accumulate at least 200 XP from quests and milestones today.',
    icon: 'bolt',
    current: 0,
    target: 200,
    rewardXp: 100,
    rewardGold: 30,
  },
];

function msUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}

function formatCountdown(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export default function DailyMissionsPage() {
  const { state } = useGame();
  const [countdown, setCountdown] = useState(formatCountdown(msUntilMidnight()));
  const [missionsList, setMissionsList] = useState(MISSIONS_DATA);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(formatCountdown(msUntilMidnight()));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate live mission progress
  const completedMissionsCount = missionsList.filter(
    (m) => m.current >= m.target
  ).length;

  const totalPossibleXp = missionsList.reduce(
    (acc, m) => acc + m.rewardXp,
    0
  );

  return (
    <div className="daily-missions-container">
      {/* 1. Header Panoramic Hero Banner */}
      <section className="missions-hero-banner">
        {/* Scenic Alpine Backdrop Image */}
        <div className="missions-hero-scenery">
          <img
            src={dailyMissionsBanner}
            alt="Quartermaster's Board Scenery"
            className="w-full h-full object-cover object-[center_35%]"
          />
          {/* Subtle gradient overlay to enhance text readability on the left */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#f1f3fd] via-[#f1f3fd]/85 via-45% to-transparent" />
        </div>

        {/* Left Hero Content */}
        <div className="missions-hero-content">
          <span className="missions-hero-badge">QUARTERMASTER&apos;S BOARD</span>
          <h1 className="missions-hero-title">
            <span className="material-symbols-outlined text-[30px] text-[#6366f1]">
              event_available
            </span>
            <span>Daily Missions</span>
          </h1>
          <p className="missions-hero-subtitle">
            A fresh set of bite-sized goals every day. Clear them all before the board resets at midnight.
          </p>
        </div>

        {/* Right Floating HUD Stats Card */}
        <div className="missions-hud-card hidden lg:flex">
          {/* 1. Missions Complete */}
          <div className="missions-hud-stat">
            <div className="missions-hud-icon-box bg-[#dcfce7]">
              <span className="material-symbols-outlined text-[#15803d] text-[22px]">
                check_circle
              </span>
            </div>
            <div className="missions-hud-stat-info">
              <span className="missions-hud-stat-val">{completedMissionsCount} / {missionsList.length}</span>
              <span className="missions-hud-stat-lbl">MISSIONS COMPLETE</span>
            </div>
          </div>

          <div className="missions-hud-divider" />

          {/* 2. Total XP Today */}
          <div className="missions-hud-stat">
            <div className="missions-hud-icon-box bg-[#fef3c7]">
              <span className="material-symbols-outlined text-[#d97706] text-[22px]">
                bolt
              </span>
            </div>
            <div className="missions-hud-stat-info">
              <span className="missions-hud-stat-val">+{totalPossibleXp}</span>
              <span className="missions-hud-stat-lbl">TOTAL XP TODAY</span>
            </div>
          </div>

          <div className="missions-hud-divider" />

          {/* 3. Until Reset */}
          <div className="missions-hud-stat">
            <div className="missions-hud-icon-box bg-[#ede9fe]">
              <span className="material-symbols-outlined text-[#6366f1] text-[22px]">
                schedule
              </span>
            </div>
            <div className="missions-hud-stat-info">
              <span className="missions-hud-stat-val">{countdown}</span>
              <span className="missions-hud-stat-lbl">UNTIL RESET</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Daily Missions List */}
      <section className="missions-list">
        {missionsList.map((m) => {
          const isComplete = m.current >= m.target;
          const progressPct = Math.min(
            100,
            Math.round((m.current / m.target) * 100)
          );

          return (
            <div
              key={m.id}
              className={`mission-row-card ${isComplete ? 'completed' : ''}`}
            >
              {/* Left Details */}
              <div className="mission-row-left">
                <div className="mission-icon-box">
                  <span className="material-symbols-outlined text-[24px]">
                    {m.icon}
                  </span>
                </div>

                <div className="mission-details-col">
                  <h3 className="mission-row-title">{m.title}</h3>
                  <p className="mission-row-desc">{m.desc}</p>
                  <div className="mission-row-track">
                    <div
                      className="mission-row-fill"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Counter & Badges */}
              <div className="mission-row-right">
                <div className="mission-badges-row">
                  <span className="mission-count-badge">
                    {m.current}/{m.target}
                  </span>
                  <span className="mission-pill-xp">+{m.rewardXp} XP</span>
                  <span className="mission-pill-gold">+{m.rewardGold} Gold</span>
                </div>

                <div className="mission-timer-row">
                  <span className="material-symbols-outlined text-[15px]">
                    schedule
                  </span>
                  <span>{countdown}</span>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
