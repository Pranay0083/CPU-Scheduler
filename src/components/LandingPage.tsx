interface LandingPageProps {
    onNavigate: (page: 'SIMULATOR' | 'LEARN') => void;
    onLoadPreset: (preset: string) => void;
    darkMode: boolean;
    onToggleDarkMode: () => void;
}

export function LandingPage({ onNavigate, onLoadPreset, darkMode, onToggleDarkMode }: LandingPageProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-tertiary to-bg-secondary flex flex-col items-center pb-20 overflow-x-hidden text-text-primary">
            {/* Hero Section */}
            <section className="min-h-[90vh] flex flex-col justify-center items-center w-full px-4 relative isolate gap-12 text-center">
                <div className="flex flex-col items-center max-w-4xl z-10 gap-6">
                    <div className="px-4 py-1.5 rounded-full bg-accent-primary/20 border border-accent-primary/30 text-accent-primary text-sm font-bold uppercase tracking-wider backdrop-blur-sm animate-pulse">
                        ⚡ The Ultimate OS Scheduler Explorer
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-2 leading-tight flex flex-col md:block items-center justify-center gap-2">
                        <span className="bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-info bg-clip-text text-transparent">CoreFlow</span>
                        <span className="text-accent-primary mx-2 hidden md:inline">:</span>
                        <span className="text-white">CPU Scheduler</span>
                    </h1>
                    <p className="text-xl text-text-secondary max-w-2xl leading-relaxed">
                        Visualize process life cycles, master complex scheduling algorithms,
                        and test your OS knowledge with real-time simulations.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                        <button
                            className="px-8 py-4 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-bold text-lg shadow-lg hover:shadow-glow hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                            onClick={() => onNavigate('SIMULATOR')}
                        >
                            <span className="text-xl">🚀</span>
                            Start Simulating
                        </button>
                        <button
                            className="px-8 py-4 rounded-full bg-bg-glass backdrop-blur-md border border-accent-primary/30 text-accent-info font-bold text-lg hover:bg-white/5 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                            onClick={() => onNavigate('LEARN')}
                        >
                            <span className="text-xl">📖</span>
                            Read the Theory
                        </button>
                    </div>
                </div>

                {/* Mini Gantt Animation */}
                <div className="relative w-full max-w-2xl glass-panel p-6 opacity-80 scale-90 md:scale-100 hover:scale-[1.02] transition-transform duration-500">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 text-sm font-bold text-text-secondary">CPU</div>
                            <div className="flex-1 h-12 bg-bg-secondary rounded-lg overflow-hidden flex relative">
                                <div className="absolute inset-y-0 left-0 bg-accent-info/80 flex items-center justify-center text-white font-bold text-xs animate-[wiggle_4s_ease-in-out_infinite]" style={{ width: '30%', animationDelay: '0s' }}>P1</div>
                                <div className="absolute inset-y-0 left-[30%] bg-accent-success/80 flex items-center justify-center text-white font-bold text-xs animate-[wiggle_4s_ease-in-out_infinite]" style={{ width: '20%', animationDelay: '0.8s' }}>P2</div>
                                <div className="absolute inset-y-0 left-[50%] bg-accent-warning/80 flex items-center justify-center text-white font-bold text-xs animate-[wiggle_4s_ease-in-out_infinite]" style={{ width: '25%', animationDelay: '1.4s' }}>P3</div>
                                <div className="absolute inset-y-0 left-[75%] bg-accent-info/80 flex items-center justify-center text-white font-bold text-xs animate-[wiggle_4s_ease-in-out_infinite]" style={{ width: '25%', animationDelay: '2s' }}>P1</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4 mt-4 justify-center">
                        <div className="px-3 py-1 bg-bg-secondary rounded-full flex items-center gap-2 border border-border-main">
                            <div className="w-2 h-2 rounded-full bg-accent-success custom-pulse"></div>
                            <span className="text-xs font-mono">Core 0</span>
                        </div>
                        <div className="px-3 py-1 bg-bg-secondary rounded-full flex items-center gap-2 border border-border-main">
                            <div className="w-2 h-2 rounded-full bg-accent-warning"></div>
                            <span className="text-xs font-mono">Core 1</span>
                        </div>
                    </div>
                </div>

                {/* Theme Toggle */}
                <button
                    className="absolute top-6 right-6 p-3 rounded-full bg-bg-glass backdrop-blur-md border border-border-main hover:bg-white/10 transition-all text-xl"
                    onClick={onToggleDarkMode}
                    title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {darkMode ? '☀️' : '🌙'}
                </button>
            </section>

            {/* 3-Pillar Navigation Cards */}
            <section className="w-full max-w-7xl px-4 py-20 flex flex-col items-center gap-12">
                <h2 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-white to-text-secondary bg-clip-text text-transparent">Choose Your Path</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                    <div
                        className="glass-panel p-8 flex flex-col gap-4 cursor-pointer hover:-translate-y-2 transition-transform duration-300 group border-t-4 border-t-accent-secondary"
                        onClick={() => onNavigate('LEARN')}
                    >
                        <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">📚</div>
                        <h3 className="text-2xl font-bold">Learn</h3>
                        <p className="text-accent-secondary font-medium uppercase tracking-wider text-sm">Theory & Logic</p>
                        <p className="text-text-secondary leading-relaxed">
                            Deep dive into the process state model, Gantt math, and algorithm mechanics.
                        </p>
                        <div className="mt-auto text-accent-secondary group-hover:translate-x-2 transition-transform">→</div>
                    </div>

                    <div
                        className="glass-panel p-8 flex flex-col gap-4 cursor-pointer hover:-translate-y-2 transition-transform duration-300 group border-t-4 border-t-accent-primary transform md:-translate-y-4"
                        onClick={() => onNavigate('SIMULATOR')}
                    >
                        <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🎮</div>
                        <h3 className="text-2xl font-bold">Visualize</h3>
                        <p className="text-accent-primary font-medium uppercase tracking-wider text-sm">The Simulator</p>
                        <p className="text-text-secondary leading-relaxed">
                            Build custom scenarios, toggle multi-core CPUs, and watch the scheduler in action.
                        </p>
                        <div className="mt-auto text-accent-primary group-hover:translate-x-2 transition-transform">→</div>
                    </div>

                    <div
                        className="glass-panel p-8 flex flex-col gap-4 cursor-pointer hover:-translate-y-2 transition-transform duration-300 group border-t-4 border-t-accent-warning"
                        onClick={() => onNavigate('SIMULATOR')}
                    >
                        <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">📝</div>
                        <h3 className="text-2xl font-bold">Test</h3>
                        <p className="text-accent-warning font-medium uppercase tracking-wider text-sm">Predict & Verify</p>
                        <p className="text-text-secondary leading-relaxed">
                            Challenge yourself. Guess the timings, answer "Who's next?" and get a score.
                        </p>
                        <div className="mt-auto text-accent-warning group-hover:translate-x-2 transition-transform">→</div>
                    </div>
                </div>
            </section>

            {/* Process Journey */}
            <section className="w-full max-w-7xl px-4 py-20 flex flex-col items-center gap-12 bg-bg-secondary/30 rounded-3xl border border-white/5">
                <h2 className="text-3xl font-bold text-center">The Process Journey</h2>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full justify-center">
                    <div className="flex flex-col items-center gap-4 p-6 glass-panel flex-1 text-center min-w-[200px]">
                        <div className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center font-bold text-accent-primary border border-accent-primary">1</div>
                        <div className="text-3xl">⌨️</div>
                        <h4 className="font-bold">Input</h4>
                        <p className="text-sm text-text-secondary">Enter Arrival Time, Burst Time & Priority</p>
                    </div>
                    <div className="hidden md:block h-0.5 w-12 bg-border-main"></div>
                    <div className="flex flex-col items-center gap-4 p-6 glass-panel flex-1 text-center min-w-[200px]">
                        <div className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center font-bold text-accent-secondary border border-accent-secondary">2</div>
                        <div className="text-3xl">⚙️</div>
                        <h4 className="font-bold">Processing</h4>
                        <p className="text-sm text-text-secondary">Engine calculates scheduling sequence</p>
                    </div>
                    <div className="hidden md:block h-0.5 w-12 bg-border-main"></div>
                    <div className="flex flex-col items-center gap-4 p-6 glass-panel flex-1 text-center min-w-[200px]">
                        <div className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center font-bold text-accent-info border border-accent-info">3</div>
                        <div className="text-3xl">📊</div>
                        <h4 className="font-bold">Visualization</h4>
                        <p className="text-sm text-text-secondary">Gantt chart & queues animate live</p>
                    </div>
                    <div className="hidden md:block h-0.5 w-12 bg-border-main"></div>
                    <div className="flex flex-col items-center gap-4 p-6 glass-panel flex-1 text-center min-w-[200px]">
                        <div className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center font-bold text-accent-success border border-accent-success">4</div>
                        <div className="text-3xl">📈</div>
                        <h4 className="font-bold">Analytics</h4>
                        <p className="text-sm text-text-secondary">View AWT, ATAT, CPU utilization</p>
                    </div>
                </div>
            </section>

            {/* Feature Highlights */}
            <section className="w-full max-w-7xl px-4 py-20 flex flex-col items-center gap-12">
                <h2 className="text-3xl font-bold text-center">Why This Tool?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {[
                        { icon: '🖥️', title: 'Multi-Core Ready', desc: 'Simulate load balancing across up to 4 CPU cores with real-time visualization.' },
                        { icon: '💾', title: 'I/O Blocking', desc: 'Real-world scenarios where processes wait for disk, network, or user input.' },
                        { icon: '🔥', title: 'Starvation Alerts', desc: 'Watch processes turn red as they wait too long. See aging rescue them.' },
                        { icon: '🎯', title: 'MLFQ Mastery', desc: 'Explore the most complex industry-standard scheduling algorithms.' },
                        { icon: '📐', title: '6 Algorithms', desc: 'FCFS, SJF, SRTF, Round Robin, Priority, and Multi-Level Feedback Queue.' },
                        { icon: '🧪', title: 'Test Mode', desc: 'Predict completion times and get scored on scheduler decisions.' }
                    ].map((feature, i) => (
                        <div key={i} className="glass-panel p-6 flex flex-col gap-4 hover:-translate-y-1 transition-transform border border-white/5 hover:border-accent-primary/30">
                            <div className="text-3xl">{feature.icon}</div>
                            <h4 className="font-bold text-lg">{feature.title}</h4>
                            <p className="text-text-secondary text-sm leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Quick-Start Presets */}
            <section className="w-full max-w-7xl px-4 py-20 flex flex-col items-center gap-8 mb-20 bg-gradient-to-t from-black/20 to-transparent rounded-3xl">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-2">One-Click Demos</h2>
                    <p className="text-text-secondary">Jump right into classic scheduling scenarios</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                    <div
                        className="glass-panel p-6 cursor-pointer hover:bg-white/5 transition-all group border-l-4 border-l-accent-error"
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
