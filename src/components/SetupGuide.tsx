import { useState } from 'react';

export default function SetupGuide() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: 'Choose Your AI Framework',
      icon: '🧠',
      description: 'Select the AI backbone for your email agent',
      content: `There are several frameworks you can use to build an AI email agent:

**Option 1: LangChain + OpenAI**
• Most popular choice for AI agents
• Built-in tools for email, web, and API integration
• Supports GPT-4, Claude, and other LLMs
• Great documentation and community

**Option 2: AutoGen (Microsoft)**
• Multi-agent conversations
• Great for complex workflows
• Built-in code execution
• Good for team-based agents

**Option 3: CrewAI**
• Role-based agent design
• Easy to set up email-specific agents
• Built-in task delegation
• Simple Python API

**Option 4: Custom with OpenAI API**
• Full control over behavior
• Lower cost for simple tasks
• More work to build from scratch
• Best for specific use cases`,
      code: `# Example: LangChain Agent Setup
from langchain.agents import initialize_agent, Tool
from langchain.llms import OpenAI
from langchain.memory import ConversationBufferMemory

# Define email tools
tools = [
    Tool(
        name="Check Email",
        func=check_email_func,
        description="Check inbox for new emails"
    ),
    Tool(
        name="Summarize Email", 
        func=summarize_func,
        description="Summarize an email thread"
    ),
    Tool(
        name="Draft Reply",
        func=draft_reply_func,
        description="Draft a reply to an email"
    ),
]

# Initialize the agent
agent = initialize_agent(
    tools,
    OpenAI(temperature=0),
    memory=ConversationBufferMemory(),
    verbose=True
)`
    },
    {
      title: 'Connect Email APIs',
      icon: '📧',
      description: 'Set up email provider integrations',
      content: `Connect your email accounts using these APIs:

**Gmail API (Recommended)**
• OAuth 2.0 authentication
• Full read/write access
• Real-time push notifications
• Free tier: 1 billion quota units/day

**Microsoft Graph API (Outlook)**
• OAuth 2.0 authentication
• Calendar + Email + Contacts
• Webhook subscriptions
• Free for personal, paid for business

**IMAP/SMTP (Universal)**
• Works with any email provider
• Limited functionality
• No push notifications
• Good for simple setups

**Setup Steps for Gmail:**
1. Go to Google Cloud Console
2. Create a new project
3. Enable Gmail API
4. Create OAuth 2.0 credentials
5. Download credentials.json
6. Run authorization flow`,
      code: `# Gmail API Setup with Python
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.modify'
]

def get_gmail_service():
    flow = InstalledAppFlow.from_client_secrets_file(
        'credentials.json', SCOPES
    )
    creds = flow.run_local_server(port=0)
    service = build('gmail', 'v1', credentials=creds)
    return service

# Check for new emails
def check_new_emails(service, query='is:unread'):
    results = service.users().messages().list(
        userId='me', q=query
    ).execute()
    messages = results.get('messages', [])
    return messages`
    },
    {
      title: 'Build Agent Logic',
      icon: '⚙️',
      description: 'Define how your agent processes emails',
      content: `Design your agent's decision-making logic:

**Email Classification**
The agent should categorize emails into:
• 🔴 Urgent - Needs immediate attention
• 🟡 Important - Needs response today
• 🟢 Normal - Can wait
• ⚪ Low Priority - Newsletters, promotions

**Action Rules**
• Urgent emails → Push notification + summary
• Important emails → Summarize + draft reply
• Normal emails → Auto-categorize + batch summary
• Spam/Promotions → Auto-archive

**Smart Features**
• Detect meeting invites → Check calendar conflicts
• Detect invoices → Log to accounting
• Detect mentions → Track action items
• Detect deadlines → Set reminders`,
      code: `# Agent Logic Example
class EmailAgent:
    def __init__(self, llm, gmail_service):
        self.llm = llm
        self.gmail = gmail_service
        self.rules = self._setup_rules()
    
    def process_email(self, email):
        # Classify priority
        priority = self.classify_priority(email)
        
        # Generate summary
        summary = self.summarize(email)
        
        # Decide action based on priority
        if priority == 'urgent':
            self.send_alert(email, summary)
            draft = self.draft_reply(email)
            self.notify_user(email, summary, draft)
        elif priority == 'important':
            draft = self.draft_reply(email)
            self.notify_user(email, summary, draft)
        else:
            self.auto_categorize(email)
            self.add_to_daily_digest(email, summary)
    
    def classify_priority(self, email):
        prompt = f"""Classify this email's priority:
        From: {email['from']}
        Subject: {email['subject']}
        Body: {email['body'][:500]}
        
        Respond with: urgent, important, normal, or low"""
        
        return self.llm(prompt).strip().lower()`
    },
    {
      title: 'Set Up Notifications',
      icon: '🔔',
      description: 'Configure how the agent alerts you',
      content: `Choose your notification channels:

**Push Notifications (Mobile)**
• Instant alerts for urgent emails
• Use Firebase Cloud Messaging
• Or Apple Push Notification Service

**Slack/Discord Integration**
• Post summaries to a channel
• Interactive buttons for quick actions
• Thread conversations about emails

**SMS (Critical Only)**
• Use Twilio for SMS alerts
• Reserve for truly urgent items
• Cost: ~$0.01 per message

**Dashboard (This App!)**
• Real-time email feed
• Agent activity log
• Quick action buttons
• Daily/weekly reports`,
      code: `# Notification Setup
import requests

class Notifier:
    def __init__(self):
        self.slack_webhook = "YOUR_WEBHOOK_URL"
        self.twilio_sid = "YOUR_SID"
        self.twilio_token = "YOUR_TOKEN"
    
    def send_slack(self, message, channel="#emails"):
        requests.post(self.slack_webhook, json={
            "channel": channel,
            "text": message,
            "blocks": [
                {"type": "section", "text": {
                    "type": "mrkdwn",
                    "text": message
                }}
            ]
        })
    
    def send_sms(self, phone, message):
        from twilio.rest import Client
        client = Client(self.twilio_sid, self.twilio_token)
        client.messages.create(
            body=message,
            from_='+1234567890',
            to=phone
        )
    
    def send_push(self, title, body):
        # Firebase Cloud Messaging
        requests.post(
            "https://fcm.googleapis.com/fcm/send",
            headers={"Authorization": f"key={self.fcm_key}"},
            json={
                "to": self.device_token,
                "notification": {"title": title, "body": body}
            }
        )`
    },
    {
      title: 'Deploy & Monitor',
      icon: '🚀',
      description: 'Run your agent in production',
      content: `Deploy your agent and keep it running:

**Hosting Options**
• **Railway/Render** - Easy Python deployment, $5-20/mo
• **AWS Lambda** - Pay per execution, great for scheduled tasks
• **VPS (DigitalOcean)** - Full control, $5-20/mo
• **Your own machine** - Free but needs to stay on

**Monitoring**
• Log all agent actions
• Track API costs (OpenAI, email APIs)
• Set up error alerts
• Monitor response times

**Cost Optimization**
• Use GPT-3.5 for simple tasks (~$0.002/email)
• Use GPT-4 only for complex analysis (~$0.03/email)
• Cache common responses
• Batch process non-urgent emails

**Security**
• Store API keys in environment variables
• Use OAuth tokens (not passwords)
• Encrypt stored email data
• Regular security audits`,
      code: `# Deployment with Docker
# Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "agent.py"]

# docker-compose.yml
version: '3.8'
services:
  email-agent:
    build: .
    environment:
      - OPENAI_API_KEY=\${OPENAI_API_KEY}
      - GMAIL_CREDENTIALS=\${GMAIL_CREDENTIALS}
      - SLACK_WEBHOOK=\${SLACK_WEBHOOK}
    restart: always
    volumes:
      - ./logs:/app/logs

# Run with:
# docker-compose up -d

# Monitoring with health checks
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('agent.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger('email_agent')

# Track costs
class CostTracker:
    def __init__(self):
        self.daily_cost = 0
        self.monthly_budget = 10.00  # $10/month
    
    def track(self, tokens_used, model='gpt-3.5'):
        rates = {'gpt-3.5': 0.002, 'gpt-4': 0.03}
        cost = tokens_used * rates[model] / 1000
        self.daily_cost += cost
        if self.daily_cost > self.monthly_budget / 30:
            logger.warning("Daily budget exceeded!")`
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">📖 Setup Guide</h1>
        <p className="text-gray-400">Learn how to build your own AI email agent step by step</p>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm text-blue-400 font-medium">Step {activeStep + 1} of {steps.length}</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-3">
          {steps.map((step, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className={`text-center ${i <= activeStep ? 'text-blue-400' : 'text-gray-600'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 text-sm ${
                i <= activeStep ? 'bg-blue-500/20 border border-blue-500/50' : 'bg-gray-800 border border-gray-700'
              }`}>
                {i < activeStep ? '✓' : step.icon}
              </div>
              <span className="text-xs hidden md:block">{step.title.split(' ').slice(0, 2).join(' ')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{steps[activeStep].icon}</span>
            <h2 className="text-xl font-bold text-white">{steps[activeStep].title}</h2>
          </div>
          <p className="text-gray-400">{steps[activeStep].description}</p>
        </div>

        <div className="p-6">
          <div className="prose prose-invert max-w-none mb-6">
            {steps[activeStep].content.split('\n\n').map((paragraph, i) => (
              <div key={i} className="mb-4">
                {paragraph.split('\n').map((line, j) => {
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <h4 key={j} className="text-white font-semibold mt-4 mb-2">{line.slice(2, -2)}</h4>;
                  }
                  if (line.startsWith('•')) {
                    return (
                      <div key={j} className="flex items-start gap-2 ml-2 mb-1">
                        <span className="text-blue-400 mt-0.5">•</span>
                        <span className="text-gray-300 text-sm">{line.slice(2)}</span>
                      </div>
                    );
                  }
                  if (/^\d+\./.test(line)) {
                    return (
                      <div key={j} className="flex items-start gap-2 ml-2 mb-1">
                        <span className="text-blue-400 font-mono text-sm">{line.match(/^\d+/)?.[0]}.</span>
                        <span className="text-gray-300 text-sm">{line.replace(/^\d+\.\s*/, '')}</span>
                      </div>
                    );
                  }
                  if (line.trim()) {
                    return <p key={j} className="text-gray-300 text-sm mb-2">{line}</p>;
                  }
                  return null;
                })}
              </div>
            ))}
          </div>

          {/* Code Block */}
          <div className="bg-gray-950 border border-gray-800 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
              <span className="text-xs text-gray-500 font-mono">code example</span>
              <button className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                📋 Copy
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-sm">
              <code className="text-gray-300 font-mono whitespace-pre">{steps[activeStep].code}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
          disabled={activeStep === 0}
          className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          ← Previous
        </button>
        <button
          onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
          disabled={activeStep === steps.length - 1}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          Next Step →
        </button>
      </div>

      {/* Quick Links */}
      <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">🔗 Useful Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ResourceLink title="LangChain Documentation" url="https://python.langchain.com" />
          <ResourceLink title="Gmail API Guide" url="https://developers.google.com/gmail/api" />
          <ResourceLink title="OpenAI API Reference" url="https://platform.openai.com/docs" />
          <ResourceLink title="AutoGen Framework" url="https://github.com/microsoft/autogen" />
          <ResourceLink title="CrewAI Documentation" url="https://docs.crewai.com" />
          <ResourceLink title="Microsoft Graph API" url="https://learn.microsoft.com/graph" />
        </div>
      </div>
    </div>
  );
}

function ResourceLink({ title, url }: { title: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 bg-gray-800/50 hover:bg-gray-800 rounded-lg p-3 transition-colors group"
    >
      <span className="text-blue-400">↗</span>
      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{title}</span>
    </a>
  );
}
