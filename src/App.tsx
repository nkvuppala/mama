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
        setCurrentView={setCurrentView}
        totalUnread={totalUnread}
        activeAgents={activeAgents}
        mailboxCount={mailboxes.length}
        onShowSetup={() => setShowSetupWizard(true)}
        theme={theme}
      />
      
      <main className="flex-1 overflow-hidden flex flex-col">
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
