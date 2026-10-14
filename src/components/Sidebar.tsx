import { ThemeConfig } from '../types';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: any) => void;
  totalUnread: number;
  activeAgents: number;
  mailboxCount: number;
  onShowSetup?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  theme: ThemeConfig;
}

export default function Sidebar({ currentView, setCurrentView, totalUnread, activeAgents, mailboxCount, onShowSetup, isOpen, onClose, theme }: SidebarProps) {
  const isDark = theme.mode === 'dark';
  
  const navItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', badge: totalUnread },
    { id: 'inbox', icon: '📬', label: 'Unified Inbox', badge: totalUnread },
    { id: 'mailboxes', icon: '📮', label: 'Mailboxes', badge: mailboxCount },
    { id: 'agents', icon: '🤖', label: 'Agents', badge: activeAgents },
    { id: 'theme', icon: '🎨', label: 'Appearance' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`
        fixed lg:relative z-50 lg:z-auto
        w-64 h-full
        flex flex-col shrink-0 border-r
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}
      `}>
        {/* Logo */}
        <div className={`p-5 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl text-white font-bold"
              style={{ background: `linear-gradient(135deg, ${theme.accentColor}, ${theme.accentColor}dd)` }}
            >
              ⚡
            </div>
            <div className="flex-1">
              <h1 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>MAMA</h1>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Multi-Account Mail Agent</p>
            </div>
            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className={`lg:hidden p-2 rounded-lg ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              ✕
            </button>
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
                ? isDark 
                  ? 'text-white border' 
                  : 'text-white border'
                : isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            style={currentView === item.id ? { 
              background: `${theme.accentColor}20`, 
              borderColor: `${theme.accentColor}40`,
              color: theme.accentColor
            } : {}}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span 
                className="text-xs px-2 py-0.5 rounded-full text-white"
                style={{ background: theme.accentColor }}
              >
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Setup Guide Button */}
      {onShowSetup && (
        <div className={`p-3 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <button
            onClick={onShowSetup}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isDark 
                ? 'text-gray-400 hover:text-white hover:bg-gray-800 border border-dashed border-gray-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-dashed border-gray-300'
            }`}
          >
            <span className="text-lg">📖</span>
            <span className="flex-1 text-left">Setup Guide</span>
          </button>
        </div>
      )}

      {/* Status Footer */}
      <div className={`p-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className={`rounded-lg p-3 ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium" style={{ color: theme.accentColor }}>
              {activeAgents} Agents Active
            </span>
          </div>
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            {mailboxCount}/30 mailboxes connected
          </p>
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            {totalUnread} unread emails
          </p>
          <div className={`mt-2 pt-2 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <p className={`text-xs ${isDark ? 'text-green-400' : 'text-green-600'} flex items-center gap-1`}>
              🔒 Read-only mode
            </p>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
}
