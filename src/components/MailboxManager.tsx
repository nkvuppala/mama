import { useState } from 'react';
import { Mailbox, MailboxType, RefreshSchedule, ThemeConfig, AGENT_EMOJIS } from '../types';

interface MailboxManagerProps {
  mailboxes: Mailbox[];
  onAdd: (mailbox: Mailbox) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Mailbox>) => void;
  onRefresh: (id: string) => void;
  theme: ThemeConfig;
}

export default function MailboxManager({ mailboxes, onAdd, onRemove, onUpdate, onRefresh, theme }: MailboxManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const isDark = theme.mode === 'dark';
  const cardBg = isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            📮 Mailbox Manager
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            {mailboxes.length}/30 mailboxes connected
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          disabled={mailboxes.length >= 30}
          className="px-5 py-2.5 rounded-lg text-white font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: theme.accentColor }}
        >
          + Add Mailbox
        </button>
      </div>

      {/* Usage Bar */}
      <div className={`${cardBg} border rounded-xl p-4 mb-6`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Mailbox Slots Used
          </span>
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {mailboxes.length} / 30
          </span>
        </div>
        <div className={`h-3 rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
          <div 
            className="h-full rounded-full transition-all"
            style={{ 
              width: `${(mailboxes.length / 30) * 100}%`,
              background: `linear-gradient(90deg, ${theme.accentColor}, ${theme.accentColor}aa)`
            }}
          ></div>
        </div>
      </div>

      {/* Add Mailbox Form */}
      {showAddForm && (
        <AddMailboxForm
          onAdd={(mb) => { onAdd(mb); setShowAddForm(false); }}
          onCancel={() => setShowAddForm(false)}
          existingCount={mailboxes.length}
          theme={theme}
        />
      )}

      {/* Mailbox List */}
      <div className="space-y-3">
        {mailboxes.map(mb => (
          <div key={mb.id} className={`${cardBg} border rounded-xl overflow-hidden`} style={{ borderLeft: `3px solid ${mb.agentColor}` }}>
            <div className="p-4">
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0"
                  style={{ background: `${mb.agentColor}20` }}
                >
                  {mb.agentEmoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{mb.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                      {mb.type}
                    </span>
                    <StatusBadge status={mb.status} />
                  </div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{mb.emailAddress}</p>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mt-0.5`}>
                    Agent: <strong>{mb.agentName}</strong> • {mb.unreadCount} unread • Last checked: {new Date(mb.lastChecked).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onRefresh(mb.id)}
                    className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                    title="Refresh now"
                  >
                    🔄
                  </button>
                  <button
                    onClick={() => setEditingId(editingId === mb.id ? null : mb.id)}
                    className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => { if (confirm('Remove this mailbox?')) onRemove(mb.id); }}
                    className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-red-500/20 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-gray-600 hover:text-red-600'}`}
                    title="Remove"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Edit */}
            {editingId === mb.id && (
              <div className={`border-t p-4 ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>Mailbox Name</label>
                    <input
                      type="text"
                      value={mb.name}
                      onChange={(e) => onUpdate(mb.id, { name: e.target.value })}
                      className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none`}
                      style={{ borderColor: `${theme.accentColor}50` }}
                    />
                  </div>
                  <div>
                    <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>Refresh Schedule</label>
                    <select
                      value={mb.refreshSchedule}
                      onChange={(e) => onUpdate(mb.id, { refreshSchedule: e.target.value as RefreshSchedule })}
                      className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none`}
                    >
                      <option value="realtime">Real-time (push)</option>
                      <option value="5min">Every 5 minutes</option>
                      <option value="15min">Every 15 minutes</option>
                      <option value="30min">Every 30 minutes</option>
                      <option value="1hour">Every hour</option>
                      <option value="manual">Manual only</option>
                    </select>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Toggle label="Auto-categorize" checked={mb.autoCategorize} onChange={(v) => onUpdate(mb.id, { autoCategorize: v })} theme={theme} />
                    <Toggle label="Auto-archive" checked={mb.autoArchive} onChange={(v) => onUpdate(mb.id, { autoArchive: v })} theme={theme} />
                    <Toggle label="Escalate urgent" checked={mb.escalateUrgent} onChange={(v) => onUpdate(mb.id, { escalateUrgent: v })} theme={theme} />
                    <Toggle label="Slack notify" checked={mb.notifySlack} onChange={(v) => onUpdate(mb.id, { notifySlack: v })} theme={theme} />
                    <Toggle label="Push notify" checked={mb.notifyPush} onChange={(v) => onUpdate(mb.id, { notifyPush: v })} theme={theme} />
                  </div>
                  <div>
                    <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>Status</label>
                    <div className="flex gap-2">
                      {(['active', 'paused'] as const).map(s => (
                        <button
                          key={s}
                          onClick={() => onUpdate(mb.id, { status: s })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                            mb.status === s 
                              ? 'text-white' 
                              : isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'
                          }`}
                          style={mb.status === s ? { background: theme.accentColor } : {}}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AddMailboxForm({ onAdd, onCancel, existingCount, theme }: {
  onAdd: (mb: Mailbox) => void;
  onCancel: () => void;
  existingCount: number;
  theme: ThemeConfig;
}) {
  const isDark = theme.mode === 'dark';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState<MailboxType>('gmail');
  const [agentName, setAgentName] = useState('');
  const [agentEmoji, setAgentEmoji] = useState(AGENT_EMOJIS[Math.floor(Math.random() * AGENT_EMOJIS.length)]);
  const [imapHost, setImapHost] = useState('');
  const [imapPort, setImapPort] = useState(993);

  const handleSubmit = () => {
    if (!name || !email || !agentName) return;
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#22c55e', '#f97316', '#06b6d4', '#ef4444', '#14b8a6'];
    onAdd({
      id: `mb${Date.now()}`,
      name,
      emailAddress: email,
      type,
      agentName,
      agentEmoji,
      agentColor: colors[Math.floor(Math.random() * colors.length)],
      agentPersonality: 'Helpful and efficient.',
      refreshSchedule: '15min',
      lastChecked: new Date().toISOString(),
      nextCheck: new Date(Date.now() + 15 * 60000).toISOString(),
      status: 'active',
      unreadCount: 0,
      totalEmails: 0,
      actionsToday: 0,
      autoReply: false,
      autoArchive: false,
      autoCategorize: true,
      escalateUrgent: false,
      notifySlack: false,
      notifyPush: true,
      ...(type === 'imap' || type === 'custom' ? { imapHost, imapPort } : {}),
    });
  };

  return (
    <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6 mb-6`}>
      <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        ✨ Add New Mailbox ({30 - existingCount} slots remaining)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>Mailbox Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Work Gmail, Client Support"
            className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900'} focus:outline-none`}
          />
        </div>
        <div>
          <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>Email Address *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900'} focus:outline-none`}
          />
        </div>
        <div>
          <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>Provider Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as MailboxType)}
            className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} focus:outline-none`}
          >
            <option value="gmail">Gmail (Google)</option>
            <option value="outlook">Outlook / Hotmail</option>
            <option value="imap">IMAP (Custom Server)</option>
            <option value="yahoo">Yahoo Mail</option>
            <option value="icloud">iCloud Mail</option>
            <option value="custom">Custom / Other</option>
          </select>
        </div>
        <div>
          <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>Agent Name *</label>
          <input
            type="text"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            placeholder="e.g., Rita, Theta, Max"
            className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900'} focus:outline-none`}
          />
        </div>
        <div>
          <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>Agent Avatar</label>
          <div className="flex flex-wrap gap-1">
            {AGENT_EMOJIS.slice(0, 12).map(emoji => (
              <button
                key={emoji}
                onClick={() => setAgentEmoji(emoji)}
                className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${
                  agentEmoji === emoji ? 'ring-2 scale-110' : isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
                style={agentEmoji === emoji ? { outline: `2px solid ${theme.accentColor}`, background: `${theme.accentColor}20` } : {}}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
        {(type === 'imap' || type === 'custom') && (
          <>
            <div>
              <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>IMAP Host</label>
              <input
                type="text"
                value={imapHost}
                onChange={(e) => setImapHost(e.target.value)}
                placeholder="imap.example.com"
                className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900'} focus:outline-none`}
              />
            </div>
            <div>
              <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>IMAP Port</label>
              <input
                type="number"
                value={imapPort}
                onChange={(e) => setImapPort(Number(e.target.value))}
                className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} focus:outline-none`}
              />
            </div>
          </>
        )}
      </div>
      <div className="flex gap-3 mt-5">
        <button
          onClick={handleSubmit}
          disabled={!name || !email || !agentName}
          className="px-5 py-2 rounded-lg text-white font-medium transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: theme.accentColor }}
        >
          Add Mailbox
        </button>
        <button
          onClick={onCancel}
          className={`px-5 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    active: { bg: 'bg-green-500/20', text: 'text-green-400', label: '● Active' },
    syncing: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: '⟳ Syncing' },
    paused: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: '⏸ Paused' },
    error: { bg: 'bg-red-500/20', text: 'text-red-400', label: '✗ Error' },
  };
  const c = config[status] || config.active;
  return <span className={`text-xs px-2 py-0.5 rounded-full ${c.bg} ${c.text}`}>{c.label}</span>;
}

function Toggle({ label, checked, onChange, theme }: { label: string; checked: boolean; onChange: (v: boolean) => void; theme: ThemeConfig }) {
  const isDark = theme.mode === 'dark';
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div
        onClick={() => onChange(!checked)}
        className={`w-9 h-5 rounded-full relative transition-colors ${checked ? '' : isDark ? 'bg-gray-700' : 'bg-gray-300'}`}
        style={checked ? { background: theme.accentColor } : {}}
      >
        <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${checked ? 'left-4.5' : 'left-0.5'}`}
          style={{ left: checked ? '18px' : '2px' }}
        ></div>
      </div>
      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{label}</span>
    </label>
  );
}
