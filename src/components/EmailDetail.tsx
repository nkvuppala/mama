import { Email } from '../types';

interface EmailDetailProps {
  email: Email;
  onClose: () => void;
}

export default function EmailDetail({ email, onClose }: EmailDetailProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center gap-3">
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          ← Back
        </button>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-white">{email.subject}</h2>
        </div>
        <button className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800">
          ✏️
        </button>
        <button className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800">
          🗑️
        </button>
      </div>

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

        <div className="prose prose-invert max-w-none mb-8">
          <p className="text-gray-300 leading-relaxed">{email.body}</p>
        </div>

        {/* Agent Analysis */}
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-5">
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

            <div className="flex gap-2 mt-4">
              <button className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm px-4 py-2 rounded-lg transition-colors">
                ✉️ Draft Reply
              </button>
              <button className="bg-gray-700/50 hover:bg-gray-700 text-gray-300 text-sm px-4 py-2 rounded-lg transition-colors">
                📌 Mark Important
              </button>
              <button className="bg-gray-700/50 hover:bg-gray-700 text-gray-300 text-sm px-4 py-2 rounded-lg transition-colors">
                📁 Archive
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
