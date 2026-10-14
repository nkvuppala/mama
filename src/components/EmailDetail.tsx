import { useState } from 'react';
import { Email, AgentAction } from '../types';

interface EmailDetailProps {
  email: Email;
  onClose: () => void;
  onAction: (action: AgentAction) => void;
}

export default function EmailDetail({ email, onClose, onAction }: EmailDetailProps) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showForward, setShowForward] = useState(false);
  const [forwardTo, setForwardTo] = useState('');
  const [showSchedule, setShowSchedule] = useState(false);
  const [actionFeedback, setActionFeedback] = useState('');

  const handleReply = () => {
    if (!replyText.trim()) return;
    onAction({
      type: 'reply',
      description: `Replied to ${email.from}`,
      result: `Reply sent: "${replyText.slice(0, 50)}..."`,
      status: 'completed'
    });
    setShowReplyBox(false);
    setReplyText('');
    setActionFeedback('✅ Reply sent successfully!');
    setTimeout(() => setActionFeedback(''), 3000);
  };

  const handleForward = () => {
    if (!forwardTo.trim()) return;
    onAction({
      type: 'forward',
      description: `Forwarded to ${forwardTo}`,
      result: `Email "${email.subject}" forwarded to ${forwardTo}`,
      status: 'completed'
    });
    setShowForward(false);
    setForwardTo('');
    setActionFeedback('✅ Email forwarded!');
    setTimeout(() => setActionFeedback(''), 3000);
  };

  const handleSchedule = () => {
    onAction({
      type: 'schedule',
      description: `Meeting scheduled re: ${email.subject}`,
      result: 'Calendar invite sent to all participants',
      status: 'completed'
    });
    setShowSchedule(false);
    setActionFeedback('✅ Meeting scheduled & invites sent!');
    setTimeout(() => setActionFeedback(''), 3000);
  };

  const handleCreateTask = () => {
    onAction({
      type: 'task',
      description: `Task created from: ${email.subject}`,
      result: 'Added to your task board with deadline',
      status: 'completed'
    });
    setActionFeedback('✅ Task created!');
    setTimeout(() => setActionFeedback(''), 3000);
  };

  const handleEscalate = () => {
    onAction({
      type: 'escalate',
      description: `Escalated: ${email.subject}`,
      result: 'Notified team via Slack, SMS, and created ticket',
      status: 'completed'
    });
    setActionFeedback('🚨 Escalated to team!');
    setTimeout(() => setActionFeedback(''), 3000);
  };

  const handleArchive = () => {
    onAction({
      type: 'organize',
      description: `Archived: ${email.subject}`,
      result: 'Moved to archive, removed from inbox',
      status: 'completed'
    });
    setActionFeedback('📁 Archived!');
    setTimeout(() => setActionFeedback(''), 3000);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center gap-3">
        <button onClick={onClose} className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800">
          ← Back
        </button>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-white">{email.subject}</h2>
        </div>
      </div>

      {/* Action Feedback Toast */}
      {actionFeedback && (
        <div className="mx-4 mt-4 bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-2 rounded-lg text-sm animate-pulse">
          {actionFeedback}
        </div>
      )}

      {/* Email Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {email.from[0]}
          </div>
          <div>
            <p className="font-medium text-white">{email.from}</p>
            <p className="text-sm text-gray-500">{email.fromEmail}</p>
          </div>
          <div className="ml-auto text-sm text-gray-500">
            {new Date(email.date).toLocaleString()}
          </div>
        </div>

        <div className="mb-8">
          <p className="text-gray-300 leading-relaxed">{email.body}</p>
        </div>

        {/* Agent Analysis */}
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🤖</span>
            <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wide">Agent Analysis</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Summary</p>
              <p className="text-sm text-gray-300">{email.agentSummary || 'No summary available'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Recommended Action</p>
              <p className="text-sm text-gray-300">{email.agentAction || 'No action needed'}</p>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS - The core of what the agent can DO */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">⚡ Take Action</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <ActionButton icon="✉️" label="Reply" color="blue" onClick={() => setShowReplyBox(!showReplyBox)} />
            <ActionButton icon="🔄" label="Forward" color="yellow" onClick={() => setShowForward(!showForward)} />
            <ActionButton icon="📅" label="Schedule Meeting" color="purple" onClick={() => setShowSchedule(!showSchedule)} />
            <ActionButton icon="✅" label="Create Task" color="green" onClick={handleCreateTask} />
            <ActionButton icon="🚨" label="Escalate" color="red" onClick={handleEscalate} />
            <ActionButton icon="📁" label="Archive" color="gray" onClick={handleArchive} />
          </div>
        </div>

        {/* Reply Box */}
        {showReplyBox && (
          <div className="bg-gray-900 border border-blue-500/30 rounded-xl p-5 mb-6">
            <h4 className="text-sm font-semibold text-blue-400 mb-3">✉️ Draft Reply</h4>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply here... or let the AI agent draft one for you!"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none h-32"
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleReply}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
              >
                📤 Send Reply
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded-lg transition-colors">
                🤖 AI Draft
              </button>
              <button
                onClick={() => setShowReplyBox(false)}
                className="bg-gray-800 hover:bg-gray-700 text-gray-400 text-sm px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Forward Box */}
        {showForward && (
          <div className="bg-gray-900 border border-yellow-500/30 rounded-xl p-5 mb-6">
            <h4 className="text-sm font-semibold text-yellow-400 mb-3">🔄 Forward Email</h4>
            <input
              type="text"
              value={forwardTo}
              onChange={(e) => setForwardTo(e.target.value)}
              placeholder="Enter email address or team name..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-yellow-500 mb-3"
            />
            <div className="flex gap-2 flex-wrap mb-3">
              <span className="text-xs text-gray-500">Quick:</span>
              {['devops@company.com', 'finance@company.com', 'team@company.com'].map(addr => (
                <button
                  key={addr}
                  onClick={() => setForwardTo(addr)}
                  className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded transition-colors"
                >
                  {addr}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleForward}
                className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
              >
                📤 Forward
              </button>
              <button
                onClick={() => setShowForward(false)}
                className="bg-gray-800 hover:bg-gray-700 text-gray-400 text-sm px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Schedule Box */}
        {showSchedule && (
          <div className="bg-gray-900 border border-purple-500/30 rounded-xl p-5 mb-6">
            <h4 className="text-sm font-semibold text-purple-400 mb-3">📅 Schedule Meeting</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Meeting Title</label>
                <input
                  type="text"
                  defaultValue={`Re: ${email.subject}`}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Time</label>
                  <input
                    type="time"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Invite</label>
                <input
                  type="text"
                  defaultValue={email.fromEmail}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleSchedule}
                className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
              >
                📅 Schedule & Send Invites
              </button>
              <button
                onClick={() => setShowSchedule(false)}
                className="bg-gray-800 hover:bg-gray-700 text-gray-400 text-sm px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ActionButton({ icon, label, color, onClick }: { icon: string; label: string; color: string; onClick: () => void }) {
  const colorMap: Record<string, string> = {
    blue: 'hover:bg-blue-500/20 hover:border-blue-500/50 hover:text-blue-400',
    yellow: 'hover:bg-yellow-500/20 hover:border-yellow-500/50 hover:text-yellow-400',
    purple: 'hover:bg-purple-500/20 hover:border-purple-500/50 hover:text-purple-400',
    green: 'hover:bg-green-500/20 hover:border-green-500/50 hover:text-green-400',
    red: 'hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400',
    gray: 'hover:bg-gray-700 hover:border-gray-600 hover:text-gray-200',
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-300 transition-all ${colorMap[color]}`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
