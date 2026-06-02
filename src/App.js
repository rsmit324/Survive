import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import SurvivalReport from './pages/SurvivalReport';
import Calendar from './pages/Calendar';
import Assignments from './pages/Assignments';
import Grades from './pages/Grades';
import Recruiting from './pages/Recruiting';
import AIChat from './pages/AIChat';
import LandingPage from './pages/LandingPage';

// Wraps all dashboard routes with the Sidebar layout
function AppShell() {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--black)' }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: 'auto', height: '100vh' }}>
        <Routes>
          <Route path="/dashboard"        element={<Dashboard />} />
          <Route path="/survival-report"  element={<SurvivalReport />} />
          <Route path="/calendar"         element={<Calendar />} />
          <Route path="/assignments"      element={<Assignments />} />
          <Route path="/grades"           element={<Grades />} />
          <Route path="/recruiting"       element={<Recruiting />} />
          <Route path="/ai"              element={<AIChat />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page — no sidebar */}
        <Route path="/" element={<LandingPage />} />

        {/* All dashboard routes — with sidebar */}
        <Route path="/*" element={<AppShell />} />
      </Routes>
    </BrowserRouter>
  );
}
