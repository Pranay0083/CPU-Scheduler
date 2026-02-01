interface LandingPageProps {
    onNavigate: (page: 'SIMULATOR' | 'LEARN') => void;
    onLoadPreset: (preset: string) => void;
    darkMode: boolean;
    onToggleDarkMode: () => void;
}

export function LandingPage({ onNavigate, onLoadPreset, darkMode, onToggleDarkMode }: LandingPageProps) {
    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge">⚡ The Ultimate OS Scheduler Explorer</div>
                    <h1 className="hero-title">
                        <span className="title-gradient">CoreFlow</span>
                        <span className="title-divider">:</span>
                        <span className="title-main">CPU Scheduler</span>
                    </h1>
                    <p className="hero-subtitle">
                        Visualize process life cycles, master complex scheduling algorithms,
                        and test your OS knowledge with real-time simulations.
                    </p>
                    <div className="hero-cta">
                        <button
                            className="cta-primary"
                            onClick={() => onNavigate('SIMULATOR')}
                        >
                            <span className="cta-icon">🚀</span>
                            Start Simulating
                        </button>
                        <button
                            className="cta-secondary"
                            onClick={() => onNavigate('LEARN')}
                        >
                            <span className="cta-icon">📖</span>
                            Read the Theory
                        </button>
                    </div>
                </div>

                {/* Mini Gantt Animation */}
                <div className="hero-visual">
                    <div className="mini-gantt">
                        <div className="gantt-label">CPU</div>
                        <div className="gantt-track">
                            <div className="gantt-block block-p1" style={{ animationDelay: '0s' }}>P1</div>
                            <div className="gantt-block block-p2" style={{ animationDelay: '0.8s' }}>P2</div>
                            <div className="gantt-block block-p3" style={{ animationDelay: '1.4s' }}>P3</div>
                            <div className="gantt-block block-p1" style={{ animationDelay: '2s' }}>P1</div>
                        </div>
                    </div>
                    <div className="cpu-cores-visual">
                        <div className="core-chip">
                            <div className="core-dot running"></div>
                            <span>Core 0</span>
                        </div>
                        <div className="core-chip">
                            <div className="core-dot ready"></div>
                            <span>Core 1</span>
                        </div>
                    </div>
                </div>

                {/* Theme Toggle */}
                <button
                    className="hero-theme-toggle"
                    onClick={onToggleDarkMode}
                    title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {darkMode ? '☀️' : '🌙'}
                </button>
            </section>

            {/* 3-Pillar Navigation Cards */}
            <section className="pillar-section">
                <h2 className="section-title">Choose Your Path</h2>
                <div className="pillar-cards">
                    <div
                        className="pillar-card learn"
                        onClick={() => onNavigate('LEARN')}
                    >
                        <div className="pillar-icon">📚</div>
                        <h3>Learn</h3>
                        <p className="pillar-subtitle">Theory & Logic</p>
                        <p className="pillar-desc">
                            Deep dive into the process state model, Gantt math, and algorithm mechanics.
                        </p>
                        <div className="pillar-arrow">→</div>
                    </div>

                    <div
                        className="pillar-card visualize"
                        onClick={() => onNavigate('SIMULATOR')}
                    >
                        <div className="pillar-icon">🎮</div>
                        <h3>Visualize</h3>
                        <p className="pillar-subtitle">The Simulator</p>
                        <p className="pillar-desc">
                            Build custom scenarios, toggle multi-core CPUs, and watch the scheduler in action.
                        </p>
                        <div className="pillar-arrow">→</div>
                    </div>

                    <div
                        className="pillar-card test"
                        onClick={() => onNavigate('SIMULATOR')}
                    >
                        <div className="pillar-icon">📝</div>
                        <h3>Test</h3>
                        <p className="pillar-subtitle">Predict & Verify</p>
                        <p className="pillar-desc">
                            Challenge yourself. Guess the timings, answer "Who's next?" and get a score.
                        </p>
                        <div className="pillar-arrow">→</div>
                    </div>
                </div>
            </section>

            {/* Process Journey */}
            <section className="journey-section">
                <h2 className="section-title">The Process Journey</h2>
                <p className="section-subtitle">From input to insights in 4 steps</p>
                <div className="journey-steps">
                    <div className="journey-step">
                        <div className="step-number">1</div>
                        <div className="step-icon">⌨️</div>
                        <h4>Input</h4>
                        <p>Enter Arrival Time, Burst Time & Priority</p>
                    </div>
                    <div className="journey-connector"></div>
                    <div className="journey-step">
                        <div className="step-number">2</div>
                        <div className="step-icon">⚙️</div>
                        <h4>Processing</h4>
                        <p>Engine calculates scheduling sequence</p>
                    </div>
                    <div className="journey-connector"></div>
                    <div className="journey-step">
                        <div className="step-number">3</div>
                        <div className="step-icon">📊</div>
                        <h4>Visualization</h4>
                        <p>Gantt chart & queues animate live</p>
                    </div>
                    <div className="journey-connector"></div>
                    <div className="journey-step">
                        <div className="step-number">4</div>
                        <div className="step-icon">📈</div>
                        <h4>Analytics</h4>
                        <p>View AWT, ATAT, CPU utilization</p>
                    </div>
                </div>
            </section>

            {/* Feature Highlights */}
            <section className="features-section">
                <h2 className="section-title">Why This Tool?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🖥️</div>
                        <h4>Multi-Core Ready</h4>
                        <p>Simulate load balancing across up to 4 CPU cores with real-time visualization.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">💾</div>
                        <h4>I/O Blocking</h4>
                        <p>Real-world scenarios where processes wait for disk, network, or user input.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔥</div>
                        <h4>Starvation Alerts</h4>
                        <p>Watch processes turn red as they wait too long. See aging rescue them.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🎯</div>
                        <h4>MLFQ Mastery</h4>
                        <p>Explore the most complex industry-standard scheduling algorithms.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📐</div>
                        <h4>6 Algorithms</h4>
                        <p>FCFS, SJF, SRTF, Round Robin, Priority, and Multi-Level Feedback Queue.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🧪</div>
                        <h4>Test Mode</h4>
                        <p>Predict completion times and get scored. Quiz yourself on scheduler decisions.</p>
                    </div>
                </div>
            </section>

            {/* Quick-Start Presets */}
            <section className="presets-section">
                <h2 className="section-title">One-Click Demos</h2>
                <p className="section-subtitle">Jump right into classic scheduling scenarios</p>
                <div className="preset-cards">
                    <div
                        className="preset-card convoy"
                        onClick={() => { onLoadPreset('convoy'); onNavigate('SIMULATOR'); }}
                    >
                        <div className="preset-icon">🚛</div>
                        <h4>Convoy Effect</h4>
                        <p>See why FCFS struggles when a long process blocks short ones.</p>
                        <span className="preset-algo">FCFS</span>
                    </div>
                    <div
                        className="preset-card quantum"
                        onClick={() => { onLoadPreset('rr-quantum'); onNavigate('SIMULATOR'); }}
                    >
                        <div className="preset-icon">⏱️</div>
                        <h4>Time Quantum Test</h4>
                        <p>Experiment with different quantum sizes in Round Robin.</p>
                        <span className="preset-algo">Round Robin</span>
                    </div>
                    <div
                        className="preset-card starvation"
                        onClick={() => { onLoadPreset('starvation'); onNavigate('SIMULATOR'); }}
                    >
                        <div className="preset-icon">💀</div>
                        <h4>Starvation Demo</h4>
                        <p>Watch low-priority processes suffer. Enable aging to save them!</p>
                        <span className="preset-algo">Priority</span>
                    </div>
                </div>
            </section>

            {/* Stats Footer */}
            <footer className="landing-footer">
                <div className="stats-counter">
                    <div className="stat">
                        <span className="stat-value">6</span>
                        <span className="stat-label">Algorithms</span>
                    </div>
                    <div className="stat-divider">•</div>
                    <div className="stat">
                        <span className="stat-value">4</span>
                        <span className="stat-label">CPU Cores</span>
                    </div>
                    <div className="stat-divider">•</div>
                    <div className="stat">
                        <span className="stat-value">∞</span>
                        <span className="stat-label">Possibilities</span>
                    </div>
                </div>
                <p className="footer-tagline">
                    Built for OS students, by OS enthusiasts.
                    <span className="footer-heart">💜</span>
                </p>
            </footer>
        </div>
    );
}

export default LandingPage;
