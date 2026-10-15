# 📊 Analytics & Reports Dashboard

## Overview

The Analytics Dashboard provides comprehensive insights into your email agent performance, costs, and time savings. Track ROI, optimize agent behavior, and understand email patterns across all your mailboxes.

## 🎯 Key Features

### 1. Time Range Selection
- **Today**: View metrics for the current day
- **This Week**: Weekly performance overview
- **This Month**: Monthly trends and patterns

### 2. Key Metrics Cards
Real-time statistics with trend indicators:

- **📧 Emails Processed**: Total emails handled by all agents
- **✉️ Replies Sent**: Number of automated/suggested replies
- **✅ Tasks Created**: Tasks extracted from emails
- **⏱️ Avg Response Time**: Average time to process emails (in minutes)

Each card shows percentage change compared to previous period (green = improvement, red = decline).

### 3. 💰 LLM API Costs Breakdown

**Total Cost Display**: Shows total API spending for selected period

**Per-Agent Breakdown**:
- Visual progress bars showing cost distribution
- Exact dollar amount per agent
- Percentage of total cost
- Color-coded by agent

**Cost Per Email**: Average cost to process a single email

**Example**:
```
Total: $12.47
├─ Rita (🦊): $3.45 (27.7%)
├─ Theta (🦉): $2.89 (23.2%)
├─ Max (🐶): $2.34 (18.8%)
├─ Atlas (🦁): $1.98 (15.9%)
└─ Sage (🐼): $1.81 (14.5%)

Cost per email: $0.0100
```

### 4. ⏰ Time Saved Analysis

**Total Time Saved**: Hours and minutes saved through automation

**Breakdown by Category**:
- **Auto-replies** (40%): Time saved by automated responses
- **Auto-categorization** (30%): Time saved by sorting emails
- **Task creation** (20%): Time saved by extracting action items
- **Other automations** (10%): Miscellaneous time savings

**Estimated Value**: Monetary value of time saved (calculated at $50/hour)

**Example**:
```
Total: 30h 40m
├─ Auto-replies: 12h 16m (40%)
├─ Auto-categorization: 9h 12m (30%)
├─ Task creation: 6h 8m (20%)
└─ Other: 3h 4m (10%)

Estimated value: $1,533 (at $50/hr)
```

### 5. 📈 Daily Email Volume Chart

**Visual Bar Chart**:
- X-axis: Days of the week
- Y-axis: Number of emails
- Color: Uses theme accent color with gradient
- Hover: Shows exact count

**Purpose**: Identify peak email days, plan agent schedules, detect anomalies

### 6. 📂 Email Categories Breakdown

**Category Distribution**:
- Work emails
- Personal emails
- Support tickets
- Sales inquiries
- Newsletters
- And more...

**Visual Representation**:
- Progress bars with category colors
- Count and percentage for each category
- Sorted by volume

**Example**:
```
├─ Work: 456 (36.6%) ████████████████
├─ Personal: 234 (18.8%) █████████
├─ Support: 189 (15.2%) ███████
├─ Sales: 156 (12.5%) ██████
└─ Newsletters: 212 (17.0%) ████████
```

### 7. 🤖 Agent Performance Metrics

**Per-Agent Statistics**:
- Agent name and emoji
- Number of emails processed
- Accuracy percentage
- Visual accuracy bar

**Color Coding**:
- 🟢 Green (95%+): Excellent performance
- 🟡 Yellow (90-94%): Good performance
- 🔴 Red (<90%): Needs improvement

**Example**:
```
🦊 Rita    342 emails    94% ████████████████████
🦉 Theta   289 emails    91% ██████████████████
🐶 Max     234 emails    96% ████████████████████
🦁 Atlas   198 emails    89% █████████████████
🐼 Sage    184 emails    92% ██████████████████
```

## 💡 Use Cases

### 1. Cost Optimization
- Identify expensive agents
- Adjust LLM models (e.g., switch to cheaper models for simple tasks)
- Optimize API call frequency
- Set budget alerts

### 2. Performance Tuning
- Find underperforming agents
- Adjust agent brain configuration
- Improve rules and FAQs
- Increase training data

### 3. Capacity Planning
- Identify peak email days
- Adjust refresh schedules
- Scale agents based on volume
- Plan for growth

### 4. ROI Calculation
- Track time saved vs. API costs
- Calculate net savings
- Justify subscription costs
- Show value to stakeholders

### 5. Trend Analysis
- Monitor email volume trends
- Detect seasonal patterns
- Identify emerging categories
- Plan resource allocation

## 📊 Data Sources

### Real-time Metrics
- Emails processed (from action log)
- Replies sent (from action log)
- Tasks created (from action log)
- Response times (from timestamps)

### Calculated Metrics
- API costs (from LLM usage tracking)
- Time saved (estimated based on automation type)
- Accuracy rates (from user corrections)
- Category breakdown (from email labels)

### Historical Data
- Daily/weekly/monthly aggregates
- Trend calculations
- Percentage changes
- Moving averages

## 🔧 Configuration

### Time Range
```typescript
type TimeRange = 'day' | 'week' | 'month';
```

### Metrics Display
- Automatic refresh every 5 minutes
- Manual refresh button
- Export to CSV (future)
- Custom date ranges (future)

### Cost Tracking
- Per-agent cost allocation
- Model-specific pricing
- Token usage tracking
- Budget thresholds

## 📱 Mobile Responsive

**Desktop**:
- 4-column metric cards
- Side-by-side cost/time panels
- Full-width charts

**Tablet**:
- 2-column metric cards
- Stacked cost/time panels
- Responsive charts

**Mobile**:
- Single column layout
- Scrollable metrics
- Simplified charts

## 🎨 Customization

### Theme Integration
- Uses accent color for charts
- Adapts to light/dark mode
- Consistent with app design

### Agent Colors
- Each agent has unique color
- Used in all visualizations
- Helps identify agents quickly

## 🚀 Future Enhancements

### Planned Features
1. **Custom Date Ranges**: Select any date period
2. **Export Reports**: CSV, PDF exports
3. **Budget Alerts**: Email notifications when costs exceed threshold
4. **Comparisons**: Compare periods (week-over-week, month-over-month)
5. **Custom Metrics**: User-defined KPIs
6. **Agent Leaderboards**: Rank agents by performance
7. **Predictive Analytics**: Forecast future costs and volume
8. **Integration**: Connect to external analytics tools

### API Integration
```typescript
// Future: Real backend integration
interface AnalyticsAPI {
  getMetrics(timeRange: TimeRange): Promise<AnalyticsData>;
  getCostBreakdown(agentId: string): Promise<CostData>;
  getTimeSaved(category: string): Promise<TimeData>;
  exportReport(format: 'csv' | 'pdf'): Promise<Blob>;
}
```

## 📈 Example Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│ 📊 Analytics & Reports                                      │
│ Track agent performance, email insights, and cost          │
├─────────────────────────────────────────────────────────────┤
│ Time Range: [Today] [This Week] [This Month]               │
├─────────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│ │ 📧 1,247 │ │ ✉️ 89    │ │ ✅ 156   │ │ ⏱️ 4.2m  │       │
│ │ +12%     │ │ +8%      │ │ +15%     │ │ -18%     │       │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
├─────────────────────────────────────────────────────────────┤
│ 💰 LLM API Costs              ⏰ Time Saved                 │
│ Total: $12.47                 Total: 30h 40m               │
│ ─────────────────             ─────────────────            │
│ 🦊 Rita    $3.45  ████       Auto-replies     12h 16m     │
│ 🦉 Theta   $2.89  ███        Auto-categorize   9h 12m     │
│ 🐶 Max     $2.34  ██         Task creation     6h 8m      │
│ 🦁 Atlas   $1.98  █          Other             3h 4m      │
│ 🐼 Sage    $1.81  █                                       │
│                             Estimated: $1,533              │
├─────────────────────────────────────────────────────────────┤
│ 📈 Daily Email Volume                                       │
│                                                             │
│ 71 │         █                                             │
│ 62 │    █    █                                             │
│ 54 │    █    █    █                                        │
│ 45 │ █  █    █    █                                        │
│ 38 │ █  █    █    █    █                                   │
│ 23 │ █  █    █    █    █    █                              │
│ 18 │ █  █    █    █    █    █    █                         │
│    └──┴──┴──┴──┴──┴──┴──┘                                  │
│    Mon Tue Wed Thu Fri Sat Sun                             │
├─────────────────────────────────────────────────────────────┤
│ 📂 Email Categories          🤖 Agent Performance          │
│ ─────────────────            ─────────────────             │
│ Work       456 (36.6%)       🦊 Rita   342    94% ████    │
│ Personal   234 (18.8%)       🦉 Theta  289    91% ███     │
│ Support    189 (15.2%)       🐶 Max    234    96% ████    │
│ Sales      156 (12.5%)       🦁 Atlas  198    89% ██      │
│ Newsletter 212 (17.0%)       🐼 Sage   184    92% ███     │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Key Benefits

1. **Visibility**: See exactly what your agents are doing
2. **Cost Control**: Monitor and optimize API spending
3. **Performance**: Track agent accuracy and improve
4. **ROI**: Quantify time and money saved
5. **Planning**: Make data-driven decisions
6. **Optimization**: Identify areas for improvement

## 📝 Notes

- Data is currently mock/simulated for demo purposes
- Real implementation would track actual LLM API usage
- Time saved is estimated based on automation type
- Accuracy rates would come from user corrections
- Costs would be calculated from actual API billing

---

**The Analytics Dashboard turns your email agents from a black box into a transparent, measurable, optimizable system!** 📊✨
