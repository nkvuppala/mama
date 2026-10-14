interface SidebarProps {
  currentView: string;
  setCurrentView: (view: any) => void;
  unreadCount: number;
  urgentCount: number;
}

export default function Sidebar({ currentView, setCurrentView, unreadCount, urgentCount }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { id: 'emails', icon: '📧', label: 'Emails', badge: unreadCount },
    { id: 'actions', icon: '⚡', label: 'Agent Actions' },
    { id: 'agent', icon: '🤖', label: 'Agent Config', badge: urgentCount },
    { id: 'chat', icon: '💬', label: 'Chat with Agent' },
    { id: 'setup', icon: '📖', label: 'Setup Guide' },
  ];

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-xl">
            🤖
          </div>
          <div>
            <h1 className="font-bold text-white text-lg">EmailAgent</h1>
            <p className="text-xs text-gray-500">AI-Powered Assistant</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              currentView === item.id
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && item.badge > 0 && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                item.id === 'agent' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
              }`}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Agent Status */}
      <div className="p-4 border-t border-gray-800">
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-medium">Agent Online</span>
          </div>
          <p className="text-xs text-gray-500">Monitoring 3 accounts</p>
          <p className="text-xs text-gray-500">Last check: 2 min ago</p>
        </div>
      </div>
    </aside>
  );
}
