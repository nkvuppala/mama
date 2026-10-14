# 🚀 MAMA - Multi-Account Mail Agent

A powerful web application for managing multiple email accounts with AI-powered agents. Monitor up to 30 mailboxes across Gmail, Outlook, IMAP, and more - each with its own named agent that can read, reply, schedule, escalate, and organize emails automatically.

![MAMA](https://img.shields.io/badge/React-18.3-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8) ![Vite](https://img.shields.io/badge/Vite-6.0-646cff)

## ✨ Features

### 📮 Multi-Mailbox Management (Up to 30)
- **Multiple Providers**: Gmail, Outlook, IMAP, Yahoo, iCloud, Custom
- **Company Grouping**: Organize mailboxes by company/organization
- **Priority Levels**: Critical, High, Normal, Low
- **Custom Refresh Schedules**: Real-time, 5min, 15min, 30min, 1hr, Manual

### 🤖 AI Agents (One Per Mailbox)
- **Named Agents**: Give each mailbox a unique agent (Rita, Max, Theta, etc.)
- **Custom Avatars**: Choose from 20+ emoji avatars
- **Personality Types**: Professional, Friendly, Technical, Creative, Minimalist, Guardian
- **Agent Colors**: Custom color coding per agent

### ⚡ Automated Actions
- **Reply & Respond**: Draft and send replies with AI assistance
- **Schedule Meetings**: Check availability and send invites
- **Create Tasks**: Extract action items from emails
- **Escalate**: Alert teams via Slack, SMS, PagerDuty
- **Forward & Share**: Send emails to team members
- **Organize**: Auto-categorize, archive, unsubscribe

### 🏖️ Out-of-Office Auto-Reply
- **Scheduled OOO**: Set start/end dates
- **Custom Messages**: Personalized auto-reply content
- **Smart Filtering**: External only, domain exceptions
- **Reply Frequency**: Once per sender, daily, or every email

### 🎨 Personalization
- **Light/Dark Mode**: Toggle between themes
- **10 Accent Colors**: Blue, Purple, Pink, Red, Orange, Amber, Green, Teal, Cyan, Indigo
- **Custom Colors**: Pick any color with color picker
- **Quick Presets**: 10 pre-configured theme combinations

### 📊 Consolidated Dashboard
- **Live Stats**: Unread counts, active agents, actions taken
- **Company Groups**: View mailboxes organized by organization
- **Activity Feed**: Real-time agent action log
- **Priority Indicators**: Visual priority badges

## 🛠️ Tech Stack

- **Frontend**: React 18.3 + TypeScript 5.7
- **Build Tool**: Vite 6.0
- **Styling**: Tailwind CSS 3.4
- **State Management**: React Hooks (useState, useEffect)
- **Routing**: Single-page application (no router needed)

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm

### Setup Steps

```bash
# Clone the repository
git clone https://github.com/yourusername/mama.git
cd mama

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🚀 Usage Examples

### Example 1: Setting Up a Work Email

1. Go to **Mailboxes** tab
2. Click **+ Add Mailbox**
3. Fill in:
   - **Name**: "Work Gmail"
   - **Email**: "alex@company.com"
   - **Provider**: Gmail
   - **Agent Name**: "Rita"
   - **Company**: "TechCorp Inc."
4. Choose an avatar (e.g., 🦊)
5. Click **Add Mailbox**

### Example 2: Configuring IMAP

1. Add a new mailbox
2. Select **IMAP (Custom Server)** as provider
3. Enter IMAP details:
   - **Host**: `imap.yourserver.com`
   - **Port**: `993`
   - **Username**: `your@email.com`
   - **Password**: `••••••••`
   - **SSL**: Enabled
4. Configure SMTP for sending:
   - **SMTP Host**: `smtp.yourserver.com`
   - **SMTP Port**: `587`
5. Save and the agent will start monitoring

### Example 3: Setting Up Out-of-Office

1. Go to **Agents** tab
2. Select the mailbox (e.g., "HR Inbox")
3. Scroll to **Out of Office Auto-Reply**
4. Toggle **Active**
5. Configure:
   - **Start Date**: 2026-01-20
   - **End Date**: 2026-01-27
   - **Subject**: "Out of Office - Annual Retreat"
   - **Message**: "Thank you for your email. Our team is away for the annual retreat and will return on January 27th. For urgent matters, contact hr-urgent@company.com."
   - **Reply Frequency**: Once per sender
   - **External Only**: Enabled (don't reply to internal team)
   - **Allowed Domains**: `company.com`
6. Save - auto-replies are now active!

### Example 4: Composing an Email

1. Go to **Unified Inbox**
2. Click **✉️ Compose** button
3. Select **From** mailbox (e.g., "Rita - Work Gmail")
4. Enter **To**, **Subject**, **Body**
5. Preview shows your signature automatically appended
6. Click **📤 Send Email**
7. Agent sends via the selected mailbox's provider

### Example 5: Renaming a Company Group

1. Go to **Dashboard**
2. Hover over a company header (e.g., "TechCorp Inc.")
3. Click the **✏️ pencil icon**
4. Type new name: "Acme Corp"
5. Press **Enter** or click **✓**
6. All 6 TechCorp mailboxes now belong to "Acme Corp"

### Example 6: Taking Action on an Email

1. Go to **Unified Inbox**
2. Select an email
3. See **⚡ Quick Actions** panel:
   - **✉️ Reply**: Opens compose modal with reply context
   - **🔄 Forward**: Forward to team members
   - **📅 Schedule**: Create meeting from email
   - **✅ Create Task**: Extract action item
   - **🚨 Escalate**: Alert team via Slack/SMS
   - **📁 Archive**: Move to archive
4. Click any action - agent performs it and logs to activity feed

## 📁 Project Structure

```
mama/
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx          # Navigation sidebar
│   │   ├── Dashboard.tsx        # Main dashboard view
│   │   ├── MailboxManager.tsx   # Add/edit/remove mailboxes
│   │   ├── AgentConfig.tsx      # Configure agents, signatures, OOO
│   │   ├── UnifiedInbox.tsx     # View all emails across mailboxes
│   │   ├── ComposeEmail.tsx     # Compose/reply modal
│   │   └── ThemeSettings.tsx    # Light/dark mode, colors
│   ├── types.ts                 # TypeScript interfaces
│   ├── data.ts                  # Sample data (15 mailboxes, 8 emails)
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
├── public/                      # Static assets
├── index.html                   # HTML template
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── vite.config.ts               # Vite config
└── tailwind.config.js           # Tailwind config
```

## 🔧 Configuration

### Mailbox Configuration

Each mailbox has these settings:

```typescript
interface Mailbox {
  id: string;
  name: string;                    // Display name
  emailAddress: string;            // Email address
  type: 'gmail' | 'outlook' | 'imap' | 'yahoo' | 'icloud' | 'custom';
  company: string;                 // Company/group name
  
  // Agent settings
  agentName: string;               // Agent name (e.g., "Rita")
  agentEmoji: string;              // Agent avatar emoji
  agentColor: string;              // Agent color (hex)
  agentPersonality: string;        // Agent personality description
  
  // Priority & schedule
  priority: 'critical' | 'high' | 'normal' | 'low';
  refreshSchedule: 'realtime' | '5min' | '15min' | '30min' | '1hour' | 'manual';
  
  // IMAP config (for IMAP/custom providers)
  imapConfig?: {
    host: string;
    port: number;
    username: string;
    password: string;
    ssl: boolean;
    folders: string[];
    smtpHost: string;
    smtpPort: number;
    smtpUsername: string;
    smtpPassword: string;
    smtpSsl: boolean;
  };
  
  // Signature
  signature: {
    name: string;
    title?: string;
    company?: string;
    phone?: string;
    website?: string;
    customHtml?: string;
  };
  
  // Out of Office
  outOfOffice: {
    enabled: boolean;
    startDate: string;
    endDate: string;
    subject: string;
    message: string;
    onlyExternal: boolean;
    allowedDomains: string[];
    replyFrequency: 'once' | 'daily' | 'every';
  };
  
  // Automation flags
  autoReply: boolean;
  autoArchive: boolean;
  autoCategorize: boolean;
  escalateUrgent: boolean;
  notifySlack: boolean;
  notifyPush: boolean;
}
```

### Theme Configuration

```typescript
interface ThemeConfig {
  mode: 'light' | 'dark';
  accentColor: string;    // Hex color (e.g., "#3b82f6")
  accentName: string;     // Color name (e.g., "Blue")
}
```

## 🌐 Publishing to GitHub

### Step 1: Create a GitHub Repository

1. Go to [github.com](https://github.com)
2. Click **+ New repository**
3. Fill in:
   - **Repository name**: `mama`
   - **Description**: "Multi-Mailbox AI Email Manager"
   - **Public** or **Private**
   - **Don't** initialize with README (we already have one)
4. Click **Create repository**

### Step 2: Initialize Git and Push

```bash
# Initialize git in your project
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: MAMA multi-account mail agent"

# Add GitHub remote (replace with your username)
git remote add origin https://github.com/YOUR_USERNAME/mama.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Update Remote URL (if needed)

```bash
# Check current remote
git remote -v

# Change remote URL
git remote set-url origin https://github.com/YOUR_USERNAME/mama.git
```

### Step 4: Deploy to GitHub Pages (Optional)

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to `package.json`:
```json
{
  "homepage": "https://YOUR_USERNAME.github.io/mama",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Update `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/mama/',
  // ... rest of config
})
```

4. Deploy:
```bash
npm run deploy
```

5. Your site will be live at: `https://YOUR_USERNAME.github.io/mama/`

## 🚀 Deploying to Other Platforms

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts, then your site is live!
```

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Cloudflare Pages

1. Push to GitHub
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
3. Create a Pages project
4. Connect your GitHub repo
5. Build command: `npm run build`
6. Output directory: `dist`
7. Deploy!

## 📝 Development

### Available Scripts

```bash
# Development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Lint code
npm run lint
```

### Adding a New Feature

1. Create a new component in `src/components/`
2. Import and use it in `App.tsx`
3. Update types in `src/types.ts` if needed
4. Test with `npm run dev`
5. Build with `npm run build`

### Customizing Sample Data

Edit `src/data.ts` to change:
- Sample mailboxes (add your own)
- Sample emails
- Default agent names and personalities

## 🔒 Security Notes

- **Passwords**: In production, never store passwords in plain text
- **API Keys**: Use environment variables for sensitive data
- **OAuth**: Implement proper OAuth flows for Gmail/Outlook
- **IMAP**: Use SSL/TLS for all IMAP connections
- **CORS**: Configure proper CORS policies for API calls

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [React](https://react.dev)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Bundled with [Vite](https://vitejs.dev)
- Icons from [Emoji](https://emojipedia.org)

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check existing issues first
- Provide detailed reproduction steps

## 🗺️ Roadmap

- [ ] Real email API integration (Gmail, Outlook, IMAP)
- [ ] Backend server for email processing
- [ ] AI model integration (OpenAI, Claude)
- [ ] Mobile app (React Native)
- [ ] Calendar integration
- [ ] Advanced analytics
- [ ] Team collaboration features
- [ ] Plugin system for custom actions

---

**Made with ❤️ for email power users**

*MAMA - Manage 30 mailboxes like a pro with AI agents that actually DO things!*
