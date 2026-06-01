import React, { useState } from 'react';
import { assignments, courses } from '../data/mockData';

const URGENCY_CONFIG = {
  critical: { color: 'var(--red-text)', bg: 'var(--red-dim)', border: 'var(--red-border)', label: 'CRITICAL' },
  high:     { color: 'var(--orange-text)', bg: 'var(--orange-dim)', border: 'rgba(240,125,58,0.3)', label: 'HIGH' },
  medium:   { color: 'var(--gold)', bg: 'var(--gold-dim)', border: 'var(--gold-border)', label: 'MEDIUM' },
  low:      { color: 'var(--green)', bg: 'var(--green-dim)', border: 'var(--green-border)', label: 'LOW' },
};

function AssignmentCard({ a, expanded, onToggle }) {
  const uc = URGENCY_CONFIG[a.urgency];
  const due = new Date(a.dueDate);
  const dueStr = due.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  const daysUntil = Math.ceil((due - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div style={{
      background: 'var(--cream-faint)',
      border: `0.5px solid ${expanded ? uc.border : 'var(--border)'}`,
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      transition: 'border-color 0.2s',
    }}>
      <div
        onClick={onToggle}
        style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '14px 16px', cursor: 'pointer',
        }}>
        <div style={{
          width: 10, height: 10, borderRadius: '50%',
          background: uc.color, flexShrink: 0, opacity: 0.9,
        }} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '1px',
              color: uc.color, background: uc.bg,
              padding: '1px 6px', borderRadius: 4,
            }}>{uc.label}</span>
            <span className="display" style={{ fontSize: 11, color: 'var(--cream-muted)', fontWeight: 500 }}>{a.course}</span>
          </div>
          <div className="display" style={{ fontSize: 13, fontWeight: 500, color: 'var(--cream)' }}>{a.name}</div>
          <div style={{ fontSize: 11, color: 'var(--cream-muted)', marginTop: 2 }}>
            Due {dueStr} · {daysUntil <= 0 ? 'TODAY' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
          </div>
        </div>

        <div style={{ display: 'flex', flex: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
          <div style={{
            fontSize: 11, fontWeight: 600,
            padding: '4px 10px', borderRadius: 6,
            background: uc.bg, color: uc.color,
          }}>
            {a.hoursNeeded < 1 ? `${a.hoursNeeded * 60}m` : `${a.hoursNeeded}h`}
          </div>
          <div style={{ fontSize: 10, color: 'var(--cream-dim)' }}>{a.weight}% of grade</div>
        </div>

        <div style={{
          fontSize: 16, color: 'var(--cream-dim)',
          transform: expanded ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s',
        }}>▾</div>
      </div>

      {expanded && (
        <div style={{
          padding: '0 16px 16px',
          borderTop: '0.5px solid var(--border)',
          paddingTop: 14,
          display: 'flex', gap: 20,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: 'var(--cream-dim)', letterSpacing: '1px', marginBottom: 8, fontWeight: 600 }}>WHAT TO STUDY</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {a.topics.map((t, i) => (
                <span key={i} style={{
                  fontSize: 11, padding: '4px 10px',
                  background: 'var(--cream-faint)',
                  border: '0.5px solid var(--border)',
                  borderRadius: 6, color: 'var(--cream)',
                }}>{t}</span>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--cream-dim)', letterSpacing: '1px', marginBottom: 8, fontWeight: 600 }}>AI PLAN</div>
            <div style={{
              fontSize: 11, color: 'var(--gold)', fontStyle: 'italic', lineHeight: 1.5,
              borderLeft: '2px solid var(--gold)', paddingLeft: 8, maxWidth: 220,
            }}>
              Start this {daysUntil <= 1 ? 'now' : daysUntil <= 3 ? 'tomorrow' : 'this weekend'}.
              {a.hoursNeeded >= 4 ? ' Break it into 2 sessions.' : ' One focused session is enough.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Assignments() {
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('all');

  const filtered = assignments.filter(a => filter === 'all' || a.urgency === filter);
  const totalHours = assignments.reduce((s, a) => s + a.hoursNeeded, 0);

  return (
    <div className="fade-up" style={{ padding: '24px 28px', overflowY: 'auto', height: '100%' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 className="display" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.3px', marginBottom: 4 }}>
          Assignments
        </h1>
        <p style={{ fontSize: 13, color: 'var(--cream-muted)' }}>
          Ranked by urgency, not just due date. {totalHours} total hours needed this week.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'TOTAL DUE', val: assignments.length, color: 'var(--cream)' },
          { label: 'CRITICAL', val: assignments.filter(a => a.urgency === 'critical').length, color: 'var(--red-text)' },
          { label: 'HOURS NEEDED', val: `${totalHours}h`, color: 'var(--gold)' },
          { label: 'COMPLETED', val: assignments.filter(a => a.completed).length, color: 'var(--green)' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--cream-faint)', border: '0.5px solid var(--border)',
            borderRadius: 'var(--radius-md)', padding: '12px', textAlign: 'center',
          }}>
            <div className="display" style={{ fontSize: 8, color: 'var(--cream-dim)', letterSpacing: '1.5px', marginBottom: 6, fontWeight: 600 }}>{s.label}</div>
            <div className="metric" style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {['all', 'critical', 'high', 'medium', 'low'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '4px 14px', borderRadius: 20,
            border: `0.5px solid ${filter === f ? 'var(--gold-border)' : 'var(--border)'}`,
            background: filter === f ? 'var(--gold-dim)' : 'transparent',
            color: filter === f ? 'var(--gold)' : 'var(--cream-muted)',
            fontSize: 10, fontWeight: 600, letterSpacing: '0.5px', cursor: 'pointer',
          }}>{f.toUpperCase()}</button>
        ))}
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(a => (
          <AssignmentCard
            key={a.id} a={a}
            expanded={expanded === a.id}
            onToggle={() => setExpanded(expanded === a.id ? null : a.id)}
          />
        ))}
      </div>
    </div>
  );
}
