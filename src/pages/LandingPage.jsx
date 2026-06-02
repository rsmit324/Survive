import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─── Constants ─────────────────────────────────────────────── */

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

const days = [
  { day: 'Friday',   vibe: 'Go out.',                        color: 'var(--gold)',     dot: '#E8C547' },
  { day: 'Saturday', vibe: 'Full-send game day.',             color: 'var(--orange)',   dot: '#F07D3A' },
  { day: 'Sunday',   vibe: "You're going to hate yourself.",  color: 'var(--red-text)', dot: '#E84545' },
];

const toSurvive = [
  'Study 4 hours Saturday morning before you regret it',
  'Finish Econ review — midterm is Monday at 10am',
  "Stop pretending you'll wake up at 8am Sunday",
];

const PROMPTS = [
  {
    emoji: '🚨',
    text: 'How academically dangerous is my weekend?',
    response: {
      label: 'Academic Danger Level',
      value: '7.4 / 10',
      valueColor: 'var(--orange)',
      lines: [
        { icon: '✅', text: 'Friday is safe.' },
        { icon: '⚠️', text: 'Saturday gets risky.' },
        { icon: '🆘', text: 'Sunday becomes a hostage situation.' },
      ],
      tasks: [
        'Study 3 hours before game day',
        'Finish Econ review tonight',
        "Stop pretending you'll wake up at 8am",
      ],
    },
  },
  {
    emoji: '🔥',
    text: 'Give me the damage report.',
    response: {
      label: 'Weekend Damage',
      value: 'Significant',
      valueColor: 'var(--orange)',
      lines: [
        { icon: '📊', text: 'ECON 301 midterm Monday. You have 6 hours of studying left.' },
        { icon: '📅', text: 'You have 4 social commitments this weekend.' },
        { icon: '😅', text: "You're double-booked Saturday night. Pick one." },
      ],
      tasks: [
        '4 hours of ECON review across the weekend',
        'COMM 210 draft due Sunday night',
        'One of those Saturday plans has to go',
      ],
    },
  },
  {
    emoji: '😬',
    text: 'Be honest. How cooked am I?',
    response: {
      label: 'Current Status',
      value: 'Medium Rare',
      valueColor: 'var(--gold)',
      lines: [
        { icon: '🩺', text: 'You can still recover.' },
        { icon: '📉', text: 'Finance is the problem. Not Friday night.' },
        { icon: '🕐', text: 'You have exactly enough time if you stop procrastinating today.' },
      ],
      tasks: [
        'Two focused hours tonight fixes most of this',
        'The tailgate is fine — just do the work first',
        'Do not touch your phone until the Econ review is done',
      ],
    },
  },
  {
    emoji: '🏈',
    text: 'Can I full-send game day and still get an A?',
    response: {
      label: 'Full-Send Viability',
      value: 'Conditional',
      valueColor: 'var(--gold)',
      lines: [
        { icon: '✅', text: 'Yes — but only if you study Saturday morning.' },
        { icon: '📖', text: '3 hours before the game covers your ECON exposure.' },
        { icon: '🎉', text: 'After that, full send is academically approved.' },
      ],
      tasks: [
        'Study 7–10am Saturday. Non-negotiable.',
        'Finish COMM draft Friday night',
        'Sunday is recovery + CS lab. Keep it light.',
      ],
    },
  },
  {
    emoji: '📈',
    text: "What's my GPA's biggest threat right now?",
    response: {
      label: 'GPA Threat Level',
      value: 'Elevated',
      valueColor: 'var(--red-text)',
      lines: [
        { icon: '🎯', text: 'ECON 301 midterm — 15% of your grade, Monday 10am.' },
        { icon: '📝', text: "You're currently a B+. One bad exam drops you to a B." },
        { icon: '💡', text: 'The rest of your courses are fine. Focus here.' },
      ],
      tasks: [
        'ECON review is the only thing that matters this weekend',
        'Supply & Demand, Market Equilibrium, Ch 7–11',
        'Everything else can wait until Monday',
      ],
    },
  },
  {
    emoji: '🫡',
    text: 'What do I actually need to do to survive?',
    response: {
      label: 'Survival Plan',
      value: 'Doable',
      valueColor: 'var(--green)',
      lines: [
        { icon: '📋', text: "Here's the exact plan. Don't overthink it." },
        { icon: '⏱️', text: '5 total hours of work across the weekend.' },
        { icon: '🎉', text: 'Everything else is yours to do with as you please.' },
      ],
      tasks: [
        'Friday night: COMM draft (2 hrs)',
        'Saturday morning: ECON review (3 hrs)',
        'Sunday: CS lab, then do literally whatever you want',
      ],
    },
  },
];

const INTEGRATIONS = [
  {
    name: 'Canvas',
    icon: '📚',
    color: 'var(--red-text)',
    colorDim: 'var(--red-dim)',
    colorBorder: 'var(--red-border)',
    desc: 'Pull assignments, deadlines, grades, and coursework automatically.',
    status: 'Coming soon',
  },
  {
    name: 'WHOOP',
    icon: '💪',
    color: 'var(--green)',
    colorDim: 'var(--green-dim)',
    colorBorder: 'var(--green-border)',
    desc: 'Understand sleep, recovery, and strain before recommending study plans.',
    status: 'Coming soon',
  },
  {
    name: 'Google Calendar',
    icon: '📅',
    color: 'var(--blue-text)',
    colorDim: 'var(--blue-dim)',
    colorBorder: 'var(--blue-border)',
    desc: "Know where your time is actually going.",
    status: 'Coming soon',
  },
  {
    name: 'Outlook',
    icon: '📧',
    color: 'var(--purple-text)',
    colorDim: 'var(--purple-dim)',
    colorBorder: 'rgba(174,100,220,0.3)',
    desc: 'Keep everything synced across all your academic accounts.',
    status: 'Coming soon',
  },
];

const TESTIMONIALS = [
  {
    quote: "Finally, something that understands I have classes AND a social life.",
    name: 'Jordan M.',
    detail: 'Junior · Finance · Big Ten',
  },
  {
    quote: "The damage report is painfully accurate. Like, uncomfortably so.",
    name: 'Maya R.',
    detail: 'Sophomore · Pre-Med · SEC',
  },
  {
    quote: "This is the first planner I've actually used for more than a week.",
    name: 'Tyler K.',
    detail: 'Senior · CS + Business · ACC',
  },
];

/* ─── Root Component ──────────────────────────────────────────── */

export default function LandingPage() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const showcaseRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const scrollToShowcase = () =>
    showcaseRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div style={S.root}>
      <div style={S.grain} />
      <div style={S.glowTL} />
      <div style={S.glowBR} />

      {/* NAV */}
      <nav style={S.nav}>
        <span style={S.logo}>SURVIVE</span>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button style={S.navGhost} onClick={scrollToShowcase}>See the app</button>
          <button style={S.navCta} onClick={() => navigate('/dashboard')}>
            Open Dashboard →
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section
        style={{
          ...S.hero,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'none' : 'translateY(16px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}
      >
        {/* Eyebrow */}
        <div style={S.eyebrow}>
          <span style={S.eyebrowDot} />
          Built for students who want both
        </div>

        {/* Headline */}
        <h1 style={S.headline}>
          Your syllabus doesn't know
          <span style={S.headlineAccent}> you're going out tonight.</span>
        </h1>

        <p style={S.sub}>
          SURVIVE is the first AI that understands both your grades{' '}
          <em>and</em> your social calendar — and tells you exactly how to manage both.
        </p>

        {/* Both pills */}
        <div style={S.bothRow}>
          {['Good grades', 'Social life', 'Recruiting', 'Organizations', 'Health', 'Sleep', 'Fun'].map((item, i) => (
            <span key={i} style={S.bothPill}>{item}</span>
          ))}
        </div>

        {/* CTAs */}
        <div style={S.ctaRow}>
          <button style={S.ctaPrimary} onClick={() => navigate('/dashboard')}>
            Get Started — it's free
          </button>
          <button style={S.ctaSecondary} onClick={scrollToShowcase}>
            See How It Works ↓
          </button>
        </div>

        {/* Damage Report Card */}
        <DamageReportCard navigate={navigate} />

        {/* Ask SURVIVE */}
        <AskSurviveSection navigate={navigate} mounted={mounted} />
      </section>

      {/* DASHBOARD SHOWCASE */}
      <DashboardShowcase ref={showcaseRef} navigate={navigate} />

      {/* EMOTIONAL SECTION */}
      <ChaosSection />

      {/* SOCIAL PROOF */}
      <TestimonialsSection />

      {/* INTEGRATIONS */}
      <IntegrationsSection />

      {/* FINAL CTA */}
      <footer style={S.footer}>
        <div style={S.footerGlow} />
        <h2 style={S.footerHeadline}>Go have fun.<br /><span style={{ color: 'var(--gold)' }}>We'll help you survive.</span></h2>
        <p style={S.footerSub}>Your syllabus doesn't know you're going out tonight. We do.</p>
        <button style={S.footerBtn} onClick={() => navigate('/dashboard')}>
          Create Free Account
        </button>
      </footer>

      <style>{globalCss}</style>
    </div>
  );
}

/* ─── Damage Report Card ─────────────────────────────────────── */

function DamageReportCard({ navigate }) {
  const [checked, setChecked] = useState([false, false, false]);
  const toggle = i => setChecked(p => p.map((v, idx) => idx === i ? !v : v));

  return (
    <div style={C.wrapper}>
      <div style={C.halo} />
      <div style={C.card}>
        <div style={C.header}>
          <div>
            <div style={C.headerLabel}>WEEKEND DAMAGE REPORT</div>
            <div style={C.headerSub}>Generated for Alex · Friday 4:47pm</div>
          </div>
          <div style={C.scoreBadge}>
            <span style={C.scoreNum}>72</span>
            <span style={C.scoreUnit}>/ 100</span>
          </div>
        </div>

        <div style={C.divider} />

        <div style={C.daysGrid}>
          {days.map((d, i) => (
            <div key={i} style={C.dayRow}>
              <div style={{ ...C.dayDot, background: d.dot, boxShadow: `0 0 8px ${d.dot}80` }} />
              <div>
                <div style={C.dayLabel}>{d.day}</div>
                <div style={{ ...C.dayVibe, color: d.color }}>{d.vibe}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={C.divider} />

        <div style={C.surviveLabel}>TO SURVIVE THIS WEEKEND</div>
        <div style={C.tasks}>
          {toSurvive.map((t, i) => (
            <div key={i} style={C.taskRow} onClick={() => toggle(i)}>
              <div style={{ ...C.checkbox, ...(checked[i] ? C.checkboxDone : {}) }}>
                {checked[i] && <span style={{ fontSize: 10, color: 'var(--green)' }}>✓</span>}
              </div>
              <span style={{ ...C.taskText, ...(checked[i] ? C.taskDone : {}) }}>{t}</span>
            </div>
          ))}
        </div>

        <div style={C.divider} />

        <button style={C.askBtn} onClick={() => navigate('/ai')}>
          ✦ Ask SURVIVE anything about your weekend
        </button>
      </div>
    </div>
  );
}

/* ─── Ask SURVIVE Section ─────────────────────────────────────── */

function AskSurviveSection({ navigate, mounted }) {
  const [active, setActive] = useState(null);
  const [animating, setAnimating] = useState(false);

  const handleClick = (i) => {
    if (active === i) { setActive(null); return; }
    setAnimating(true);
    setActive(i);
    setTimeout(() => setAnimating(false), 50);
  };

  const current = active !== null ? PROMPTS[active] : null;

  return (
    <div style={AS.section}>
      <div style={AS.sectionLabel}>
        <span style={AS.labelLine} />
        STUDENTS ARE ASKING
        <span style={AS.labelLine} />
      </div>

      <div style={AS.grid}>
        {PROMPTS.map((p, i) => (
          <button
            key={i}
            className={active === i ? 'chip-active' : 'chip-idle'}
            style={{
              ...AS.chip,
              ...(active === i ? AS.chipActive : {}),
              animationDelay: `${0.4 + i * 0.08}s`,
              animationPlayState: mounted ? 'running' : 'paused',
            }}
            onClick={() => handleClick(i)}
          >
            <span style={AS.chipEmoji}>{p.emoji}</span>
            <span>{p.text}</span>
          </button>
        ))}
      </div>

      {/* Response panel */}
      {current && (
        <div
          style={{
            ...AS.responsePanel,
            opacity: animating ? 0 : 1,
            transform: animating ? 'translateY(8px)' : 'translateY(0)',
            transition: 'opacity 0.25s ease, transform 0.25s ease',
          }}
        >
          <div style={AS.responseHeader}>
            <span style={AS.responseIcon}>✦</span>
            <span style={AS.responseName}>SURVIVE</span>
            <div style={AS.responseStatus}>
              <span style={AS.responseStatusLabel}>{current.response.label}</span>
              <span style={{ ...AS.responseStatusValue, color: current.response.valueColor }}>
                {current.response.value}
              </span>
            </div>
          </div>

          <div style={AS.responseLines}>
            {current.response.lines.map((l, i) => (
              <div key={i} style={AS.responseLine}>
                <span style={AS.responseLineIcon}>{l.icon}</span>
                <span style={AS.responseLineText}>{l.text}</span>
              </div>
            ))}
          </div>

          <div style={AS.divider} />

          <div style={AS.recommendLabel}>RECOMMENDED</div>
          <div style={AS.taskList}>
            {current.response.tasks.map((t, i) => (
              <div key={i} style={AS.taskRow}>
                <span style={AS.taskCheck}>✓</span>
                <span style={AS.taskText}>{t}</span>
              </div>
            ))}
          </div>

          <button style={AS.tryCta} onClick={() => navigate('/ai')}>
            Ask SURVIVE about your actual schedule →
          </button>
        </div>
      )}

      {!current && (
        <div style={AS.tapHint}>
          ↑ Tap a question to see what SURVIVE says
        </div>
      )}
    </div>
  );
}

/* ─── Dashboard Showcase ──────────────────────────────────────── */

const DashboardShowcase = React.forwardRef(function DashboardShowcase({ navigate }, ref) {
  return (
    <section ref={ref} style={DS.section}>
      <div style={DS.sectionInner}>
        <div style={DS.header}>
          <div style={DS.eyebrow}>THE COMMAND CENTER</div>
          <h2 style={DS.title}>
            Everything that matters.
            <span style={{ color: 'var(--gold)' }}> Finally.</span>
          </h2>
          <p style={DS.sub}>
            Your classes, deadlines, grades, recruiting, social plans, and AI advisor in one place.
          </p>
        </div>

        {/* Large dashboard mockup */}
        <div style={DS.mockupWrapper}>
          <div style={DS.mockupGlow} />
          <div style={DS.mockupFrame}>
            {/* Browser chrome */}
            <div style={DS.chrome}>
              <div style={DS.chromeDots}>
                <div style={{ ...DS.dot, background: '#E84545' }} />
                <div style={{ ...DS.dot, background: '#E8C547' }} />
                <div style={{ ...DS.dot, background: '#3DDC84' }} />
              </div>
              <div style={DS.chromeUrl}>survive.app/dashboard</div>
            </div>

            {/* Dashboard layout */}
            <div style={DS.dashLayout}>
              {/* Sidebar */}
              <div style={DS.sidebar}>
                <div style={DS.sidebarLogo}>SURVIVE</div>
                {[
                  { icon: '⚡', label: 'Dashboard', active: true },
                  { icon: '🎯', label: 'Survival Report', active: false },
                  { icon: '📅', label: 'Calendar', active: false },
                  { icon: '📚', label: 'Assignments', active: false },
                  { icon: '📊', label: 'Grades', active: false },
                  { icon: '💼', label: 'Recruiting', active: false },
                  { icon: '✦', label: 'Ask SURVIVE', active: false },
                ].map((item, i) => (
                  <div key={i} style={{ ...DS.sidebarItem, ...(item.active ? DS.sidebarItemActive : {}) }}>
                    <span>{item.icon}</span>
                    <span style={DS.sidebarLabel}>{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div style={DS.mainContent}>
                <div style={DS.dashHeader}>
                  <div>
                    <div style={DS.dashGreeting}>Good morning, Alex 👋</div>
                    <div style={DS.dashSub}>Friday, May 29 · Here's what you're dealing with.</div>
                  </div>
                  <div style={DS.dashAskBtn}>✦ Ask Survive</div>
                </div>

                <div style={DS.dashGrid}>
                  {/* Survival meter */}
                  <div style={DS.survivalMeter}>
                    <div style={DS.meterLabel}>WEEKEND SURVIVAL MODE</div>
                    <div style={DS.meterRow}>
                      <div style={DS.meterScore}>72</div>
                      <div>
                        <div style={DS.meterTitle}>Survival Score</div>
                        <div style={DS.meterStatus}>Hanging In</div>
                      </div>
                    </div>
                    <div style={DS.meterQuote}>"Go out Friday. Study Saturday morning. Don't pretend Sunday is real."</div>
                    {[['Academic load', 68, 'var(--orange)'], ['Social capacity', 55, 'var(--gold)'], ['Sleep debt', 30, 'var(--blue)']].map(([l, p, c]) => (
                      <div key={l} style={DS.barRow}>
                        <span style={DS.barLabel}>{l}</span>
                        <div style={DS.barTrack}>
                          <div style={{ ...DS.barFill, width: `${p}%`, background: c }} />
                        </div>
                        <span style={{ ...DS.barVal, color: c }}>{p >= 60 ? 'High' : p >= 40 ? 'Mod' : 'Low'}</span>
                      </div>
                    ))}
                  </div>

                  {/* Right column */}
                  <div style={DS.rightCol}>
                    {/* Assignments */}
                    <div style={DS.miniCard}>
                      <div style={DS.miniCardLabel}>WHAT ACTUALLY MATTERS</div>
                      {[
                        { course: 'ECON 301', name: 'Midterm Exam', color: 'var(--red-text)', h: '6h' },
                        { course: 'COMM 210', name: 'Case Study', color: 'var(--orange-text)', h: '2h' },
                        { course: 'CS 241',   name: 'Lab 6',       color: 'var(--gold)',       h: '3h' },
                      ].map((it, i) => (
                        <div key={i} style={DS.assignRow}>
                          <div style={{ ...DS.assignDot, background: it.color }} />
                          <span style={DS.assignName}>{it.course} — {it.name}</span>
                          <span style={{ ...DS.assignH, color: it.color }}>{it.h}</span>
                        </div>
                      ))}
                    </div>

                    {/* Grades */}
                    <div style={DS.miniCard}>
                      <div style={DS.miniCardLabel}>GRADE FORECAST</div>
                      <div style={DS.gradeGrid}>
                        {[['ECON', 'B+', 'var(--gold)'], ['COMM', 'A-', 'var(--green)'], ['CS', 'B', 'var(--gold)'], ['PSYC', 'A', 'var(--green)']].map(([c, g, col]) => (
                          <div key={c} style={DS.gradeCard}>
                            <div style={DS.gradeCourse}>{c}</div>
                            <div style={{ ...DS.gradeValue, color: col }}>{g}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Weekend report teaser */}
                    <div style={DS.weekendCard}>
                      <div style={DS.weekendLabel}>WEEKEND SURVIVAL REPORT →</div>
                      <div style={DS.weekendText}>Econ midterm Monday. Game day Saturday. You need a plan.</div>
                      <div style={DS.weekendMetrics}>
                        <div style={DS.metric}>
                          <div style={DS.metricNum}>8.5</div>
                          <div style={DS.metricLabel}>FUN SCORE</div>
                        </div>
                        <div style={DS.metric}>
                          <div style={{ ...DS.metricNum, color: 'var(--red-text)' }}>6h</div>
                          <div style={DS.metricLabel}>STUDY NEEDED</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button style={DS.cta} onClick={() => navigate('/dashboard')}>
            Open the Dashboard →
          </button>
        </div>
      </div>
    </section>
  );
});

/* ─── Chaos Section ──────────────────────────────────────────── */

function ChaosSection() {
  const leftItems = ['Exams', 'Deadlines', 'Recruiting', 'Organizations'];
  const rightItems = ['Tailgates', 'Parties', 'Group projects', 'Lack of sleep'];

  return (
    <section style={CH.section}>
      <div style={CH.inner}>
        <h2 style={CH.title}>College doesn't happen<br /><span style={{ color: 'var(--gold)' }}>one commitment at a time.</span></h2>

        <div style={CH.grid}>
          <div style={CH.listCol}>
            {leftItems.map((item, i) => (
              <div key={i} style={{ ...CH.listItem, animationDelay: `${i * 0.08}s` }}>
                <div style={CH.listDot} />
                {item}
              </div>
            ))}
          </div>
          <div style={CH.listCol}>
            {rightItems.map((item, i) => (
              <div key={i} style={{ ...CH.listItem, animationDelay: `${(i + 4) * 0.08}s` }}>
                <div style={{ ...CH.listDot, background: 'var(--orange)' }} />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div style={CH.dividerRow}>
          <div style={CH.dividerLine} />
          <div style={CH.dividerText}>Most apps track one thing.</div>
          <div style={CH.dividerLine} />
        </div>

        <div style={CH.punchline}>
          SURVIVE understands <span style={{ color: 'var(--gold)' }}>all of it.</span>
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ──────────────────────────────────────────── */

function TestimonialsSection() {
  return (
    <section style={T.section}>
      <div style={T.inner}>
        <div style={T.eyebrow}>BUILT BY STUDENTS. FOR STUDENTS.</div>
        <h2 style={T.title}>The reaction we were going for.</h2>
        <div style={T.grid}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={T.card}>
              <div style={T.quote}>"{t.quote}"</div>
              <div style={T.meta}>
                <div style={T.name}>{t.name}</div>
                <div style={T.detail}>{t.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Integrations ──────────────────────────────────────────── */

function IntegrationsSection() {
  return (
    <section style={IN.section}>
      <div style={IN.inner}>
        <div style={IN.eyebrow}>COMING SOON</div>
        <h2 style={IN.title}>The more SURVIVE knows,<br /><span style={{ color: 'var(--gold)' }}>the smarter it gets.</span></h2>
        <p style={IN.sub}>Connect your existing tools. SURVIVE does the rest.</p>
        <div style={IN.grid}>
          {INTEGRATIONS.map((intg, i) => (
            <div key={i} style={IN.card}>
              <div style={{ ...IN.cardBar, background: intg.color }} />
              <div style={IN.cardTop}>
                <span style={IN.cardIcon}>{intg.icon}</span>
                <span style={{ ...IN.cardStatus, color: intg.color, background: intg.colorDim, border: `0.5px solid ${intg.colorBorder}` }}>
                  {intg.status}
                </span>
              </div>
              <div style={{ ...IN.cardName, color: intg.color }}>{intg.name}</div>
              <div style={IN.cardDesc}>{intg.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════════ */

const S = {
  root: {
    minHeight: '100vh',
    background: 'var(--black)',
    color: 'var(--cream)',
    position: 'relative',
    overflowX: 'hidden',
    fontFamily: 'var(--font-body)',
  },
  grain: {
    position: 'fixed', inset: 0,
    backgroundImage: NOISE_SVG,
    backgroundRepeat: 'repeat',
    backgroundSize: '180px 180px',
    opacity: 0.028,
    pointerEvents: 'none', zIndex: 1,
  },
  glowTL: {
    position: 'fixed', top: -160, left: -100,
    width: 700, height: 500,
    background: 'radial-gradient(ellipse, rgba(232,197,71,0.12) 0%, transparent 65%)',
    pointerEvents: 'none', zIndex: 0,
  },
  glowBR: {
    position: 'fixed', bottom: -120, right: -80,
    width: 600, height: 500,
    background: 'radial-gradient(ellipse, rgba(240,125,58,0.1) 0%, transparent 65%)',
    pointerEvents: 'none', zIndex: 0,
  },
  nav: {
    position: 'relative', zIndex: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '22px 48px',
    borderBottom: '0.5px solid var(--border)',
    backdropFilter: 'blur(12px)',
  },
  logo: {
    fontFamily: 'var(--font-metric)', fontWeight: 800,
    fontSize: 17, letterSpacing: '5px', color: 'var(--gold)',
  },
  navGhost: {
    fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 500,
    color: 'var(--cream-muted)', background: 'none', border: 'none',
    cursor: 'pointer', padding: '8px 14px',
  },
  navCta: {
    fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700,
    color: 'var(--black)', background: 'var(--gold)',
    border: 'none', borderRadius: 8, padding: '9px 20px', cursor: 'pointer',
  },
  hero: {
    position: 'relative', zIndex: 5,
    maxWidth: 820, margin: '0 auto',
    padding: '80px 40px 60px', textAlign: 'center',
  },
  eyebrow: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700,
    letterSpacing: '2.5px', textTransform: 'uppercase',
    color: 'var(--cream-muted)', marginBottom: 28,
  },
  eyebrowDot: {
    width: 6, height: 6, borderRadius: '50%',
    background: 'var(--green)', boxShadow: '0 0 8px var(--green)',
    display: 'inline-block',
  },
  headline: {
    fontFamily: 'var(--font-metric)', fontWeight: 800,
    fontSize: 'clamp(40px, 6.5vw, 74px)',
    lineHeight: 1.07, letterSpacing: '-2px',
    color: 'var(--cream)', marginBottom: 24,
  },
  headlineAccent: { color: 'var(--gold)' },
  sub: {
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(16px, 1.9vw, 19px)',
    lineHeight: 1.65, color: 'var(--cream-muted)',
    maxWidth: 580, margin: '0 auto 28px',
  },
  bothRow: {
    display: 'flex', flexWrap: 'wrap', gap: 8,
    justifyContent: 'center', marginBottom: 40,
  },
  bothPill: {
    fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600,
    color: 'var(--cream-muted)',
    background: 'var(--cream-faint)',
    border: '0.5px solid var(--border)',
    borderRadius: 100, padding: '6px 14px',
  },
  ctaRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 14, flexWrap: 'wrap', marginBottom: 56,
  },
  ctaPrimary: {
    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
    letterSpacing: '0.3px', color: 'var(--black)', background: 'var(--gold)',
    border: 'none', borderRadius: 10, padding: '15px 32px', cursor: 'pointer',
  },
  ctaSecondary: {
    fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14,
    color: 'var(--cream-muted)', background: 'transparent',
    border: '0.5px solid var(--border)', borderRadius: 10,
    padding: '15px 26px', cursor: 'pointer',
  },
  footer: {
    position: 'relative', zIndex: 5, textAlign: 'center',
    padding: '100px 40px 80px',
    borderTop: '0.5px solid var(--border)',
    overflow: 'hidden',
  },
  footerGlow: {
    position: 'absolute', top: -80, left: '50%',
    transform: 'translateX(-50%)',
    width: 600, height: 300,
    background: 'radial-gradient(ellipse, rgba(232,197,71,0.14) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  footerHeadline: {
    position: 'relative',
    fontFamily: 'var(--font-metric)', fontWeight: 800,
    fontSize: 'clamp(32px, 5vw, 60px)',
    lineHeight: 1.1, letterSpacing: '-1px',
    color: 'var(--cream)', marginBottom: 20,
  },
  footerSub: {
    position: 'relative',
    fontFamily: 'var(--font-body)', fontSize: 17,
    color: 'var(--cream-muted)', marginBottom: 36,
    fontStyle: 'italic',
  },
  footerBtn: {
    position: 'relative',
    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
    color: 'var(--black)', background: 'var(--gold)',
    border: 'none', borderRadius: 10, padding: '16px 40px', cursor: 'pointer',
  },
};

/* ─── Damage Card Styles ─────────────────────────────────────── */
const C = {
  wrapper: {
    position: 'relative', maxWidth: 540,
    margin: '0 auto 56px',
    animation: 'cardFloat 6s ease-in-out infinite',
  },
  halo: {
    position: 'absolute', inset: -1,
    borderRadius: 'calc(var(--radius-xl) + 2px)',
    background: 'linear-gradient(135deg, rgba(232,197,71,0.4) 0%, rgba(240,125,58,0.2) 40%, rgba(232,69,69,0.15) 100%)',
    zIndex: 0, filter: 'blur(1px)',
  },
  card: {
    position: 'relative', zIndex: 1,
    background: 'var(--black-3)',
    border: '0.5px solid rgba(232,197,71,0.15)',
    borderRadius: 'var(--radius-xl)',
    padding: '26px 30px',
    display: 'flex', flexDirection: 'column', gap: 18,
    boxShadow: '0 40px 100px rgba(0,0,0,0.7)', textAlign: 'left',
  },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' },
  headerLabel: {
    fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700,
    letterSpacing: '2.5px', color: 'var(--cream-dim)',
    textTransform: 'uppercase', marginBottom: 4,
  },
  headerSub: { fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--cream-muted)' },
  scoreBadge: {
    display: 'flex', alignItems: 'baseline', gap: 2,
    background: 'var(--gold-dim)', border: '0.5px solid var(--gold-border)',
    borderRadius: 10, padding: '6px 14px',
  },
  scoreNum: {
    fontFamily: 'var(--font-metric)', fontSize: 30, fontWeight: 800,
    color: 'var(--gold)', lineHeight: 1,
  },
  scoreUnit: {
    fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600,
    color: 'var(--gold)', opacity: 0.6,
  },
  divider: { height: '0.5px', background: 'var(--border)' },
  daysGrid: { display: 'flex', flexDirection: 'column', gap: 13 },
  dayRow: { display: 'flex', alignItems: 'center', gap: 14 },
  dayDot: { width: 10, height: 10, borderRadius: '50%', flexShrink: 0 },
  dayLabel: {
    fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700,
    color: 'var(--cream-dim)', letterSpacing: '1px',
    textTransform: 'uppercase', marginBottom: 2,
  },
  dayVibe: { fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700 },
  surviveLabel: {
    fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700,
    letterSpacing: '2.5px', color: 'var(--cream-dim)', textTransform: 'uppercase',
  },
  tasks: { display: 'flex', flexDirection: 'column', gap: 10, marginTop: -8 },
  taskRow: { display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' },
  checkbox: {
    width: 18, height: 18, borderRadius: 5,
    border: '0.5px solid var(--border-hover)', background: 'transparent',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, marginTop: 1, transition: 'all 0.15s',
  },
  checkboxDone: { background: 'var(--green-dim)', borderColor: 'var(--green-border)' },
  taskText: {
    fontFamily: 'var(--font-body)', fontSize: 14,
    lineHeight: 1.5, color: 'var(--cream-muted)', transition: 'all 0.15s',
  },
  taskDone: { textDecoration: 'line-through', color: 'var(--cream-dim)' },
  askBtn: {
    width: '100%',
    fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700,
    color: 'var(--gold)', background: 'var(--gold-dim)',
    border: '0.5px solid var(--gold-border)',
    borderRadius: 10, padding: '13px 16px', cursor: 'pointer', letterSpacing: '0.3px',
  },
};

/* ─── Ask SURVIVE Styles ─────────────────────────────────────── */
const AS = {
  section: {
    maxWidth: 720, margin: '0 auto 20px',
    display: 'flex', flexDirection: 'column',
    gap: 20, alignItems: 'center',
  },
  sectionLabel: {
    fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700,
    letterSpacing: '2.5px', color: 'var(--cream-dim)', textTransform: 'uppercase',
    display: 'flex', alignItems: 'center', gap: 14,
  },
  labelLine: { display: 'inline-block', width: 32, height: '0.5px', background: 'var(--border)' },
  grid: { display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  chip: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600,
    color: 'var(--cream)', background: 'var(--black-3)',
    border: '0.5px solid var(--border)', borderRadius: 100,
    padding: '12px 20px', cursor: 'pointer', whiteSpace: 'nowrap',
    animation: 'chipPop 0.45s ease both',
    transition: 'background 0.2s, border-color 0.2s, transform 0.15s',
  },
  chipActive: {
    background: 'var(--gold-dim)',
    borderColor: 'var(--gold-border)',
    color: 'var(--gold)',
  },
  chipEmoji: { fontSize: 17 },
  responsePanel: {
    width: '100%', maxWidth: 580,
    background: 'var(--black-3)',
    border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius-xl)',
    padding: '24px 28px',
    display: 'flex', flexDirection: 'column', gap: 16,
    textAlign: 'left',
    boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
  },
  responseHeader: {
    display: 'flex', alignItems: 'center', gap: 10,
  },
  responseIcon: { fontSize: 16, color: 'var(--gold)' },
  responseName: {
    fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700,
    letterSpacing: '2px', color: 'var(--gold)', flex: 1,
  },
  responseStatus: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 },
  responseStatusLabel: {
    fontFamily: 'var(--font-display)', fontSize: 9, fontWeight: 600,
    letterSpacing: '1.5px', color: 'var(--cream-dim)', textTransform: 'uppercase',
  },
  responseStatusValue: {
    fontFamily: 'var(--font-metric)', fontSize: 18, fontWeight: 800, lineHeight: 1,
  },
  responseLines: { display: 'flex', flexDirection: 'column', gap: 10 },
  responseLine: { display: 'flex', alignItems: 'flex-start', gap: 10 },
  responseLineIcon: { fontSize: 16, flexShrink: 0 },
  responseLineText: {
    fontFamily: 'var(--font-body)', fontSize: 15,
    color: 'var(--cream)', lineHeight: 1.5,
  },
  divider: { height: '0.5px', background: 'var(--border)' },
  recommendLabel: {
    fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700,
    letterSpacing: '2px', color: 'var(--cream-dim)', textTransform: 'uppercase',
  },
  taskList: { display: 'flex', flexDirection: 'column', gap: 8 },
  taskRow: { display: 'flex', alignItems: 'flex-start', gap: 10 },
  taskCheck: { fontSize: 13, color: 'var(--green)', flexShrink: 0, marginTop: 1 },
  taskText: {
    fontFamily: 'var(--font-body)', fontSize: 14,
    color: 'var(--cream-muted)', lineHeight: 1.5,
  },
  tryCta: {
    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
    color: 'var(--gold)', background: 'var(--gold-dim)',
    border: '0.5px solid var(--gold-border)',
    borderRadius: 10, padding: '12px 16px', cursor: 'pointer',
    width: '100%',
  },
  tapHint: {
    fontFamily: 'var(--font-body)', fontSize: 13, fontStyle: 'italic',
    color: 'var(--cream-dim)',
  },
};

/* ─── Dashboard Showcase Styles ─────────────────────────────── */
const DS = {
  section: {
    position: 'relative', zIndex: 5,
    borderTop: '0.5px solid var(--border)',
    background: 'linear-gradient(180deg, var(--black-2) 0%, var(--black) 100%)',
    padding: '80px 0',
  },
  sectionInner: { maxWidth: 1100, margin: '0 auto', padding: '0 40px' },
  header: { textAlign: 'center', marginBottom: 52 },
  eyebrow: {
    fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700,
    letterSpacing: '3px', color: 'var(--cream-dim)',
    textTransform: 'uppercase', marginBottom: 16,
  },
  title: {
    fontFamily: 'var(--font-metric)', fontWeight: 800,
    fontSize: 'clamp(30px, 4vw, 50px)',
    lineHeight: 1.1, letterSpacing: '-1px',
    color: 'var(--cream)', marginBottom: 16,
  },
  sub: {
    fontFamily: 'var(--font-body)', fontSize: 16,
    color: 'var(--cream-muted)', lineHeight: 1.65,
    maxWidth: 500, margin: '0 auto',
  },
  mockupWrapper: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },
  mockupGlow: {
    position: 'absolute', inset: -2,
    background: 'linear-gradient(135deg, rgba(232,197,71,0.3) 0%, rgba(240,125,58,0.15) 50%, rgba(74,143,231,0.1) 100%)',
    borderRadius: 18, zIndex: 0, filter: 'blur(1px)',
  },
  mockupFrame: {
    position: 'relative', zIndex: 1,
    background: 'var(--black-2)',
    border: '0.5px solid var(--border)',
    borderRadius: 14,
    overflow: 'hidden',
    boxShadow: '0 60px 120px rgba(0,0,0,0.8)',
  },
  chrome: {
    display: 'flex', alignItems: 'center', gap: 12,
    background: 'var(--black-3)',
    borderBottom: '0.5px solid var(--border)',
    padding: '10px 16px',
  },
  chromeDots: { display: 'flex', gap: 6 },
  dot: { width: 10, height: 10, borderRadius: '50%' },
  chromeUrl: {
    fontFamily: 'var(--font-body)', fontSize: 11,
    color: 'var(--cream-dim)',
    background: 'var(--black-4)',
    border: '0.5px solid var(--border)',
    borderRadius: 6, padding: '3px 12px',
  },
  dashLayout: { display: 'flex', minHeight: 420 },
  sidebar: {
    width: 170, background: 'var(--black-3)',
    borderRight: '0.5px solid var(--border)',
    padding: '20px 12px',
    display: 'flex', flexDirection: 'column', gap: 4,
    flexShrink: 0,
  },
  sidebarLogo: {
    fontFamily: 'var(--font-metric)', fontWeight: 800,
    fontSize: 11, letterSpacing: '3px', color: 'var(--gold)',
    marginBottom: 16, paddingLeft: 8,
  },
  sidebarItem: {
    display: 'flex', alignItems: 'center', gap: 8,
    fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 500,
    color: 'var(--cream-dim)', padding: '7px 8px', borderRadius: 8,
  },
  sidebarItemActive: {
    background: 'var(--cream-faint)',
    color: 'var(--cream)',
    border: '0.5px solid var(--border)',
  },
  sidebarLabel: { fontSize: 11 },
  mainContent: { flex: 1, padding: '20px 22px', overflow: 'hidden' },
  dashHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 18,
  },
  dashGreeting: {
    fontFamily: 'var(--font-display)', fontSize: 16,
    fontWeight: 700, color: 'var(--cream)',
  },
  dashSub: { fontSize: 11, color: 'var(--cream-muted)', marginTop: 3 },
  dashAskBtn: {
    fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 600,
    color: 'var(--gold)', background: 'var(--gold-dim)',
    border: '0.5px solid var(--gold-border)',
    borderRadius: 8, padding: '6px 12px', cursor: 'default',
  },
  dashGrid: { display: 'grid', gridTemplateColumns: '1fr 240px', gap: 16 },
  survivalMeter: {
    background: 'linear-gradient(135deg, rgba(232,197,71,0.08) 0%, rgba(232,69,69,0.04) 100%)',
    border: '0.5px solid var(--gold-border)',
    borderRadius: 12, padding: '16px',
  },
  meterLabel: {
    fontFamily: 'var(--font-display)', fontSize: 8, fontWeight: 600,
    letterSpacing: '2px', color: 'var(--gold)', opacity: 0.5,
    textTransform: 'uppercase', marginBottom: 10,
  },
  meterRow: { display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 10 },
  meterScore: {
    fontFamily: 'var(--font-metric)', fontSize: 52,
    fontWeight: 800, lineHeight: 1, color: 'var(--gold)',
  },
  meterTitle: {
    fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600, color: 'var(--cream)',
  },
  meterStatus: { fontSize: 10, color: 'var(--gold)', fontWeight: 500 },
  meterQuote: {
    fontSize: 11, fontStyle: 'italic', color: 'var(--cream)',
    opacity: 0.8, borderLeft: '2px solid var(--gold)',
    paddingLeft: 10, lineHeight: 1.5, marginBottom: 12,
  },
  barRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 },
  barLabel: { fontSize: 10, color: 'var(--cream-muted)', flex: 1 },
  barTrack: { flex: 2, height: 3, background: 'rgba(245,242,235,0.08)', borderRadius: 2, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 2 },
  barVal: { fontSize: 10, fontWeight: 500, minWidth: 24, textAlign: 'right' },
  rightCol: { display: 'flex', flexDirection: 'column', gap: 12 },
  miniCard: {
    background: 'var(--cream-faint)', border: '0.5px solid var(--border)',
    borderRadius: 10, padding: '12px',
  },
  miniCardLabel: {
    fontFamily: 'var(--font-display)', fontSize: 8, fontWeight: 700,
    letterSpacing: '2px', color: 'var(--cream-dim)',
    textTransform: 'uppercase', marginBottom: 8,
  },
  assignRow: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 },
  assignDot: { width: 5, height: 5, borderRadius: '50%', flexShrink: 0 },
  assignName: { flex: 1, fontSize: 10, color: 'var(--cream)', fontWeight: 500 },
  assignH: { fontSize: 10, fontWeight: 700 },
  gradeGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 },
  gradeCard: {
    background: 'var(--black-3)', border: '0.5px solid var(--border)',
    borderRadius: 8, padding: '8px', textAlign: 'center',
  },
  gradeCourse: { fontSize: 9, color: 'var(--cream-dim)', marginBottom: 3 },
  gradeValue: { fontFamily: 'var(--font-metric)', fontSize: 20, fontWeight: 800, lineHeight: 1 },
  weekendCard: {
    background: 'var(--red-dim)', border: '0.5px solid var(--red-border)',
    borderRadius: 10, padding: '12px',
  },
  weekendLabel: {
    fontFamily: 'var(--font-display)', fontSize: 8, fontWeight: 600,
    letterSpacing: '1.5px', color: 'var(--red-text)',
    textTransform: 'uppercase', marginBottom: 6,
  },
  weekendText: { fontSize: 11, color: 'var(--cream)', opacity: 0.85, lineHeight: 1.5, marginBottom: 10 },
  weekendMetrics: { display: 'flex', gap: 8 },
  metric: {
    flex: 1, textAlign: 'center',
    background: 'var(--cream-faint)', borderRadius: 6, padding: '7px',
  },
  metricNum: {
    fontFamily: 'var(--font-metric)', fontSize: 18,
    fontWeight: 800, color: 'var(--gold)', lineHeight: 1,
  },
  metricLabel: { fontSize: 8, color: 'var(--cream-muted)', marginTop: 2, letterSpacing: '1px' },
  cta: {
    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
    color: 'var(--black)', background: 'var(--gold)',
    border: 'none', borderRadius: 10, padding: '15px 38px', cursor: 'pointer',
  },
};

/* ─── Chaos Section Styles ───────────────────────────────────── */
const CH = {
  section: {
    position: 'relative', zIndex: 5,
    borderTop: '0.5px solid var(--border)',
    padding: '80px 40px',
  },
  inner: { maxWidth: 700, margin: '0 auto', textAlign: 'center' },
  title: {
    fontFamily: 'var(--font-metric)', fontWeight: 800,
    fontSize: 'clamp(28px, 4vw, 48px)',
    lineHeight: 1.1, letterSpacing: '-1px',
    color: 'var(--cream)', marginBottom: 40,
  },
  grid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: 12, maxWidth: 440, margin: '0 auto 40px', textAlign: 'left',
  },
  listItem: {
    display: 'flex', alignItems: 'center', gap: 10,
    fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600,
    color: 'var(--cream)', padding: '10px 0',
    borderBottom: '0.5px solid var(--border)',
  },
  listDot: { width: 7, height: 7, borderRadius: '50%', background: 'var(--gold)', flexShrink: 0 },
  dividerRow: {
    display: 'flex', alignItems: 'center', gap: 16,
    margin: '8px 0 28px',
  },
  dividerLine: { flex: 1, height: '0.5px', background: 'var(--border)' },
  dividerText: {
    fontFamily: 'var(--font-display)', fontSize: 13,
    fontWeight: 600, color: 'var(--cream-dim)', whiteSpace: 'nowrap',
  },
  punchline: {
    fontFamily: 'var(--font-metric)', fontWeight: 800,
    fontSize: 'clamp(24px, 3.5vw, 40px)',
    letterSpacing: '-0.5px', color: 'var(--cream)',
  },
};

/* ─── Testimonial Styles ─────────────────────────────────────── */
const T = {
  section: {
    position: 'relative', zIndex: 5,
    borderTop: '0.5px solid var(--border)',
    padding: '80px 40px',
    background: 'var(--black-2)',
  },
  inner: { maxWidth: 960, margin: '0 auto' },
  eyebrow: {
    fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700,
    letterSpacing: '3px', color: 'var(--cream-dim)',
    textTransform: 'uppercase', marginBottom: 14, textAlign: 'center',
  },
  title: {
    fontFamily: 'var(--font-metric)', fontWeight: 800,
    fontSize: 'clamp(24px, 3vw, 40px)',
    letterSpacing: '-0.5px', color: 'var(--cream)',
    textAlign: 'center', marginBottom: 48,
  },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 16,
  },
  card: {
    background: 'var(--black-3)', border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius-xl)', padding: '28px 24px',
    display: 'flex', flexDirection: 'column', gap: 20,
  },
  quote: {
    fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600,
    lineHeight: 1.5, color: 'var(--cream)', flex: 1,
  },
  meta: {},
  name: {
    fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700,
    color: 'var(--gold)', marginBottom: 3,
  },
  detail: { fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--cream-dim)' },
};

/* ─── Integration Styles ─────────────────────────────────────── */
const IN = {
  section: {
    position: 'relative', zIndex: 5,
    borderTop: '0.5px solid var(--border)',
    padding: '80px 40px',
  },
  inner: { maxWidth: 960, margin: '0 auto' },
  eyebrow: {
    fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700,
    letterSpacing: '3px', color: 'var(--cream-dim)',
    textTransform: 'uppercase', marginBottom: 14, textAlign: 'center',
  },
  title: {
    fontFamily: 'var(--font-metric)', fontWeight: 800,
    fontSize: 'clamp(26px, 3.5vw, 44px)',
    lineHeight: 1.1, letterSpacing: '-1px',
    color: 'var(--cream)', textAlign: 'center', marginBottom: 14,
  },
  sub: {
    fontFamily: 'var(--font-body)', fontSize: 15,
    color: 'var(--cream-muted)', textAlign: 'center',
    marginBottom: 48, lineHeight: 1.6,
  },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 14,
  },
  card: {
    position: 'relative',
    background: 'var(--black-3)', border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius-xl)', padding: '24px 20px',
    overflow: 'hidden',
    display: 'flex', flexDirection: 'column', gap: 10,
  },
  cardBar: { position: 'absolute', top: 0, left: 0, right: 0, height: '2px', opacity: 0.7 },
  cardTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  cardIcon: { fontSize: 22 },
  cardStatus: {
    fontFamily: 'var(--font-display)', fontSize: 9, fontWeight: 700,
    letterSpacing: '1.5px', borderRadius: 100, padding: '3px 10px',
  },
  cardName: {
    fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, letterSpacing: '-0.2px',
  },
  cardDesc: {
    fontFamily: 'var(--font-body)', fontSize: 13,
    color: 'var(--cream-muted)', lineHeight: 1.6,
  },
};

/* ─── Global CSS ─────────────────────────────────────────────── */
const globalCss = `
  @keyframes cardFloat {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-10px); }
  }
  @keyframes chipPop {
    from { opacity: 0; transform: scale(0.9) translateY(10px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  .chip-idle:hover {
    background: var(--black-4) !important;
    border-color: var(--border-hover) !important;
    transform: translateY(-2px);
  }
  .chip-active:hover {
    opacity: 0.9;
  }

  @media (max-width: 900px) {
    nav { padding: 18px 24px !important; }
  }
  @media (max-width: 680px) {
    nav { padding: 16px 20px !important; }
    section { padding: 60px 20px !important; }
    h1 { letter-spacing: -1px !important; }
    .dash-sidebar { display: none; }
  }
`;
