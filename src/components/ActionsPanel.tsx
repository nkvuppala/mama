import { AgentAction } from '../types';

interface ActionsPanelProps {
  actionLog: AgentAction[];
}

export default function ActionsPanel({ actionLog }: ActionsPanelProps) {
  const actionCategories = [
    {
      category: '✉️ Reply & Respond',
      color: 'blue',
      actions: [
        { icon: '✉️', name: 'Draft Reply', desc: 'AI writes a reply based on context', status: 'ready' },
        { icon: '📤', name: 'Send Reply', desc: 'Send immediately or queue for approval', status: 'ready' },
        { icon: '🔄', name: 'Auto-Reply', desc: 'Set up automatic responses (e.g., OOO)', status: 'ready' },
        { icon: '💬', name: 'Thread Reply', desc: 'Reply within the same email thread', status: 'ready' },
      ]
    },
    {
      category: '📅 Calendar & Meetings',
      color: 'purple',
      actions: [
        { icon: '📅', name: 'Schedule Meeting', desc: 'Find free slots & send invites', status: 'ready' },
        { icon: '🔍', name: 'Check Availability', desc: 'See when participants are free', status: 'ready' },
        { icon: '📆', name: 'Move Meeting', desc: 'Reschedule based on email requests', status: 'ready' },
        { icon: '⏰', name: 'Set Reminder', desc: 'Create reminders for deadlines', status: 'ready' },
      ]
    },
    {
      category: '✅ Tasks & Projects',
      color: 'green',
      actions: [
        { icon: '✅', name: 'Create Task', desc: 'Extract action items into to-dos', status: 'ready' },
        { icon: '📋', name: 'Update Jira/Notion', desc: 'Sync tasks with project tools', status: 'ready' },
        { icon: '🏷️', name: 'Assign to Team', desc: 'Delegate tasks to team members', status: 'ready' },
        { icon: '📊', name: 'Track Progress', desc: 'Monitor task completion status', status: 'ready' },
      ]
    },
    {
      category: '🚨 Escalation & Alerts',
      color: 'red',
      actions: [
        { icon: '🚨', name: 'Escalate to Team', desc: 'Send urgent alerts via Slack/SMS', status: 'ready' },
        { icon: '📱', name: 'PagerDuty Alert', desc: 'Create incident for on-call team', status: 'ready' },
        { icon: '🎫', name: 'Create Ticket', desc: 'Auto-generate Jira/Linear tickets', status: 'ready' },
        { icon: '📢', name: 'Status Update', desc: 'Post updates to status page', status: 'ready' },
      ]
    },
    {
      category: '🔄 Forward & Share',
      color: 'yellow',
      actions: [
        { icon: '🔄', name: 'Forward Email', desc: 'Send to specific people or teams', status: 'ready' },
        { icon: '📎', name: 'Share with Context', desc: 'Forward with added commentary', status: 'ready' },
        { icon: '👥', name: 'CC/BCC Team', desc: 'Add people to existing threads', status: 'ready' },
        { icon: '🔗', name: 'Share Link', desc: 'Generate shareable email links', status: 'ready' },
      ]
    },
    {
      category: '📁 Organize & Clean',
      color: 'indigo',
      actions: [
        { icon: '📁', name: 'Archive', desc: 'Move processed emails to archive', status: 'ready' },
        { icon: '🏷️', name: 'Auto-Label', desc: 'Categorize with smart labels', status: 'ready' },
        { icon: '🚫', name: 'Unsubscribe', desc: 'Remove from unwanted newsletters', status: 'ready' },
        { icon: '🗑️', name: 'Delete Spam', desc: 'Auto-remove spam and junk', status: 'ready' },
      ]
    },
    {
      category: '📊 Reports & Analytics',
      color: 'orange',
      actions: [
        { icon: '📊', name: 'Daily Briefing', desc: 'Morning summary of key emails', status: 'ready' },
        { icon: '📈', name: 'Response Time', desc: 'Track how fast you reply', status: 'ready' },
        { icon: '💰', name: 'Revenue Log', desc: 'Track payments and invoices', status: 'ready' },
        { icon: '📉', name: 'Weekly Report', desc: 'Email volume and trends', status: 'ready' },
      ]
    },
  ];

  const colorMap: Record<string, string> = {
    blue: 'border-blue-500/30 from-blue-500/10',
    purple: 'border-purple-500/30 from-purple-500/10',
    green: 'border-green-500/30 from-green-500/10',
    red: 'border-red-500/30 from-red-500/10',
    yellow: 'border-yellow-500/30 from-yellow-500/10',
    indigo: 'border-indigo-500/30 from-indigo-500/10',
    orange: 'border-orange-500/30 from-orange-500/10',
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">⚡ Agent Actions</h1>
        <p className="text-gray-400">Everything your AI agent can DO — not just read, but actually take action</p>
      </div>

      {/* Capabilities Overview */}
      <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">🎯 What Makes This Different</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-green-400 mb-2">📖 READ</h3>
            <p className="text-xs text-gray-400">Most email tools just show you emails. Boring.</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-400 mb-2">🧠 UNDERSTAND</h3>
            <p className="text-xs text-gray-400">AI summarizes, categorizes, and extracts meaning.</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-green-500/30">
            <h3 className="text-sm font-semibold text-purple-400 mb-2">⚡ ACT</h3>
            <p className="text-xs text-gray-400">Reply, schedule, create tasks, escalate, forward — automatically!</p>
          </div>
        </div>
      </div>

      {/* Action Categories */}
      <div className="space-y-6 mb-8">
        {actionCategories.map((cat, i) => (
          <div key={i} className={`bg-gradient-to-br ${colorMap[cat.color]} to-transparent border rounded-xl p-5`}>
            <h3 className="text-lg font-semibold text-white mb-4">{cat.category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cat.actions.map((action, j) => (
                <div key={j} className="bg-gray-800/50 hover:bg-gray-800 rounded-lg p-3 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{action.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">{action.name}</p>
                      <p className="text-xs text-gray-500">{action.desc}</p>
                    </div>
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Ready</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Live Action Log */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">📜 Live Action History</h2>
        {actionLog.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">⚡</p>
            <p className="text-gray-400 text-sm mb-1">No actions taken yet</p>
            <p className="text-gray-600 text-xs">Go to Chat or click an email to start taking actions!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {actionLog.map((action, i) => (
              <div key={i} className="flex items-start gap-3 bg-gray-800/50 rounded-lg p-4">
                <ActionIcon type={action.type} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{action.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{action.result}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  action.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                  action.status === 'pending_approval' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {action.status === 'completed' ? '✅ Done' : action.status === 'pending_approval' ? '⏳ Pending' : '❌ Failed'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ActionIcon({ type }: { type: AgentAction['type'] }) {
  const icons: Record<string, string> = {
    reply: '✉️',
    schedule: '📅',
    task: '✅',
    escalate: '🚨',
    forward: '🔄',
    organize: '📁',
    scan: '🔍',
    summarize: '📝',
  };
  return (
    <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center text-sm shrink-0">
      {icons[type] || '⚡'}
    </div>
  );
}
