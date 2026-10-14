import { useState, useEffect } from 'react';
import { Mailbox, Email, AgentAction, ThemeConfig, ThemeMode } from './types';
import { sampleMailboxes, sampleEmails } from './data';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MailboxManager from './components/MailboxManager';
import AgentConfig from './components/AgentConfig';
import UnifiedInbox from './components/UnifiedInbox';
import ThemeSettings from './components/ThemeSettings';
import SetupWizard from './components/SetupWizard';

type View = 'dashboard' | 'mailboxes' | 'agents' | 'inbox' | 'theme';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [mailboxes, setMailboxes] = useState<Mailbox[]>(sampleMailboxes);
  const [emails] = useState<Email[]>(sampleEmails);
  const [actionLog, setActionLog] = useState<AgentAction[]>([]);
  const [selectedMailboxId, setSelectedMailboxId] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeConfig>({
    mode: 'dark',
    accentColor: '#3b82f6',
    accentName: 'Blue',
  });
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [showAddMailbox, setShowAddMailbox] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme.mode === 'light');
    document.documentElement.style.setProperty('--accent', theme.accentColor);
  }, [theme]);

  const totalUnread = mailboxes.reduce((sum, m) => sum + m.unreadCount, 0);
  const activeAgents = mailboxes.filter(m => m.status === 'active').length;
  const totalActions = mailboxes.reduce((sum, m) => sum + m.actionsToday, 0);

  const logAction = (action: AgentAction) => {
    setActionLog(prev => [action, ...prev]);
  };

  const refreshMailbox = (id: string) => {
    setMailboxes(prev => prev.map(m => 
      m.id === id ? { ...m, lastChecked: new Date().toISOString(), status: 'syncing' as const } : m
    ));
    setTimeout(() => {
      setMailboxes(prev => prev.map(m => 
        m.id === id ? { ...m, status: 'active' as const } : m
      ));
    }, 1500);
  };

  const updateMailbox = (id: string, updates: Partial<Mailbox>) => {
    setMailboxes(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const addMailbox = (mailbox: Mailbox) => {
    if (mailboxes.length < 30) {
      setMailboxes(prev => [...prev, mailbox]);
    }
  };

  const removeMailbox = (id: string) => {
    setMailboxes(prev => prev.filter(m => m.id !== id));
  };

  const renameCompany = (oldName: string, newName: string) => {
    if (!newName.trim() || newName === oldName) return;
    setMailboxes(prev => prev.map(m => 
      m.company === oldName ? { ...m, company: newName.trim() } : m
    ));
  };

  return (
    <div className={`flex h-screen overflow-hidden ${theme.mode === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-950 text-gray-100'}`}>
      <Sidebar 
        currentView={currentView} 
        setCurrentView={(view) => {
          setCurrentView(view);
          setSidebarOpen(false); // Close sidebar on mobile after navigation
        }}
        totalUnread={totalUnread}
        activeAgents={activeAgents}
        mailboxCount={mailboxes.length}
        onShowSetup={() => setShowSetupWizard(true)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        theme={theme}
      />
      
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Mobile Header */}
        <div className={`lg:hidden flex items-center gap-3 p-3 border-b ${theme.mode === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <button
            onClick={() => setSidebarOpen(true)}
            className={`p-2 rounded-lg ${theme.mode === 'dark' ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ background: `linear-gradient(135deg, ${theme.accentColor}, ${theme.accentColor}dd)` }}
            >
              ⚡
            </div>
            <h1 className={`font-bold ${theme.mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>MAMA</h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {totalUnread > 0 && (
              <span 
                className="text-xs px-2 py-1 rounded-full text-white font-medium"
                style={{ background: theme.accentColor }}
              >
                {totalUnread}
              </span>
            )}
          </div>
        </div>

        {currentView === 'dashboard' && (
          <Dashboard 
            mailboxes={mailboxes}
            emails={emails}
            actionLog={actionLog}
            totalUnread={totalUnread}
            activeAgents={activeAgents}
            totalActions={totalActions}
            onRefreshMailbox={refreshMailbox}
            onSelectMailbox={(id: string) => { setSelectedMailboxId(id); setCurrentView('inbox'); }}
            onRenameCompany={renameCompany}
            onAddMailbox={() => { setCurrentView('mailboxes'); setShowAddMailbox(true); }}
            theme={theme}
          />
        )}
        {currentView === 'mailboxes' && (
          <MailboxManager 
            mailboxes={mailboxes}
            onAdd={addMailbox}
            onRemove={removeMailbox}
            onUpdate={updateMailbox}
            onRefresh={refreshMailbox}
            onRenameCompany={renameCompany}
            showAddMailbox={showAddMailbox}
            onCloseAddMailbox={() => setShowAddMailbox(false)}
            theme={theme}
          />
        )}
        {currentView === 'agents' && (
          <AgentConfig 
            mailboxes={mailboxes}
            onUpdate={updateMailbox}
            theme={theme}
          />
        )}
        {currentView === 'inbox' && (
          <UnifiedInbox 
            mailboxes={mailboxes}
            emails={emails}
            selectedMailboxId={selectedMailboxId}
            onSelectMailbox={setSelectedMailboxId}
            onAction={logAction}
            onRenameCompany={renameCompany}
            theme={theme}
          />
        )}
        {currentView === 'theme' && (
          <ThemeSettings 
            theme={theme}
            onUpdate={setTheme}
          />
        )}
      </main>

      {/* Setup Wizard */}
      {showSetupWizard && (
        <SetupWizard 
          onComplete={() => setShowSetupWizard(false)}
          theme={theme}
        />
      )}
    </div>
  );
}
