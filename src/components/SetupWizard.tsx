import { useState } from 'react';
import { ThemeConfig } from '../types';

interface SetupWizardProps {
  onComplete: () => void;
  theme: ThemeConfig;
}

export default function SetupWizard({ onComplete, theme }: SetupWizardProps) {
  const [step, setStep] = useState(0);
  const isDark = theme.mode === 'dark';
  const cardBg = isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';

  const steps = [
    {
      title: 'Welcome to MAMA',
      icon: '👋',
      content: 'Multi-Account Mail Agent helps you manage up to 30 email accounts with AI-powered agents.',
    },
    {
      title: 'How It Works',
      icon: '🔧',
      content: 'Each mailbox gets a named AI agent (like Rita, Max, Theta) that READS your emails and takes actions. Your emails stay safe on the server - agents never delete anything.',
    },
    {
      title: 'Supported Providers',
      icon: '📧',
      content: 'Connect Gmail, Outlook, IMAP servers, Yahoo, iCloud, or any custom email provider. Each uses secure authentication.',
    },
    {
      title: 'Read-Only Safety',
      icon: '🛡️',
      content: 'Agents operate in READ-ONLY mode by default. They can:\n• Read and summarize emails\n• Draft replies (you approve before sending)\n• Categorize and organize\n• Create tasks and reminders\n\nThey CANNOT:\n• Delete emails from your server\n• Modify server-side folders\n• Change account settings',
    },
    {
      title: 'Let\'s Add Your First Mailbox',
      icon: '🚀',
      content: 'Click "Get Started" to add your first mailbox. You\'ll need:\n• Your email address\n• Provider type (Gmail, Outlook, IMAP, etc.)\n• Authentication (OAuth or password)\n\nWe\'ll test the connection before saving!',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className={`${cardBg} rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden`}>
        {/* Progress Bar */}
        <div className={`h-1 ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
          <div 
            className="h-full transition-all duration-500"
            style={{ 
              width: `${((step + 1) / steps.length) * 100}%`,
              background: theme.accentColor 
            }}
          ></div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{steps[step].icon}</div>
            <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {steps[step].title}
            </h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Step {step + 1} of {steps.length}
            </p>
          </div>

          <div className={`${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} rounded-xl p-5 mb-6`}>
            <p className={`text-sm leading-relaxed whitespace-pre-line ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {steps[step].content}
            </p>
          </div>

          {/* Safety Notice on Last Step */}
          {step === steps.length - 1 && (
            <div className={`rounded-xl p-4 mb-6 border ${isDark ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200'}`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔒</span>
                <div>
                  <p className={`font-semibold text-sm ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                    Your Data is Safe
                  </p>
                  <p className={`text-xs mt-1 ${isDark ? 'text-green-400/70' : 'text-green-600'}`}>
                    MAMA only READS your emails. Nothing is deleted, moved, or modified on your email server without your explicit approval.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => step > 0 ? setStep(step - 1) : onComplete()}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
            >
              {step === 0 ? 'Skip Setup' : '← Back'}
            </button>

            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-6 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity"
                style={{ background: theme.accentColor }}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={onComplete}
                className="px-6 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity"
                style={{ background: theme.accentColor }}
              >
                🚀 Get Started
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
