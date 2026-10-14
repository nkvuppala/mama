export interface Email {
  id: string;
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
  type: 'check' | 'summarize' | 'reply' | 'organize' | 'alert';
  status: 'pending' | 'running' | 'completed' | 'error';
  description: string;
  result?: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
}

export interface AgentAction {
  type: 'reply' | 'schedule' | 'task' | 'escalate' | 'forward' | 'organize' | 'scan' | 'summarize';
  description: string;
  result: string;
  status: 'completed' | 'pending_approval' | 'failed';
  timestamp?: string;
}
