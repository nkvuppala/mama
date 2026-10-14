import { useState } from 'react';
import { Mailbox, Email, AgentAction, ThemeConfig, PRIORITY_CONFIG } from '../types';

interface DashboardProps {
  mailboxes: Mailbox[];
  emails: Email[];
  actionLog: AgentAction[];
  totalUnread: number;
  activeAgents: number;
  totalActions: number;
  onRefreshMailbox: (id: string) => void;
  onSelectMailbox: (id: string) => void;
  onRenameCompany: (oldName: string, newName: string) => void;
  theme: ThemeConfig;
}

export default function Dashboard({ mailboxes, emails, actionLog, totalUnread, activeAgents, totalActions, onRefreshMailbox, onSelectMailbox, onRenameCompany, theme }: DashboardProps) {
  const isDark = theme.mode === 'dark';
  const cardBg = isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const subtext = isDark ? 'text-gray-500' : 'text-gray-500';
  const mutedText = isDark ? 'text-gray-400' : 'text-gray-600';

  const typeIcons: Record<string, string> = {
    gmail: '📧', outlook: '📮', imap: '🖥️', yahoo: '📩', icloud: '☁️', custom: '⚙️'
  };

  const scheduleLabels: Record<string, string> = {
    realtime: 'Real-time', '5min': 'Every 5 min', '15min': 'Every 15 min',
    '30min': 'Every 30 min', '1hour': 'Every hour', manual: 'Manual'
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Consolidated Dashboard
        </h1>
        <p className={mutedText}>
          All {mailboxes.length} mailboxes at a glance • {activeAgents} agents running • {totalUnread} unread emails
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon="📮" label="Mailboxes" value={mailboxes.length.toString()} sub="of 30 max" theme={theme} />
        <StatCard icon="🤖" label="Active Agents" value={activeAgents.toString()} sub={`${mailboxes.length - activeAgents} paused`} theme={theme} />
        <StatCard icon="📬" label="Unread" value={totalUnread.toString()} sub="across all boxes" theme={theme} />
        <StatCard icon="⚡" label="Actions Today" value={totalActions.toString()} sub="auto-performed" theme={theme} />
      </div>

      {/* All Mailboxes Grid - Grouped by Company */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            📮 Your Mailboxes ({mailboxes.length})
          </h2>
          <button 
            className="text-sm px-4 py-2 rounded-lg text-white font-medium transition-colors hover:opacity-90"
            style={{ background: theme.accentColor }}
          >
            + Add Mailbox
          </button>
        </div>

        {/* Company Groups */}
        <div className="space-y-6">
          {Object.entries(
            mailboxes.reduce((acc: Record<string, typeof mailboxes>, mb) => {
              if (!acc[mb.company]) acc[mb.company] = [];
              acc[mb.company].push(mb);
              return acc;
            }, {})
          ).map(([companyName, companyMailboxes]) => (
            <div key={companyName}>
              <CompanyGroupHeader 
                name={companyName} 
                count={companyMailboxes.length}
                unread={companyMailboxes.reduce((s, m) => s + m.unreadCount, 0)}
                hasOOO={companyMailboxes.some(m => m.outOfOffice.enabled)}
                onRename={(newName) => onRenameCompany(companyName, newName)}
                theme={theme}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {companyMailboxes.map(mb => (
            <div
              key={mb.id}
              className={`${cardBg} border rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer group`}
              onClick={() => onSelectMailbox(mb.id)}
              style={{ borderLeftColor: mb.agentColor, borderLeftWidth: '3px' }}
            >
              {/* Agent Header */}
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                  style={{ background: `${mb.agentColor}20` }}
                >
                  {mb.agentEmoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {mb.agentName}
                  </p>
                  <p className={`text-xs truncate ${subtext}`}>{mb.emailAddress}</p>
                </div>
                <StatusDot status={mb.status} />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className={`text-center p-2 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                  <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{mb.unreadCount}</p>
                  <p className={`text-xs ${subtext}`}>Unread</p>
                </div>
                <div className={`text-center p-2 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                  <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{mb.actionsToday}</p>
                  <p className={`text-xs ${subtext}`}>Actions</p>
                </div>
                <div className={`text-center p-2 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                  <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{mb.totalEmails}</p>
                  <p className={`text-xs ${subtext}`}>Total</p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{typeIcons[mb.type]}</span>
                  <span className={`text-xs capitalize ${subtext}`}>{mb.type}</span>
                  <span className="text-xs" title={PRIORITY_CONFIG[mb.priority].desc}>
                    {PRIORITY_CONFIG[mb.priority].icon}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-xs ${subtext}`}>🔄 {scheduleLabels[mb.refreshSchedule]}</span>
                </div>
              </div>

              {/* Refresh button */}
              <button
                onClick={(e) => { e.stopPropagation(); onRefreshMailbox(mb.id); }}
                className={`mt-3 w-full text-xs py-1.5 rounded-lg border transition-colors opacity-0 group-hover:opacity-100 ${
                  isDark ? 'border-gray-700 hover:bg-gray-800 text-gray-400' : 'border-gray-300 hover:bg-gray-50 text-gray-600'
                }`}
              >
                🔄 Refresh Now
              </button>
            </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Across All Mailboxes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Emails */}
        <div className={`${cardBg} border rounded-xl p-5`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            📬 Latest Emails (All Mailboxes)
          </h3>
          <div className="space-y-2">
            {emails.slice(0, 6).map(email => {
              const mb = mailboxes.find(m => m.id === email.mailboxId);
              return (
                <div key={email.id} className={`flex items-center gap-3 p-2 rounded-lg ${isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'} transition-colors`}>
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                    style={{ background: `${mb?.agentColor || '#666'}20` }}
                  >
                    {mb?.agentEmoji || '📧'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {email.subject}
                    </p>
                    <p className={`text-xs truncate ${subtext}`}>
                      {mb?.agentName} • {email.from}
                    </p>
                  </div>
                  {!email.read && (
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: theme.accentColor }}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Agent Activity Log */}
        <div className={`${cardBg} border rounded-xl p-5`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            ⚡ Agent Activity Feed
          </h3>
          {actionLog.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-3">🤖</p>
              <p className={mutedText}>Agents are monitoring your mailboxes...</p>
              <p className={`text-xs ${subtext} mt-1`}>Actions will appear here as they happen</p>
            </div>
          ) : (
            <div className="space-y-2">
              {actionLog.slice(0, 8).map((action, i) => {
                const mb = mailboxes.find(m => m.id === action.mailboxId);
                return (
                  <div key={i} className={`flex items-center gap-3 p-2 rounded-lg ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                      style={{ background: `${mb?.agentColor || '#666'}30` }}
                    >
                      {mb?.agentEmoji || '⚡'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                        {action.description}
                      </p>
                      <p className={`text-xs ${subtext}`}>{mb?.agentName} • {action.result}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, theme }: { icon: string; label: string; value: string; sub: string; theme: ThemeConfig }) {
  return (
    <div 
      className="border rounded-xl p-4"
      style={{ 
        background: `${theme.accentColor}08`,
        borderColor: `${theme.accentColor}30`
      }}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-2xl font-bold" style={{ color: theme.accentColor }}>{value}</p>
          <p className="text-sm font-medium" style={{ color: theme.mode === 'dark' ? '#fff' : '#111' }}>{label}</p>
          <p className="text-xs" style={{ color: theme.mode === 'dark' ? '#6b7280' : '#9ca3af' }}>{sub}</p>
        </div>
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: 'bg-green-500',
    syncing: 'bg-blue-500 animate-pulse',
    paused: 'bg-yellow-500',
    error: 'bg-red-500',
  };
  return <div className={`w-2.5 h-2.5 rounded-full ${colors[status] || 'bg-gray-500'}`}></div>;
}

function CompanyGroupHeader({ name, count, unread, hasOOO, onRename, theme }: {
  name: string;
  count: number;
  unread: number;
  hasOOO: boolean;
  onRename: (newName: string) => void;
  theme: ThemeConfig;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(name);
  const isDark = theme.mode === 'dark';
  const subtext = isDark ? 'text-gray-500' : 'text-gray-500';

  const handleSave = () => {
    if (editValue.trim() && editValue !== name) {
      onRename(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(name);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
        {name[0]}
      </div>
      <div className="flex-1">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
              className={`px-2 py-1 text-sm rounded border ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2`}
              style={{ focusRingColor: theme.accentColor } as any}
              autoFocus
            />
            <button
              onClick={handleSave}
              className="text-green-500 hover:text-green-400 text-sm"
              title="Save"
            >
              ✓
            </button>
            <button
              onClick={handleCancel}
              className="text-red-500 hover:text-red-400 text-sm"
              title="Cancel"
            >
              ✗
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{name}</h3>
            <button
              onClick={() => {
                setEditValue(name);
                setIsEditing(true);
              }}
              className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-700/20 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
              title="Rename company"
            >
              ✏️
            </button>
          </div>
        )}
        <p className={`text-xs ${subtext}`}>
          {count} mailbox{count !== 1 ? 'es' : ''} • {unread} unread
        </p>
      </div>
      {hasOOO && (
        <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">🏖️ OOO Active</span>
      )}
    </div>
  );
}
