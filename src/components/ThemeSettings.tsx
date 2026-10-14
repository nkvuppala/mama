import { ThemeConfig, ThemeMode, ACCENT_COLORS } from '../types';

interface ThemeSettingsProps {
  theme: ThemeConfig;
  onUpdate: (theme: ThemeConfig) => void;
}

export default function ThemeSettings({ theme, onUpdate }: ThemeSettingsProps) {
  const isDark = theme.mode === 'dark';
  const cardBg = isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';

  const presets = [
    { name: 'Midnight Blue', mode: 'dark' as ThemeMode, accent: '#3b82f6' },
    { name: 'Deep Purple', mode: 'dark' as ThemeMode, accent: '#8b5cf6' },
    { name: 'Rose Garden', mode: 'dark' as ThemeMode, accent: '#ec4899' },
    { name: 'Emerald Night', mode: 'dark' as ThemeMode, accent: '#22c55e' },
    { name: 'Ocean Breeze', mode: 'dark' as ThemeMode, accent: '#06b6d4' },
    { name: 'Sunset Glow', mode: 'dark' as ThemeMode, accent: '#f97316' },
    { name: 'Clean Light', mode: 'light' as ThemeMode, accent: '#3b82f6' },
    { name: 'Soft Lavender', mode: 'light' as ThemeMode, accent: '#8b5cf6' },
    { name: 'Fresh Mint', mode: 'light' as ThemeMode, accent: '#14b8a6' },
    { name: 'Warm Amber', mode: 'light' as ThemeMode, accent: '#f59e0b' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🎨 Appearance
        </h1>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          Customize your workspace with light/dark mode and personalized colors
        </p>
      </div>

      {/* Preview Card */}
      <div className={`${cardBg} border rounded-xl p-6 mb-8`}>
        <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          👀 Live Preview
        </h3>
        <div className={`rounded-xl p-5 border`} style={{ 
          background: isDark ? '#111827' : '#f9fafb',
          borderColor: `${theme.accentColor}30`
        }}>
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
              style={{ background: theme.accentColor }}
            >
              ⚡
            </div>
            <div>
              <p className="font-bold" style={{ color: isDark ? '#fff' : '#111' }}>MailAgent</p>
              <p style={{ color: isDark ? '#6b7280' : '#9ca3af' }} className="text-xs">Preview Mode</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg p-3" style={{ background: `${theme.accentColor}15`, border: `1px solid ${theme.accentColor}30` }}>
              <p className="text-2xl font-bold" style={{ color: theme.accentColor }}>57</p>
              <p className="text-xs" style={{ color: isDark ? '#6b7280' : '#9ca3af' }}>Unread</p>
            </div>
            <div className="rounded-lg p-3" style={{ background: `${theme.accentColor}15`, border: `1px solid ${theme.accentColor}30` }}>
              <p className="text-2xl font-bold" style={{ color: theme.accentColor }}>8</p>
              <p className="text-xs" style={{ color: isDark ? '#6b7280' : '#9ca3af' }}>Agents</p>
            </div>
            <div className="rounded-lg p-3" style={{ background: `${theme.accentColor}15`, border: `1px solid ${theme.accentColor}30` }}>
              <p className="text-2xl font-bold" style={{ color: theme.accentColor }}>45</p>
              <p className="text-xs" style={{ color: isDark ? '#6b7280' : '#9ca3af' }}>Actions</p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button 
              className="px-4 py-2 rounded-lg text-white text-sm font-medium"
              style={{ background: theme.accentColor }}
            >
              Primary Button
            </button>
            <button 
              className="px-4 py-2 rounded-lg text-sm font-medium border"
              style={{ borderColor: `${theme.accentColor}50`, color: theme.accentColor }}
            >
              Secondary
            </button>
          </div>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className={`${cardBg} border rounded-xl p-6 mb-6`}>
        <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🌓 Mode
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onUpdate({ ...theme, mode: 'dark' })}
            className={`p-5 rounded-xl border-2 transition-all ${
              theme.mode === 'dark' ? 'border-current' : 'border-transparent'
            }`}
            style={theme.mode === 'dark' ? { borderColor: theme.accentColor, background: '#111827' } : { background: '#111827' }}
          >
            <div className="text-4xl mb-2">🌙</div>
            <p className="font-semibold text-white">Dark Mode</p>
            <p className="text-sm text-gray-500">Easy on the eyes</p>
          </button>
          <button
            onClick={() => onUpdate({ ...theme, mode: 'light' })}
            className={`p-5 rounded-xl border-2 transition-all ${
              theme.mode === 'light' ? 'border-current' : 'border-transparent'
            }`}
            style={theme.mode === 'light' ? { borderColor: theme.accentColor, background: '#f9fafb' } : { background: '#f9fafb' }}
          >
            <div className="text-4xl mb-2">☀️</div>
            <p className="font-semibold text-gray-900">Light Mode</p>
            <p className="text-sm text-gray-500">Classic and clean</p>
          </button>
        </div>
      </div>

      {/* Accent Color */}
      <div className={`${cardBg} border rounded-xl p-6 mb-6`}>
        <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🎨 Accent Color
        </h3>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-3 mb-4">
          {ACCENT_COLORS.map(color => (
            <button
              key={color.value}
              onClick={() => onUpdate({ ...theme, accentColor: color.value, accentName: color.name })}
              className={`w-full aspect-square rounded-xl transition-all hover:scale-110 ${
                theme.accentColor === color.value ? 'ring-4 ring-offset-2 scale-110' : ''
              }`}
              style={{ background: color.value }}
              title={color.name}
            />
          ))}
        </div>
        
        {/* Custom Color */}
        <div className="flex items-center gap-3">
          <label className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Custom:</label>
          <input
            type="color"
            value={theme.accentColor}
            onChange={(e) => {
              const color = ACCENT_COLORS.find(c => c.value === e.target.value);
              onUpdate({ ...theme, accentColor: e.target.value, accentName: color?.name || 'Custom' });
            }}
            className="w-10 h-10 rounded-lg cursor-pointer border-0"
          />
          <span className={`text-sm font-mono ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {theme.accentColor}
          </span>
          <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            ({theme.accentName})
          </span>
        </div>
      </div>

      {/* Presets */}
      <div className={`${cardBg} border rounded-xl p-6`}>
        <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          ✨ Quick Presets
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {presets.map(preset => (
            <button
              key={preset.name}
              onClick={() => onUpdate({ mode: preset.mode, accentColor: preset.accent, accentName: preset.name })}
              className={`p-3 rounded-xl border transition-all hover:scale-105 ${
                theme.mode === preset.mode && theme.accentColor === preset.accent
                  ? 'border-2'
                  : isDark ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'
              }`}
              style={
                theme.mode === preset.mode && theme.accentColor === preset.accent
                  ? { borderColor: preset.accent, background: `${preset.accent}15` }
                  : { background: preset.mode === 'dark' ? '#111827' : '#f9fafb' }
              }
            >
              <div 
                className="w-6 h-6 rounded-full mx-auto mb-2"
                style={{ background: preset.accent }}
              ></div>
              <p className={`text-xs font-medium text-center ${
                preset.mode === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {preset.name}
              </p>
              <p className={`text-xs text-center ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                {preset.mode === 'dark' ? '🌙' : '☀️'}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
