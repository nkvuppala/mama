import { useState } from 'react';
import { Email, AgentTask, ChatMessage, AgentAction } from './types';
import { sampleEmails, sampleTasks } from './data';
import Sidebar from './components/Sidebar';
import EmailList from './components/EmailList';
import EmailDetail from './components/EmailDetail';
import AgentPanel from './components/AgentPanel';
import ChatInterface from './components/ChatInterface';
import SetupGuide from './components/SetupGuide';
import ActionsPanel from './components/ActionsPanel';

type View = 'dashboard' | 'emails' | 'actions' | 'agent' | 'chat' | 'setup';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [emails, setEmails] = useState<Email[]>(sampleEmails);
  const [tasks] = useState<AgentTask[]>(sampleTasks);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [actionLog, setActionLog] = useState<AgentAction[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm0',
      role: 'agent',
      content: "Hello! I'm your AI Email Agent. I don't just read your emails — I can:\n\n• ✉️ Draft & send replies\n• 📅 Schedule meetings\n• ✅ Create tasks & to-dos\n• 📁 Organize & archive\n• 🚨 Escalate urgent items\n• 🔄 Forward to team members\n• 📊 Generate reports\n• 🔗 Update your calendar\n\nWhat would you like me to do?",
      timestamp: new Date().toISOString()
    }
  ]);

  const unreadCount = emails.filter(e => !e.read).length;
  const urgentCount = emails.filter(e => e.label === 'important' && !e.read).length;

  const logAction = (action: AgentAction) => {
    setActionLog(prev => [action, ...prev]);
  };

  const handleSendMessage = (content: string) => {
    const userMsg: ChatMessage = {
      id: `m${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      const lowerContent = content.toLowerCase();
      let response = '';
      let action: AgentAction | null = null;

      if (lowerContent.includes('check') || lowerContent.includes('inbox') || lowerContent.includes('new email')) {
        response = "📬 **Scanning your inbox...**\n\nFound 3 unread emails:\n\n1. 🚨 **AWS Alert** — Production server at 94% CPU\n   → I've already escalated this to your Slack #alerts channel\n   → Created an incident ticket: INC-2024-089\n\n2. 💰 **Stripe** — $2,450 payment from Acme Corp\n   → Logged in your revenue tracker\n   → Updated monthly total to $18,320\n\n3. ❤️ **Mom** — Sunday dinner invitation\n   → I drafted a reply: 'Yes! Can't wait for lasagna! See you Sunday ❤️'\n   → Want me to send it?\n\n✅ Actions taken: 1 escalation, 1 log entry, 1 draft reply";
        action = { type: 'scan', description: 'Scanned inbox', result: '3 unread found, 1 escalated, 1 draft created', status: 'completed' };
      } else if (lowerContent.includes('reply') || lowerContent.includes('respond') || lowerContent.includes('draft')) {
        response = "✍️ **Drafting reply...**\n\nFor: Mom's Sunday dinner invitation\n\n---\n**To:** mom@email.com\n**Subject:** Re: Sunday dinner?\n\nHi Mom!\n\nYes, I'd love to come for dinner on Sunday! Lasagna is my favorite — tell Dad I said hi!\n\nWhat time should I be there?\n\nLove you ❤️\n---\n\n📋 **Options:**\n• ✅ Send this reply\n• ✏️ Edit before sending\n• 🔄 Generate different version\n• ❌ Discard\n\nJust tell me what to do!";
        action = { type: 'reply', description: 'Drafted reply to Mom', result: 'Reply ready for approval', status: 'pending_approval' };
      } else if (lowerContent.includes('schedule') || lowerContent.includes('meeting') || lowerContent.includes('calendar')) {
        response = "📅 **Scheduling a meeting...**\n\nBased on your emails, I found these open slots this week:\n\n• **Tuesday 2:00-3:00 PM** — Free\n• **Wednesday 10:00-11:00 AM** — Free\n• **Thursday 3:00-4:30 PM** — Free\n\nI also noticed the budget review email mentions a board meeting next week. Want me to:\n\n1. 📅 Schedule a prep meeting before the board meeting?\n2. 📧 Send a meeting invite to Sarah Chen about the budget?\n3. 🔍 Check everyone's availability first?\n\nJust tell me who, when, and what!";
        action = { type: 'schedule', description: 'Checked calendar availability', result: '3 open slots found this week', status: 'completed' };
      } else if (lowerContent.includes('task') || lowerContent.includes('todo') || lowerContent.includes('to-do') || lowerContent.includes('remind')) {
        response = "✅ **Creating tasks from your emails...**\n\nI've extracted these action items:\n\n1. ☐ **Review Q4 budget** — Due Friday\n   From: Sarah Chen's email\n   → Added to your Notion board\n   → Set reminder for Thursday 9 AM\n\n2. ☐ **Fix login timeout bug (PROJ-456)** — Priority: High\n   From: Jira assignment\n   → Added to your sprint board\n   → Estimated: 4 hours\n\n3. ☐ **Investigate AWS CPU spike** — URGENT\n   From: AWS alert\n   → Created incident ticket\n   → Notified DevOps team on Slack\n\n4. ☐ **Confirm Sunday dinner with Mom** — No deadline\n   From: Mom's email\n   → Reminder set for Saturday\n\n📊 Total: 4 tasks created, 2 reminders set, 1 team notification sent";
        action = { type: 'task', description: 'Created 4 tasks from emails', result: '2 reminders set, 1 team notified', status: 'completed' };
      } else if (lowerContent.includes('forward') || lowerContent.includes('send to') || lowerContent.includes('share')) {
        response = "🔄 **Forwarding email...**\n\nWhich email would you like to forward? Here are suggestions:\n\n1. 🚨 **AWS Alert** → Forward to DevOps team?\n   Suggested recipients: devops@company.com, #infra-alerts\n   \n2. 💰 **Stripe Payment** → Forward to accounting?\n   Suggested recipients: finance@company.com\n   \n3. 📋 **Budget Review** → Forward to your manager?\n   Suggested recipients: manager@company.com\n\nI can also:\n• Add a message when forwarding\n• CC additional people\n• Attach related documents\n\nWhich one, and where should it go?";
        action = { type: 'forward', description: 'Ready to forward email', result: 'Awaiting recipient selection', status: 'pending_approval' };
      } else if (lowerContent.includes('summar') || lowerContent.includes('overview') || lowerContent.includes('briefing')) {
        response = "📊 **Daily Email Briefing — Jan 15, 2026**\n\n**🚨 URGENT (needs action now):**\n• AWS production server at 94% CPU — I've escalated to DevOps\n\n**💼 WORK (needs response today):**\n• Budget review from Sarah — Due Friday, I drafted a reply\n• Bug PROJ-456 assigned — Added to your sprint board\n\n**💰 FINANCE:**\n• $2,450 received from Acme Corp — Logged in tracker\n\n**❤️ PERSONAL:**\n• Mom wants you for Sunday dinner — Draft reply ready\n\n**📱 SOCIAL/DEV:**\n• 3 LinkedIn requests — Auto-accepted 1 (CTO)\n• PR #234 merged — No action needed\n\n---\n**Actions I took:**\n✅ Escalated 1 urgent item\n✅ Created 4 tasks\n✅ Drafted 2 replies\n✅ Logged 1 payment\n✅ Sent 1 team notification";
        action = { type: 'summarize', description: 'Generated daily briefing', result: '5 actions taken automatically', status: 'completed' };
      } else if (lowerContent.includes('archive') || lowerContent.includes('clean') || lowerContent.includes('organize')) {
        response = "📁 **Organizing your inbox...**\n\nHere's what I did:\n\n✅ **Archived 12 emails** — Old newsletters and promotions\n✅ **Moved 5 to Projects folder** — Related to active work\n✅ **Starred 3 important emails** — Budget, AWS alert, Mom's dinner\n✅ **Unsubscribed from 2 lists** — Noisy newsletters\n✅ **Created filter rule** — Auto-archive future AWS resolved alerts\n\n📊 Inbox went from 47 → 25 emails\n🎯 Only actionable emails remain!\n\nWant me to set up more auto-filters?";
        action = { type: 'organize', description: 'Organized inbox', result: 'Archived 12, filtered 5, unsubscribed 2', status: 'completed' };
      } else if (lowerContent.includes('escalate') || lowerContent.includes('urgent') || lowerContent.includes('alert')) {
        response = "🚨 **Escalation Actions:**\n\nFor the AWS production alert, I've already:\n\n1. ✅ **Sent Slack message** to #devops-alerts\n   → Tagged @oncall-engineer\n   → Included server metrics link\n\n2. ✅ **Created PagerDuty incident**\n   → Severity: P1\n   → Auto-assigned to on-call rotation\n\n3. ✅ **Sent SMS** to on-call engineer\n   → Phone: +1-xxx-xxx-1234\n\n4. ✅ **Created Jira ticket** INFRA-789\n   → Linked to AWS CloudWatch dashboard\n   → Set priority: Critical\n\n5. ✅ **Drafted status page update**\n   → Ready to publish if needed\n\n📊 All escalation channels notified in under 30 seconds!";
        action = { type: 'escalate', description: 'Escalated AWS alert', result: '5 channels notified: Slack, PagerDuty, SMS, Jira, Status Page', status: 'completed' };
      } else {
        response = "I can do a LOT more than just find emails! Here's everything I can do:\n\n**📧 Email Actions:**\n• Read & summarize emails\n• Draft & send replies\n• Forward to team members\n• Archive & organize\n• Unsubscribe from newsletters\n• Set follow-up reminders\n\n**📅 Calendar Actions:**\n• Schedule meetings\n• Check availability\n• Send meeting invites\n• Set reminders\n\n**✅ Task Actions:**\n• Create to-do items\n• Extract action items from emails\n• Set deadlines & reminders\n• Update project boards (Jira, Notion, etc.)\n\n**🚨 Escalation Actions:**\n• Send Slack/Discord messages\n• Create incident tickets\n• Send SMS for urgent items\n• Trigger PagerDuty alerts\n\n**📊 Reporting:**\n• Daily email briefings\n• Weekly summaries\n• Revenue tracking\n• Response time analytics\n\nJust tell me what you need! Try saying:\n• 'Draft a reply to Mom'\n• 'Schedule a meeting with Sarah'\n• 'Create a task from the bug email'\n• 'Escalate the AWS alert'";
      }

      const agentMsg: ChatMessage = {
        id: `m${Date.now() + 1}`,
        role: 'agent',
        content: response,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, agentMsg]);
      
      if (action) {
        logAction(action);
      }
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
            actionLog={actionLog}
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
                onAction={logAction}
              />
            )}
          </div>
        )}
        {currentView === 'actions' && <ActionsPanel actionLog={actionLog} />}
        {currentView === 'agent' && <AgentPanel tasks={tasks} emails={emails} />}
        {currentView === 'chat' && (
          <ChatInterface messages={messages} onSendMessage={handleSendMessage} />
        )}
        {currentView === 'setup' && <SetupGuide />}
      </main>
    </div>
  );
}

function DashboardView({ emails, tasks, unreadCount, urgentCount, actionLog, onSelectEmail }: {
  emails: Email[];
  tasks: AgentTask[];
  unreadCount: number;
  urgentCount: number;
  actionLog: AgentAction[];
  onSelectEmail: (email: Email) => void;
}) {
  const recentEmails = emails.slice(0, 4);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Good Morning! 👋</h1>
        <p className="text-gray-400">Your AI agent has been busy — here's what it did while you were away</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="📬" label="Unread Emails" value={unreadCount.toString()} color="blue" />
        <StatCard icon="🚨" label="Urgent Items" value={urgentCount.toString()} color="red" />
        <StatCard icon="⚡" label="Actions Taken" value={(tasks.filter(t => t.status === 'completed').length + actionLog.length).toString()} color="green" />
        <StatCard icon="✉️" label="Replies Drafted" value="3" color="purple" />
      </div>

      {/* Agent Actions Summary */}
      <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-5 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <h2 className="text-lg font-semibold text-white">What Your Agent Did Today</h2>
          <span className="text-sm text-gray-500 ml-auto">Auto-mode: ON</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <ActionSummary icon="✉️" title="Drafted Replies" count={3} items={['Reply to Mom', 'Reply to Sarah (budget)', 'Reply to Jira ticket']} />
          <ActionSummary icon="✅" title="Created Tasks" count={4} items={['Budget review', 'Fix login bug', 'AWS investigation', 'Confirm dinner']} />
          <ActionSummary icon="📅" title="Scheduled" count={1} items={['Budget prep meeting Tue 2PM']} />
          <ActionSummary icon="🚨" title="Escalated" count={1} items={['AWS alert → DevOps + PagerDuty']} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Emails */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>📧</span> Emails Needing Attention
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
                    {email.agentAction && (
                      <p className="text-xs text-green-400 mt-1 truncate">⚡ {email.agentAction}</p>
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

        {/* Action Log */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>⚡</span> Live Action Log
          </h3>
          {actionLog.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm mb-2">No actions yet</p>
              <p className="text-gray-600 text-xs">Try the Chat to give your agent commands!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {actionLog.slice(0, 6).map((action, i) => (
                <div key={i} className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <ActionTypeBadge type={action.type} />
                    <span className="text-sm font-medium text-white">{action.description}</span>
                  </div>
                  <p className="text-xs text-gray-400 ml-6">{action.result}</p>
                </div>
              ))}
            </div>
          )}
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

function ActionSummary({ icon, title, count, items }: { icon: string; title: string; count: number; items: string[] }) {
  return (
    <div className="bg-gray-800/50 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <span>{icon}</span>
        <span className="text-sm font-medium text-white">{title}</span>
        <span className="text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full ml-auto">{count}</span>
      </div>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-xs text-gray-400 flex items-center gap-1">
            <span className="text-green-400">✓</span> {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ActionTypeBadge({ type }: { type: AgentAction['type'] }) {
  const config: Record<string, { bg: string; text: string; icon: string }> = {
    reply: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: '✉️' },
    schedule: { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: '📅' },
    task: { bg: 'bg-green-500/20', text: 'text-green-400', icon: '✅' },
    escalate: { bg: 'bg-red-500/20', text: 'text-red-400', icon: '🚨' },
    forward: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: '🔄' },
    organize: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', icon: '📁' },
    scan: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', icon: '🔍' },
    summarize: { bg: 'bg-orange-500/20', text: 'text-orange-400', icon: '📝' },
  };
  const c = config[type] || config.scan;
  return <span className={`${c.bg} ${c.text} text-xs px-1.5 py-0.5 rounded`}>{c.icon}</span>;
}
