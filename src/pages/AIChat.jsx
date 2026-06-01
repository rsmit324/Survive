import React, { useState, useRef, useEffect } from 'react';
import { chatHistory, assignments, courses, weekendReport, currentUser } from '../data/mockData';

const QUICK_PROMPTS = [
  "Can I skip class tomorrow?",
  "What should I study this weekend?",
  "Am I going to be okay for Econ?",
  "Roast my current schedule",
  "What's my survival plan for tonight?",
  "Is it okay to go out Friday?",
];

const SYSTEM_PROMPT = `You are Survive — an AI college copilot that acts like the student's closest, most organized friend. You are brutally honest but always on the student's side. You never lecture. You never say "you shouldn't go out" — instead you tell them exactly what they need to do to stay academically alive while still having fun.

Your personality: funny, direct, a little sarcastic, deeply caring. You sound like a smart older friend who's been through college and wants them to win. Use casual language. Keep responses concise. Lead with the answer, not the caveats.

You have access to this student's data:
Student: ${currentUser.name}, ${currentUser.year}, ${currentUser.major}, ${currentUser.greek}
Current GPA: ${currentUser.gpa}

Courses & Grades:
${courses.map(c => `- ${c.name} (${c.fullName}): ${c.grade} (${c.gradeNum}%), trend: ${c.trend}`).join('\n')}

Upcoming Assignments:
${assignments.map(a => `- ${a.course}: ${a.name}, due in ~${Math.ceil((new Date(a.dueDate) - new Date()) / (1000*60*60*24))} days, ${a.hoursNeeded}h needed, ${a.weight}% of grade, urgency: ${a.urgency}`).join('\n')}

Weekend survival score: ${weekendReport.survivalScore}/100
Weekend summary: ${weekendReport.aiSummary}

Your job: Help ${currentUser.name.split(' ')[0]} balance academics and social life. Give real, actionable advice. Be specific. Be real. Never be preachy.`;

function Message({ msg }) {
  const isAI = msg.role === 'assistant';
  return (
    <div style={{
      display: 'flex',
      justifyContent: isAI ? 'flex-start' : 'flex-end',
      marginBottom: 14,
    }}>
      {isAI && (
        <div style={{
          width: 28, height: 28,
          borderRadius: '50%',
          background: 'var(--gold-dim)',
          border: '0.5px solid var(--gold-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, color: 'var(--gold)',
          flexShrink: 0, marginRight: 10, marginTop: 2,
        }}>✦</div>
      )}
      <div style={{
        maxWidth: '75%',
        padding: '12px 14px',
        borderRadius: isAI ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
        background: isAI ? 'var(--cream-faint)' : 'var(--gold-dim)',
        border: `0.5px solid ${isAI ? 'var(--border)' : 'var(--gold-border)'}`,
        fontSize: 13, lineHeight: 1.6,
        color: isAI ? 'var(--cream)' : 'var(--cream)',
      }}>
        {msg.message}
        <div style={{ fontSize: 10, color: 'var(--cream-dim)', marginTop: 6, textAlign: 'right' }}>
          {msg.timestamp}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        background: 'var(--gold-dim)', border: '0.5px solid var(--gold-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, color: 'var(--gold)', flexShrink: 0,
      }}>✦</div>
      <div style={{
        padding: '12px 16px',
        background: 'var(--cream-faint)', border: '0.5px solid var(--border)',
        borderRadius: '4px 14px 14px 14px',
        display: 'flex', gap: 4, alignItems: 'center',
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--gold)', opacity: 0.6,
            animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

export default function AIChat() {
  const [messages, setMessages] = useState(chatHistory);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      message: text,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const conversationHistory = [...messages, userMsg].map(m => ({
      role: m.role,
      content: m.message,
    }));

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: conversationHistory,
        }),
      });

      const data = await response.json();
      const reply = data.content?.map(b => b.text || '').join('') || "Something went wrong. Try again.";

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        message: reply,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        message: "My brain glitched. Try asking again — I'm usually smarter than this.",
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      }]);
    }

    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="fade-up" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        padding: '20px 24px 16px',
        borderBottom: '0.5px solid var(--border)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div className="pulse" style={{
            width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)',
          }} />
          <h1 className="display" style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.2px' }}>
            Ask Survive
          </h1>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '1px',
            color: 'var(--green)', background: 'var(--green-dim)',
            border: '0.5px solid var(--green-border)',
            padding: '2px 7px', borderRadius: 4,
          }}>ONLINE</span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--cream-muted)', paddingLeft: 18 }}>
          Your honest AI college copilot. Knows your schedule, grades, and how much fun you deserve.
        </p>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '20px 24px',
        display: 'flex', flexDirection: 'column',
      }}>
        {messages.map(msg => <Message key={msg.id} msg={msg} />)}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div style={{
        padding: '0 24px 12px',
        display: 'flex', gap: 6, flexWrap: 'wrap',
        flexShrink: 0,
      }}>
        {QUICK_PROMPTS.map(p => (
          <button
            key={p}
            onClick={() => sendMessage(p)}
            disabled={loading}
            style={{
              fontSize: 11, padding: '5px 12px',
              borderRadius: 20,
              border: '0.5px solid var(--border)',
              background: 'var(--cream-faint)',
              color: 'var(--cream-muted)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.borderColor = 'var(--gold-border)'; e.currentTarget.style.color = 'var(--gold)'; }}}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--cream-muted)'; }}
          >{p}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{
        padding: '0 24px 20px',
        flexShrink: 0,
      }}>
        <div style={{
          display: 'flex', gap: 10,
          background: 'var(--cream-faint)',
          border: '0.5px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '10px 14px',
          transition: 'border-color 0.2s',
        }}
        onFocusCapture={e => e.currentTarget.style.borderColor = 'var(--gold-border)'}
        onBlurCapture={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask anything — 'Can I survive if I skip studying Saturday?'"
            disabled={loading}
            rows={1}
            style={{
              flex: 1, resize: 'none',
              fontSize: 13, lineHeight: 1.5,
              color: 'var(--cream)',
              background: 'transparent',
              border: 'none', outline: 'none',
              fontFamily: 'var(--font-body)',
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            style={{
              background: input.trim() && !loading ? 'var(--gold)' : 'var(--cream-faint)',
              border: 'none',
              borderRadius: 8,
              width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              color: input.trim() && !loading ? 'var(--black)' : 'var(--cream-dim)',
              fontSize: 14, fontWeight: 700,
              transition: 'all 0.15s',
              flexShrink: 0,
              alignSelf: 'flex-end',
            }}>↑</button>
        </div>
        <div style={{ fontSize: 10, color: 'var(--cream-dim)', marginTop: 6, textAlign: 'center' }}>
          Enter to send · Survive knows your schedule, grades &amp; social calendar
        </div>
      </div>
    </div>
  );
}
