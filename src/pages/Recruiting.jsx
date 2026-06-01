import React, { useState } from 'react';
import { recruitingItems } from '../data/mockData';

const STATUS_CONFIG = {
  applied:     { label: 'Applied',     color: 'var(--blue-text)',    bg: 'var(--blue-dim)',    step: 1 },
  first_round: { label: 'First Round', color: 'var(--gold)',         bg: 'var(--gold-dim)',    step: 2 },
  final_round: { label: 'Final Round', color: 'var(--orange-text)',  bg: 'var(--orange-dim)',  step: 3 },
  offer:       { label: 'Offer 🎉',    color: 'var(--green)',        bg: 'var(--green-dim)',   step: 4 },
  rejected:    { label: 'Rejected',    color: 'var(--red-text)',     bg: 'var(--red-dim)',     step: 0 },
};

function RecruitingCard({ item }) {
  const sc = STATUS_CONFIG[item.status];
  const due = new Date(item.deadline);
  const daysUntil = Math.ceil((due - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div style={{
      background: 'var(--cream-faint)',
      border: `0.5px solid ${item.priority === 'high' ? sc.bg.replace('dim', 'border') : 'var(--border)'}`,
      borderRadius: 'var(--radius-xl)',
      padding: '18px 20px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <div className="display" style={{ fontSize: 15, fontWeight: 700, color: 'var(--cream)' }}>{item.company}</div>
          <div className="display" style={{ fontSize: 12, color: 'var(--cream-muted)', marginTop: 2, fontWeight: 400 }}>{item.role}</div>
        </div>
        <span style={{
          fontSize: 10, fontWeight: 600,
          padding: '4px 10px', borderRadius: 6,
          background: sc.bg, color: sc.color,
        }}>{sc.label}</span>
      </div>

      {/* Progress bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
        {['Applied', 'First Round', 'Final Round', 'Offer'].map((stage, i) => (
          <div key={stage} style={{
            flex: 1, height: 3,
            background: sc.step > i ? sc.color : 'var(--border)',
            borderRadius: 2,
            opacity: sc.step > i ? 1 : 0.3,
          }} />
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div className="display" style={{ fontSize: 10, color: 'var(--cream-dim)', marginBottom: 3, fontWeight: 600, letterSpacing: '0.5px' }}>NEXT STEP</div>
          <div style={{ fontSize: 12, color: 'var(--cream)', lineHeight: 1.4 }}>{item.nextStep}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: 'var(--cream-dim)', marginBottom: 3 }}>Deadline</div>
          <div style={{ fontSize: 11, color: daysUntil <= 7 ? 'var(--red-text)' : 'var(--cream-muted)' }}>
            {daysUntil <= 0 ? 'TODAY' : `${daysUntil}d`}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Recruiting() {
  return (
    <div className="fade-up" style={{ padding: '24px 28px', overflowY: 'auto', height: '100%' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 className="display" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.3px', marginBottom: 4 }}>
          Recruiting
        </h1>
        <p style={{ fontSize: 13, color: 'var(--cream-muted)' }}>
          Track applications, deadlines, and next steps — without losing your mind.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 24 }}>
        {[
          { label: 'ACTIVE', val: recruitingItems.filter(r => r.status !== 'rejected').length, color: 'var(--cream)' },
          { label: 'IN PROCESS', val: recruitingItems.filter(r => ['first_round','final_round'].includes(r.status)).length, color: 'var(--gold)' },
          { label: 'OFFERS', val: recruitingItems.filter(r => r.status === 'offer').length, color: 'var(--green)' },
          { label: 'URGENT', val: recruitingItems.filter(r => {
            const d = Math.ceil((new Date(r.deadline) - new Date()) / (1000*60*60*24));
            return d <= 14;
          }).length, color: 'var(--red-text)' },
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {recruitingItems.map(item => <RecruitingCard key={item.id} item={item} />)}

        {/* Add placeholder */}
        <div style={{
          background: 'transparent',
          border: '0.5px dashed var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '18px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'var(--cream-dim)',
          fontSize: 12, gap: 8,
          transition: 'border-color 0.15s, color 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.color = 'var(--cream-muted)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--cream-dim)'; }}
        >
          + Add application
        </div>
      </div>
    </div>
  );
}
