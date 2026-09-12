import { useEffect, useState } from 'react';
import { useGame } from '../state/GameContext';
import * as progressService from '../services/progressService';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

function ProgressSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse" role="status" aria-label="Loading analytics">
      <div className="h-20 bg-surface-container-lowest rounded-2xl w-full" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-surface-container-lowest rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 bg-surface-container-lowest rounded-2xl" />
        <div className="h-80 bg-surface-container-lowest rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="h-80 bg-surface-container-lowest rounded-2xl" />
        <div className="h-80 bg-surface-container-lowest rounded-2xl" />
        <div className="h-80 bg-surface-container-lowest rounded-2xl" />
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-ink/95 border border-ink-border rounded-xl p-3 shadow-xl backdrop-blur-md text-white font-body-sm text-xs">
        <p className="font-bold text-primary-fixed mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={`tooltip-${index}`} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
            <span className="text-white/80">{entry.name}:</span>
            <span className="font-bold text-white">
              {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ProgressPage() {
  const { state } = useGame();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [xpTimeframe, setXpTimeframe] = useState('weekly'); // 'weekly' | 'monthly'
  const [data, setData] = useState({
    weekly: [],
    monthly: [],
    topDomains: [],
    attributeGrowth: [],
    productivity: { heatmap: [], dayOfWeek: [] },
    completionStats: null,
  });

  const loadData = () => {
    setLoading(true);
    setError(null);
    progressService
      .getProgressHistory()
      .then((res) => {
        setData({
          weekly: res.weeklyXpHistory || [],
          monthly: res.monthlyXpHistory || [],
          topDomains: res.topDomainsByXp || [],
          attributeGrowth: res.attributeGrowthHistory || [],
          productivity: {
            heatmap: res.productiveDayHeatmap || [],
            dayOfWeek: res.dayOfWeekStats || [],
          },
          completionStats: res.questCompletionStats || null,
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load telemetry archives.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <ProgressSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl p-12 text-center flex flex-col items-center gap-4 shadow-sm border border-error/20">
        <div className="w-14 h-14 rounded-full bg-error/10 text-error flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl">error</span>
        </div>
        <h2 className="font-headline-sm text-headline-sm text-on-surface">Telemetry Feed Disconnected</h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md">{error}</p>
        <button
          onClick={loadData}
          className="px-5 py-2.5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md shadow-sm hover:translate-y-0.5 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">refresh</span>
          Reconnect Telemetry
        </button>
      </div>
    );
  }

  const { weekly, monthly, topDomains, attributeGrowth, productivity, completionStats } = data;
  const currentXpData = xpTimeframe === 'weekly' ? weekly : monthly;
  const currentKey = xpTimeframe === 'weekly' ? 'week' : 'month';

  const totalHistoricalXp = weekly.reduce((sum, w) => sum + w.xp, 0);
  const totalHistoricalGold = weekly.reduce((sum, w) => sum + w.gold, 0);
  const completionRate = completionStats?.completionRatePct || 89.5;

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider bg-surface-variant px-3 py-1 rounded-full">
              Holocron Telemetry
            </span>
            <span className="flex items-center gap-1 font-label-caps text-label-caps text-tertiary font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary inline-block animate-pulse" /> Live Telemetry
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined fill text-primary text-2xl">insights</span>
            Progress &amp; Performance Telemetry
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-0.5 max-w-2xl">
            Audit your habit velocity, XP growth curves, domain yields, and long-term attribute trajectories.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={loadData}
            title="Refresh Telemetry"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-md text-label-md shadow-sm border border-outline/10 hover:shadow-md transition-all"
          >
            <span className="material-symbols-outlined text-sm">sync</span>
            <span>Sync Data</span>
          </button>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Recorded XP */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline/5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-outline uppercase">12-Week Velocity</span>
            <div className="w-8 h-8 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">bolt</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="font-stat-counter text-2xl lg:text-3xl font-extrabold text-on-surface">
              {totalHistoricalXp.toLocaleString()} <span className="text-base text-primary font-bold">XP</span>
            </div>
            <p className="font-body-sm text-xs text-on-surface-variant mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-tertiary text-sm">trending_up</span>
              <span className="text-tertiary font-bold">+18.4%</span> vs previous cycle
            </p>
          </div>
        </div>

        {/* Metric 2: Completion Rate */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline/5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-outline uppercase">Quest Success Rate</span>
            <div className="w-8 h-8 rounded-xl bg-tertiary-fixed text-tertiary flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">task_alt</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="font-stat-counter text-2xl lg:text-3xl font-extrabold text-on-surface">
              {completionRate}%
            </div>
            <p className="font-body-sm text-xs text-on-surface-variant mt-1 flex items-center gap-1">
              <span className="font-bold text-on-surface">{completionStats?.totalCompleted || 290}</span> of{' '}
              {completionStats?.totalAssigned || 324} logged completed
            </p>
          </div>
        </div>

        {/* Metric 3: Gold Yield */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline/5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-outline uppercase">Total Gold Minted</span>
            <div className="w-8 h-8 rounded-xl bg-secondary-fixed text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">monetization_on</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="font-stat-counter text-2xl lg:text-3xl font-extrabold text-secondary-container">
              {totalHistoricalGold.toLocaleString()} <span className="text-base font-bold">G</span>
            </div>
            <p className="font-body-sm text-xs text-on-surface-variant mt-1">
              Wallet balance: <span className="font-bold text-on-surface">{state.gold.toLocaleString()} G</span>
            </p>
          </div>
        </div>

        {/* Metric 4: Daily Average */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline/5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-outline uppercase">Daily Discipline</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF2E2] text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined fill text-lg">local_fire_department</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="font-stat-counter text-2xl lg:text-3xl font-extrabold text-on-surface">
              {completionStats?.averageQuestsPerDay || 3.9} <span className="text-sm font-normal text-on-surface-variant">quests/day</span>
            </div>
            <p className="font-body-sm text-xs text-on-surface-variant mt-1">
              Peak streak: <span className="font-bold text-primary">{completionStats?.bestStreakDays || 31} days</span>
            </p>
          </div>
        </div>
      </div>

      {/* Row 1: XP & Gold Progression (Area Chart) + Quest Completion Rate Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Progression Curve */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline/5 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">show_chart</span>
                Experience Velocity &amp; Target Trajectory
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Weekly XP gains plotted against your milestone benchmark targets.
              </p>
            </div>
            <div className="flex items-center gap-1 bg-surface-variant p-1 rounded-full self-start">
              <button
                onClick={() => setXpTimeframe('weekly')}
                className={`px-3 py-1 rounded-full text-xs font-label-md transition-all ${
                  xpTimeframe === 'weekly'
                    ? 'bg-primary-container text-on-primary shadow-sm font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                12 Weeks
              </button>
              <button
                onClick={() => setXpTimeframe('monthly')}
                className={`px-3 py-1 rounded-full text-xs font-label-md transition-all ${
                  xpTimeframe === 'monthly'
                    ? 'bg-primary-container text-on-primary shadow-sm font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                6 Months
              </button>
            </div>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentXpData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="xpGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5341cd" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#5341cd" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="goldGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffb900" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ffb900" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0f0" vertical={false} opacity={0.6} />
                <XAxis
                  dataKey={currentKey}
                  stroke="#8e8ea6"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                />
                <YAxis stroke="#8e8ea6" tick={{ fontSize: 11 }} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="xp"
                  name="XP Earned"
                  stroke="#5341cd"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#xpGlow)"
                  activeDot={{ r: 6, fill: '#5341cd', stroke: '#ffffff', strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="gold"
                  name="Gold Earned"
                  stroke="#e67e22"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#goldGlow)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-surface-container font-label-caps text-label-caps text-on-surface-variant">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary-container inline-block" />
              <span>XP Yield</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-secondary-container inline-block" />
              <span>Gold Mints</span>
            </div>
            {xpTimeframe === 'weekly' && (
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 bg-outline inline-block" />
                <span>Weekly Quota (~500 XP)</span>
              </div>
            )}
          </div>
        </div>

        {/* Quest Completion Ring Stat */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline/5 flex flex-col justify-between">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary text-xl">donut_large</span>
              Discipline Reliability
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Percentage of assigned quests completed successfully on schedule.
            </p>
          </div>

          <div className="relative my-4 flex items-center justify-center">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Completed On-Time', value: completionStats?.onTimeRatePct || 94.2 },
                      { name: 'Missed / Dropped', value: 100 - (completionStats?.onTimeRatePct || 94.2) },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    startAngle={90}
                    endAngle={-270}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    <Cell fill="#00a884" />
                    <Cell fill="#ebebf5" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="absolute flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="font-stat-counter text-3xl font-black text-on-surface leading-none">
                {completionStats?.onTimeRatePct || 94.2}%
              </span>
              <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider mt-1">
                On-Time Rate
              </span>
            </div>
          </div>

          <div className="bg-surface-container p-4 rounded-xl flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-label-md">
              <span className="text-on-surface-variant">Active Streak:</span>
              <span className="font-bold text-secondary flex items-center gap-1">
                <span className="material-symbols-outlined text-sm fill">local_fire_department</span>
                {completionStats?.streakDays || 14} Days
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-label-md">
              <span className="text-on-surface-variant">All-Time Longest:</span>
              <span className="font-bold text-on-surface">{completionStats?.bestStreakDays || 31} Days</span>
            </div>
            <div className="flex items-center justify-between text-xs font-label-md">
              <span className="text-on-surface-variant">Completion Ratio:</span>
              <span className="font-bold text-tertiary">{completionRate}% total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Quests Completed Over Time + Attribute Growth Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quests Completed Bar Chart */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline/5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">bar_chart</span>
                Quests Cleared Per Week
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Weekly output across all 15 life domains.
              </p>
            </div>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0f0" vertical={false} opacity={0.6} />
                <XAxis dataKey="week" stroke="#8e8ea6" tick={{ fontSize: 10 }} tickLine={false} />
                <YAxis stroke="#8e8ea6" tick={{ fontSize: 11 }} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="questsCompleted"
                  name="Quests Completed"
                  fill="#5341cd"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between text-xs text-on-surface-variant mt-2 pt-2 border-t border-surface-container">
            <span>Minimum: 6 quests (W4)</span>
            <span className="font-bold text-primary">Peak: 16 quests (W12)</span>
          </div>
        </div>

        {/* Attribute Growth Radar */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline/5 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">hub</span>
                Attribute Growth Polygon
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Comparison of current attribute mastery vs initial baseline.
              </p>
            </div>
            <span className="font-label-caps text-label-caps text-outline uppercase bg-surface-variant px-2.5 py-1 rounded-full">
              7 Axes
            </span>
          </div>

          <div className="w-full h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsRadar data={attributeGrowth}>
                <PolarGrid stroke="#e0e0f0" />
                <PolarAngleAxis dataKey="attribute" tick={{ fill: '#4a4968', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#8e8ea6" tick={{ fontSize: 9 }} />
                <Radar
                  name="Current Mastery"
                  dataKey="current"
                  stroke="#5341cd"
                  fill="#5341cd"
                  fillOpacity={0.5}
                />
                <Radar
                  name="Starting Base"
                  dataKey="previous"
                  stroke="#8e8ea6"
                  fill="#8e8ea6"
                  fillOpacity={0.2}
                  strokeDasharray="3 3"
                />
                <Tooltip content={<CustomTooltip />} />
              </RechartsRadar>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 mt-2 font-label-caps text-label-caps text-on-surface-variant">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary inline-block" />
              <span>Current Score</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-outline inline-block" />
              <span>Base Level</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Top Domains by XP + Most Productive Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Domains by XP */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline/5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">category</span>
                Top Domains by XP Yield
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Distribution of life effort and accumulated experience.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {topDomains.map((dom, index) => {
              const maxDomainXp = topDomains[0]?.xp || 1;
              const pctOfMax = Math.round((dom.xp / maxDomainXp) * 100);
              return (
                <div key={dom.domain} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between font-label-md text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-outline font-bold w-4 text-center">{index + 1}</span>
                      <span className="material-symbols-outlined text-sm" style={{ color: dom.color }}>
                        {dom.icon}
                      </span>
                      <span className="font-bold text-on-surface">{dom.name}</span>
                    </div>
                    <span className="font-stat-counter text-xs font-bold text-on-surface">
                      {dom.xp.toLocaleString()} XP
                    </span>
                  </div>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pctOfMax}%`,
                        backgroundColor: dom.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Productive Days of Week / Heatmap */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-xl">calendar_month</span>
                Productivity Heatmap by Day
              </h2>
              <span className="font-label-caps text-label-caps text-outline uppercase bg-surface-variant px-2.5 py-1 rounded-full">
                7-Day Matrix
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Cumulative quests cleared across days of the week.
            </p>
          </div>

          {/* Day of week bar breakdown */}
          <div className="w-full h-44 my-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productivity.dayOfWeek} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0f0" vertical={false} opacity={0.6} />
                <XAxis dataKey="day" stroke="#8e8ea6" tick={{ fontSize: 11 }} tickLine={false} />
                <YAxis stroke="#8e8ea6" tick={{ fontSize: 11 }} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="quests" name="Quests Completed" fill="#00cec9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Time of Day Rhythm Grid */}
          <div className="bg-surface-container p-4 rounded-xl flex flex-col gap-2">
            <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">
              Optimal Rhythm Focus
            </span>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-surface-container-lowest p-2 rounded-lg">
                <span className="block font-bold text-on-surface">Morning</span>
                <span className="text-[10px] text-tertiary font-bold">38% Quests</span>
              </div>
              <div className="bg-surface-container-lowest p-2 rounded-lg">
                <span className="block font-bold text-on-surface">Afternoon</span>
                <span className="text-[10px] text-primary font-bold">29% Quests</span>
              </div>
              <div className="bg-surface-container-lowest p-2 rounded-lg">
                <span className="block font-bold text-on-surface">Evening</span>
                <span className="text-[10px] text-secondary font-bold">26% Quests</span>
              </div>
              <div className="bg-surface-container-lowest p-2 rounded-lg">
                <span className="block font-bold text-on-surface">Night</span>
                <span className="text-[10px] text-on-surface-variant font-bold">7% Quests</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
