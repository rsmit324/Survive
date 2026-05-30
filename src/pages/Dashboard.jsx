import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assignments, courses, events, weekendReport, currentUser } from '../data/mockData';

function SurvivalMeter({ score }) {
  const color = score >= 80 ? 'var(--green)' : score >= 60 ? 'var(--gold)' : 'var(--red)';
  const label = score >= 80 ? 'Thriving' : score >= 60 ? 'Hanging In' : 'Danger Zone';
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(232,197,71,0.1) 0%, rgba(232,69,69,0.05) 100%)',
      border: '0.5px solid var(--gold-border)',
      borderRadius: 'var(--radius-xl)',
      padding: '20px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 14, right: 18,
        fontFamily: 'var(--font-display)',
        fontSize: 8, fontWeight: 700, letterSpacing: '2px',
        color: 'var(--gold)', opacity: 0.4,
      }}>WEEKEND SURVIVAL MODE</div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 14 }}>
        <div className="display" style={{ fontSize: 64, fontWeight: 800, lineHeight: 1, color }}>
          {score}
        </div>
        <div style={{ marginBottom: 10 }}>
          <div className="display" style={{ fontSize: 14, fontWeight: 700, color: 'var(--cream)' }}>Survival Score</div>
          <div style={{ fontSize: 11, color, fontWeight: 500 }}>{label}</div>
        </div>
      </div>

      <div style={{
        fontSize: 13, fontStyle: 'italic',
        color: 'var(--cream)', opacity: 0.85,
        borderLeft: '2px solid var(--gold)',
        paddingLeft: 12, lineHeight: 1.5,
        marginBottom: 16,
      }}>
        {weekendReport.aiSummary}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { label: 'Academic load', pct: 68, color: 'var(--orange)', val: 'High' },
          { label: 'Social capacity', pct: 55, color: 'var(--gold)',   val: 'Moderate' },
          { label: 'Sleep debt',     pct: 30, color: 'var(--blue)',    val: 'Low' },
        ].map(bar => (
          <div key={bar.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 11, color: 'var(--cream-muted)', flex: 1 }}>{bar.label}</span>
            <div style={{ flex: 2, height: 4, background: 'rgba(245,242,235,0.08)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: `${bar.pct}%`, height: '100%', background: bar.color, borderRadius: 2 }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 500, minWidth: 56, color: 'var(--cream)' }}>{bar.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AssignmentRow({ a }) {
  const urgencyColors = {
    critical: 'var(--red)',
    high: 'var(--orange)',
    medium: 'var(--gold)',
    low: 'var(--green)',
  };
  const effortClasses = {
    critical: { bg: 'var(--red-dim)', color: 'var(--red-text)' },
    high: { bg: 'var(--orange-dim)', color: 'var(--orange-text)' },
    medium: { bg: 'var(--gold-dim)', color: 'var(--gold)' },
    low: { bg: 'var(--green-dim)', color: 'var(--green)' },
  };
  const ef = effortClasses[a.urgency];
  const due = new Date(a.dueDate);
  const dueStr = due.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', cursor: 'pointer' }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: urgencyColors[a.urgency], flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {a.course} — {a.name}
        </div>
        <div style={{ fontSize: 11, color: 'var(--cream-muted)', marginTop: 2 }}>
          Due {dueStr} · {a.weight}% of grade
        </div>
      </div>
      <div style={{
        fontSize: 11, fontWeight: 500,
        padding: '3px 10px', borderRadius: 6,
        background: ef.bg, color: ef.color,
        flexShrink: 0,
      }}>
        {a.hoursNeeded < 1 ? `${a.hoursNeeded * 60}m` : `${a.hoursNeeded}h`} needed
      </div>
    </div>
  );
}

function GradeCard({ c }) {
  const trendIcon = c.trend === 'up' ? '↑' : c.trend === 'down' ? '↓' : '→';
  const trendColor = c.trend === 'up' ? 'var(--green)' : c.trend === 'down' ? 'var(--red-text)' : 'var(--cream-muted)';
  const gradeColor = c.gradeNum >= 90 ? 'var(--green)' : c.gradeNum >= 80 ? 'var(--gold)' : 'var(--orange-text)';
  return (
    <div className="card" style={{ textAlign: 'center', padding: '14px 10px' }}>
      <div style={{ fontSize: 10, color: 'var(--cream-muted)', marginBottom: 6, fontWeight: 500 }}>{c.name}</div>
      <div className="display" style={{ fontSize: 26, fontWeight: 800, lineHeight: 1, color: gradeColor }}>{c.grade}</div>
      <div style={{ fontSize: 11, marginTop: 5, color: trendColor }}>{trendIcon} {c.trend === 'up' ? 'Improving' : c.trend === 'down' ? 'At risk' : 'Stable'}</div>
    </div>
  );
}

function TodayAgenda() {
  const today = new Date().toISOString().split('T')[0];
  const todayEvents = events.filter(e => e.date === '2026-05-29').slice(0, 5);
  const typeConfig = {
    class: { label: 'CLASS', cls: 'tag-class' },
    social: { label: 'SOCIAL', cls: 'tag-social' },
    greek: { label: 'GREEK', cls: 'tag-greek' },
    sport: { label: 'SPORT', cls: 'tag-sport' },
    recruiting: { label: 'RECRUIT', cls: 'tag-recruiting' },
    study: { label: 'STUDY', cls: 'tag-study' },
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {todayEvents.map(ev => {
        const cfg = typeConfig[ev.type] || { label: ev.type.toUpperCase(), cls: 'tag-study' };
        return (
          <div key={ev.id} className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 12px', cursor: 'pointer' }}>
            <div style={{ fontSize: 10, color: 'var(--cream-muted)', minWidth: 44, paddingTop: 2, textAlign: 'right' }}>{ev.time}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 500 }}>{ev.title}</div>
              <div style={{ fontSize: 10, color: 'var(--cream-muted)', marginTop: 2 }}>{ev.location}</div>
              {ev.aiNote && (
                <div style={{ fontSize: 10, color: 'var(--gold)', marginTop: 3, fontStyle: 'italic' }}>{ev.aiNote}</div>
              )}
            </div>
            <span className={`tag ${cfg.cls}`}>{cfg.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="fade-up" style={{ padding: '24px 28px', overflowY: 'auto', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 className="display" style={{ fontSize: 22, fontWeight: 800, color: 'var(--cream)', letterSpacing: '-0.5px' }}>
            Good morning, {currentUser.name.split(' ')[0]} 👋
          </h1>
          <p style={{ fontSize: 13, color: 'var(--cream-muted)', marginTop: 4 }}>
            Friday, May 29 · Here's what you're dealing with.
          </p>
        </div>
        <button
          onClick={() => navigate('/ai')}
          style={{
            background: 'var(--gold-dim)',
            border: '0.5px solid var(--gold-border)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 16px',
            color: 'var(--gold)',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}>✦ Ask Survive</button>
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Survival score */}
          <SurvivalMeter score={weekendReport.survivalScore} />

          {/* Assignments */}
          <div>
            <div className="section-label">Upcoming — What actually matters</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {assignments.slice(0, 4).map(a => <AssignmentRow key={a.id} a={a} />)}
            </div>
            <button
              onClick={() => navigate('/assignments')}
              style={{
                marginTop: 10, width: '100%',
                padding: '9px',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--cream-muted)',
                fontSize: 11,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--cream)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--cream-muted)'}
            >View all assignments →</button>
          </div>

          {/* Grade forecast */}
          <div>
            <div className="section-label">Grade Forecast — If nothing changes</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {courses.map(c => <GradeCard key={c.id} c={c} />)}
            </div>
          </div>
        </div>

        {/* Right rail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <div className="section-label">Today — Friday, May 29</div>
            <TodayAgenda />
          </div>

          {/* Weekend survival CTA */}
          <div
            onClick={() => navigate('/survival-report')}
            style={{
              background: 'var(--red-dim)',
              border: '0.5px solid var(--red-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
              cursor: 'pointer',
            }}>
            <div className="display" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2px', color: 'var(--red-text)', marginBottom: 8 }}>
              WEEKEND SURVIVAL REPORT →
            </div>
            <p style={{ fontSize: 12, color: 'var(--cream)', opacity: 0.8, lineHeight: 1.5 }}>
              {weekendReport.headline}
            </p>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <div style={{
                flex: 1, textAlign: 'center',
                background: 'var(--cream-faint)', borderRadius: 'var(--radius-sm)', padding: '8px',
              }}>
                <div className="display" style={{ fontSize: 20, fontWeight: 800, color: 'var(--gold)' }}>{weekendReport.funScore}/10</div>
                <div style={{ fontSize: 9, color: 'var(--cream-muted)', marginTop: 2 }}>FUN SCORE</div>
              </div>
              <div style={{
                flex: 1, textAlign: 'center',
                background: 'var(--cream-faint)', borderRadius: 'var(--radius-sm)', padding: '8px',
              }}>
                <div className="display" style={{ fontSize: 20, fontWeight: 800, color: 'var(--red-text)' }}>{weekendReport.hoursNeeded}h</div>
                <div style={{ fontSize: 9, color: 'var(--cream-muted)', marginTop: 2 }}>STUDY NEEDED</div>
              </div>
            </div>
          </div>

          {/* Quick AI */}
          <div
            onClick={() => navigate('/ai')}
            style={{
              background: 'var(--gold-dim)',
              border: '0.5px solid var(--gold-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '14px',
              cursor: 'pointer',
            }}>
            <div className="display" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2px', color: 'var(--gold)', marginBottom: 8 }}>✦ ASK SURVIVE</div>
            <p style={{ fontSize: 11, color: 'var(--cream-muted)', lineHeight: 1.5 }}>
              "Can I skip Econ Monday if I study all day Sunday?"
            </p>
            <p style={{ fontSize: 11, color: 'var(--cream)', marginTop: 6, borderLeft: '2px solid var(--gold)', paddingLeft: 8, fontStyle: 'italic', lineHeight: 1.4 }}>
              Probably yes, but check what you're missing first...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
