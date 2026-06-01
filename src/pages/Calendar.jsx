import React, { useState } from 'react';
import { events } from '../data/mockData';

const DAYS = [
  { date: '2026-05-29', label: 'Fri', full: 'Friday, May 29' },
  { date: '2026-05-30', label: 'Sat', full: 'Saturday, May 30' },
  { date: '2026-05-31', label: 'Sun', full: 'Sunday, May 31' },
  { date: '2026-06-01', label: 'Mon', full: 'Monday, Jun 1' },
  { date: '2026-06-02', label: 'Tue', full: 'Tuesday, Jun 2' },
  { date: '2026-06-03', label: 'Wed', full: 'Wednesday, Jun 3' },
  { date: '2026-06-04', label: 'Thu', full: 'Thursday, Jun 4' },
];

const TYPE_CONFIG = {
  class:      { label: 'CLASS',    cls: 'tag-class',      dot: 'var(--blue)' },
  social:     { label: 'SOCIAL',   cls: 'tag-social',     dot: 'var(--gold)' },
  greek:      { label: 'GREEK',    cls: 'tag-greek',      dot: 'var(--purple)' },
  sport:      { label: 'SPORT',    cls: 'tag-sport',      dot: 'var(--green)' },
  recruiting: { label: 'RECRUIT',  cls: 'tag-recruiting', dot: 'var(--orange)' },
  study:      { label: 'STUDY',    cls: 'tag-study',      dot: 'var(--cream-muted)' },
};

const FILTERS = ['all', 'class', 'social', 'greek', 'sport', 'recruiting', 'study'];

export default function Calendar() {
  const [selectedDay, setSelectedDay] = useState('2026-05-29');
  const [filter, setFilter] = useState('all');

  const dayEvents = events
    .filter(e => e.date === selectedDay)
    .filter(e => filter === 'all' || e.type === filter)
    .sort((a, b) => a.time.localeCompare(b.time));

  const dayData = DAYS.find(d => d.date === selectedDay);

  const getEventCountForDay = (date) => events.filter(e => e.date === date).length;

  return (
    <div className="fade-up" style={{ padding: '24px 28px', overflowY: 'auto', height: '100%' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 className="display" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.3px', marginBottom: 4 }}>
          Social Calendar
        </h1>
        <p style={{ fontSize: 13, color: 'var(--cream-muted)' }}>
          Everything in one place — class, social, Greek life, game days, recruiting.
        </p>
      </div>

      {/* Day selector */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {DAYS.map(day => {
          const count = getEventCountForDay(day.date);
          const active = selectedDay === day.date;
          return (
            <button
              key={day.date}
              onClick={() => setSelectedDay(day.date)}
              style={{
                flex: 1,
                padding: '10px 8px',
                borderRadius: 'var(--radius-md)',
                background: active ? 'var(--gold-dim)' : 'var(--cream-faint)',
                border: `0.5px solid ${active ? 'var(--gold-border)' : 'var(--border)'}`,
                color: active ? 'var(--gold)' : 'var(--cream-muted)',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}>
              <div className="display" style={{ fontSize: 11, fontWeight: 700 }}>{day.label}</div>
              <div style={{ fontSize: 9, marginTop: 3, opacity: 0.7 }}>{count} events</div>
            </button>
          );
        })}
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {FILTERS.map(f => {
          const cfg = f === 'all' ? { label: 'ALL', cls: '' } : TYPE_CONFIG[f];
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '4px 12px',
                borderRadius: 20,
                border: `0.5px solid ${active ? 'var(--gold-border)' : 'var(--border)'}`,
                background: active ? 'var(--gold-dim)' : 'transparent',
                color: active ? 'var(--gold)' : 'var(--cream-muted)',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.5px',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}>{f.toUpperCase()}</button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>
        {/* Events list */}
        <div>
          <div className="display" style={{
            fontSize: 12, fontWeight: 600, color: 'var(--cream)',
            marginBottom: 12, paddingBottom: 10,
            borderBottom: '0.5px solid var(--border)',
          }}>{dayData?.full}</div>

          {dayEvents.length === 0 ? (
            <div style={{
              padding: '40px 20px', textAlign: 'center',
              color: 'var(--cream-muted)', fontSize: 13,
            }}>No events — enjoy the free time ✨</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {dayEvents.map(ev => {
                const cfg = TYPE_CONFIG[ev.type] || TYPE_CONFIG.study;
                return (
                  <div key={ev.id} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 14,
                    padding: '14px 16px',
                    background: ev.aiGenerated ? 'rgba(232,197,71,0.04)' : 'var(--cream-faint)',
                    border: `0.5px solid ${ev.aiGenerated ? 'var(--gold-border)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-lg)',
                    transition: 'border-color 0.15s',
                  }}>
                    <div style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
                      minWidth: 52, paddingTop: 2,
                    }}>
                      <span style={{ fontSize: 11, color: 'var(--cream-muted)' }}>{ev.time}</span>
                      {ev.duration && (
                        <span style={{ fontSize: 9, color: 'var(--cream-dim)', marginTop: 2 }}>
                          {ev.duration >= 60 ? `${ev.duration / 60}h` : `${ev.duration}m`}
                        </span>
                      )}
                    </div>

                    <div style={{
                      width: 3, alignSelf: 'stretch',
                      background: cfg.dot,
                      borderRadius: 2, opacity: 0.6, flexShrink: 0,
                    }} />

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span className="display" style={{ fontSize: 13, fontWeight: 500 }}>{ev.title}</span>
                        {ev.aiGenerated && (
                          <span style={{ fontSize: 8, color: 'var(--gold)', fontWeight: 700, letterSpacing: '1px' }}>✦ AI SCHEDULED</span>
                        )}
                      </div>
                      {ev.location && (
                        <div style={{ fontSize: 11, color: 'var(--cream-muted)', marginBottom: ev.aiNote ? 4 : 0 }}>
                          📍 {ev.location}
                        </div>
                      )}
                      {ev.notes && (
                        <div style={{ fontSize: 11, color: 'var(--blue-text)', marginTop: 4, lineHeight: 1.4 }}>
                          {ev.notes}
                        </div>
                      )}
                      {ev.aiNote && (
                        <div style={{
                          fontSize: 11, color: 'var(--gold)',
                          fontStyle: 'italic', marginTop: 4, lineHeight: 1.4,
                          borderLeft: '2px solid var(--gold)', paddingLeft: 8,
                        }}>{ev.aiNote}</div>
                      )}
                      {ev.canSkip === true && (
                        <div style={{ marginTop: 6 }}>
                          <span style={{
                            fontSize: 9, color: 'var(--cream-muted)',
                            background: 'var(--cream-faint)',
                            border: '0.5px solid var(--border)',
                            padding: '2px 7px', borderRadius: 4, fontWeight: 500,
                          }}>optional</span>
                        </div>
                      )}
                    </div>
                    <span className={`tag ${cfg.cls}`}>{cfg.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Week summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div className="section-label">This week — at a glance</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {DAYS.map(day => {
                const dayEvs = events.filter(e => e.date === day.date);
                const types = [...new Set(dayEvs.map(e => e.type))];
                return (
                  <div
                    key={day.date}
                    onClick={() => setSelectedDay(day.date)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 12px',
                      background: selectedDay === day.date ? 'var(--gold-dim)' : 'var(--cream-faint)',
                      border: `0.5px solid ${selectedDay === day.date ? 'var(--gold-border)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                    }}>
                    <span className="display" style={{
                      fontSize: 11, fontWeight: 700, minWidth: 28,
                      color: selectedDay === day.date ? 'var(--gold)' : 'var(--cream)',
                    }}>{day.label}</span>
                    <div style={{ flex: 1, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {types.map(t => {
                        const cfg = TYPE_CONFIG[t] || TYPE_CONFIG.study;
                        return (
                          <div key={t} style={{
                            width: 6, height: 6, borderRadius: '50%',
                            background: cfg.dot, opacity: 0.8,
                          }} />
                        );
                      })}
                    </div>
                    <span style={{ fontSize: 10, color: 'var(--cream-muted)' }}>{dayEvs.length}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div style={{
            background: 'var(--cream-faint)', border: '0.5px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '14px',
          }}>
            <div className="section-label" style={{ marginBottom: 10 }}>Event types</div>
            {Object.entries(TYPE_CONFIG).map(([type, cfg]) => (
              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.dot }} />
                <span style={{ fontSize: 11, color: 'var(--cream-muted)', textTransform: 'capitalize' }}>{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
