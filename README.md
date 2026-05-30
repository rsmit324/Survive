# Survive — AI College OS

> "Go have fun. We'll help you survive."

Survive is an AI operating system for college life. It brings Canvas, Outlook, your calendar, social events, Greek life, game days, and recruiting into one place — and acts as your personal AI college copilot.

## What's Built

| Page | Description |
|------|-------------|
| **Dashboard** | Survival score, upcoming assignments, grade forecast, today's agenda |
| **Weekend Report** | AI survival analysis, fun score, academic threats, recovery plan |
| **Social Calendar** | All events by day — class, Greek life, game days, recruiting, AI study blocks |
| **Assignments** | Urgency-ranked, expandable with topics + AI study plan per assignment |
| **Grades** | Per-course tracking with projected outcome scenarios |
| **Recruiting** | Pipeline tracker with status, next steps, deadlines |
| **Ask Survive** | Live AI chat powered by Claude — knows your real schedule + grades |

## Quick Start

```bash
cd survive
npm install
npm start
```

Runs at `http://localhost:3000`

## AI Chat Setup

The AI chat page (`/ai`) calls the Anthropic API directly. To enable it:

1. Go to `src/pages/AIChat.jsx`
2. The API call is already wired — it needs an API key via a proxy or env variable
3. For local dev, set up a simple Express proxy:

```bash
npm install express cors
```

Create `server.js`:
```js
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(req.body),
  });
  const data = await response.json();
  res.json(data);
});

app.listen(3001, () => console.log('Proxy on :3001'));
```

Then update `AIChat.jsx` to call `http://localhost:3001/api/chat` instead.

## Deploying to Vercel

```bash
npm install -g vercel
vercel
```

Done. Free hosting. Share the URL.

## Next: Canvas Integration

When ready to integrate Canvas:

1. Add a settings page where students paste their Canvas API token
2. Replace `src/data/mockData.js` with live Canvas API calls
3. Canvas base URL: `https://YOUR_SCHOOL.instructure.com/api/v1/`
4. Endpoints to hit:
   - `/courses` — enrolled courses
   - `/courses/:id/assignments` — assignments per course
   - `/courses/:id/grades` — current grades

## Tech Stack

- React 18 + React Router 6
- Zero backend (mock data → real API calls)
- Deploys anywhere (Vercel, Netlify, GitHub Pages)
- Anthropic Claude API for AI chat

## Brand

**Philosophy:** "Go have fun. We'll help you survive."  
The AI is never preachy, never tells students not to go out.  
It predicts tradeoffs. It gives the honest plan. It roots for you.
