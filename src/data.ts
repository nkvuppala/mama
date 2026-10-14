import { Email, AgentTask } from './types';

export const sampleEmails: Email[] = [
  {
    id: '1',
    from: 'Sarah Chen',
    fromEmail: 'sarah.chen@company.com',
    subject: 'Q4 Budget Review - Action Required',
    preview: 'Hi team, please review the attached budget proposal before Friday...',
    body: 'Hi team, please review the attached budget proposal before Friday. We need to finalize the numbers for the board meeting next week. Key changes include increased R&D allocation and reduced marketing spend.',
    date: '2026-01-15T09:30:00',
    read: false,
    starred: true,
    label: 'important',
    agentAction: 'Flagged as urgent - requires your response by Friday',
    agentSummary: 'Budget review needed. Key: R&D up, marketing down. Deadline: Friday.'
  },
  {
    id: '2',
    from: 'GitHub',
    fromEmail: 'notifications@github.com',
    subject: '[repo] Pull Request #234 merged',
    preview: 'Your pull request "Fix authentication flow" has been merged...',
    body: 'Your pull request "Fix authentication flow" has been merged into main. 3 files changed, 47 insertions(+), 12 deletions(-).',
    date: '2026-01-15T08:15:00',
    read: true,
    starred: false,
    label: 'social',
    agentAction: 'Auto-categorized as development notification',
    agentSummary: 'PR merged: authentication fix. 3 files, +47/-12 lines.'
  },
  {
    id: '3',
    from: 'AWS',
    fromEmail: 'no-reply@aws.amazon.com',
    subject: '⚠️ High CPU Alert on Production Server',
    preview: 'Your EC2 instance i-0abc123 has exceeded 90% CPU utilization...',
    body: 'Your EC2 instance i-0abc123 (prod-api-server) has exceeded 90% CPU utilization for the past 15 minutes. Current utilization: 94%. Consider scaling up or investigating the cause.',
    date: '2026-01-15T07:45:00',
    read: false,
    starred: true,
    label: 'important',
    agentAction: '🚨 CRITICAL ALERT - Immediate attention needed',
    agentSummary: 'Production server at 94% CPU for 15+ min. May need scaling.'
  },
  {
    id: '4',
    from: 'LinkedIn',
    fromEmail: 'messages-noreply@linkedin.com',
    subject: 'You have 3 new connection requests',
    preview: 'John Smith, Maria Garcia, and David Kim want to connect...',
    body: 'You have 3 new connection requests waiting. John Smith (CTO at TechCorp), Maria Garcia (Senior Dev at StartupXYZ), David Kim (Freelance Designer).',
    date: '2026-01-14T16:00:00',
    read: true,
    starred: false,
    label: 'social',
    agentAction: 'Auto-categorized as social notification',
    agentSummary: '3 connection requests: CTO, Senior Dev, Freelance Designer.'
  },
  {
    id: '5',
    from: 'Stripe',
    fromEmail: 'receipts@stripe.com',
    subject: 'Payment received - $2,450.00',
    preview: 'A payment of $2,450.00 has been received from Acme Corp...',
    body: 'A payment of $2,450.00 has been received from Acme Corp (Invoice #INV-2024-089). The funds will be available in your bank account within 2 business days.',
    date: '2026-01-14T14:30:00',
    read: false,
    starred: false,
    label: 'inbox',
    agentAction: 'Logged as revenue. Updated monthly total to $18,320.',
    agentSummary: 'Payment received: $2,450 from Acme Corp. Invoice #INV-2024-089.'
  },
  {
    id: '6',
    from: 'Newsletter - TechDigest',
    fromEmail: 'weekly@techdigest.io',
    subject: 'This Week in Tech: AI Agents, New Frameworks & More',
    preview: 'Top stories: OpenAI releases new agent framework, React 20...',
    body: 'Top stories this week: OpenAI releases new agent framework, React 20 announced with server components v2, TypeScript 6.0 beta, and the rise of AI-powered development tools.',
    date: '2026-01-14T10:00:00',
    read: true,
    starred: false,
    label: 'promotions',
    agentAction: 'Summarized and saved key articles to your reading list',
    agentSummary: 'Key topics: AI agents, React 20, TypeScript 6.0. 3 articles saved.'
  },
  {
    id: '7',
    from: 'Mom',
    fromEmail: 'mom@email.com',
    subject: 'Sunday dinner?',
    preview: 'Hi sweetie, are you free for dinner this Sunday? Making your favorite...',
    body: 'Hi sweetie, are you free for dinner this Sunday? Making your favorite lasagna! Dad says hi. Love, Mom ❤️',
    date: '2026-01-14T09:00:00',
    read: false,
    starred: true,
    label: 'inbox',
    agentAction: 'Personal email - suggested reply drafted',
    agentSummary: 'Mom invites you for Sunday dinner (lasagna!). Needs a response.'
  },
  {
    id: '8',
    from: 'Jira',
    fromEmail: 'jira@company.atlassian.net',
    subject: '[PROJ-456] Bug assigned to you: Login timeout issue',
    preview: 'A critical bug has been assigned to you. Priority: High...',
    body: 'Bug PROJ-456: Users experiencing session timeouts after 5 minutes instead of 30. Priority: High. Sprint: Current. Reporter: QA Team.',
    date: '2026-01-13T17:00:00',
    read: true,
    starred: false,
    label: 'important',
    agentAction: 'Added to your task board. Priority: High.',
    agentSummary: 'Bug assigned: Login timeout (5min vs 30min). Priority: High.'
  }
];

export const sampleTasks: AgentTask[] = [
  {
    id: 't1',
    type: 'check',
    status: 'completed',
    description: 'Scanned inbox for new emails',
    result: 'Found 3 unread emails, 1 urgent',
    timestamp: '2026-01-15T09:35:00'
  },
  {
    id: 't2',
    type: 'alert',
    status: 'completed',
    description: 'Detected critical AWS alert',
    result: 'Notified user via push notification',
    timestamp: '2026-01-15T07:46:00'
  },
  {
    id: 't3',
    type: 'organize',
    status: 'completed',
    description: 'Auto-categorized 12 emails',
    result: '5 important, 3 social, 2 promotions, 2 inbox',
    timestamp: '2026-01-15T07:45:00'
  },
  {
    id: 't4',
    type: 'summarize',
    status: 'completed',
    description: 'Generated email summaries',
    result: 'Summarized 8 emails in 2.3 seconds',
    timestamp: '2026-01-15T07:44:00'
  },
  {
    id: 't5',
    type: 'reply',
    status: 'pending',
    description: 'Draft reply for Mom\'s dinner invitation',
    result: 'Awaiting user approval',
    timestamp: '2026-01-15T09:30:00'
  }
];
