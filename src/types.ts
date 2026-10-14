export type MailboxType = 'gmail' | 'outlook' | 'imap' | 'yahoo' | 'icloud' | 'custom';
export type RefreshSchedule = 'realtime' | '5min' | '15min' | '30min' | '1hour' | 'manual';
export type AgentStatus = 'active' | 'paused' | 'error' | 'syncing';
export type ThemeMode = 'light' | 'dark';
export type MailboxPriority = 'critical' | 'high' | 'normal' | 'low';

export interface EmailSignature {
  name: string;
  title?: string;
  company?: string;
  phone?: string;
  website?: string;
  customHtml?: string;
}

export interface OutOfOfficeConfig {
  enabled: boolean;
  startDate: string;
  endDate: string;
  subject: string;
  message: string;
  onlyExternal: boolean; // Only reply to external senders
  allowedDomains: string[]; // Don't reply to these domains (e.g., internal)
  replyFrequency: 'once' | 'daily' | 'every'; // How often to reply to same sender
}

export interface ImapConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  ssl: boolean;
  // Folders to monitor
  folders: string[];
  // SMTP for sending
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  smtpSsl: boolean;
}

export interface Mailbox {
  id: string;
  name: string;
  emailAddress: string;
  type: MailboxType;
  // IMAP settings
  imapConfig?: ImapConfig;
  // Agent config
  agentName: string;
  agentEmoji: string;
  agentColor: string;
  agentPersonality: string;
  // Priority
  priority: MailboxPriority;
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
  // Signature
  signature: EmailSignature;
  // Reply settings
  replyPrefix: string; // e.g., "On {date}, {from} wrote:"
  defaultCc?: string;
  defaultBcc?: string;
  // Out of Office
  outOfOffice: OutOfOfficeConfig;
  // Company grouping
  company: string;
}

export interface Email {
  id: string;
  mailboxId: string;
  from: string;
  fromEmail: string;
  to?: string;
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
  type: 'reply' | 'schedule' | 'task' | 'escalate' | 'forward' | 'organize' | 'scan' | 'summarize' | 'send';
  mailboxId: string;
  description: string;
  result: string;
  status: 'completed' | 'pending_approval' | 'failed' | 'sending';
}

export interface ComposedEmail {
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
  fromMailboxId: string;
  isReply?: boolean;
  replyToEmailId?: string;
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

export interface ThemeConfig {
  mode: ThemeMode;
  accentColor: string;
  accentName: string;
}

export const PRIORITY_CONFIG: Record<MailboxPriority, { label: string; icon: string; color: string; desc: string }> = {
  critical: { label: 'Critical', icon: '🔴', color: '#ef4444', desc: 'Instant alerts, real-time sync, always on top' },
  high: { label: 'High', icon: '🟠', color: '#f97316', desc: 'Frequent checks, push notifications' },
  normal: { label: 'Normal', icon: '🟢', color: '#22c55e', desc: 'Standard monitoring, balanced' },
  low: { label: 'Low', icon: '⚪', color: '#6b7280', desc: 'Hourly checks, minimal notifications' },
};
