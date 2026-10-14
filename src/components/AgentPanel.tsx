import { AgentTask, Email } from '../types';

interface AgentPanelProps {
  tasks: AgentTask[];
  emails: Email[];
}

export default function AgentPanel({ tasks, emails }: AgentPanelProps) {
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const pendingTasks = tasks.filter(t => t.status === 'pending');

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">🤖 Agent Activity</h1>
        <p className="text-gray-400">Monitor what your AI agent is doing in real-time</p>
      </div>

      {/* Agent Configuration */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Agent Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ConfigItem 
            icon="📧" 
            title="Email Sources" 
            value="Gmail, Outlook, AWS" 
            description="Connected accounts"
          />
          <ConfigItem 
            icon="🔄" 
            title="Check Frequency" 
            value="Every 5 minutes" 
            description="Auto-scan interval"
          />
          <ConfigItem 
            icon="🎯" 
            title="Auto Actions" 
            value="Categorize, Summarize" 
            description="Without approval"
          />
          <ConfigItem 
            icon="🚨" 
            title="Alert Threshold" 
            value="Urgent + Important" 
            description="Push notification triggers"
          />
          <ConfigItem 
            icon="✉️" 
            title="Reply Drafting" 
            value="Requires approval" 
            description="Never auto-send"
          />
          <ConfigItem 
            icon="📊" 
            title="Daily Report" 
            value="9:00 AM" 
            description="Morning briefing time"
          />
        </div>
      </div>

      {/* Task Timeline */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Task Timeline</h2>
        <div className="space-y-4">
          {tasks.map((task, index) => (
            <div key={task.id} className="flex gap-4">
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                  task.status === 'running' ? 'bg-blue-500/20 text-blue-400 animate-pulse' :
                  task.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {task.status === 'completed' ? '✓' : task.status === 'running' ? '⟳' : task.status === 'pending' ? '⏳' : '✗'}
                </div>
                {index < tasks.length - 1 && (
                  <div className="w-px h-full bg-gray-700 my-1"></div>
                )}
              </div>
              
              {/* Task content */}
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-white">{task.description}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    task.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                    task.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {task.status}
                  </span>
                </div>
                {task.result && (
                  <p className="text-sm text-gray-400">{task.result}</p>
                )}
                <p className="text-xs text-gray-600 mt-1">
                  {new Date(task.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Today's Stats</h3>
          <div className="space-y-3">
            <StatBar label="Emails Scanned" value={emails.length} max={50} color="blue" />
            <StatBar label="Summaries Generated" value={8} max={50} color="purple" />
            <StatBar label="Auto-categorized" value={12} max={50} color="green" />
            <StatBar label="Alerts Sent" value={2} max={50} color="red" />
            <StatBar label="Replies Drafted" value={3} max={50} color="yellow" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Agent Capabilities</h3>
          <div className="space-y-3">
            <Capability icon="🔍" name="Email Scanning" status="active" />
            <Capability icon="📝" name="Smart Summaries" status="active" />
            <Capability icon="✉️" name="Reply Drafting" status="active" />
            <Capability icon="📁" name="Auto Organization" status="active" />
            <Capability icon="🚨" name="Priority Alerts" status="active" />
            <Capability icon="📊" name="Daily Reports" status="active" />
            <Capability icon="🔗" name="Calendar Integration" status="coming" />
            <Capability icon="📞" name="Call Scheduling" status="coming" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfigItem({ icon, title, value, description }: { icon: string; title: string; value: string; description: string }) {
  return (
    <div className="bg-gray-800/50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <span>{icon}</span>
        <span className="text-sm font-medium text-white">{title}</span>
      </div>
      <p className="text-lg font-semibold text-blue-400">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );
}

function StatBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const percentage = (value / max) * 100;
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
  };

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-medium">{value}</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorMap[color]} rounded-full transition-all`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

function Capability({ icon, name, status }: { icon: string; name: string; status: 'active' | 'coming' }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-lg">{icon}</span>
      <span className="text-sm text-gray-300 flex-1">{name}</span>
      <span className={`text-xs px-2 py-0.5 rounded-full ${
        status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-500'
      }`}>
        {status === 'active' ? '✓ Active' : 'Coming Soon'}
      </span>
    </div>
  );
}
