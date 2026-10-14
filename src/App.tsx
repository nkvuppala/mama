import { useState } from 'react';
import { Email, AgentTask, ChatMessage } from './types';
import { sampleEmails, sampleTasks } from './data';
import Sidebar from './components/Sidebar';
import EmailList from './components/EmailList';
import EmailDetail from './components/EmailDetail';
import AgentPanel from './components/AgentPanel';
import ChatInterface from './components/ChatInterface';
import SetupGuide from './components/SetupGuide';

type View = 'dashboard' | 'emails' | 'agent' | 'chat' | 'setup';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [emails] = useState<Email[]>(sampleEmails);
  const [tasks] = useState<AgentTask[]>(sampleTasks);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm0',
      role: 'agent',
      content: "Hello! I'm your AI Email Agent. I can check your inbox, summarize emails, draft replies, organize your mailbox, and alert you about important messages. How can I help you today?",
      timestamp: new Date().toISOString()
    }
  ]);

  const unreadCount = emails.filter(e => !e.read).length;
  const urgentCount = emails.filter(e => e.label === 'important' && !e.read).length;

  const handleSendMessage = (content: string) => {
    const userMsg: ChatMessage = {
      id: `m${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);

    // Simulate agent response
    setTimeout(() => {
      const agentResponses: Record<string, string> = {
        'check my email': "📬 I've scanned your inbox. You have 3 unread emails:\n\n1. 🚨 **AWS Alert** - Production server at 94% CPU (URGENT)\n2. 💰 **Stripe** - Payment of $2,450 received from Acme Corp\n3. ❤️ **Mom** - Sunday dinner invitation\n\nWould you like me to summarize any of these or draft a reply?",
        'summarize': "📝 Here's your email summary for today:\n\n**Urgent:** AWS production server is at 94% CPU - may need immediate scaling.\n**Finance:** $2,450 payment received from Acme Corp (Invoice #INV-2024-089).\n**Work:** Budget review needed by Friday. Bug PROJ-456 assigned (login timeout).\n**Personal:** Mom wants you for Sunday dinner (lasagna!).\n**Dev:** PR #234 merged successfully.\n**Social:** 3 LinkedIn connection requests pending.\n\nShall I draft any replies?",
        'default': "I understand! Let me help you with that. I can:\n\n• 🔍 Check your inbox for new messages\n• 📝 Summarize long email threads\n• ✉️ Draft replies for you to review\n• 📁 Organize and categorize emails\n• 🚨 Alert you about urgent messages\n\nJust tell me what you'd like to do!"
      };

      const lowerContent = content.toLowerCase();
      let response = agentResponses['default'];
      
      if (lowerContent.includes('check') || lowerContent.includes('inbox') || lowerContent.includes('email')) {
        response = agentResponses['check my email'];
      } else if (lowerContent.includes('summar') || lowerContent.includes('overview')) {
        response = agentResponses['summarize'];
      } else if (lowerContent.includes('draft') || lowerContent.includes('reply')) {
        response = "✍️ I'd be happy to draft a reply! Which email would you like me to respond to? Here are the unread ones:\n\n1. AWS Alert (production server)\n2. Stripe payment receipt\n3. Mom's dinner invitation\n\nJust say the number or sender name, and I'll draft a response for your review.";
      } else if (lowerContent.includes('organize') || lowerContent.includes('categorize')) {
        response = "📁 I've organized your inbox:\n\n• **Important (3):** Budget review, AWS alert, Jira bug\n• **Social (2):** LinkedIn, GitHub\n• **Promotions (1):** TechDigest newsletter\n• **Personal (2):** Stripe receipt, Mom's email\n\nI've also auto-archived 5 old promotional emails. Want me to set up filters for future emails?";
      } else if (lowerContent.includes('alert') || lowerContent.includes('urgent')) {
        response = "🚨 **Urgent items requiring your attention:**\n\n1. **AWS Production Alert** - Server at 94% CPU for 15+ minutes\n   → Recommended action: Scale up or investigate\n   → Status: Needs immediate attention\n\n2. **Budget Review** - Due by Friday\n   → Recommended action: Review and approve\n   → Status: 2 days remaining\n\nWould you like me to take any action on these?";
      }

      const agentMsg: ChatMessage = {
        id: `m${Date.now() + 1}`,
        role: 'agent',
        content: response,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, agentMsg]);
    }, 800);
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        unreadCount={unreadCount}
        urgentCount={urgentCount}
      />
      
      <main className="flex-1 overflow-hidden flex flex-col">
        {currentView === 'dashboard' && (
          <DashboardView 
            emails={emails} 
            tasks={tasks} 
            unreadCount={unreadCount}
            urgentCount={urgentCount}
            onSelectEmail={(email) => { setSelectedEmail(email); setCurrentView('emails'); }}
          />
        )}
        {currentView === 'emails' && (
          <div className="flex-1 flex overflow-hidden">
            <EmailList 
              emails={emails} 
              selectedEmail={selectedEmail}
              onSelectEmail={setSelectedEmail}
            />
            {selectedEmail && (
              <EmailDetail 
                email={selectedEmail}
                onClose={() => setSelectedEmail(null)}
              />
            )}
          </div>
        )}
        {currentView === 'agent' && <AgentPanel tasks={tasks} emails={emails} />}
        {currentView === 'chat' && (
          <ChatInterface messages={messages} onSendMessage={handleSendMessage} />
        )}
        {currentView === 'setup' && <SetupGuide />}
      </main>
    </div>
  );
}

function DashboardView({ emails, tasks, unreadCount, urgentCount, onSelectEmail }: {
  emails: Email[];
  tasks: AgentTask[];
  unreadCount: number;
  urgentCount: number;
  onSelectEmail: (email: Email) => void;
}) {
  const recentEmails = emails.slice(0, 4);
  const recentTasks = tasks.slice(0, 4);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Good Morning! 👋</h1>
        <p className="text-gray-400">Here's your email agent's daily briefing for January 15, 2026</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="📬" label="Unread Emails" value={unreadCount.toString()} color="blue" />
        <StatCard icon="🚨" label="Urgent Items" value={urgentCount.toString()} color="red" />
        <StatCard icon="✅" label="Tasks Completed" value={tasks.filter(t => t.status === 'completed').length.toString()} color="green" />
        <StatCard icon="💰" label="Revenue Logged" value="$2,450" color="purple" />
      </div>

      {/* Agent Status */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <h2 className="text-lg font-semibold text-white">Agent Status: Active</h2>
          <span className="text-sm text-gray-500 ml-auto">Last scan: 2 minutes ago</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <p className="text-sm text-gray-400">Monitoring</p>
            <p className="text-white font-medium">Gmail, Outlook, AWS Alerts</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <p className="text-sm text-gray-400">Auto-actions</p>
            <p className="text-white font-medium">Categorize, Summarize, Alert</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <p className="text-sm text-gray-400">Pending Approval</p>
            <p className="text-white font-medium">1 draft reply</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Emails */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>📧</span> Recent Emails
          </h3>
          <div className="space-y-3">
            {recentEmails.map(email => (
              <button
                key={email.id}
                onClick={() => onSelectEmail(email)}
                className="w-full text-left bg-gray-800/50 hover:bg-gray-800 rounded-lg p-3 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {!email.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></div>}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{email.from}</p>
                    <p className="text-sm text-gray-300 truncate">{email.subject}</p>
                    {email.agentSummary && (
                      <p className="text-xs text-gray-500 mt-1 truncate">🤖 {email.agentSummary}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 shrink-0">
                    {new Date(email.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Agent Activity */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>🤖</span> Agent Activity
          </h3>
          <div className="space-y-3">
            {recentTasks.map(task => (
              <div key={task.id} className="bg-gray-800/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <TaskStatusBadge status={task.status} />
                  <span className="text-sm font-medium text-white">{task.description}</span>
                </div>
                {task.result && (
                  <p className="text-xs text-gray-400 ml-6">{task.result}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/30',
    red: 'from-red-500/20 to-red-600/5 border-red-500/30',
    green: 'from-green-500/20 to-green-600/5 border-green-500/30',
    purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/30',
  };

  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} border rounded-xl p-4`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-sm text-gray-400">{label}</p>
        </div>
      </div>
    </div>
  );
}

function TaskStatusBadge({ status }: { status: AgentTask['status'] }) {
  const config = {
    pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: '⏳' },
    running: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: '🔄' },
    completed: { bg: 'bg-green-500/20', text: 'text-green-400', label: '✅' },
    error: { bg: 'bg-red-500/20', text: 'text-red-400', label: '❌' },
  };
  const c = config[status];
  return <span className={`${c.bg} ${c.text} text-xs px-1.5 py-0.5 rounded`}>{c.label}</span>;
}
