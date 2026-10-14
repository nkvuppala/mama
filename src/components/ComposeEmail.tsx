import { useState } from 'react';
import { Mailbox, Email, ThemeConfig, ComposedEmail } from '../types';

interface ComposeEmailProps {
  mailboxes: Mailbox[];
  replyTo?: Email | null;
  onClose: () => void;
  onSend: (email: ComposedEmail) => void;
  theme: ThemeConfig;
}

export default function ComposeEmail({ mailboxes, replyTo, onClose, onSend, theme }: ComposeEmailProps) {
  const [fromMailboxId, setFromMailboxId] = useState(replyTo?.mailboxId || mailboxes[0]?.id || '');
  const [to, setTo] = useState(replyTo?.fromEmail || '');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState(replyTo ? `Re: ${replyTo.subject}` : '');
  const [body, setBody] = useState('');
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const isDark = theme.mode === 'dark';
  const fromMailbox = mailboxes.find(m => m.id === fromMailboxId);

  const generateSignature = () => {
    if (!fromMailbox) return '';
    const sig = fromMailbox.signature;
    
    if (sig.customHtml) {
      return `\n\n--\n${sig.customHtml}`;
    }

    let signature = '\n\n--\n';
    signature += sig.name || '';
    if (sig.title) signature += `\n${sig.title}`;
    if (sig.company) signature += `\n${sig.company}`;
    if (sig.phone) signature += `\n📱 ${sig.phone}`;
    if (sig.website) signature += `\n🌐 ${sig.website}`;
    
    return signature;
  };

  const generateReplyBody = () => {
    if (!replyTo || !fromMailbox) return '';
    
    const prefix = fromMailbox.replyPrefix
      .replace('{date}', new Date(replyTo.date).toLocaleString())
      .replace('{from}', replyTo.from);
    
    return `${body}${generateSignature()}\n\n${prefix}\n> ${replyTo.body.split('\n').join('\n> ')}`;
  };

  const handleSend = () => {
    if (!to || !subject || !fromMailbox) return;
    
    setIsSending(true);
    setSendStatus('sending');

    // Simulate sending process
    setTimeout(() => {
      const fullBody = replyTo ? generateReplyBody() : body + generateSignature();
      
      onSend({
        to,
        cc: cc || undefined,
        bcc: bcc || undefined,
        subject,
        body: fullBody,
        fromMailboxId,
        isReply: !!replyTo,
        replyToEmailId: replyTo?.id,
      });

      setSendStatus('sent');
      setIsSending(false);

      // Close after showing success
      setTimeout(() => {
        onClose();
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {replyTo ? '✉️ Reply' : '✉️ Compose Email'}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
          >
            ✕
          </button>
        </div>

        {/* Sending Status */}
        {sendStatus === 'sending' && (
          <div className="bg-blue-500/10 border-b border-blue-500/30 px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              <span className="text-sm text-blue-400">
                {fromMailbox?.agentEmoji} {fromMailbox?.agentName} is sending via {fromMailbox?.type.toUpperCase()}...
              </span>
            </div>
          </div>
        )}
        {sendStatus === 'sent' && (
          <div className="bg-green-500/10 border-b border-green-500/30 px-4 py-2">
            <span className="text-sm text-green-400">✅ Email sent successfully!</span>
          </div>
        )}

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* From */}
          <div className="flex items-center gap-3">
            <label className={`text-sm font-medium w-16 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>From:</label>
            <select
              value={fromMailboxId}
              onChange={(e) => setFromMailboxId(e.target.value)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} focus:outline-none`}
            >
              {mailboxes.map(mb => (
                <option key={mb.id} value={mb.id}>
                  {mb.agentEmoji} {mb.agentName} ({mb.emailAddress})
                </option>
              ))}
            </select>
          </div>

          {/* To */}
          <div className="flex items-center gap-3">
            <label className={`text-sm font-medium w-16 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>To:</label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              className={`flex-1 rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900'} focus:outline-none`}
            />
            {!showCc && !showBcc && (
              <div className="flex gap-2">
                <button onClick={() => setShowCc(true)} className="text-xs text-blue-500 hover:underline">Cc</button>
                <button onClick={() => setShowBcc(true)} className="text-xs text-blue-500 hover:underline">Bcc</button>
              </div>
            )}
          </div>

          {/* CC */}
          {showCc && (
            <div className="flex items-center gap-3">
              <label className={`text-sm font-medium w-16 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Cc:</label>
              <input
                type="email"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                placeholder="cc@example.com"
                className={`flex-1 rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900'} focus:outline-none`}
              />
            </div>
          )}

          {/* BCC */}
          {showBcc && (
            <div className="flex items-center gap-3">
              <label className={`text-sm font-medium w-16 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Bcc:</label>
              <input
                type="email"
                value={bcc}
                onChange={(e) => setBcc(e.target.value)}
                placeholder="bcc@example.com"
                className={`flex-1 rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900'} focus:outline-none`}
              />
            </div>
          )}

          {/* Subject */}
          <div className="flex items-center gap-3">
            <label className={`text-sm font-medium w-16 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Subject:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
              className={`flex-1 rounded-lg px-3 py-2 text-sm border ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900'} focus:outline-none`}
            />
          </div>

          {/* Body */}
          <div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your message here..."
              className={`w-full rounded-lg px-3 py-2 text-sm border resize-none ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900'} focus:outline-none`}
              rows={12}
            />
          </div>

          {/* Out of Office Warning */}
          {fromMailbox?.outOfOffice.enabled && (
            <div className={`rounded-lg p-3 border ${isDark ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span>🏖️</span>
                <span className={`text-sm font-medium ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>
                  Out of Office Active
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-yellow-400/70' : 'text-yellow-600'}`}>
                Auto-reply is enabled ({fromMailbox.outOfOffice.startDate} → {fromMailbox.outOfOffice.endDate}). 
                Senders will receive: "{fromMailbox.outOfOffice.subject}"
              </p>
            </div>
          )}

          {/* Signature Preview */}
          {fromMailbox && (
            <div className={`rounded-lg p-3 border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium" style={{ color: fromMailbox.agentColor }}>
                  {fromMailbox.agentEmoji} {fromMailbox.agentName}'s Signature
                </span>
              </div>
              <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} whitespace-pre-line`}>
                {fromMailbox.signature.name}
                {fromMailbox.signature.title && `\n${fromMailbox.signature.title}`}
                {fromMailbox.signature.company && `\n${fromMailbox.signature.company}`}
                {fromMailbox.signature.phone && `\n📱 ${fromMailbox.signature.phone}`}
                {fromMailbox.signature.website && `\n🌐 ${fromMailbox.signature.website}`}
              </div>
            </div>
          )}

          {/* Original Message (if replying) */}
          {replyTo && (
            <div className={`rounded-lg p-3 border ${isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-100 border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Original message from {replyTo.from}
                </span>
              </div>
              <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} whitespace-pre-line border-l-2 pl-2 ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
                {replyTo.body}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between p-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            Sending via {fromMailbox?.type.toUpperCase()} • {fromMailbox?.emailAddress}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              disabled={isSending}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} disabled:opacity-50`}
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={!to || !subject || isSending}
              className="px-6 py-2 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: theme.accentColor }}
            >
              {isSending ? 'Sending...' : '📤 Send Email'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
