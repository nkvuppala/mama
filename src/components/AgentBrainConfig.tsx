import { useState } from 'react';
import { Mailbox, AgentBrain, LLMConfig, ThemeConfig } from '../types';

interface AgentBrainConfigProps {
  mailbox: Mailbox;
  onUpdate: (updates: Partial<Mailbox>) => void;
  theme: ThemeConfig;
}

export default function AgentBrainConfig({ mailbox, onUpdate, theme }: AgentBrainConfigProps) {
  const isDark = theme.mode === 'dark';
  const cardBg = isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  
  const [brain, setBrain] = useState<AgentBrain>(mailbox.brain || {
    companyInfo: '',
    products: [],
    faqs: [],
    pastEmails: [],
    tone: 'professional',
    responseStyle: 'balanced',
    language: 'English',
    rules: [],
    learnFromReplies: true,
    confidenceThreshold: 0.7,
  });

  const [llmConfig, setLLMConfig] = useState<LLMConfig>(mailbox.llmConfig || {
    provider: 'openai',
    apiKey: '',
    model: 'gpt-4',
    maxTokens: 2000,
    temperature: 0.7,
  });

  const [showApiKey, setShowApiKey] = useState(false);

  const updateBrain = (updates: Partial<AgentBrain>) => {
    const newBrain = { ...brain, ...updates };
    setBrain(newBrain);
    onUpdate({ brain: newBrain });
  };

  const updateLLM = (updates: Partial<LLMConfig>) => {
    const newConfig = { ...llmConfig, ...updates };
    setLLMConfig(newConfig);
    onUpdate({ llmConfig: newConfig });
  };

  const addFAQ = () => {
    updateBrain({ faqs: [...brain.faqs, { question: '', answer: '' }] });
  };

  const updateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    const newFaqs = [...brain.faqs];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    updateBrain({ faqs: newFaqs });
  };

  const removeFAQ = (index: number) => {
    updateBrain({ faqs: brain.faqs.filter((_, i) => i !== index) });
  };

  const addRule = () => {
    updateBrain({
      rules: [...brain.rules, {
        id: `rule-${Date.now()}`,
        name: 'New Rule',
        condition: '',
        action: 'reply',
        response: '',
        priority: brain.rules.length,
        enabled: true,
      }]
    });
  };

  const updateRule = (index: number, updates: Partial<typeof brain.rules[0]>) => {
    const newRules = [...brain.rules];
    newRules[index] = { ...newRules[index], ...updates };
    updateBrain({ rules: newRules });
  };

  const removeRule = (index: number) => {
    updateBrain({ rules: brain.rules.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      {/* LLM Configuration */}
      <div className={`${cardBg} border rounded-xl p-5`}>
        <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🤖 LLM Configuration
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>
              AI Provider
            </label>
            <select
              value={llmConfig.provider}
              onChange={(e) => updateLLM({ provider: e.target.value as any })}
              className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} focus:outline-none`}
            >
              <option value="openai">OpenAI (GPT-4, GPT-3.5)</option>
              <option value="gemini">Google Gemini</option>
              <option value="claude">Anthropic Claude</option>
              <option value="custom">Custom API</option>
            </select>
          </div>

          <div>
            <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>
              API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={llmConfig.apiKey}
                onChange={(e) => updateLLM({ apiKey: e.target.value })}
                placeholder="sk-..."
                className={`w-full rounded-lg px-3 py-2 pr-20 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'} focus:outline-none`}
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className={`absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded text-xs ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {showApiKey ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              🔒 Your API key is stored locally and never sent to our servers
            </p>
          </div>

          <div>
            <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>
              Model
            </label>
            <input
              type="text"
              value={llmConfig.model}
              onChange={(e) => updateLLM({ model: e.target.value })}
              placeholder="gpt-4"
              className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'} focus:outline-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>
                Max Tokens
              </label>
              <input
                type="number"
                value={llmConfig.maxTokens}
                onChange={(e) => updateLLM({ maxTokens: Number(e.target.value) })}
                className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} focus:outline-none`}
              />
            </div>
            <div>
              <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>
                Temperature (0-1)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={llmConfig.temperature}
                onChange={(e) => updateLLM({ temperature: Number(e.target.value) })}
                className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} focus:outline-none`}
              />
            </div>
          </div>

          {!llmConfig.apiKey && (
            <div className={`p-3 rounded-lg border ${isDark ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200'}`}>
              <p className={`text-xs ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>
                ⚠️ No API key configured. Agent will use demo mode with predefined responses.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Agent Brain - Knowledge Base */}
      <div className={`${cardBg} border rounded-xl p-5`}>
        <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🧠 Agent Brain - Knowledge Base
        </h3>

        <div className="space-y-4">
          <div>
            <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>
              Company Information
            </label>
            <textarea
              value={brain.companyInfo}
              onChange={(e) => updateBrain({ companyInfo: e.target.value })}
              placeholder="Describe your company, products, services, values, etc. This helps the agent understand context."
              className={`w-full rounded-lg px-3 py-2 text-sm border resize-none h-24 ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'} focus:outline-none`}
            />
          </div>

          <div>
            <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>
              Products/Services (one per line)
            </label>
            <textarea
              value={brain.products.join('\n')}
              onChange={(e) => updateBrain({ products: e.target.value.split('\n').filter(p => p.trim()) })}
              placeholder="Product 1&#10;Product 2&#10;Service A"
              className={`w-full rounded-lg px-3 py-2 text-sm border resize-none h-20 ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'} focus:outline-none`}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                FAQs (Frequently Asked Questions)
              </label>
              <button
                onClick={addFAQ}
                className="text-xs px-3 py-1 rounded-lg text-white hover:opacity-90"
                style={{ background: theme.accentColor }}
              >
                + Add FAQ
              </button>
            </div>
            <div className="space-y-2">
              {brain.faqs.map((faq, index) => (
                <div key={index} className={`p-3 rounded-lg border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-start gap-2">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                        placeholder="Question"
                        className={`w-full rounded px-2 py-1 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'} focus:outline-none`}
                      />
                      <textarea
                        value={faq.answer}
                        onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                        placeholder="Answer"
                        className={`w-full rounded px-2 py-1 text-sm border resize-none h-16 ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'} focus:outline-none`}
                      />
                    </div>
                    <button
                      onClick={() => removeFAQ(index)}
                      className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
              {brain.faqs.length === 0 && (
                <p className={`text-xs text-center py-4 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  No FAQs yet. Click "+ Add FAQ" to add common questions and answers.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Personality & Tone */}
      <div className={`${cardBg} border rounded-xl p-5`}>
        <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🎭 Personality & Tone
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>
              Tone
            </label>
            <select
              value={brain.tone}
              onChange={(e) => updateBrain({ tone: e.target.value as any })}
              className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} focus:outline-none`}
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="casual">Casual</option>
              <option value="formal">Formal</option>
            </select>
          </div>

          <div>
            <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>
              Response Style
            </label>
            <select
              value={brain.responseStyle}
              onChange={(e) => updateBrain({ responseStyle: e.target.value as any })}
              className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} focus:outline-none`}
            >
              <option value="concise">Concise</option>
              <option value="balanced">Balanced</option>
              <option value="detailed">Detailed</option>
            </select>
          </div>

          <div>
            <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>
              Language
            </label>
            <input
              type="text"
              value={brain.language}
              onChange={(e) => updateBrain({ language: e.target.value })}
              placeholder="English"
              className={`w-full rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'} focus:outline-none`}
            />
          </div>
        </div>
      </div>

      {/* Rule Engine */}
      <div className={`${cardBg} border rounded-xl p-5`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            ⚙️ Rule Engine
          </h3>
          <button
            onClick={addRule}
            className="text-xs px-3 py-1 rounded-lg text-white hover:opacity-90"
            style={{ background: theme.accentColor }}
          >
            + Add Rule
          </button>
        </div>

        <p className={`text-xs mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Rules are evaluated in priority order (higher number = checked first). First matching rule is executed.
        </p>

        <div className="space-y-3">
          {brain.rules.map((rule, index) => (
            <div key={rule.id} className={`p-4 rounded-lg border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={rule.name}
                      onChange={(e) => updateRule(index, { name: e.target.value })}
                      placeholder="Rule name"
                      className={`rounded px-2 py-1 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'} focus:outline-none`}
                    />
                    <input
                      type="number"
                      value={rule.priority}
                      onChange={(e) => updateRule(index, { priority: Number(e.target.value) })}
                      placeholder="Priority"
                      className={`rounded px-2 py-1 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none`}
                    />
                  </div>
                  <input
                    type="text"
                    value={rule.condition}
                    onChange={(e) => updateRule(index, { condition: e.target.value })}
                    placeholder="Condition (e.g., contains('urgent'), from.includes('boss@'))"
                    className={`w-full rounded px-2 py-1 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'} focus:outline-none`}
                  />
                  <select
                    value={rule.action}
                    onChange={(e) => updateRule(index, { action: e.target.value as any })}
                    className={`w-full rounded px-2 py-1 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none`}
                  >
                    <option value="reply">Reply</option>
                    <option value="escalate">Escalate</option>
                    <option value="ignore">Ignore</option>
                    <option value="categorize">Categorize</option>
                    <option value="forward">Forward</option>
                  </select>
                  {rule.action === 'reply' && (
                    <textarea
                      value={rule.response || ''}
                      onChange={(e) => updateRule(index, { response: e.target.value })}
                      placeholder="Response template (use {name}, {company}, etc. for variables)"
                      className={`w-full rounded px-2 py-1 text-sm border resize-none h-16 ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'} focus:outline-none`}
                    />
                  )}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      onChange={(e) => updateRule(index, { enabled: e.target.checked })}
                      className="rounded"
                    />
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Enabled</span>
                  </label>
                </div>
                <button
                  onClick={() => removeRule(index)}
                  className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
          {brain.rules.length === 0 && (
            <p className={`text-xs text-center py-4 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              No rules yet. Click "+ Add Rule" to create automated responses.
            </p>
          )}
        </div>
      </div>

      {/* Learning Settings */}
      <div className={`${cardBg} border rounded-xl p-5`}>
        <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          📚 Learning & Autonomy
        </h3>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={brain.learnFromReplies}
              onChange={(e) => updateBrain({ learnFromReplies: e.target.checked })}
              className="rounded"
            />
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Learn from approved replies
              </p>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                Agent improves responses based on your corrections
              </p>
            </div>
          </label>

          <div>
            <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>
              Confidence Threshold ({(brain.confidenceThreshold * 100).toFixed(0)}%)
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={brain.confidenceThreshold}
              onChange={(e) => updateBrain({ confidenceThreshold: Number(e.target.value) })}
              className="w-full"
            />
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Agent asks for approval when confidence is below this threshold
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
