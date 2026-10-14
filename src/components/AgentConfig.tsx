import { useState } from 'react';
import { Mailbox, ThemeConfig, AGENT_EMOJIS, ACCENT_COLORS, PRIORITY_CONFIG, MailboxPriority } from '../types';

interface AgentConfigProps {
  mailboxes: Mailbox[];
  onUpdate: (id: string, updates: Partial<Mailbox>) => void;
  theme: ThemeConfig;
}

export default function AgentConfig({ mailboxes, onUpdate, theme }: AgentConfigProps) {
  const [selectedId, setSelectedId] = useState<string | null>(mailboxes[0]?.id || null);
  const isDark = theme.mode === 'dark';
  const cardBg = isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const selected = mailboxes.find(m => m.id === selectedId);

  const personalities = [
    { name: 'Professional', desc: 'Formal, efficient, work-focused', emoji: '💼' },
    { name: 'Friendly', desc: 'Casual, warm, personable', emoji: '😊' },
    { name: 'Technical', desc: 'Precise, detailed, analytical', emoji: '🔧' },
    { name: 'Creative', desc: 'Innovative, expressive, unique', emoji: '🎨' },
    { name: 'Minimalist', desc: 'Brief, to-the-point, no fluff', emoji: '⚡' },
    { name: 'Guardian', desc: 'Security-focused, cautious, protective', emoji: '🛡️' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🤖 Agent Configuration
        </h1>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          Name, personalize, and configure each agent's behavior
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent List */}
        <div className={`${cardBg} border rounded-xl p-4`}>
          <h3 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Your Agents ({mailboxes.length})
          </h3>
          <div className="space-y-2">
            {mailboxes.map(mb => (
              <button
                key={mb.id}
                onClick={() => setSelectedId(mb.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${
                  selectedId === mb.id
                    ? isDark ? 'bg-gray-800' : 'bg-gray-100'
                    : isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'
                }`}
                style={selectedId === mb.id ? { borderLeft: `3px solid ${mb.agentColor}` } : {}}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
                  style={{ background: `${mb.agentColor}20` }}
                >
                  {mb.agentEmoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{mb.agentName}</p>
                  <p className={`text-xs truncate ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{mb.emailAddress}</p>
                </div>
                <StatusDot status={mb.status} />
              </button>
            ))}
          </div>
        </div>

        {/* Agent Config Panel */}
        {selected && (
          <div className="lg:col-span-2 space-y-4">
            {/* Identity */}
            <div className={`${cardBg} border rounded-xl p-5`}>
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                🪪 Agent Identity
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>Agent Name</label>
                  <input
                    type="text"
                    value={selected.agentName}
                    onChange={(e) => onUpdate(selected.id, { agentName: e.target.value })}
                    className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} focus:outline-none`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>Agent Color</label>
                  <div className="flex flex-wrap gap-2">
                    {ACCENT_COLORS.map(c => (
                      <button
                        key={c.value}
                        onClick={() => onUpdate(selected.id, { agentColor: c.value })}
                        className={`w-8 h-8 rounded-full transition-transform ${selected.agentColor === c.value ? 'ring-2 ring-offset-2 scale-110' : 'hover:scale-110'}`}
                        style={{ background: c.value }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>Agent Emoji</label>
                  <div className="flex flex-wrap gap-1">
                    {AGENT_EMOJIS.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => onUpdate(selected.id, { agentEmoji: emoji })}
                        className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                          selected.agentEmoji === emoji ? 'scale-110' : isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                        }`}
                        style={selected.agentEmoji === emoji ? { background: `${selected.agentColor}20`, outline: `2px solid ${selected.agentColor}` } : {}}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Personality */}
            <div className={`${cardBg} border rounded-xl p-5`}>
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                🧠 Personality
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {personalities.map(p => (
                  <button
                    key={p.name}
                    onClick={() => onUpdate(selected.id, { agentPersonality: p.desc })}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      selected.agentPersonality === p.desc
                        ? 'border-2'
                        : isDark ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={selected.agentPersonality === p.desc ? { borderColor: selected.agentColor, background: `${selected.agentColor}10` } : {}}
                  >
                    <span className="text-2xl block mb-1">{p.emoji}</span>
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{p.name}</p>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{p.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div className={`${cardBg} border rounded-xl p-5`}>
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                🎯 Priority Level
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(Object.keys(PRIORITY_CONFIG) as MailboxPriority[]).map(priority => {
                  const config = PRIORITY_CONFIG[priority];
                  return (
                    <button
                      key={priority}
                      onClick={() => onUpdate(selected.id, { priority })}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        selected.priority === priority
                          ? 'border-2'
                          : isDark ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={selected.priority === priority ? { borderColor: config.color, background: `${config.color}10` } : {}}
                    >
                      <div className="text-2xl mb-2">{config.icon}</div>
                      <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{config.label}</p>
                      <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mt-1`}>{config.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Signature */}
            <div className={`${cardBg} border rounded-xl p-5`}>
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ✍️ Email Signature
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>Name</label>
                  <input
                    type="text"
                    value={selected.signature.name}
                    onChange={(e) => onUpdate(selected.id, { signature: { ...selected.signature, name: e.target.value } })}
                    className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} focus:outline-none`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>Title</label>
                  <input
                    type="text"
                    value={selected.signature.title || ''}
                    onChange={(e) => onUpdate(selected.id, { signature: { ...selected.signature, title: e.target.value } })}
                    placeholder="e.g., Senior Developer"
                    className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'} focus:outline-none`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>Company</label>
                  <input
                    type="text"
                    value={selected.signature.company || ''}
                    onChange={(e) => onUpdate(selected.id, { signature: { ...selected.signature, company: e.target.value } })}
                    placeholder="e.g., TechCorp Inc."
                    className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'} focus:outline-none`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>Phone</label>
                  <input
                    type="text"
                    value={selected.signature.phone || ''}
                    onChange={(e) => onUpdate(selected.id, { signature: { ...selected.signature, phone: e.target.value } })}
                    placeholder="e.g., +1 (555) 123-4567"
                    className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'} focus:outline-none`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>Website</label>
                  <input
                    type="text"
                    value={selected.signature.website || ''}
                    onChange={(e) => onUpdate(selected.id, { signature: { ...selected.signature, website: e.target.value } })}
                    placeholder="e.g., www.company.com"
                    className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'} focus:outline-none`}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>Custom HTML (optional)</label>
                  <textarea
                    value={selected.signature.customHtml || ''}
                    onChange={(e) => onUpdate(selected.id, { signature: { ...selected.signature, customHtml: e.target.value } })}
                    placeholder="<p>Your custom signature HTML...</p>"
                    className={`w-full rounded-lg px-3 py-2 text-sm border resize-none h-20 ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'} focus:outline-none font-mono`}
                  />
                </div>
              </div>
              
              {/* Signature Preview */}
              <div className={`mt-4 p-4 rounded-lg border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <p className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Preview:</p>
                <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-line`}>
                  {selected.signature.name}
                  {selected.signature.title && `\n${selected.signature.title}`}
                  {selected.signature.company && `\n${selected.signature.company}`}
                  {selected.signature.phone && `\n📱 ${selected.signature.phone}`}
                  {selected.signature.website && `\n🌐 ${selected.signature.website}`}
                </div>
              </div>
            </div>

            {/* Schedule & Behavior */}
            <div className={`${cardBg} border rounded-xl p-5`}>
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ⏰ Schedule & Behavior
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>Refresh Schedule</label>
                  <div className="space-y-2">
                    {[
                      { value: 'realtime', label: 'Real-time', desc: 'Instant push notifications' },
                      { value: '5min', label: 'Every 5 min', desc: 'High frequency' },
                      { value: '15min', label: 'Every 15 min', desc: 'Balanced' },
                      { value: '30min', label: 'Every 30 min', desc: 'Low resource' },
                      { value: '1hour', label: 'Every hour', desc: 'Minimal checks' },
                      { value: 'manual', label: 'Manual only', desc: 'You control when' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => onUpdate(selected.id, { refreshSchedule: opt.value as any })}
                        className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-all ${
                          selected.refreshSchedule === opt.value
                            ? isDark ? 'bg-gray-800' : 'bg-gray-100'
                            : isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'
                        }`}
                        style={selected.refreshSchedule === opt.value ? { borderLeft: `3px solid ${selected.agentColor}` } : {}}
                      >
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{opt.label}</p>
                          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{opt.desc}</p>
                        </div>
                        {selected.refreshSchedule === opt.value && (
                          <span style={{ color: selected.agentColor }}>✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>Agent Capabilities</label>
                  <div className="space-y-3">
                    {[
                      { key: 'autoCategorize', label: 'Auto-categorize emails', icon: '🏷️' },
                      { key: 'autoArchive', label: 'Auto-archive processed', icon: '📁' },
                      { key: 'autoReply', label: 'Auto-reply (with templates)', icon: '✉️' },
                      { key: 'escalateUrgent', label: 'Escalate urgent items', icon: '🚨' },
                      { key: 'notifySlack', label: 'Notify via Slack', icon: '💬' },
                      { key: 'notifyPush', label: 'Push notifications', icon: '📱' },
                    ].map(cap => (
                      <label key={cap.key} className="flex items-center gap-3 cursor-pointer">
                        <div
                          onClick={() => onUpdate(selected.id, { [cap.key]: !(selected as any)[cap.key] })}
                          className={`w-9 h-5 rounded-full relative transition-colors ${(selected as any)[cap.key] ? '' : isDark ? 'bg-gray-700' : 'bg-gray-300'}`}
                          style={(selected as any)[cap.key] ? { background: selected.agentColor } : {}}
                        >
                          <div 
                            className="w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all"
                            style={{ left: (selected as any)[cap.key] ? '18px' : '2px' }}
                          ></div>
                        </div>
                        <span className="text-sm">{cap.icon}</span>
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{cap.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: 'bg-green-500', syncing: 'bg-blue-500 animate-pulse',
    paused: 'bg-yellow-500', error: 'bg-red-500',
  };
  return <div className={`w-2.5 h-2.5 rounded-full ${colors[status] || 'bg-gray-500'}`}></div>;
}
