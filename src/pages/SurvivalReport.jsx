import React, { useState } from 'react';
import { weekendReport, events } from '../data/mockData';

function ThreatCard({ threat }) {
  const colors = {
    critical: { bg: 'var(--red-dim)', border: 'var(--red-border)', color: 'var(--red-text)', label: 'CRITICAL' },
    medium: { bg: 'var(--gold-dim)', border: 'var(--gold-border)', color: 'var(--gold)', label: 'WATCH' },
    low: { bg: 'var(--green-dim)', border: 'var(--green-border)', color: 'var(--green)', label: 'OK' },
  };
  const c = colors[threat.severity];
  return (
    <div style={{
      background: c.bg, border: `0.5px solid ${c.border}`,
      borderRadius: 'var(--radius-md)', padding: '12px 14px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        {/* Course name — Space Grotesk (display) */}
        <span className="display" style={{ fontSize: 12, fontWeight: 600, color: 'var(--cream)' }}>{threat.course}</span>
        <span style={{
          fontSize: 8, fontWeight: 600, letterSpacing: '1.5px',
          color: c.color, background: 'rgba(0,0,0,0.2)',
          padding: '2px 6px', borderRadius: 4,
          fontFamily: 'var(--font-display)',
        }}>{c.label}</span>
      </div>
      {/* Threat description — Inter (body, inherited) */}
      <p style={{ fontSize: 12, color: 'var(--cream)', opacity: 0.8, lineHeight: 1.5 }}>{threat.threat}</p>
    </div>
  );
}

function RecoveryItem({ item, onToggle }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '12px 14px',
      background: item.done ? 'var(--green-dim)' : 'var(--cream-faint)',
      border: `0.5px solid ${item.done ? 'var(--green-border)' : 'var(--border)'}`,
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      transition: 'all 0.2s',
    }} onClick={() => onToggle(item.id)}>
      <div style={{
        width: 18, height: 18,
        borderRadius: 5,
        border: `0.5px solid ${item.done ? 'var(--green-border)' : 'var(--border-hover)'}`,
        background: item.done ? 'rgba(61,220,132,0.2)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: 1,
        fontSize: 10, color: 'var(--green)',
      }}>{item.done ? '✓' : ''}</div>
      <div style={{ flex: 1 }}>
        {/* Time — Inter (body, inherited) */}
        <div style={{ fontSize: 10, color: 'var(--cream-dim)', marginBottom: 2, fontWeight: 500 }}>{item.time}</div>
        {/* Action — Inter (body, inherited) */}
        <div style={{
          fontSize: 12, lineHeight: 1.5,
          color: item.done ? 'var(--cream-muted)' : 'var(--cream)',
          textDecoration: item.done ? 'line-through' : 'none',
        }}>{item.action}</div>
      </div>
    </div>
  );
}

export default function SurvivalReport() {
  const [plan, setPlan] = useState(weekendReport.recoveryPlan);

  const toggle = (id) => {
    setPlan(p => p.map(i => i.id === id ? { ...i, done: !i.done } : i));
  };

  const doneCount = plan.filter(i => i.done).length;

  const weekendEvents = events.filter(e =>
    ['2026-05-30', '2026-05-31', '2026-06-01'].includes(e.date)
  );

  const typeConfig = {
    class:      { label: 'CLASS',     cls: 'tag-class' },
    social:     { label: 'SOCIAL',    cls: 'tag-social' },
    greek:      { label: 'GREEK',     cls: 'tag-greek' },
    sport:      { label: 'SPORT',     cls: 'tag-sport' },
    recruiting: { label: 'RECRUIT',   cls: 'tag-recruiting' },
    study:      { label: 'AI STUDY',  cls: 'tag-study' },
  };

  const days = [
    { date: '2026-05-30', label: 'Saturday, May 30' },
    { date: '2026-05-31', label: 'Sunday, May 31' },
    { date: '2026-06-01', label: 'Monday, June 1' },
  ];

  return (
    <div className="fade-up" style={{ padding: '24px 28px', overflowY: 'auto', height: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          {/* Page title — Space Grotesk (display) */}
          <h1 className="display" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.3px' }}>
            Weekend Survival Report
          </h1>
          <span style={{
            fontSize: 9, fontWeight: 600, letterSpacing: '1.5px',
            color: 'var(--gold)', background: 'var(--gold-dim)',
            border: '0.5px solid var(--gold-border)',
            padding: '3px 8px', borderRadius: 5,
            fontFamily: 'var(--font-display)',
          }}>{weekendReport.weekOf}</span>
        </div>
        {/* Subheadline — Inter (body, inherited) */}
        <p style={{ fontSize: 13, color: 'var(--cream-muted)' }}>{weekendReport.headline}</p>
      </div>

      {/* Score row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'SURVIVAL SCORE', val: weekendReport.survivalScore, color: 'var(--gold)' },
          { label: 'FUN SCORE',      val: `${weekendReport.funScore}/10`, color: 'var(--green)' },
          { label: 'STUDY NEEDED',   val: `${weekendReport.hoursNeeded}h`, color: 'var(--red-text)' },
          { label: 'RISK LEVEL',     val: weekendReport.academicRisk.toUpperCase(), color: 'var(--orange-text)' },
        ].map(m => (
          <div key={m.label} style={{
            background: 'var(--cream-faint)', border: '0.5px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '14px', textAlign: 'center',
          }}>
            {/* Metric label — Space Grotesk (display) */}
            <div className="display" style={{ fontSize: 9, color: 'var(--cream-dim)', letterSpacing: '1.5px', marginBottom: 8, fontWeight: 600 }}>{m.label}</div>
            {/* Metric value — Sora (metric) */}
            <div className="metric" style={{ fontSize: 24, fontWeight: 800, color: m.color }}>{m.val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Weekend schedule */}
          <div>
            <div className="section-label">Your weekend — what's already locked in</div>
            {days.map(day => {
              const dayEvents = weekendEvents.filter(e => e.date === day.date);
              if (!dayEvents.length) return null;
              return (
                <div key={day.date} style={{ marginBottom: 16 }}>
                  {/* Day label — Space Grotesk (display) */}
                  <div className="display" style={{
                    fontSize: 11, fontWeight: 600, color: 'var(--cream-muted)',
                    marginBottom: 8, paddingLeft: 2,
                  }}>{day.label}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {dayEvents.map(ev => {
                      const cfg = typeConfig[ev.type] || { label: ev.type.toUpperCase(), cls: 'tag-study' };
                      return (
                        <div key={ev.id} style={{
                          display: 'flex', alignItems: 'flex-start', gap: 12,
                          padding: '10px 14px',
                          background: ev.aiGenerated ? 'rgba(232,197,71,0.04)' : 'var(--cream-faint)',
                          border: `0.5px solid ${ev.aiGenerated ? 'var(--gold-border)' : 'var(--border)'}`,
                          borderRadius: 'var(--radius-md)',
                        }}>
                          {/* Time — Inter (body, inherited) */}
                          <div style={{ fontSize: 10, color: 'var(--cream-muted)', minWidth: 44, paddingTop: 2, textAlign: 'right' }}>{ev.time}</div>
                          <div style={{ flex: 1 }}>
                            {/* Event title — Space Grotesk (display) */}
                            <div className="display" style={{ fontSize: 12, fontWeight: 500 }}>
                              {ev.title}
                              {ev.aiGenerated && (
                                <span style={{ marginLeft: 6, fontSize: 9, color: 'var(--gold)', fontWeight: 600 }}>✦ AI</span>
                              )}
                            </div>
                            {/* AI note — Inter italic */}
                            {ev.aiNote && (
                              <div style={{ fontSize: 10, color: 'var(--gold)', marginTop: 3, fontStyle: 'italic', lineHeight: 1.5 }}>{ev.aiNote}</div>
                            )}
                          </div>
                          <span className={`tag ${cfg.cls}`}>{cfg.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Threats */}
          <div>
            <div className="section-label">Academic threats this weekend</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {weekendReport.topThreats.map((t, i) => <ThreatCard key={i} threat={t} />)}
            </div>
          </div>
        </div>

        {/* Right col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div className="section-label" style={{ marginBottom: 0 }}>Recovery plan</div>
              <span style={{ fontSize: 10, color: 'var(--cream-muted)' }}>{doneCount}/{plan.length} done</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {plan.map(item => <RecoveryItem key={item.id} item={item} onToggle={toggle} />)}
            </div>
            {doneCount === plan.length && (
              <div style={{
                marginTop: 12, padding: '12px', textAlign: 'center',
                background: 'var(--green-dim)', border: '0.5px solid var(--green-border)',
                borderRadius: 'var(--radius-md)',
              }}>
                <div className="display" style={{ fontSize: 13, fontWeight: 600, color: 'var(--green)' }}>
                  You're gonna make it. 🎉
                </div>
              </div>
            )}
          </div>

          <div style={{
            background: 'var(--cream-faint)', border: '0.5px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '16px',
          }}>
            <div className="section-label" style={{ marginBottom: 12 }}>The honest breakdown</div>
            <div style={{ marginBottom: 14 }}>
              <div className="display" style={{ fontSize: 10, color: 'var(--green)', fontWeight: 600, letterSpacing: '1px', marginBottom: 8 }}>✓ GREEN LIGHT</div>
              {weekendReport.whatYouCanDo.map((s, i) => (
                <div key={i} style={{
                  fontSize: 12, color: 'var(--cream)', opacity: 0.85, lineHeight: 1.5,
                  paddingLeft: 12, borderLeft: '2px solid var(--green)',
                  marginBottom: 6,
                }}>{s}</div>
              ))}
            </div>
            <div>
              <div className="display" style={{ fontSize: 10, color: 'var(--red-text)', fontWeight: 600, letterSpacing: '1px', marginBottom: 8 }}>✗ HOLD OFF</div>
              {weekendReport.whatYouCantDo.map((s, i) => (
                <div key={i} style={{
                  fontSize: 12, color: 'var(--cream)', opacity: 0.85, lineHeight: 1.5,
                  paddingLeft: 12, borderLeft: '2px solid var(--red)',
                  marginBottom: 6,
                }}>{s}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
