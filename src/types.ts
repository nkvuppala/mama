export type MailboxType = 'gmail' | 'outlook' | 'imap' | 'yahoo' | 'icloud' | 'custom';
export type RefreshSchedule = 'realtime' | '5min' | '15min' | '30min' | '1hour' | 'manual';
export type AgentStatus = 'active' | 'paused' | 'error' | 'syncing';
export type ThemeMode = 'light' | 'dark';

export interface Mailbox {
  id: string;
  name: string;
  emailAddress: string;
  type: MailboxType;
  // IMAP settings (for imap/custom)
  imapHost?: string;
  imapPort?: number;
  smtpHost?: string;
  smtpPort?: number;
  // Agent config
  agentName: string;
  agentEmoji: string;
  agentColor: string;
  agentPersonality: string;
  // Schedule
  refreshSchedule: RefreshSchedule;
  lastChecked: string;
  nextCheck: string;
  status: AgentStatus;
  // Stats
  unreadCount: number;
  totalEmails: number;
  actionsToday: number;
  // Preferences
  autoReply: boolean;
  autoArchive: boolean;
  autoCategorize: boolean;
  escalateUrgent: boolean;
  notifySlack: boolean;
  notifyPush: boolean;
}

export interface Email {
  id: string;
  mailboxId: string;
  from: string;
  fromEmail: string;
  subject: string;
  preview: string;
  body: string;
  date: string;
  read: boolean;
  starred: boolean;
  label: 'inbox' | 'important' | 'social' | 'promotions';
  agentAction?: string;
  agentSummary?: string;
}

export interface AgentTask {
  id: string;
  mailboxId: string;
  type: 'check' | 'summarize' | 'reply' | 'organize' | 'alert';
  status: 'pending' | 'running' | 'completed' | 'error';
  description: string;
  result?: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  mailboxId?: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
}

export interface AgentAction {
  type: 'reply' | 'schedule' | 'task' | 'escalate' | 'forward' | 'organize' | 'scan' | 'summarize';
  mailboxId: string;
  description: string;
  result: string;
  status: 'completed' | 'pending_approval' | 'failed';
}

export interface ThemeConfig {
  mode: ThemeMode;
  accentColor: string;
  accentName: string;
}

export const AGENT_EMOJIS = ['🤖', '🦊', '🐱', '🦉', '🐶', '🦄', '🐼', '🦁', '🐸', '🦋', '🐧', '🦅', '🐬', '🦜', '🐝', '🦈', '🐙', '🦎', '🐺', '🦇'];

export const ACCENT_COLORS = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Indigo', value: '#6366f1' },
];
