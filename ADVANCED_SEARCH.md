# 🔍 Advanced Search & Filters

## Overview

The Advanced Search feature provides powerful email discovery across all your mailboxes. Search by text, filter by multiple criteria, save custom filters, and quickly find any email in seconds.

## 🎯 Key Features

### 1. Full-Text Search

**Search Fields**:
- Email subject
- Email body content
- Sender name
- Sender email address

**Real-time Results**:
- Instant filtering as you type
- Case-insensitive matching
- Partial word matching
- No need to press Enter

**Example**:
```
Search: "invoice"
Results: All emails containing "invoice" in subject, body, or sender
```

### 2. Multi-Mailbox Filtering

**Filter by Agent/Mailbox**:
- Select specific mailboxes to search
- Search across all mailboxes (default)
- Visual checkbox interface
- Shows agent emoji and name

**Example Use Case**:
```
Search only in:
☑ Rita (Work Gmail)
☑ Max (Company IMAP)
☐ Theta (Personal Gmail)
☐ Atlas (Client Support)
```

### 3. Company-Based Filtering

**Filter by Company Group**:
- Search within specific companies
- Useful for multi-company setups
- Automatically groups mailboxes

**Example**:
```
Search in companies:
☑ TechCorp Inc.
☐ StartupXYZ
☐ MyBusiness LLC
☐ Personal
```

### 4. Date Range Filters

**Quick Date Selection**:
- **Today**: Emails from the last 24 hours
- **This Week**: Emails from the last 7 days
- **This Month**: Emails from the last 30 days
- **All Time**: No date restriction

**Use Case**:
```
Find all urgent emails from this week
Search: "urgent"
Date: This Week
```

### 5. Label-Based Filtering

**Filter by Email Labels**:
- Inbox
- Important
- Social
- Promotions

**Multiple Selection**:
- Select one or more labels
- Combine with other filters
- Quick category filtering

**Example**:
```
Find important emails
Labels: ☑ Important
Date: This Week
```

### 6. Status Filters

**Unread Only**:
- Show only unread emails
- Quick access to new messages
- Combine with other filters

**Starred Only**:
- Show only starred/important emails
- Focus on priority items
- Quick access to flagged emails

**Example**:
```
Find unread important emails
Labels: ☑ Important
Status: ☑ Unread only
```

### 7. Saved Filters

**Save Custom Filters**:
- Name your filter combinations
- Quick access to frequent searches
- One-click filter application
- Delete saved filters

**Example Saved Filters**:
```
💾 Saved Filters:
[Urgent This Week] [Unread Important] [Client Emails] [Invoices]
```

**Use Case**:
```
1. Create filter: Label=Important, Date=This Week, Unread=Yes
2. Save as "Urgent This Week"
3. Click to apply anytime
```

## 🎨 User Interface

### Search Input
- Large, prominent search bar at top
- Search icon (🔍) on left
- Placeholder text: "Search emails by subject, body, sender..."
- Full-width on mobile
- Auto-focus on page load

### Filter Panel
- Collapsible sections for organization
- Checkbox interfaces for multi-select
- Radio buttons for single-select (date range)
- Scrollable lists for mailboxes/companies
- Clear visual hierarchy

### Results Display
- Shows matching email count
- Empty state with helpful message
- Scrollable results list
- Email preview cards
- Click to view full email

### Filter Actions
- **💾 Save Filter**: Save current filter combination
- **Clear All**: Reset all filters
- **Load Filter**: Click saved filter to apply

## 🔧 Filter Combinations

### Example 1: Urgent Client Emails
```
Search: "urgent" OR "asap"
Mailbox: Atlas (Client Support)
Date: This Week
Label: Important
Status: Unread only
```

### Example 2: Invoices This Month
```
Search: "invoice" OR "payment" OR "billing"
Date: This Month
Label: Inbox
```

### Example 3: Team Updates
```
Search: "update" OR "status" OR "progress"
Company: TechCorp Inc.
Date: This Week
```

### Example 4: Personal Unread
```
Mailbox: Theta (Personal Gmail)
Status: Unread only
```

### Example 5: Starred Work Emails
```
Company: TechCorp Inc.
Status: Starred only
```

## 📊 Search Results

### Result Card Display
Each result shows:
- Agent emoji and color
- Sender name
- "via [Agent Name]" indicator
- Email subject (bold)
- Email preview (2 lines)
- Date
- Status badges (Unread, Starred)
- Label badge

### Visual Indicators
- **Unread**: Blue badge
- **Starred**: ⭐ icon
- **Labels**: Color-coded badges
  - Important: Red
  - Social: Blue
  - Promotions: Yellow
  - Inbox: Gray

### Empty State
When no results found:
- Large search icon (🔍)
- "No emails found" message
- "Try adjusting your search or filters" hint

## 💡 Use Cases

### 1. Quick Email Discovery
**Scenario**: Find a specific email from last week
```
Search: "project kickoff"
Date: This Week
```

### 2. Urgent Task Identification
**Scenario**: Find all urgent unread emails
```
Search: "urgent" OR "asap" OR "deadline"
Date: Today
Status: Unread only
Label: Important
```

### 3. Client Communication Review
**Scenario**: Review all client emails this month
```
Mailbox: Atlas (Client Support)
Date: This Month
```

### 4. Invoice Tracking
**Scenario**: Find all invoices for accounting
```
Search: "invoice"
Date: This Month
Label: Inbox
```

### 5. Newsletter Cleanup
**Scenario**: Find newsletters to unsubscribe
```
Search: "newsletter" OR "subscribe" OR "unsubscribe"
Label: Promotions
```

### 6. Meeting Follow-ups
**Scenario**: Find emails about meetings
```
Search: "meeting" OR "calendar" OR "schedule"
Date: This Week
```

## 🔍 Search Syntax

### Basic Search
```
invoice              → Contains "invoice"
project kickoff      → Contains "project kickoff"
```

### Multiple Words
```
urgent deadline      → Contains both "urgent" AND "deadline"
```

### Future: Advanced Syntax
```
"exact phrase"       → Exact phrase matching
from:john            → From specific sender
subject:invoice      → In subject only
body:payment         → In body only
after:2024-01-01     → After specific date
before:2024-01-31    → Before specific date
label:important      → Specific label
```

## 🎯 Filter Logic

### AND Logic (Default)
All selected filters must match:
```
Mailbox: Rita
Label: Important
Date: This Week
→ Shows emails from Rita AND labeled Important AND from this week
```

### OR Logic (Within Filter)
Multiple selections within same filter:
```
Labels: ☑ Important ☑ Social
→ Shows emails labeled Important OR Social
```

### Combined Example
```
Mailbox: ☑ Rita ☑ Max
Label: ☑ Important ☑ Social
Date: This Week
→ (Rita OR Max) AND (Important OR Social) AND This Week
```

## 📱 Mobile Responsive

### Desktop
- 3-column filter grid
- Full-width search input
- Side-by-side results

### Tablet
- 2-column filter grid
- Stacked results

### Mobile
- Single column layout
- Scrollable filters
- Full-width results
- Touch-optimized checkboxes

## 💾 Saved Filters

### Save Dialog
```
┌─────────────────────────────┐
│ Save Filter                 │
├─────────────────────────────┤
│ Filter name:                │
│ [Urgent This Week        ] │
│                             │
│ [Save] [Cancel]            │
└─────────────────────────────┘
```

### Filter Management
- **Load**: Click filter name to apply
- **Delete**: Click ✕ to remove
- **Overwrite**: Save with same name to update

### Example Saved Filters
```
💾 Saved Filters:
[Urgent This Week] [Unread Important] [Client Emails] [Invoices] [Meeting Follow-ups]
```

## 🚀 Performance

### Optimization
- Debounced search input (300ms delay)
- Client-side filtering (instant results)
- Virtual scrolling for large result sets
- Lazy loading of email details

### Scalability
- Handles 1000+ emails smoothly
- Filters apply in <100ms
- No server round-trips for filtering
- Efficient memory usage

## 🔧 Technical Implementation

### Filter State
```typescript
interface SearchFilters {
  query: string;              // Search text
  mailboxIds: string[];       // Selected mailboxes
  companies: string[];        // Selected companies
  dateRange: 'today' | 'week' | 'month' | 'all';
  labels: string[];           // Selected labels
  unreadOnly: boolean;        // Unread filter
  starredOnly: boolean;       // Starred filter
}
```

### Saved Filter
```typescript
interface SavedFilter {
  id: string;
  name: string;
  filters: SearchFilters;
}
```

### Filter Application
```typescript
const filteredEmails = emails.filter(email => {
  // Text search
  if (filters.query) {
    const matchesQuery = /* search logic */;
    if (!matchesQuery) return false;
  }
  
  // Mailbox filter
  if (filters.mailboxIds.length > 0) {
    if (!filters.mailboxIds.includes(email.mailboxId)) return false;
  }
  
  // Company filter
  if (filters.companies.length > 0) {
    const mailbox = getMailbox(email.mailboxId);
    if (!filters.companies.includes(mailbox.company)) return false;
  }
  
  // Date filter
  if (filters.dateRange !== 'all') {
    // Date comparison logic
  }
  
  // Label filter
  if (filters.labels.length > 0) {
    if (!filters.labels.includes(email.label)) return false;
  }
  
  // Status filters
  if (filters.unreadOnly && email.read) return false;
  if (filters.starredOnly && !email.starred) return false;
  
  return true;
});
```

## 🎨 UI Components

### Search Input
```tsx
<input
  type="text"
  value={filters.query}
  onChange={(e) => setFilters({ ...filters, query: e.target.value })}
  placeholder="Search emails by subject, body, sender..."
/>
```

### Mailbox Filter
```tsx
{mailboxes.map(mb => (
  <label>
    <input
      type="checkbox"
      checked={filters.mailboxIds.includes(mb.id)}
      onChange={(e) => {
        if (e.target.checked) {
          setFilters({ 
            ...filters, 
            mailboxIds: [...filters.mailboxIds, mb.id] 
          });
        } else {
          setFilters({ 
            ...filters, 
            mailboxIds: filters.mailboxIds.filter(id => id !== mb.id) 
          });
        }
      }}
    />
    <span>{mb.agentEmoji}</span>
    <span>{mb.agentName}</span>
  </label>
))}
```

### Save Filter Dialog
```tsx
{showSaveDialog && (
  <div className="fixed inset-0 bg-black/50">
    <input
      type="text"
      value={saveName}
      onChange={(e) => setSaveName(e.target.value)}
      placeholder="Filter name..."
    />
    <button onClick={handleSaveFilter}>Save</button>
    <button onClick={() => setShowSaveDialog(false)}>Cancel</button>
  </div>
)}
```

## 🔄 Integration with Other Features

### With Unified Inbox
- Click search result → Opens in Unified Inbox
- Maintains filter context
- Seamless navigation

### With Analytics
- Search results can inform analytics
- Track popular searches
- Identify common patterns

### With Agent Actions
- Search → Select email → Take action
- Bulk actions on search results (future)
- Quick reply from search (future)

## 🚀 Future Enhancements

### Planned Features
1. **Advanced Search Syntax**: Boolean operators, field-specific search
2. **Search History**: Recent searches quick access
3. **Smart Suggestions**: AI-powered search suggestions
4. **Bulk Actions**: Select multiple emails, apply actions
5. **Search in Attachments**: Search attachment content
6. **Regex Support**: Regular expression search
7. **Search Templates**: Pre-defined search templates
8. **Export Results**: Export search results to CSV
9. **Search Alerts**: Get notified of new matching emails
10. **Natural Language**: "Show me urgent emails from John this week"

### API Integration
```typescript
// Future: Backend search
interface SearchAPI {
  search(query: string, filters: SearchFilters): Promise<SearchResults>;
  saveFilter(filter: SavedFilter): Promise<void>;
  getSavedFilters(): Promise<SavedFilter[]>;
  getSearchHistory(): Promise<string[]>;
}
```

## 📝 Example Workflows

### Workflow 1: Daily Triage
```
1. Open Search
2. Apply filter: Date=Today, Status=Unread
3. Save as "Daily Triage"
4. Process emails one by one
5. Repeat daily
```

### Workflow 2: Client Follow-up
```
1. Open Search
2. Apply filter: Mailbox=Atlas, Label=Important, Date=This Week
3. Save as "Client Follow-up"
4. Review and respond
5. Check weekly
```

### Workflow 3: Invoice Processing
```
1. Open Search
2. Search: "invoice"
3. Apply filter: Date=This Month
4. Save as "Monthly Invoices"
5. Process and archive
6. Repeat monthly
```

## 🎯 Key Benefits

1. **Speed**: Find any email in seconds
2. **Precision**: Combine multiple filters
3. **Convenience**: Save and reuse filters
4. **Flexibility**: Search across all mailboxes
5. **Efficiency**: Quick access to priority emails
6. **Organization**: Categorize and filter by need

---

**Advanced Search turns email chaos into organized, actionable insights!** 🔍✨
