import { useState } from 'react';
import { Mailbox, AnalyticsData, ThemeConfig } from '../types';

interface AnalyticsDashboardProps {
  mailboxes: Mailbox[];
  theme: ThemeConfig;
}

export default function AnalyticsDashboard({ mailboxes, theme }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const isDark = theme.mode === 'dark';
  const cardBg = isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';

  // Mock analytics data - in real app, this would come from backend
  const analytics: AnalyticsData = {
    emailsProcessed: 1247,
    repliesSent: 89,
    tasksCreated: 156,
    escalationsMade: 23,
    avgResponseTime: 4.2,
    apiCost: 12.47,
    timeSaved: 1840,
    dailyStats: [
      { date: 'Mon', count: 45 },
      { date: 'Tue', count: 62 },
      { date: 'Wed', count: 38 },
      { date: 'Thu', count: 71 },
      { date: 'Fri', count: 54 },
      { date: 'Sat', count: 23 },
      { date: 'Sun', count: 18 },
    ],
    categoryBreakdown: [
      { category: 'Work', count: 456, color: '#3b82f6' },
      { category: 'Personal', count: 234, color: '#8b5cf6' },
      { category: 'Support', count: 189, color: '#ec4899' },
      { category: 'Sales', count: 156, color: '#f97316' },
      { category: 'Newsletters', count: 212, color: '#14b8a6' },
    ],
    agentPerformance: [
      { agentName: 'Rita', emoji: '🦊', color: '#f97316', emails: 342, accuracy: 94 },
      { agentName: 'Theta', emoji: '🦉', color: '#8b5cf6', emails: 289, accuracy: 91 },
      { agentName: 'Max', emoji: '🐶', color: '#22c55e', emails: 234, accuracy: 96 },
      { agentName: 'Atlas', emoji: '🦁', color: '#ef4444', emails: 198, accuracy: 89 },
      { agentName: 'Sage', emoji: '🐼', color: '#14b8a6', emails: 184, accuracy: 92 },
    ],
  };

  const maxDailyCount = Math.max(...analytics.dailyStats.map(d => d.count));

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          📊 Analytics & Reports
        </h1>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          Track agent performance, email insights, and cost optimization
        </p>
      </div>

      {/* Time Range Selector */}
      <div className={`${cardBg} border rounded-xl p-4 mb-6`}>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Time Range:</span>
          {(['day', 'week', 'month'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeRange === range
                  ? 'text-white'
                  : isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
              }`}
              style={timeRange === range ? { background: theme.accentColor } : {}}
            >
              {range === 'day' ? 'Today' : range === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          icon="📧"
          label="Emails Processed"
          value={analytics.emailsProcessed.toLocaleString()}
          change="+12%"
          positive={true}
          theme={theme}
        />
        <MetricCard
          icon="✉️"
          label="Replies Sent"
          value={analytics.repliesSent.toString()}
          change="+8%"
          positive={true}
          theme={theme}
        />
        <MetricCard
          icon="✅"
          label="Tasks Created"
          value={analytics.tasksCreated.toString()}
          change="+15%"
          positive={true}
          theme={theme}
        />
        <MetricCard
          icon="⏱️"
          label="Avg Response Time"
          value={`${analytics.avgResponseTime}m`}
          change="-18%"
          positive={true}
          theme={theme}
        />
      </div>

      {/* Cost & Time Saved */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* API Cost Breakdown */}
        <div className={`${cardBg} border rounded-xl p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              💰 LLM API Costs
            </h3>
            <span className={`text-2xl font-bold`} style={{ color: theme.accentColor }}>
              ${analytics.apiCost.toFixed(2)}
            </span>
          </div>
          
          <div className="space-y-3">
            {analytics.agentPerformance.map(agent => {
              const cost = (agent.emails / analytics.emailsProcessed) * analytics.apiCost;
              const percentage = (cost / analytics.apiCost) * 100;
              return (
                <div key={agent.agentName}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span>{agent.emoji}</span>
                      <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {agent.agentName}
                      </span>
                    </div>
                    <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      ${cost.toFixed(2)}
                    </span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${percentage}%`, background: agent.color }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={`mt-4 pt-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Cost per email:
              </span>
              <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                ${(analytics.apiCost / analytics.emailsProcessed).toFixed(4)}
              </span>
            </div>
          </div>
        </div>

        {/* Time Saved */}
        <div className={`${cardBg} border rounded-xl p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              ⏰ Time Saved
            </h3>
            <span className={`text-2xl font-bold`} style={{ color: theme.accentColor }}>
              {Math.floor(analytics.timeSaved / 60)}h {analytics.timeSaved % 60}m
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Auto-replies
                </span>
                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {Math.floor(analytics.timeSaved * 0.4)}m
                </span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                <div className="h-full rounded-full" style={{ width: '40%', background: '#3b82f6' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Auto-categorization
                </span>
                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {Math.floor(analytics.timeSaved * 0.3)}m
                </span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                <div className="h-full rounded-full" style={{ width: '30%', background: '#8b5cf6' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Task creation
                </span>
                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {Math.floor(analytics.timeSaved * 0.2)}m
                </span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                <div className="h-full rounded-full" style={{ width: '20%', background: '#22c55e' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Other automations
                </span>
                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {Math.floor(analytics.timeSaved * 0.1)}m
                </span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                <div className="h-full rounded-full" style={{ width: '10%', background: '#f97316' }}></div>
              </div>
            </div>
          </div>

          <div className={`mt-4 pt-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Estimated value:
              </span>
              <span className={`text-sm font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                ${Math.floor(analytics.timeSaved / 60 * 50)} (at $50/hr)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Email Volume Chart */}
      <div className={`${cardBg} border rounded-xl p-6 mb-6`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          📈 Daily Email Volume
        </h3>
        <div className="flex items-end justify-between gap-2 h-48">
          {analytics.dailyStats.map((day, i) => {
            const height = (day.count / maxDailyCount) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center justify-end h-full">
                  <span className={`text-xs font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {day.count}
                  </span>
                  <div
                    className="w-full rounded-t-lg transition-all hover:opacity-80"
                    style={{
                      height: `${height}%`,
                      background: `linear-gradient(to top, ${theme.accentColor}, ${theme.accentColor}80)`,
                    }}
                  ></div>
                </div>
                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  {day.date}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Breakdown & Agent Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Categories */}
        <div className={`${cardBg} border rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            📂 Email Categories
          </h3>
          <div className="space-y-3">
            {analytics.categoryBreakdown.map((cat, i) => {
              const percentage = (cat.count / analytics.emailsProcessed) * 100;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {cat.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {cat.count}
                      </span>
                      <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${percentage}%`, background: cat.color }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Agent Performance */}
        <div className={`${cardBg} border rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            🤖 Agent Performance
          </h3>
          <div className="space-y-3">
            {analytics.agentPerformance.map((agent, i) => (
              <div key={i} className={`p-3 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{agent.emoji}</span>
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {agent.agentName}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      agent.accuracy >= 95
                        ? isDark ? 'text-green-400' : 'text-green-600'
                        : agent.accuracy >= 90
                        ? isDark ? 'text-yellow-400' : 'text-yellow-600'
                        : isDark ? 'text-red-400' : 'text-red-600'
                    }`}
                  >
                    {agent.accuracy}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    {agent.emails} emails processed
                  </span>
                  <div className={`h-1.5 w-24 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${agent.accuracy}%`, background: agent.color }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, change, positive, theme }: {
  icon: string;
  label: string;
  value: string;
  change: string;
  positive: boolean;
  theme: ThemeConfig;
}) {
  const isDark = theme.mode === 'dark';
  
  return (
    <div
      className="border rounded-xl p-4"
      style={{
        background: `${theme.accentColor}08`,
        borderColor: `${theme.accentColor}30`,
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            positive
              ? isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-600'
              : isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600'
          }`}
        >
          {change}
        </span>
      </div>
      <p className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {value}
      </p>
      <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{label}</p>
    </div>
  );
}
