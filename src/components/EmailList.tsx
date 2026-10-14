import { Email } from '../types';

interface EmailListProps {
  emails: Email[];
  selectedEmail: Email | null;
  onSelectEmail: (email: Email) => void;
}

export default function EmailList({ emails, selectedEmail, onSelectEmail }: EmailListProps) {
  const labelColors: Record<string, string> = {
    important: 'bg-red-500/20 text-red-400',
    social: 'bg-blue-500/20 text-blue-400',
    promotions: 'bg-yellow-500/20 text-yellow-400',
    inbox: 'bg-gray-500/20 text-gray-400',
  };

  const labelIcons: Record<string, string> = {
    important: '🔴',
    social: '👥',
    promotions: '📢',
    inbox: '📥',
  };

  return (
    <div className="w-full lg:w-96 border-r border-gray-800 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-white mb-3">Inbox</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search emails..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          <span className="absolute right-3 top-2.5 text-gray-500">🔍</span>
        </div>
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto">
        {emails.map(email => (
          <button
            key={email.id}
            onClick={() => onSelectEmail(email)}
            className={`w-full text-left p-4 border-b border-gray-800/50 hover:bg-gray-800/50 transition-colors ${
              selectedEmail?.id === email.id ? 'bg-gray-800 border-l-2 border-l-blue-500' : ''
            } ${!email.read ? 'bg-gray-900/50' : ''}`}
          >
            <div className="flex items-start gap-3">
              {!email.read && (
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-1.5 shrink-0"></div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${!email.read ? 'text-white' : 'text-gray-300'} truncate`}>
                    {email.from}
                  </span>
                  <span className="text-xs text-gray-500 shrink-0 ml-2">
                    {new Date(email.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className={`text-sm truncate mb-1 ${!email.read ? 'text-gray-200' : 'text-gray-400'}`}>
                  {email.subject}
                </p>
                <p className="text-xs text-gray-500 truncate">{email.preview}</p>
                
                {/* Agent Summary */}
                {email.agentSummary && (
                  <div className="mt-2 bg-gray-800/80 rounded-md px-2 py-1.5">
                    <p className="text-xs text-gray-400">
                      <span className="text-blue-400">🤖</span> {email.agentSummary}
                    </p>
                  </div>
                )}

                {/* Labels */}
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${labelColors[email.label]}`}>
                    {labelIcons[email.label]} {email.label}
                  </span>
                  {email.starred && <span className="text-xs">⭐</span>}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
