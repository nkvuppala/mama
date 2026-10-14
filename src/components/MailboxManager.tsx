import { useState, useEffect } from 'react';
import { Mailbox, MailboxType, RefreshSchedule, ThemeConfig, AGENT_EMOJIS } from '../types';

interface MailboxManagerProps {
  mailboxes: Mailbox[];
  onAdd: (mailbox: Mailbox) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Mailbox>) => void;
  onRefresh: (id: string) => void;
  onRenameCompany: (oldName: string, newName: string) => void;
  showAddMailbox?: boolean;
  onCloseAddMailbox?: () => void;
  theme: ThemeConfig;
}

export default function MailboxManager({ mailboxes, onAdd, onRemove, onUpdate, onRefresh, onRenameCompany, showAddMailbox, onCloseAddMailbox, theme }: MailboxManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const isDark = theme.mode === 'dark';
  const cardBg = isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';

  // Open add form when triggered from dashboard
  useEffect(() => {
    if (showAddMailbox) {
      setShowAddForm(true);
    }
  }, [showAddMailbox]);

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

      {/* Mailbox List - Grouped by Company */}
      <div className="space-y-6">
        {Object.entries(
          mailboxes.reduce((acc: Record<string, Mailbox[]>, mb) => {
            if (!acc[mb.company]) acc[mb.company] = [];
            acc[mb.company].push(mb);
            return acc;
          }, {})
        ).map(([companyName, companyMailboxes]) => (
            <div key={companyName} className="group">
              <CompanyGroupHeader 
                name={companyName} 
                count={companyMailboxes.length}
                unread={companyMailboxes.reduce((s, m) => s + m.unreadCount, 0)}
                hasOOO={companyMailboxes.some(m => m.outOfOffice.enabled)}
                onRename={(newName: string) => onRenameCompany(companyName, newName)}
                theme={theme}
              />            <div className="space-y-2">
              {companyMailboxes.map(mb => (
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
                {/* IMAP Config Display */}
                {mb.type === 'imap' && mb.imapConfig && (
                  <div className={`mb-4 p-3 rounded-lg border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <p className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>🖥️ IMAP Configuration</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      <div>
                        <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>Host:</span>
                        <span className={`ml-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{mb.imapConfig.host}</span>
                      </div>
                      <div>
                        <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>Port:</span>
                        <span className={`ml-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{mb.imapConfig.port}</span>
                      </div>
                      <div>
                        <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>SSL:</span>
                        <span className={`ml-1 ${mb.imapConfig.ssl ? 'text-green-400' : 'text-red-400'}`}>{mb.imapConfig.ssl ? '✓ Yes' : '✗ No'}</span>
                      </div>
                      <div>
                        <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>Folders:</span>
                        <span className={`ml-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{mb.imapConfig.folders.join(', ')}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mt-2">
                      <div>
                        <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>SMTP Host:</span>
                        <span className={`ml-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{mb.imapConfig.smtpHost}</span>
                      </div>
                      <div>
                        <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>SMTP Port:</span>
                        <span className={`ml-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{mb.imapConfig.smtpPort}</span>
                      </div>
                      <div>
                        <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>Username:</span>
                        <span className={`ml-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{mb.imapConfig.username}</span>
                      </div>
                      <div>
                        <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>Password:</span>
                        <span className={`ml-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>••••••••</span>
                      </div>
                    </div>
                  </div>
                )}

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
  const [agentColor, setAgentColor] = useState('#3b82f6');
  const [company, setCompany] = useState('');
  const [priority, setPriority] = useState<'critical' | 'high' | 'normal' | 'low'>('normal');
  const [refreshSchedule, setRefreshSchedule] = useState<'realtime' | '5min' | '15min' | '30min' | '1hour' | 'manual'>('15min');
  
  // IMAP settings
  const [imapHost, setImapHost] = useState('');
  const [imapPort, setImapPort] = useState(993);
  const [imapUsername, setImapUsername] = useState('');
  const [imapPassword, setImapPassword] = useState('');
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState(587);
  
  // Signature
  const [sigName, setSigName] = useState('');
  const [sigTitle, setSigTitle] = useState('');
  const [sigCompany, setSigCompany] = useState('');
  const [sigPhone, setSigPhone] = useState('');
  const [sigWebsite, setSigWebsite] = useState('');
  
  // Automation
  const [autoReply, setAutoReply] = useState(false);
  const [autoArchive, setAutoArchive] = useState(false);
  const [autoCategorize, setAutoCategorize] = useState(true);
  const [escalateUrgent, setEscalateUrgent] = useState(false);
  const [notifySlack, setNotifySlack] = useState(false);
  const [notifyPush, setNotifyPush] = useState(true);

  const handleSubmit = () => {
    if (!name || !email || !agentName) return;
    
    onAdd({
      id: `mb${Date.now()}`,
      name,
      emailAddress: email,
      type,
      agentName,
      agentEmoji,
      agentColor,
      agentPersonality: 'Helpful and efficient.',
      refreshSchedule,
      lastChecked: new Date().toISOString(),
      nextCheck: new Date(Date.now() + 15 * 60000).toISOString(),
      status: 'active',
      unreadCount: 0,
      totalEmails: 0,
      actionsToday: 0,
      autoReply,
      autoArchive,
      autoCategorize,
      escalateUrgent,
      notifySlack,
      notifyPush,
      ...(type === 'imap' || type === 'custom' ? {
        imapConfig: {
          host: imapHost,
          port: imapPort,
          username: imapUsername || email,
          password: imapPassword,
          ssl: true,
          folders: ['INBOX'],
          smtpHost,
          smtpPort,
          smtpUsername: imapUsername || email,
          smtpPassword: imapPassword,
          smtpSsl: true,
        }
      } : {}),
      priority,
      signature: { 
        name: sigName || agentName,
        title: sigTitle,
        company: sigCompany,
        phone: sigPhone,
        website: sigWebsite,
      },
      replyPrefix: 'On {date}, {from} wrote:',
      outOfOffice: {
        enabled: false,
        startDate: '',
        endDate: '',
        subject: 'Out of Office',
        message: 'Thank you for your email. I am currently out of the office and will respond upon my return.',
        onlyExternal: false,
        allowedDomains: [],
        replyFrequency: 'once',
      },
      company: company || 'Personal',
      brain: {
        companyInfo: '',
        products: [],
        faqs: [],
        pastEmails: [],
        tone: 'professional',
        responseStyle: 'balanced',
        language: 'English',
        rules: [],
        learnFromReplies: true,
        confidenceThreshold: 0.7,
      },
      llmConfig: {
        provider: 'openai',
        apiKey: '',
        model: 'gpt-4',
        maxTokens: 2000,
        temperature: 0.7,
      },
    });
  };

  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#22c55e', '#f97316', '#06b6d4', '#ef4444', '#14b8a6', '#6366f1', '#f59e0b'];

  return (
    <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6 mb-6 max-h-[80vh] overflow-y-auto`}>
      <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        ✨ Add New Mailbox ({30 - existingCount} slots remaining)
      </h3>

      {/* Section 1: Basic Info */}
      <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>📧 Basic Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>Mailbox Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Work Gmail, Client Support"
              className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none`}
            />
          </div>
          <div>
            <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none`}
            />
          </div>
          <div>
            <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>Provider Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as MailboxType)}
              className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none`}
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
            <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>Company / Group</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g., TechCorp Inc., Personal"
              className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none`}
            />
          </div>
        </div>
      </div>

      {/* Section 2: Agent Configuration */}
      <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>🤖 Agent Configuration</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>Agent Name *</label>
            <input
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="e.g., Rita, Theta, Max"
              className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none`}
            />
          </div>
          <div>
            <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>Agent Color</label>
            <div className="flex flex-wrap gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setAgentColor(color)}
                  className={`w-8 h-8 rounded-full transition-transform ${agentColor === color ? 'ring-2 ring-offset-2 scale-110' : 'hover:scale-110'}`}
                  style={{ background: color }}
                />
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>Agent Avatar</label>
            <div className="flex flex-wrap gap-1">
              {AGENT_EMOJIS.slice(0, 12).map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setAgentEmoji(emoji)}
                  className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${
                    agentEmoji === emoji ? 'ring-2 scale-110' : isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                  style={agentEmoji === emoji ? { outline: `2px solid ${agentColor}`, background: `${agentColor}20` } : {}}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>Priority Level</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none`}
            >
              <option value="critical">🔴 Critical</option>
              <option value="high">🟠 High</option>
              <option value="normal">🟢 Normal</option>
              <option value="low">⚪ Low</option>
            </select>
          </div>
          <div>
            <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>Refresh Schedule</label>
            <select
              value={refreshSchedule}
              onChange={(e) => setRefreshSchedule(e.target.value as any)}
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
        </div>
      </div>

      {/* Section 3: IMAP Configuration (conditional) */}
      {(type === 'imap' || type === 'custom') && (
        <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
          <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>🖥️ IMAP/SMTP Configuration</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>IMAP Host</label>
              <input
                type="text"
                value={imapHost}
                onChange={(e) => setImapHost(e.target.value)}
                placeholder="imap.example.com"
                className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none`}
              />
            </div>
            <div>
              <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>IMAP Port</label>
              <input
                type="number"
                value={imapPort}
                onChange={(e) => setImapPort(Number(e.target.value))}
                placeholder="993"
                className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none`}
              />
            </div>
            <div>
              <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>IMAP Username</label>
              <input
                type="text"
                value={imapUsername}
                onChange={(e) => setImapUsername(e.target.value)}
                placeholder={email || "your@email.com"}
                className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none`}
              />
            </div>
            <div>
              <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>IMAP Password</label>
              <input
                type="password"
                value={imapPassword}
                onChange={(e) => setImapPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none`}
              />
            </div>
            <div>
              <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>SMTP Host</label>
              <input
                type="text"
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
                placeholder="smtp.example.com"
                className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none`}
              />
            </div>
            <div>
              <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>SMTP Port</label>
              <input
                type="number"
                value={smtpPort}
                onChange={(e) => setSmtpPort(Number(e.target.value))}
                placeholder="587"
                className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none`}
              />
            </div>
          </div>
        </div>
      )}

      {/* Section 4: Signature */}
      <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>✍️ Email Signature</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>Name</label>
            <input
              type="text"
              value={sigName}
              onChange={(e) => setSigName(e.target.value)}
              placeholder={agentName || "Your Name"}
              className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none`}
            />
          </div>
          <div>
            <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>Title</label>
            <input
              type="text"
              value={sigTitle}
              onChange={(e) => setSigTitle(e.target.value)}
              placeholder="e.g., Senior Developer"
              className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none`}
            />
          </div>
          <div>
            <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>Company</label>
            <input
              type="text"
              value={sigCompany}
              onChange={(e) => setSigCompany(e.target.value)}
              placeholder="e.g., TechCorp Inc."
              className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none`}
            />
          </div>
          <div>
            <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>Phone</label>
            <input
              type="text"
              value={sigPhone}
              onChange={(e) => setSigPhone(e.target.value)}
              placeholder="+1 (555) 123-4567"
              className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none`}
            />
          </div>
          <div className="md:col-span-2">
            <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>Website</label>
            <input
              type="text"
              value={sigWebsite}
              onChange={(e) => setSigWebsite(e.target.value)}
              placeholder="www.example.com"
              className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none`}
            />
          </div>
        </div>
      </div>

      {/* Section 5: Automation Settings */}
      <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>⚡ Automation Settings</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Toggle label="Auto-reply" checked={autoReply} onChange={setAutoReply} theme={theme} />
          <Toggle label="Auto-archive" checked={autoArchive} onChange={setAutoArchive} theme={theme} />
          <Toggle label="Auto-categorize" checked={autoCategorize} onChange={setAutoCategorize} theme={theme} />
          <Toggle label="Escalate urgent" checked={escalateUrgent} onChange={setEscalateUrgent} theme={theme} />
          <Toggle label="Slack notify" checked={notifySlack} onChange={setNotifySlack} theme={theme} />
          <Toggle label="Push notify" checked={notifyPush} onChange={setNotifyPush} theme={theme} />
        </div>
      </div>

      {/* Section 6: Authentication & Connection Test */}
      <div className={`mb-6 p-4 rounded-lg border-2 ${isDark ? 'bg-blue-500/5 border-blue-500/30' : 'bg-blue-50 border-blue-200'}`}>
        <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>🔐 Authentication & Connection</h4>
        
        {/* Read-Only Notice */}
        <div className={`mb-4 p-3 rounded-lg ${isDark ? 'bg-green-500/10 border border-green-500/30' : 'bg-green-50 border border-green-200'}`}>
          <div className="flex items-start gap-2">
            <span className="text-lg">🔒</span>
            <div>
              <p className={`text-xs font-semibold ${isDark ? 'text-green-400' : 'text-green-700'}`}>Read-Only Mode</p>
              <p className={`text-xs mt-1 ${isDark ? 'text-green-400/70' : 'text-green-600'}`}>
                MAMA only READS your emails. Nothing is deleted or modified on your server without explicit approval.
              </p>
            </div>
          </div>
        </div>

        {/* OAuth for Gmail/Outlook */}
        {(type === 'gmail' || type === 'outlook') && (
          <div className="mb-4">
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
              {type === 'gmail' ? 'Google' : 'Microsoft'} OAuth Authentication:
            </p>
            <button
              type="button"
              className={`w-full px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700' 
                  : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300'
              }`}
            >
              {type === 'gmail' ? '🔗 Connect with Google' : '🔗 Connect with Microsoft'}
            </button>
            <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              You'll be redirected to {type === 'gmail' ? 'Google' : 'Microsoft'} to authorize read-only access.
            </p>
          </div>
        )}

        {/* IMAP Test Connection */}
        {(type === 'imap' || type === 'custom') && (
          <div className="mb-4">
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
              Test IMAP Connection:
            </p>
            <button
              type="button"
              disabled={!imapHost || !imapPassword}
              className={`w-full px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                !imapHost || !imapPassword
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              } ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700' 
                  : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300'
              }`}
            >
              🧪 Test Connection
            </button>
            <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Verifies IMAP host, port, and credentials before saving.
            </p>
          </div>
        )}

        {/* Connection Status */}
        <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-white'}`}>
          <p className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Connection Status:
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className={`text-xs ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
              Not connected - Complete authentication to connect
            </span>
          </div>
        </div>
      </div>

      {/* Buttons */}
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
    <div className="flex items-center gap-3 mb-3 px-2">
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
              autoFocus
            />
            <button onClick={handleSave} className="text-green-500 hover:text-green-400 text-sm" title="Save">✓</button>
            <button onClick={handleCancel} className="text-red-500 hover:text-red-400 text-sm" title="Cancel">✗</button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{name}</h3>
            <button
              onClick={() => { setEditValue(name); setIsEditing(true); }}
              className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-700/20 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
              title="Rename company"
            >
              ✏️
            </button>
          </div>
        )}
        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
          {count} mailbox{count !== 1 ? 'es' : ''} • {unread} unread
        </p>
      </div>
      {hasOOO && (
        <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">🏖️ OOO Active</span>
      )}
    </div>
  );
}
