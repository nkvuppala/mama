import { useState } from 'react';
import { Mailbox, Email, AgentAction, ThemeConfig, ComposedEmail } from '../types';
import ComposeEmail from './ComposeEmail';

interface UnifiedInboxProps {
  mailboxes: Mailbox[];
  emails: Email[];
  selectedMailboxId: string | null;
  onSelectMailbox: (id: string | null) => void;
  onAction: (action: AgentAction) => void;
  onRenameCompany: (oldName: string, newName: string) => void;
  theme: ThemeConfig;
}

export default function UnifiedInbox({ mailboxes, emails, selectedMailboxId, onSelectMailbox, onAction, onRenameCompany, theme }: UnifiedInboxProps) {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [composeReplyTo, setComposeReplyTo] = useState<Email | null>(null);
  const isDark = theme.mode === 'dark';
  const cardBg = isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';

  const filteredEmails = selectedMailboxId 
    ? emails.filter(e => e.mailboxId === selectedMailboxId)
    : emails;

  const getMailbox = (id: string) => mailboxes.find(m => m.id === id);

  const handleComposeSend = (composed: ComposedEmail) => {
    const mb = mailboxes.find(m => m.id === composed.fromMailboxId);
    onAction({
      type: 'send' as any,
      mailboxId: composed.fromMailboxId,
      description: `${mb?.agentName || 'Agent'} sent email to ${composed.to}`,
      result: `Subject: ${composed.subject}`,
      status: 'completed'
    });
  };

  const handleReplyClick = () => {
    setComposeReplyTo(selectedEmail);
    setShowCompose(true);
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
      {/* Compose Modal */}
      {showCompose && (
        <ComposeEmail
          mailboxes={mailboxes}
          replyTo={composeReplyTo}
          onClose={() => { setShowCompose(false); setComposeReplyTo(null); }}
          onSend={handleComposeSend}
          theme={theme}
        />
      )}

      {/* Mailbox Filter Sidebar - Hidden on mobile */}
      <div className={`hidden lg:block w-60 border-r shrink-0 overflow-y-auto ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
        <div className="p-3">
          <button
            onClick={() => onSelectMailbox(null)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium mb-2 transition-colors ${
              !selectedMailboxId
                ? 'text-white'
                : isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-200'
            }`}
            style={!selectedMailboxId ? { background: theme.accentColor } : {}}
          >
            <span>📬</span>
            <span className="flex-1 text-left">All Mailboxes</span>
            <span className="text-xs opacity-70">{emails.length}</span>
          </button>

          {/* Grouped by Company */}
          {Object.entries(
            mailboxes.reduce((acc: Record<string, typeof mailboxes>, mb) => {
              if (!acc[mb.company]) acc[mb.company] = [];
              acc[mb.company].push(mb);
              return acc;
            }, {})
          ).map(([companyName, companyMailboxes]) => (
            <div key={companyName} className="mb-3 group">
              <div className={`flex items-center gap-1 mb-1 px-3 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                <span className="text-xs font-medium uppercase tracking-wide flex-1">{companyName}</span>
                <button
                  onClick={() => {
                    const newName = prompt('Rename company:', companyName);
                    if (newName && newName.trim() && newName.trim() !== companyName) {
                      onRenameCompany(companyName, newName.trim());
                    }
                  }}
                  className={`opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded text-xs ${isDark ? 'hover:bg-gray-700 hover:text-white' : 'hover:bg-gray-200 hover:text-gray-900'}`}
                  title="Rename company"
                >
                  ✏️
                </button>
              </div>
              {companyMailboxes.map(mb => {
                const count = emails.filter(e => e.mailboxId === mb.id).length;
                return (
                  <button
                    key={mb.id}
                    onClick={() => onSelectMailbox(mb.id)}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      selectedMailboxId === mb.id
                        ? 'text-white'
                        : isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-200'
                    }`}
                    style={selectedMailboxId === mb.id ? { background: mb.agentColor } : {}}
                  >
                    <span className="text-sm">{mb.agentEmoji}</span>
                    <span className="flex-1 text-left truncate text-xs">{mb.agentName}</span>
                    {mb.outOfOffice.enabled && <span className="text-xs" title="Out of Office">🏖️</span>}
                    <span className="text-xs opacity-70">{count}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Email List - Full width on mobile, fixed on desktop */}
      <div className={`w-full lg:w-96 border-r shrink-0 overflow-y-auto ${isDark ? 'border-gray-800' : 'border-gray-200'} ${selectedEmail ? 'hidden lg:block' : ''}`}>
        <div className={`p-3 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <h2 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {selectedMailboxId 
                ? `${getMailbox(selectedMailboxId)?.agentName}'s Inbox` 
                : 'Unified Inbox'
              }
            </h2>
            <button
              onClick={() => { setComposeReplyTo(null); setShowCompose(true); }}
              className="text-white px-3 py-1 rounded-lg text-xs font-medium hover:opacity-90"
              style={{ background: theme.accentColor }}
            >
              ✉️ Compose
            </button>
          </div>
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            {filteredEmails.length} emails
          </p>
        </div>

        {filteredEmails.map(email => {
          const mb = getMailbox(email.mailboxId);
          return (
            <button
              key={email.id}
              onClick={() => setSelectedEmail(email)}
              className={`w-full text-left p-3 border-b transition-colors ${
                selectedEmail?.id === email.id
                  ? isDark ? 'bg-gray-800' : 'bg-blue-50'
                  : isDark ? 'hover:bg-gray-800/50 border-gray-800/50' : 'hover:bg-gray-50 border-gray-100'
              } ${!email.read ? (isDark ? 'bg-gray-900/30' : 'bg-blue-50/30') : ''}`}
              style={selectedEmail?.id === email.id ? { borderLeft: `3px solid ${mb?.agentColor || theme.accentColor}` } : {}}
            >
              <div className="flex items-start gap-2">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 mt-0.5"
                  style={{ background: `${mb?.agentColor || '#666'}20` }}
                >
                  {mb?.agentEmoji || '📧'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm font-medium truncate ${!email.read ? (isDark ? 'text-white' : 'text-gray-900') : (isDark ? 'text-gray-300' : 'text-gray-700')}`}>
                      {email.from}
                    </span>
                    <span className={`text-xs shrink-0 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      {new Date(email.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className={`text-sm truncate ${!email.read ? (isDark ? 'text-gray-200' : 'text-gray-800') : (isDark ? 'text-gray-400' : 'text-gray-600')}`}>
                    {email.subject}
                  </p>
                  {email.agentSummary && (
                    <p className={`text-xs mt-1 truncate ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      🤖 {email.agentSummary}
                    </p>
                  )}
                </div>
                {!email.read && (
                  <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: theme.accentColor }}></div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Email Detail - Full width on mobile when selected */}
      <div className={`flex-1 overflow-y-auto ${!selectedEmail ? 'hidden lg:flex lg:flex-col' : 'flex flex-col'}`}>
        {selectedEmail ? (
          <div className="flex-1 flex flex-col">
            {/* Mobile Back Button */}
            <div className={`lg:hidden p-3 border-b flex items-center gap-2 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <button
                onClick={() => setSelectedEmail(null)}
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                ← Back
              </button>
              <h2 className={`font-semibold flex-1 truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {selectedEmail.subject}
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 lg:p-6">
              {/* Email Header */}
              <div className="flex items-center gap-4 mb-6">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white shrink-0"
                  style={{ background: `linear-gradient(135deg, ${getMailbox(selectedEmail.mailboxId)?.agentColor || '#666'}, ${getMailbox(selectedEmail.mailboxId)?.agentColor || '#666'}aa)` }}
                >
                  {selectedEmail.from[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedEmail.from}</p>
                  <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{selectedEmail.fromEmail}</p>
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'} hidden sm:block`}>
                  {new Date(selectedEmail.date).toLocaleString()}
                </div>
              </div>

              <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {selectedEmail.subject}
              </h2>

              <div className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <p className="leading-relaxed">{selectedEmail.body}</p>
              </div>

              {/* Agent Analysis */}
              <div 
                className="border rounded-xl p-4 mb-6"
                style={{ 
                  background: `${getMailbox(selectedEmail.mailboxId)?.agentColor || theme.accentColor}10`,
                  borderColor: `${getMailbox(selectedEmail.mailboxId)?.agentColor || theme.accentColor}30`
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span>{getMailbox(selectedEmail.mailboxId)?.agentEmoji}</span>
                  <span className="text-sm font-semibold" style={{ color: getMailbox(selectedEmail.mailboxId)?.agentColor }}>
                    {getMailbox(selectedEmail.mailboxId)?.agentName}'s Analysis
                  </span>
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{selectedEmail.agentSummary}</p>
                {selectedEmail.agentAction && (
                  <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    ⚡ {selectedEmail.agentAction}
                  </p>
                )}
              </div>

              {/* Quick Actions */}
              <div className={`${cardBg} border rounded-xl p-4 mb-6`}>
                <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>⚡ Quick Actions</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <QuickAction icon="✉️" label="Reply" onClick={handleReplyClick} theme={theme} />
                  <QuickAction icon="🔄" label="Forward" onClick={() => onAction({ type: 'forward', mailboxId: selectedEmail.mailboxId, description: `Forwarded: ${selectedEmail.subject}`, result: 'Forwarded to team', status: 'completed' })} theme={theme} />
                  <QuickAction icon="📅" label="Schedule" onClick={() => onAction({ type: 'schedule', mailboxId: selectedEmail.mailboxId, description: `Meeting scheduled re: ${selectedEmail.subject}`, result: 'Calendar invite sent', status: 'completed' })} theme={theme} />
                  <QuickAction icon="✅" label="Create Task" onClick={() => onAction({ type: 'task', mailboxId: selectedEmail.mailboxId, description: `Task from: ${selectedEmail.subject}`, result: 'Added to task board', status: 'completed' })} theme={theme} />
                  <QuickAction icon="🚨" label="Escalate" onClick={() => onAction({ type: 'escalate', mailboxId: selectedEmail.mailboxId, description: `Escalated: ${selectedEmail.subject}`, result: 'Team notified', status: 'completed' })} theme={theme} />
                  <QuickAction icon="📁" label="Archive" onClick={() => onAction({ type: 'organize', mailboxId: selectedEmail.mailboxId, description: `Archived: ${selectedEmail.subject}`, result: 'Moved to archive', status: 'completed' })} theme={theme} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-5xl mb-4">📬</p>
              <p className={`text-lg font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Select an email to view
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                Choose from {filteredEmails.length} emails
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function QuickAction({ icon, label, onClick, theme }: { icon: string; label: string; onClick: () => void; theme: ThemeConfig }) {
  const isDark = theme.mode === 'dark';
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 p-2.5 rounded-lg text-sm transition-all ${
        isDark ? 'bg-gray-800/50 hover:bg-gray-800 text-gray-300' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
