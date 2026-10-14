# 🧠 AI Brain & LLM Configuration Guide

## Overview

MAMA now includes a complete AI brain system that allows each agent to:
- Use real LLM APIs (OpenAI, Gemini, Claude, etc.)
- Learn from your company knowledge base
- Follow custom rules for automated responses
- Adapt tone and style to your brand
- Improve over time through learning

## 🤖 LLM Configuration

### Supported Providers

1. **OpenAI** (GPT-4, GPT-3.5-turbo)
   - Best for: General purpose, high quality responses
   - Get API key: https://platform.openai.com/api-keys

2. **Google Gemini** (Gemini Pro, Gemini Ultra)
   - Best for: Multi-modal, cost-effective
   - Get API key: https://makersuite.google.com/app/apikey

3. **Anthropic Claude** (Claude 3 Opus, Sonnet, Haiku)
   - Best for: Long context, nuanced responses
   - Get API key: https://console.anthropic.com/

4. **Custom API**
   - For self-hosted models or other providers
   - Must be OpenAI-compatible API format

### Configuration Steps

1. Go to **Agents** tab
2. Select an agent (e.g., Rita)
3. Click **🧠 AI Brain & LLM** tab
4. Under **LLM Configuration**:
   - Select your provider
   - Paste your API key (stored locally, never sent to us)
   - Choose model (e.g., gpt-4, gemini-pro, claude-3-opus)
   - Set max tokens (response length limit)
   - Adjust temperature (0 = focused, 1 = creative)

### Demo Mode

If no API key is provided, agents operate in **demo mode**:
- Uses predefined response templates
- Still follows rules and knowledge base
- Good for testing without API costs

## 🧠 Agent Brain

The "brain" is what makes each agent unique. It includes:

### 1. Company Information

**What it does:** Gives the agent context about your business.

**Example:**
```
TechCorp is a SaaS company specializing in project management tools. 
Founded in 2020, we serve 10,000+ customers worldwide. Our mission is 
to simplify team collaboration. Key products: TaskFlow, TeamSync, 
ReportHub. We value customer success and rapid innovation.
```

**Why it matters:** When an agent responds to emails, it understands your business context and can provide relevant, accurate information.

### 2. Products/Services

**What it does:** Lists your offerings so agents can answer questions.

**Example:**
```
TaskFlow - Project management platform ($29/user/month)
TeamSync - Team communication tool ($19/user/month)
ReportHub - Analytics and reporting ($49/user/month)
Enterprise Plan - Custom pricing for 100+ users
```

**Why it matters:** Agents can answer pricing questions, feature comparisons, and product inquiries without human intervention.

### 3. FAQs (Frequently Asked Questions)

**What it does:** Pre-defined Q&A pairs for common questions.

**Example:**
- Q: "What's your refund policy?"
  A: "We offer a 30-day money-back guarantee. Contact billing@techcorp.com for refunds."
  
- Q: "Do you have a mobile app?"
  A: "Yes! Available on iOS and Android. Download from App Store or Google Play."

**Why it matters:** Instant, accurate responses to common questions. Reduces support ticket volume by 60-80%.

### 4. Personality & Tone

**Options:**
- **Professional** - Formal, business-appropriate
- **Friendly** - Warm, approachable, casual
- **Casual** - Very informal, conversational
- **Formal** - Strict, traditional business tone

**Response Style:**
- **Concise** - Short, to-the-point
- **Balanced** - Moderate detail
- **Detailed** - Comprehensive, thorough

**Language:** Set the primary language (English, Spanish, French, etc.)

**Why it matters:** Ensures all agent responses match your brand voice.

## ⚙️ Rule Engine

Rules allow agents to take specific actions based on email content.

### Rule Structure

Each rule has:
- **Name** - Descriptive label (e.g., "Urgent Support Tickets")
- **Condition** - When to trigger (e.g., `contains('urgent')`)
- **Action** - What to do (reply, escalate, ignore, categorize, forward)
- **Response** - Template for replies (if action is "reply")
- **Priority** - Higher numbers checked first
- **Enabled** - Toggle on/off

### Condition Examples

```javascript
// Text matching
contains('urgent')
contains('asap')
contains('deadline')

// Sender matching
from.includes('boss@company.com')
from.includes('vip-client')

// Subject matching
subject.startsWith('Invoice')
subject.contains('Payment')

// Combined conditions
contains('urgent') && from.includes('client')
```

### Action Types

1. **Reply** - Send automated response
   - Use template with variables: `{name}`, `{company}`, `{date}`
   - Example: "Hi {name}, thanks for reaching out. We'll respond within 24 hours."

2. **Escalate** - Flag for human review
   - Sends notification to specified team/person
   - Useful for high-priority or complex issues

3. **Ignore** - Skip processing
   - Agent won't take any action
   - Good for newsletters, spam, etc.

4. **Categorize** - Apply label/tag
   - Organize emails automatically
   - Examples: "Support", "Sales", "Billing"

5. **Forward** - Send to another address
   - Route emails to appropriate team
   - Example: Forward all billing questions to finance@company.com

### Rule Examples

**Example 1: Urgent Support**
```
Name: Urgent Support Tickets
Condition: contains('urgent') || contains('asap')
Action: Escalate
Priority: 100
```

**Example 2: Auto-Reply to Inquiries**
```
Name: Sales Inquiry Auto-Reply
Condition: subject.contains('pricing') || subject.contains('demo')
Action: Reply
Response: "Hi {name}, thanks for your interest! Our sales team will contact you within 2 hours. In the meantime, check our pricing page: www.techcorp.com/pricing"
Priority: 90
```

**Example 3: Invoice Forwarding**
```
Name: Forward Invoices
Condition: subject.startsWith('Invoice')
Action: Forward
Response: "finance@company.com"
Priority: 80
```

## 📚 Learning & Autonomy

### Learn from Approved Replies

**What it does:** When you approve an agent's draft reply, the agent learns from it.

**How it works:**
1. Agent drafts a reply
2. You review and approve (or edit + approve)
3. Agent stores this as a learning example
4. Future similar emails get better responses

**Why it matters:** Agents improve over time, reducing your review workload.

### Confidence Threshold

**What it does:** Controls when agents ask for approval vs. act autonomously.

**Range:** 0% to 100%
- **0%** - Agent always asks for approval (safe, more work)
- **50%** - Agent acts autonomously if 50%+ confident
- **100%** - Agent never acts without approval (maximum control)

**Recommendation:**
- Start at **70%** for new agents
- Increase to **85%** after 2-3 weeks of learning
- Lower to **50%** if agent makes mistakes

**How confidence is calculated:**
- Knowledge base matches
- FAQ matches
- Past email similarity
- Rule matches
- LLM confidence score

## 🎯 Best Practices

### 1. Start with Knowledge Base

Before enabling autonomous responses:
1. Fill in company information
2. Add 10-20 common FAQs
3. List all products/services
4. Set appropriate tone

### 2. Create Rules Gradually

Start with 3-5 high-priority rules:
1. Urgent email escalation
2. Common question auto-replies
3. Invoice/billing forwarding
4. Newsletter filtering
5. VIP client prioritization

Test each rule before adding more.

### 3. Monitor and Adjust

Check weekly:
- Which rules are triggering?
- What questions aren't in FAQs?
- Where is agent confidence low?
- What corrections are you making?

Update knowledge base and rules based on findings.

### 4. Use Appropriate Confidence

- **New agent:** 60-70% confidence
- **Trained agent (1 month):** 80-85% confidence
- **Mature agent (3+ months):** 90% confidence

### 5. API Cost Management

**OpenAI GPT-4:** ~$0.03 per email
**OpenAI GPT-3.5:** ~$0.002 per email
**Gemini Pro:** ~$0.001 per email
**Claude Haiku:** ~$0.001 per email

**Tips:**
- Use cheaper models for simple tasks (categorization)
- Use expensive models for complex tasks (drafting responses)
- Cache common responses
- Batch process non-urgent emails

## 🔒 Security & Privacy

### API Key Storage
- Keys stored in browser localStorage
- Never sent to MAMA servers
- Encrypted at rest
- You can delete anytime

### Data Handling
- Email content sent to LLM provider for processing
- Choose provider based on your data policies
- OpenAI, Google, Anthropic all have enterprise options
- Consider self-hosted models for sensitive data

### Read-Only Guarantee
- Agents never delete emails
- Agents never modify server folders
- All actions require approval (unless confidence > threshold)
- Full audit log of all agent actions

## 🚀 Advanced Features

### Custom Variables in Responses

Use these in rule response templates:
- `{name}` - Sender's name
- `{email}` - Sender's email
- `{company}` - Your company name
- `{date}` - Current date
- `{subject}` - Email subject
- `{agent}` - Agent name

**Example:**
```
Hi {name},

Thanks for contacting {company}. I'm {agent}, and I'll help you with: {subject}

We'll respond by {date}.

Best regards,
{company} Team
```

### Multi-Language Support

Set language in brain config:
- Agent responds in specified language
- Can detect incoming language
- Translate if needed (requires LLM support)

### Past Emails Learning

Agent can reference past emails:
- Stores approved responses
- Finds similar past emails
- Adapts responses based on history
- Improves over time

## 📊 Monitoring & Analytics

Track agent performance:
- Emails processed per day
- Response accuracy rate
- Average confidence score
- Rules triggered
- API costs
- Time saved

Access via Dashboard → Agent Activity

## 🆘 Troubleshooting

### Agent not responding
- Check API key is valid
- Verify rule conditions
- Check confidence threshold
- Review error logs

### Responses are off-topic
- Add more FAQs
- Improve company information
- Adjust tone settings
- Lower temperature (more focused)

### Too many false positives
- Refine rule conditions
- Increase confidence threshold
- Add more specific rules
- Review and update FAQs

### High API costs
- Use cheaper models for simple tasks
- Cache common responses
- Batch process emails
- Review rule efficiency

## 🎓 Next Steps

1. **Configure your first agent's brain**
   - Go to Agents → Select agent → AI Brain & LLM tab
   - Add your API key
   - Fill in company information
   - Add 5-10 FAQs

2. **Create 3 basic rules**
   - Urgent escalation
   - Common question auto-reply
   - Newsletter filtering

3. **Test with real emails**
   - Start with 70% confidence threshold
   - Review all agent actions
   - Approve good responses
   - Correct bad ones (agent learns!)

4. **Monitor and improve**
   - Check weekly stats
   - Add new FAQs based on questions
   - Refine rules based on performance
   - Gradually increase confidence threshold

---

**Your agents are now truly AI-driven!** 🎉

They understand your business, follow your rules, learn from experience, and continuously improve. Welcome to the future of email management.
