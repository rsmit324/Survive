import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { currentUser } from '../data/mockData';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '⬡' },
  { path: '/survival-report', label: 'Weekend Report', icon: '◈' },
  { path: '/calendar', label: 'Social Calendar', icon: '◷' },
  { path: '/assignments', label: 'Assignments', icon: '◻' },
  { path: '/grades', label: 'Grades', icon: '△' },
  { path: '/recruiting', label: 'Recruiting', icon: '◈' },
  { path: '/ai', label: 'Ask Survive', icon: '✦' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      minHeight: '100vh',
      background: 'var(--black-2)',
      borderRight: '0.5px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: '22px 20px 16px',
        borderBottom: '0.5px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="pulse" style={{
            width: 8, height: 8,
            borderRadius: '50%',
            background: 'var(--gold)',
          }} />
          <span className="display" style={{
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: '-0.5px',
            color: 'var(--cream)',
          }}>SURVIVE</span>
        </div>
        <div style={{
          fontSize: 10,
          color: 'var(--cream-dim)',
          marginTop: 4,
          letterSpacing: '1px',
          fontWeight: 500,
        }}>WEEK 11 · SPRING 2026</div>
      </div>

      {/* User */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '0.5px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <div style={{
          width: 32, height: 32,
          borderRadius: '50%',
          background: 'var(--gold-dim)',
          border: '0.5px solid var(--gold-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--gold)',
          fontFamily: 'var(--font-display)',
        }}>{currentUser.avatar}</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--cream)' }}>{currentUser.name}</div>
          <div style={{ fontSize: 10, color: 'var(--cream-muted)' }}>{currentUser.year} · {currentUser.major}</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '10px 10px', flex: 1 }}>
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 10px',
                borderRadius: 'var(--radius-sm)',
                background: active ? 'var(--gold-dim)' : 'transparent',
                border: active ? '0.5px solid var(--gold-border)' : '0.5px solid transparent',
                color: active ? 'var(--gold)' : 'var(--cream-muted)',
                fontSize: 12,
                fontWeight: active ? 500 : 400,
                marginBottom: 2,
                transition: 'all 0.15s',
                textAlign: 'left',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--cream)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--cream-muted)'; }}
            >
              <span style={{ fontSize: 14, width: 18, textAlign: 'center' }}>{item.icon}</span>
              {item.label}
              {item.path === '/ai' && (
                <span style={{
                  marginLeft: 'auto',
                  fontSize: 8,
                  background: 'var(--gold-dim)',
                  color: 'var(--gold)',
                  border: '0.5px solid var(--gold-border)',
                  padding: '1px 5px',
                  borderRadius: 4,
                  letterSpacing: '0.5px',
                  fontWeight: 600,
                }}>AI</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Tagline */}
      <div style={{
        padding: '14px 20px',
        borderTop: '0.5px solid var(--border)',
        fontFamily: 'var(--font-display)',
        fontSize: 8,
        fontWeight: 700,
        letterSpacing: '2px',
        color: 'var(--gold)',
        opacity: 0.5,
      }}>GO HAVE FUN. WE'LL HELP YOU SURVIVE.</div>
    </aside>
  );
}
