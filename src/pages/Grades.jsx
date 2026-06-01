import React from 'react';
import { courses, assignments } from '../data/mockData';

function GradeBar({ label, value, max = 100, color }) {
  const pct = (value / max) * 100;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: 'var(--cream-muted)' }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--cream)' }}>{value}%</span>
      </div>
      <div style={{ height: 5, background: 'rgba(245,242,235,0.08)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  );
}

function CourseCard({ c }) {
  const gradeColor = c.gradeNum >= 90 ? 'var(--green)' : c.gradeNum >= 80 ? 'var(--gold)' : c.gradeNum >= 70 ? 'var(--orange-text)' : 'var(--red-text)';
  const trendIcon = c.trend === 'up' ? '↑' : c.trend === 'down' ? '↓' : '→';
  const trendColor = c.trend === 'up' ? 'var(--green)' : c.trend === 'down' ? 'var(--red-text)' : 'var(--cream-muted)';
  const courseAssignments = assignments.filter(a => a.course === c.name);

  const scenarios = [
    { label: 'Ace remaining work', val: c.gradeNum + 4, color: 'var(--green)' },
    { label: 'Do the minimum',     val: c.gradeNum,     color: 'var(--gold)' },
    { label: 'Skip stuff',         val: c.gradeNum - 6, color: 'var(--red-text)' },
  ];

  return (
    <div style={{
      background: 'var(--cream-faint)',
      border: '0.5px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      padding: '20px',
      transition: 'border-color 0.2s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          {/* Course name — Space Grotesk (display) */}
          <div className="display" style={{ fontSize: 15, fontWeight: 700, color: 'var(--cream)' }}>{c.name}</div>
          {/* Full course name — Space Grotesk (display) */}
          <div className="display" style={{ fontSize: 11, color: 'var(--cream-muted)', marginTop: 2, fontWeight: 400 }}>{c.fullName}</div>
          {/* Professor name — Inter (body, inherited) */}
          <div style={{ fontSize: 10, color: 'var(--cream-dim)', marginTop: 2 }}>{c.professor} · {c.credits} credits</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          {/* Grade letter — Sora (metric) */}
          <div className="metric" style={{ fontSize: 36, fontWeight: 800, lineHeight: 1, color: gradeColor }}>{c.grade}</div>
          {/* Grade number + trend — Inter (body, inherited) */}
          <div style={{ fontSize: 11, marginTop: 4, color: trendColor }}>{trendIcon} {c.gradeNum}%</div>
        </div>
      </div>

      <GradeBar label="Current grade" value={c.gradeNum} color={gradeColor} />

      <div style={{ marginTop: 14 }}>
        {/* Section label — Space Grotesk via .section-label */}
        <div style={{ fontSize: 9, color: 'var(--cream-dim)', letterSpacing: '1.5px', fontWeight: 600, marginBottom: 8, fontFamily: 'var(--font-display)' }}>PROJECTED OUTCOMES</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {scenarios.map(s => (
            <div key={s.label} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '6px 10px',
              background: 'rgba(245,242,235,0.03)',
              border: '0.5px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
            }}>
              {/* Scenario label — Inter (body, inherited) */}
              <span style={{ fontSize: 11, color: 'var(--cream-muted)' }}>{s.label}</span>
              {/* Projected % — Sora (metric) */}
              <span className="metric" style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.val}%</span>
            </div>
          ))}
        </div>
      </div>

      {courseAssignments.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 9, color: 'var(--cream-dim)', letterSpacing: '1.5px', fontWeight: 600, marginBottom: 8, fontFamily: 'var(--font-display)' }}>UPCOMING</div>
          {courseAssignments.map(a => (
            <div key={a.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontSize: 11, padding: '4px 0',
              borderBottom: '0.5px solid var(--border)',
            }}>
              {/* Assignment name — Inter (body, inherited) */}
              <span style={{ color: 'var(--cream-muted)' }}>{a.name}</span>
              <span style={{ color: 'var(--cream-dim)' }}>{a.weight}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Grades() {
  const gpa = 3.4;
  const totalCredits = courses.reduce((s, c) => s + c.credits, 0);

  return (
    <div className="fade-up" style={{ padding: '24px 28px', overflowY: 'auto', height: '100%' }}>
      <div style={{ marginBottom: 24 }}>
        {/* Page title — Space Grotesk (display) */}
        <h1 className="display" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.3px', marginBottom: 4 }}>
          Grades
        </h1>
        {/* Description — Inter (body, inherited) */}
        <p style={{ fontSize: 13, color: 'var(--cream-muted)' }}>
          Real-time grade tracking with projected outcomes based on your remaining work.
        </p>
      </div>

      {/* GPA / stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        <div style={{
          background: 'var(--gold-dim)', border: '0.5px solid var(--gold-border)',
          borderRadius: 'var(--radius-lg)', padding: '16px', textAlign: 'center',
        }}>
          <div className="display" style={{ fontSize: 9, color: 'var(--gold)', letterSpacing: '1.5px', fontWeight: 600, marginBottom: 8 }}>SEMESTER GPA</div>
          {/* GPA — Sora (metric) */}
          <div className="metric" style={{ fontSize: 36, fontWeight: 800, color: 'var(--gold)' }}>{gpa}</div>
        </div>
        <div style={{
          background: 'var(--cream-faint)', border: '0.5px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '16px', textAlign: 'center',
        }}>
          <div className="display" style={{ fontSize: 9, color: 'var(--cream-dim)', letterSpacing: '1.5px', fontWeight: 600, marginBottom: 8 }}>CREDITS THIS SEM</div>
          {/* Credits — Sora (metric) */}
          <div className="metric" style={{ fontSize: 36, fontWeight: 800, color: 'var(--cream)' }}>{totalCredits}</div>
        </div>
        <div style={{
          background: 'var(--green-dim)', border: '0.5px solid var(--green-border)',
          borderRadius: 'var(--radius-lg)', padding: '16px', textAlign: 'center',
        }}>
          <div className="display" style={{ fontSize: 9, color: 'var(--green)', letterSpacing: '1.5px', fontWeight: 600, marginBottom: 8 }}>COURSES ON TRACK</div>
          {/* On-track count — Sora (metric) */}
          <div className="metric" style={{ fontSize: 36, fontWeight: 800, color: 'var(--green)' }}>
            {courses.filter(c => c.trend !== 'down').length}/{courses.length}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {courses.map(c => <CourseCard key={c.id} c={c} />)}
      </div>
    </div>
  );
}
