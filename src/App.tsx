import { useState, useEffect } from 'react';
import { SchedulerProvider, useScheduler } from './context/SchedulerContext';
import type { AppPage, Algorithm } from './types';
import {
  ControlPanel,
  ProcessForm,
  GanttChart,
  KernelLog,
  MetricsDashboard,
  ProcessQueue,
  ProcessTable,
  PredictionTable,
  Scorecard,
  QuizPopup,
  LearnPage,
  LandingPage,
} from './components';

// Preset configurations for quick-start demos
const DEMO_PRESETS = {
  'convoy': {
    algorithm: 'FCFS' as Algorithm,
    processes: [
      { name: 'P1 (Long)', arrivalTime: 0, burst: 12, priority: 1 },
      { name: 'P2 (Short)', arrivalTime: 1, burst: 2, priority: 1 },
      { name: 'P3 (Short)', arrivalTime: 2, burst: 2, priority: 1 },
      { name: 'P4 (Short)', arrivalTime: 3, burst: 2, priority: 1 },
    ],
  },
  'rr-quantum': {
    algorithm: 'ROUND_ROBIN' as Algorithm,
    processes: [
      { name: 'P1', arrivalTime: 0, burst: 8, priority: 1 },
      { name: 'P2', arrivalTime: 1, burst: 4, priority: 1 },
      { name: 'P3', arrivalTime: 2, burst: 6, priority: 1 },
    ],
  },
  'starvation': {
    algorithm: 'PRIORITY_NON_PREEMPTIVE' as Algorithm,
    processes: [
      { name: 'High (P1)', arrivalTime: 0, burst: 4, priority: 1 },
      { name: 'High (P2)', arrivalTime: 2, burst: 4, priority: 1 },
      { name: 'High (P3)', arrivalTime: 4, burst: 4, priority: 2 },
      { name: 'LOW (Starve)', arrivalTime: 1, burst: 3, priority: 10 },
    ],
  },
};

function AppContent() {
  const [currentPage, setCurrentPage] = useState<AppPage>('HOME');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('cpu-scheduler-dark-mode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const { dispatch } = useScheduler();

  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('cpu-scheduler-dark-mode', String(darkMode));
  }, [darkMode]);

  const handleNavigate = (page: 'SIMULATOR' | 'LEARN') => {
    setCurrentPage(page);
  };

  const handleLoadPreset = (presetName: string) => {
    const preset = DEMO_PRESETS[presetName as keyof typeof DEMO_PRESETS];
    if (preset) {
      dispatch({ type: 'SET_ALGORITHM', payload: preset.algorithm });
      dispatch({ type: 'CLEAR_PROCESSES' });
      // Add processes from preset
      preset.processes.forEach((p) => {
        dispatch({
          type: 'ADD_PROCESS',
          payload: {
            name: p.name,
            arrivalTime: p.arrivalTime,
            priority: p.priority,
            bursts: [{ type: 'CPU', duration: p.burst, remaining: p.burst }],
            color: '',
          },
        });
      });
    }
  };

  const handleNavigateToSimulator = (algorithm?: string, _preset?: string) => {
    setCurrentPage('SIMULATOR');
    if (algorithm) {
      dispatch({ type: 'SET_ALGORITHM', payload: algorithm as Algorithm });
    }
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      {/* Header - Only show on SIMULATOR and LEARN pages */}
      {currentPage !== 'HOME' && (
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title" onClick={() => setCurrentPage('HOME')} style={{ cursor: 'pointer' }}>
              <span className="title-icon">⚡</span>
              CPU Scheduler Visualizer
            </h1>
            <p className="app-subtitle">
              Interactive simulation of CPU scheduling algorithms
            </p>
          </div>

          <nav className="page-nav">
            <button
              className={`nav-tab ${currentPage === 'SIMULATOR' ? 'active' : ''}`}
              onClick={() => setCurrentPage('SIMULATOR')}
            >
              <span className="nav-icon">⚡</span>
              Simulator
            </button>
            <button
              className={`nav-tab ${currentPage === 'LEARN' ? 'active' : ''}`}
              onClick={() => setCurrentPage('LEARN')}
            >
              <span className="nav-icon">📚</span>
              Learn
            </button>
          </nav>
        </header>
      )}

      {/* Page Rendering */}
      {currentPage === 'HOME' ? (
        <LandingPage
          onNavigate={handleNavigate}
          onLoadPreset={handleLoadPreset}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      ) : currentPage === 'SIMULATOR' ? (
        <>
          <main className="app-main">
            <aside className="sidebar-left">
              <ControlPanel />
            </aside>

            <div className="main-content">
              <section className="top-section">
                <div className="top-left">
                  <ProcessForm />
                  <PredictionTable />
                  <ProcessTable />
                </div>
                <div className="top-right">
                  <MetricsDashboard />
                </div>
              </section>

              <section className="middle-section">
                <GanttChart />
              </section>

              <section className="bottom-section">
                <ProcessQueue />
              </section>
            </div>

            <aside className="sidebar-right">
              <KernelLog />
            </aside>
          </main>

          <footer className="app-footer">
            <p>
              Algorithms: FCFS • SJF • SRTF • Round Robin • Priority • MLFQ |
              Multi-Core Support • I/O Bursts • Priority Aging
            </p>
          </footer>

          <Scorecard />
          <QuizPopup />
        </>
      ) : (
        <LearnPage
          onNavigateToSimulator={handleNavigateToSimulator}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <SchedulerProvider>
      <AppContent />
    </SchedulerProvider>
  );
}

export default App;
