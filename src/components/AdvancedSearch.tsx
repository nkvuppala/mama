import { useState } from 'react';
import { Mailbox, Email, SearchFilters, SavedFilter, ThemeConfig } from '../types';

interface AdvancedSearchProps {
  mailboxes: Mailbox[];
  emails: Email[];
  theme: ThemeConfig;
}

export default function AdvancedSearch({ mailboxes, emails, theme }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    mailboxIds: [],
    companies: [],
    dateRange: 'all',
    labels: [],
    unreadOnly: false,
    starredOnly: false,
  });
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState('');
  const isDark = theme.mode === 'dark';
  const cardBg = isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';

  // Get unique companies
  const companies = Array.from(new Set(mailboxes.map(m => m.company)));

  // Filter emails based on current filters
  const filteredEmails = emails.filter(email => {
    // Text search
    if (filters.query) {
      const query = filters.query.toLowerCase();
      const matchesQuery = 
        email.subject.toLowerCase().includes(query) ||
        email.body.toLowerCase().includes(query) ||
        email.from.toLowerCase().includes(query) ||
        email.fromEmail.toLowerCase().includes(query);
      if (!matchesQuery) return false;
    }

    // Mailbox filter
    if (filters.mailboxIds.length > 0 && !filters.mailboxIds.includes(email.mailboxId)) {
      return false;
    }

    // Company filter
    if (filters.companies.length > 0) {
      const mailbox = mailboxes.find(m => m.id === email.mailboxId);
      if (!mailbox || !filters.companies.includes(mailbox.company)) {
        return false;
      }
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const emailDate = new Date(email.date);
      const now = new Date();
      const diffDays = (now.getTime() - emailDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (filters.dateRange === 'today' && diffDays > 1) return false;
      if (filters.dateRange === 'week' && diffDays > 7) return false;
      if (filters.dateRange === 'month' && diffDays > 30) return false;
    }

    // Label filter
    if (filters.labels.length > 0 && !filters.labels.includes(email.label)) {
      return false;
    }

    // Unread filter
    if (filters.unreadOnly && email.read) return false;

    // Starred filter
    if (filters.starredOnly && !email.starred) return false;

    return true;
  });

  const handleSaveFilter = () => {
    if (!saveName.trim()) return;
    const newFilter: SavedFilter = {
      id: `filter-${Date.now()}`,
      name: saveName,
      filters: { ...filters },
    };
    setSavedFilters([...savedFilters, newFilter]);
    setSaveName('');
    setShowSaveDialog(false);
  };

  const handleLoadFilter = (filter: SavedFilter) => {
    setFilters(filter.filters);
  };

  const handleDeleteFilter = (id: string) => {
    setSavedFilters(savedFilters.filter(f => f.id !== id));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      mailboxIds: [],
      companies: [],
      dateRange: 'all',
      labels: [],
      unreadOnly: false,
      starredOnly: false,
    });
  };

  const getMailbox = (id: string) => mailboxes.find(m => m.id === id);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🔍 Advanced Search
        </h1>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          Search across all mailboxes with powerful filters
        </p>
      </div>

      {/* Search Input */}
      <div className={`${cardBg} border rounded-xl p-4 mb-6`}>
        <div className="relative">
          <input
            type="text"
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            placeholder="Search emails by subject, body, sender..."
            className={`w-full pl-12 pr-4 py-3 rounded-lg text-base border ${
              isDark 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
            } focus:outline-none focus:ring-2`}
            style={{ focusRingColor: theme.accentColor } as any}
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
        </div>
      </div>

      {/* Filters */}
      <div className={`${cardBg} border rounded-xl p-4 mb-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Filters
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSaveDialog(true)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              💾 Save Filter
            </button>
            <button
              onClick={clearFilters}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Mailbox Filter */}
          <div>
            <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>
              Mailboxes
            </label>
            <div className={`max-h-32 overflow-y-auto rounded-lg border p-2 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'}`}>
              {mailboxes.map(mb => (
                <label key={mb.id} className="flex items-center gap-2 py-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.mailboxIds.includes(mb.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters({ ...filters, mailboxIds: [...filters.mailboxIds, mb.id] });
                      } else {
                        setFilters({ ...filters, mailboxIds: filters.mailboxIds.filter(id => id !== mb.id) });
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">{mb.agentEmoji}</span>
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {mb.agentName}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Company Filter */}
          <div>
            <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>
              Companies
            </label>
            <div className={`max-h-32 overflow-y-auto rounded-lg border p-2 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'}`}>
              {companies.map(company => (
                <label key={company} className="flex items-center gap-2 py-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.companies.includes(company)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters({ ...filters, companies: [...filters.companies, company] });
                      } else {
                        setFilters({ ...filters, companies: filters.companies.filter(c => c !== company) });
                      }
                    }}
                    className="rounded"
                  />
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {company}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>
              Date Range
            </label>
            <div className="space-y-1">
              {(['today', 'week', 'month', 'all'] as const).map(range => (
                <label key={range} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="dateRange"
                    checked={filters.dateRange === range}
                    onChange={() => setFilters({ ...filters, dateRange: range })}
                    className="rounded"
                  />
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {range === 'today' ? 'Today' : range === 'week' ? 'This Week' : range === 'month' ? 'This Month' : 'All Time'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Labels */}
          <div>
            <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>
              Labels
            </label>
            <div className="space-y-1">
              {['inbox', 'important', 'social', 'promotions'].map(label => (
                <label key={label} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.labels.includes(label)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters({ ...filters, labels: [...filters.labels, label] });
                      } else {
                        setFilters({ ...filters, labels: filters.labels.filter(l => l !== label) });
                      }
                    }}
                    className="rounded"
                  />
                  <span className={`text-sm capitalize ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Status Filters */}
          <div>
            <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>
              Status
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.unreadOnly}
                  onChange={(e) => setFilters({ ...filters, unreadOnly: e.target.checked })}
                  className="rounded"
                />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Unread only
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.starredOnly}
                  onChange={(e) => setFilters({ ...filters, starredOnly: e.target.checked })}
                  className="rounded"
                />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Starred only
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Filters */}
      {savedFilters.length > 0 && (
        <div className={`${cardBg} border rounded-xl p-4 mb-6`}>
          <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            💾 Saved Filters
          </h3>
          <div className="flex flex-wrap gap-2">
            {savedFilters.map(filter => (
              <div
                key={filter.id}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
              >
                <button
                  onClick={() => handleLoadFilter(filter)}
                  className={`text-sm font-medium ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
                >
                  {filter.name}
                </button>
                <button
                  onClick={() => handleDeleteFilter(filter.id)}
                  className={`text-xs ${isDark ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-600'}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      <div className={`${cardBg} border rounded-xl p-4`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Search Results
          </h3>
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {filteredEmails.length} email{filteredEmails.length !== 1 ? 's' : ''} found
          </span>
        </div>

        {filteredEmails.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-5xl mb-4">🔍</p>
            <p className={`text-lg font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              No emails found
            </p>
            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredEmails.map(email => {
              const mb = getMailbox(email.mailboxId);
              return (
                <div
                  key={email.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    isDark ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                      style={{ background: `${mb?.agentColor || '#666'}20` }}
                    >
                      {mb?.agentEmoji || '📧'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {email.from}
                        </span>
                        <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          via {mb?.agentName}
                        </span>
                      </div>
                      <p className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                        {email.subject}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                        {email.preview}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          {new Date(email.date).toLocaleDateString()}
                        </span>
                        {!email.read && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                            Unread
                          </span>
                        )}
                        {email.starred && (
                          <span className="text-xs">⭐</span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                          email.label === 'important' ? 'bg-red-500/20 text-red-400' :
                          email.label === 'social' ? 'bg-blue-500/20 text-blue-400' :
                          email.label === 'promotions' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {email.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Save Filter Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${cardBg} rounded-xl p-6 w-full max-w-md`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Save Filter
            </h3>
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="Filter name..."
              className={`w-full px-3 py-2 rounded-lg border mb-4 ${
                isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:ring-2`}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveFilter}
                disabled={!saveName.trim()}
                className="flex-1 px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 disabled:opacity-50"
                style={{ background: theme.accentColor }}
              >
                Save
              </button>
              <button
                onClick={() => { setShowSaveDialog(false); setSaveName(''); }}
                className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                  isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
