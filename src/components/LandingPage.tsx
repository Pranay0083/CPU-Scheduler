import { useState, useEffect } from 'react';

interface LandingPageProps {
    onNavigate: (page: 'SIMULATOR' | 'LEARN') => void;
    onLoadPreset: (preset: string) => void;
    darkMode: boolean;
    onToggleDarkMode: () => void;
}

// Custom hook for typing effect
function useTypingEffect(text: string, speed: number = 30) {
    const [displayedText, setDisplayedText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        let i = 0;
        setDisplayedText('');
        setIsComplete(false);
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayedText((prev) => prev + text.charAt(i));
                i++;
            } else {
                setIsComplete(true);
                clearInterval(timer);
            }
        }, speed);
        return () => clearInterval(timer);
    }, [text, speed]);

    return { displayedText, isComplete };
}

// Window Chrome component for terminal-like windows
const WindowChrome = ({ title, darkMode, activeColor = 'bg-accent-secondary' }: { title: string, darkMode: boolean, activeColor?: string }) => (
    <div className={`flex items-center justify-between px-4 py-2 border-b text-xs font-mono uppercase tracking-widest ${darkMode ? 'border-[#30363D] bg-[#0f131a]' : 'border-gray-300 bg-gray-200'} `}>
        <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-accent-error shadow-[0_0_5px_rgba(255,95,95,0.5)]"></div>
            <div className="w-3 h-3 rounded-full bg-accent-warning shadow-[0_0_5px_rgba(245,158,11,0.5)]"></div>
            <div className="w-3 h-3 rounded-full bg-accent-success shadow-[0_0_5px_rgba(80,250,123,0.5)]"></div>
        </div>
        <div className={`opacity-80 flex items-center gap-2 ${darkMode ? 'text-text-secondary' : 'text-gray-600'} `}>
            <span className={`w-2 h-2 rounded-sm animate-pulse ${activeColor} `}></span>
            {title}
        </div>
    </div>
);

export function LandingPage({ onNavigate, darkMode, onToggleDarkMode }: LandingPageProps) {
    const heroText = "> Compare FCFS, SJF, Round Robin, and Priority Scheduling with interactive visualizations and performance analytics.";
    const { displayedText: typedHeroText } = useTypingEffect(heroText, 25);

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-bg-primary text-text-primary' : 'bg-gray-100 text-gray-900'} relative overflow-x-hidden flex flex-col items-center transition-colors duration-300`}>

            {/* CRT Scanline effect */}
            {darkMode && <div className="scanline-overlay"></div>}

            {/* Top Navigation Bar / System Monitor */}
            <div className={`w-full h-10 border-b flex items-center justify-between px-6 font-mono text-[10px] tracking-widest uppercase relative z-50 ${darkMode ? 'bg-[#161B22] border-[#30363D] text-[#94a3b8]' : 'bg-gray-200 border-gray-300 text-gray-600'} `}>
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-2"><div className="w-2 h-2 bg-accent-primary rounded-sm animate-pulse"></div> SYS_ONLINE</span>
                    <span className="hidden md:inline">KERNEL: V.2.0.4</span>
                </div>
                <div className="flex items-center gap-6">
                    <span className="hidden sm:inline">CPU_TEMP: 42C</span>
                    <span>MEM: 1.2GB/16GB</span>
                    <button
                        className={`px-3 py-1 rounded-sm transition-colors hover: text-white ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'} `}
                        onClick={onToggleDarkMode}
                    >
                        {darkMode ? 'MODE: LIGHT' : 'MODE: DARK'}
                    </button>
                </div>
            </div>

            {/* Hero Section */}
            <section className="min-h-[90vh] w-full flex flex-col justify-center items-center px-4 pt-12 pb-20 relative z-10 text-center">
                <div className="max-w-4xl flex flex-col items-center gap-6 animate-fade-in-up mt-8">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-sm border text-xs font-mono font-bold tracking-widest uppercase mb-2 transition-colors ${darkMode ? 'border-accent-primary/40 text-accent-primary bg-accent-primary/10 shadow-glow' : 'border-blue-500 text-blue-600 bg-blue-50'} `}>
                        <span className="animate-pulse">▶</span> // INIT_SEQUENCE_STARTED
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-2 leading-tight font-sans">
                        <span className="block mb-2">Demystify the CPU:</span>
                        <span className={`bg-clip-text text-transparent px-2 ${darkMode ? 'bg-gradient-to-r from-accent-primary to-accent-info' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} `}>Visualize Scheduling</span>
                        <span className="block mt-2">Algorithms Instantly.</span>
                    </h1>

                    <div className={`h-16 flex items-center justify-center text-lg md: text-xl max-w-2xl leading-relaxed mb-8 font-mono ${darkMode ? 'text-accent-info' : 'text-indigo-700'} `}>
                        <p className="text-left w-full">
                            {typedHeroText}<span className="animate-[pulse_1s_infinite] bg-current inline-block w-2 h-5 ml-1 align-middle"></span>
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto mt-4 font-mono uppercase tracking-wider">
                        <button
                            className={`px-10 py-4 rounded-sm font-bold text-sm border transition-all flex items-center justify-center gap-3 w-full sm: w-auto ${darkMode ? 'bg-accent-primary/10 text-accent-primary border-accent-primary hover:bg-accent-primary hover:text-[#0B0E14] shadow-glow hover:shadow-[0_0_30px_rgba(0,255,65,0.6)] hover:-translate-y-1' : 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700 hover:-translate-y-1 shadow-md'} `}
                            onClick={() => onNavigate('SIMULATOR')}
                        >
                            <span className="text-xl">⚡</span>
                            Launch Terminal
                        </button>
                        <a
                            href="https://github.com/Pranay0083/CPU-Scheduling-Visualiser"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`px-10 py-4 rounded-sm font-bold text-sm border transition-all flex items-center justify-center gap-3 w-full sm: w-auto hover: -translate-y-1 ${darkMode ? 'bg-[#161B22] border-[#30363D] text-[#f1f5f9] hover:bg-[#30363D]' : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50 shadow-sm'} `}
                        >
                            <span className="text-xl">🐙</span>
                            Source Code
                        </a>
                    </div>
                </div>

                {/* Animated Gantt Chart Dashboard Preview Container */}
                <div className="w-full max-w-5xl mt-24 relative perspective-1000 group">
                    <div className={`transform transition-transform duration-700 ease-out group-hover:rotate-x-0 group-hover:scale-105 rounded-md flex flex-col border shadow-2xl overflow-hidden ${darkMode ? 'bg-[#161B22] border-[#30363D]' : 'bg-white border-gray-300'} `}>
                        <WindowChrome title="gantt_visualizer.exe" activeColor="bg-accent-success" darkMode={darkMode} />

                        <div className="p-6 md:p-8 flex flex-col gap-6">
                            <div className="flex justify-between items-center border-b pb-4 mb-2 border-opacity-20 border-gray-500 font-mono">
                                <h3 className="font-bold text-sm flex items-center opacity-80 uppercase tracking-widest text-[#94a3b8]">
                                    Live Execution (Round Robin)
                                </h3>
                                <div className={`text-xs px-3 py-1 rounded-sm border ${darkMode ? 'bg-[#0B0E14] border-[#30363D]' : 'bg-gray-100 border-gray-200'} `}>
                                    SYS_TICK: <span className={darkMode ? 'text-accent-primary font-bold shadow-[0_0_5px_rgba(0,255,65,0.5)]' : 'text-blue-600 font-bold'}>12ms</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                {/* Live Gantt Chart Animation */}
                                <div className="flex items-center gap-4">
                                    <div className={`w-16 font-mono font-bold text-right text-xs uppercase ${darkMode ? 'text-[#94a3b8]' : 'text-gray-500'} `}>CPU_0</div>
                                    <div className={`flex-1 h-12 rounded-sm overflow-hidden flex relative border ${darkMode ? 'bg-[#0B0E14] border-[#30363D]' : 'bg-gray-200 border-gray-300'} `}>
                                        <div className={`absolute h-full left-0 flex items-center justify-center font-mono font-bold text-xs border-r transition-colors animate-[slideRight_snap_6s_linear_infinite] ${darkMode ? 'bg-accent-error text-[#0B0E14] border-[#0B0E14] shadow-[0_0_10px_rgba(255,95,95,0.6)]' : 'bg-red-400 text-white border-white'} `} style={{ width: '25%', animationDelay: '0s' }}>P1</div>
                                        <div className={`absolute h-full left-[25 %] flex items-center justify-center font-mono font-bold text-xs border-r transition-colors animate-[slideRight_snap_6s_linear_infinite] ${darkMode ? 'bg-accent-success text-[#0B0E14] border-[#0B0E14] shadow-[0_0_10px_rgba(80,250,123,0.6)]' : 'bg-green-400 text-white border-white'} `} style={{ width: '15%', animationDelay: '0s' }}>P2</div>
                                        <div className={`absolute h-full left-[40 %] flex items-center justify-center font-mono font-bold text-xs border-r transition-colors animate-[slideRight_snap_6s_linear_infinite] ${darkMode ? 'bg-accent-info text-[#0B0E14] border-[#0B0E14] shadow-[0_0_10px_rgba(139,233,253,0.6)]' : 'bg-cyan-400 text-white border-white'} `} style={{ width: '20%', animationDelay: '0s' }}>P3</div>
                                        <div className={`absolute h-full left-[60 %] flex items-center justify-center font-mono font-bold text-xs border-r transition-colors animate-[slideRight_snap_6s_linear_infinite] overflow-hidden whitespace-nowrap ${darkMode ? 'bg-accent-error text-[#0B0E14] border-[#0B0E14] shadow-[0_0_10px_rgba(255,95,95,0.6)]' : 'bg-red-400 text-white border-white'} `} style={{ width: '0%', animationFillMode: 'forwards' }}>
                                            <div className="w-full text-center">P1</div>
                                        </div>

                                        {/* Scanning line effect */}
                                        <div className={`absolute top-0 bottom-0 w-1 animate-[scan_6s_linear_infinite] z-10 ${darkMode ? 'bg-white/50 shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'bg-white/50 shadow-md'} `}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Analytics Below Gantt */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                {[
                                    { label: 'CPU Util', val: '92%', color: darkMode ? 'text-accent-success' : 'text-green-600' },
                                    { label: 'Throughput', val: '0.8 p/ms', color: darkMode ? 'text-accent-info' : 'text-blue-600' },
                                    { label: 'Avg Wait', val: '4.5ms', color: darkMode ? 'text-accent-warning' : 'text-amber-600' },
                                    { label: 'Turnaround', val: '12.2ms', color: darkMode ? 'text-accent-purple' : 'text-purple-600' }
                                ].map((stat, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-sm border flex flex-col justify-center items-start ${darkMode ? 'bg-[#0B0E14] border-[#30363D]' : 'bg-gray-50 border-gray-200'} `}>
                                        <div className="text-[10px] uppercase tracking-widest opacity-60 mb-1 font-mono">{stat.label}</div>
                                        <div className={`text-xl font-bold font-mono ${stat.color} group-hover: scale-105 transition-transform origin-left`}>{stat.val}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Highlights Section */}
            <section className={`w-full py-32 px-4 border-y ${darkMode ? 'bg-[#0B0E14] border-[#30363D]' : 'bg-white border-gray-200'} relative`}>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20 flex flex-col items-center">
                        <div className={`inline-block px-3 py-1 border mb-6 font-mono text-xs uppercase tracking-widest rounded-sm ${darkMode ? 'bg-[#161B22] border-[#30363D] text-[#94a3b8]' : 'bg-gray-100 border-gray-300 text-gray-500'} `}>Modules / Features</div>
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 uppercase tracking-tight font-sans">Why Use the Visualizer?</h2>
                        <p className={`font-mono text-sm max-w-2xl mx-auto ${darkMode ? 'text-text-secondary' : 'text-gray-600'} `}>
                            Understand the intricate details of operating system scheduling through intuitive, industrial-grade design. Built for engineers, by engineers.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-1000">
                        {[
                            {
                                id: '01', title: 'Interactive Input', color: 'accent-primary', hoverBorder: 'border-accent-primary', bgDark: 'bg-accent-primary/10', textDark: 'text-accent-primary',
                                desc: 'Add processes on the fly. Adjust Burst Time, Arrival Time, and Priority with a strict CLI-like table interface. See changes reflect instantly.'
                            },
                            {
                                id: '02', title: 'Algo Comparison', color: 'accent-secondary', hoverBorder: 'border-accent-secondary', bgDark: 'bg-accent-secondary/10', textDark: 'text-accent-secondary',
                                desc: 'Run algorithms side-by-side. See which minimizes Average Waiting Time (W_t) via real-time statistical overlays.'
                            },
                            {
                                id: '03', title: 'Step Execution', color: 'accent-info', hoverBorder: 'border-accent-info', bgDark: 'bg-accent-info/10', textDark: 'text-accent-info',
                                desc: "Don't just see the final output. Step through the execution timeline tick-by-tick to understand every context switch perfectly."
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className={`flex flex-col rounded-md overflow-hidden transition-all duration-300 hover: -translate-y-2 border ${darkMode ? `bg-[#161B22] border-[#30363D] hover:${feature.hoverBorder} hover:shadow-[0_0_20px_var(--color-${feature.color})]` : `bg-gray-50 border-gray-200 hover:border-blue-500 hover:shadow-xl`} `}>
                                <WindowChrome title={`module_${feature.id}.sh`} activeColor={`bg-${feature.color} `} darkMode={darkMode} />
                                <div className="p-8 flex flex-col items-start gap-4">
                                    <div className={`w-12 h-12 rounded-sm flex items-center justify-center text-xl font-bold font-mono border ${darkMode ? `${feature.bgDark} ${feature.textDark} border-${feature.color}/30` : 'bg-blue-100 text-blue-600 border-blue-200'} `}>
                                        [{feature.id}]
                                    </div>
                                    <h3 className={`text-xl font-bold mt-2 font-mono uppercase tracking-wide ${darkMode ? 'text-text-primary' : 'text-gray-800'} `}>{feature.title}</h3>
                                    <p className={`leading-relaxed text-sm font-mono ${darkMode ? 'text-text-secondary' : 'text-gray-600'} `}>
                                        {feature.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Algorithm Gallery (HTOP Style) */}
            <section className={`w-full py-32 px-4 relative z-10 ${darkMode ? 'bg-[#161B22]' : 'bg-gray-50'} `}>
                <div className="max-w-6xl mx-auto flex flex-col items-center">
                    <div className="w-full flex justify-between items-end mb-8 border-b border-[#30363D] pb-4">
                        <div>
                            <div className={`font-mono text-xs uppercase tracking-widest mb-1 ${darkMode ? 'text-[#00FF41]' : 'text-blue-600'} `}>root@system:~# top -o cpu</div>
                            <h2 className="text-3xl font-bold uppercase tracking-widest font-sans">The Algorithm Registry</h2>
                        </div>
                        <div className="font-mono text-xs hidden sm:block opacity-60">Uptime: 45 days, 12:44</div>
                    </div>

                    <div className="w-full overflow-x-auto">
                        <table className={`w-full min-w-[700px] text-left border-collapse rounded-sm overflow-hidden font-mono text-sm ${darkMode ? 'bg-[#0B0E14] text-text-primary border border-[#30363D] shadow-2xl' : 'bg-white text-gray-800 border border-gray-300 shadow-md'} `}>
                            <thead>
                                <tr className={`${darkMode ? 'bg-[#161B22] border-b border-[#30363D] text-[#94a3b8]' : 'bg-gray-100 border-b border-gray-300 text-gray-600'} text-xs uppercase tracking-widest`}>
                                    <th className="p-4 font-bold border-r border-[#30363D]/50 w-16 text-center">PID</th>
                                    <th className="p-4 font-bold border-r border-[#30363D]/50">ALGORITHM NAME</th>
                                    <th className="p-4 font-bold border-r border-[#30363D]/50">USE CASE</th>
                                    <th className="p-4 font-bold">KEY METRIC</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${darkMode ? 'divide-[#30363D]' : 'divide-gray-200'} `}>
                                {[
                                    { pid: '101', name: 'FCFS', tag: 'First Come First Serve', case: 'Simplicity', metric: 'Fairness, Non-preemptive', color: 'accent-error' },
                                    { pid: '102', name: 'ROUND_ROBIN', tag: 'Time-sharing', case: 'Interactive Systems', metric: 'Quantum-based fairness', color: 'accent-success' },
                                    { pid: '103', name: 'SJF_PRE', tag: 'Shortest Job First', case: 'Efficiency', metric: 'Minimizes Wait Time (W_t)', color: 'accent-info' },
                                    { pid: '104', name: 'PRIORITY', tag: 'Priority Scheduling', case: 'Critical Tasks', metric: 'Strict adherence to priority', color: 'accent-purple' },
                                ].map((algo) => (
                                    <tr key={algo.pid} className={`transition-colors cursor -default ${darkMode ? 'hover:bg-[#161B22]' : 'hover:bg-gray-50'} `}>
                                        <td className={`p-4 text-center border-r font-bold ${darkMode ? `text-${algo.color} border-[#30363D]/50` : 'text-blue-600 border-gray-200'} `}>{algo.pid}</td>
                                        <td className={`p-4 font-bold border-r ${darkMode ? 'border-[#30363D]/50 text-white' : 'border-gray-200'} `}>
                                            {algo.name} <span className={`text-[10px] ml-2 px-2 py-0.5 rounded-sm border opacity-80 ${darkMode ? 'bg-[#161B22] border-[#30363D] text-[#94a3b8]' : 'bg-gray-100 border-gray-300'} `}>{algo.tag}</span>
                                        </td>
                                        <td className={`p-4 opacity-80 uppercase text-xs border-r ${darkMode ? 'border-[#30363D]/50' : 'border-gray-200'} `}>{algo.case}</td>
                                        <td className="p-4 opacity-70 text-xs">{algo.metric}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Technical Dashboard Preview Section */}
            <section className={`w-full py-24 px-4 border-y ${darkMode ? 'bg-bg-secondary border-border-main' : 'bg-gray-50 border-gray-200'} `}>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 font-sans uppercase tracking-widest">Technical Analytics</h2>
                        <p className={`font-mono text-sm mb-8 leading-relaxed ${darkMode ? 'text-text-secondary' : 'text-gray-600'} `}>
                            Users love seeing the "math" behind the magic. Dive deep into the performance of each algorithm with our real-time analytics engine.
                        </p>

                        <ul className="space-y-6 font-mono">
                            {[
                                { title: 'Turnaround Time', formula: 'T_at = Completion Time-Arrival Time', icon: '[T]' },
                                { title: 'Waiting Time', formula: 'W_t = Turnaround Time-Burst Time', icon: '[W]' },
                                { title: 'CPU Utilization', formula: 'Util = (Busy / Total) * 100', icon: '[C]' }
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-4">
                                    <div className={`text-xl font-bold mt-1 ${darkMode ? 'text-accent-secondary' : 'text-indigo-600'} `}>{item.icon}</div>
                                    <div>
                                        <h4 className="font-bold text-sm uppercase tracking-wider">{item.title}</h4>
                                        <code className={`text-xs mt-2 px-3 py-2 flex rounded-sm border ${darkMode ? 'bg-bg-primary border-border-main text-accent-info' : 'bg-white border-gray-300 text-blue-600'} `}>
                                            &gt; {item.formula}
                                        </code>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex-1 w-full perspective-1000">
                        {/* Mock Dashboard Graphics */}
                        <div className={`rounded-md shadow-2xl transform rotate-y-[-5deg] rotate-x-[5deg] border flex flex-col overflow-hidden ${darkMode ? 'bg-[#161B22] border-[#30363D]' : 'bg-white border-gray-300'} `}>
                            <WindowChrome title="analytics_dashboard.log" activeColor="bg-accent-warning" darkMode={darkMode} />
                            <div className="p-6">
                                <div className="flex justify-between mb-8 border-b border-opacity-20 pb-4 font-mono text-xs uppercase tracking-widest">
                                    <div className="font-bold">Analytics Engine ._</div>
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 rounded-sm bg-accent-error"></div>
                                        <div className="w-2 h-2 rounded-sm bg-accent-warning"></div>
                                        <div className="w-2 h-2 rounded-sm bg-accent-success"></div>
                                    </div>
                                </div>

                                {/* Bar Chart Mockup (Brutalist blocks) */}
                                <div className={`flex items-end gap-6 h-48 mb-8 border-b border-l p-2 relative font-mono text-xs ${darkMode ? 'border-border-main' : 'border-gray-400'} `}>
                                    <div className="absolute left-[-40px] top-0 opacity-50">10ms</div>
                                    <div className="absolute left-[-30px] bottom-0 opacity-50">0</div>

                                    <div className={`flex-1 rounded-t-sm h-[40 %] hover: h-[45 %] transition-all group relative border-t border-l border-r ${darkMode ? 'bg-accent-error/20 border-accent-error' : 'bg-red-200 border-red-500'} `}>
                                        <div className={`absolute-top-8 left-1 / 2-translate-x-1 / 2 text-[10px] px-2 py-1 rounded-sm opacity-0 group-hover: opacity-100 transition-opacity whitespace-nowrap border ${darkMode ? 'bg-bg-primary text-text-primary border-border-main' : 'bg-gray-800 text-white border-gray-900'} `}>FCFS: 4.0</div>
                                    </div>
                                    <div className={`flex-1 rounded-t-sm h-[25 %] hover: h-[30 %] transition-all group relative border-t border-l border-r ${darkMode ? 'bg-accent-success/20 border-accent-success' : 'bg-green-200 border-green-500'} `}>
                                        <div className={`absolute-top-8 left-1 / 2-translate-x-1 / 2 text-[10px] px-2 py-1 rounded-sm opacity-0 group-hover: opacity-100 transition-opacity whitespace-nowrap border ${darkMode ? 'bg-bg-primary text-text-primary border-border-main' : 'bg-gray-800 text-white border-gray-900'} `}>SJF: 2.5</div>
                                    </div>
                                    <div className={`flex-1 rounded-t-sm h-[35 %] hover: h-[40 %] transition-all group relative border-t border-l border-r ${darkMode ? 'bg-accent-secondary/20 border-accent-secondary' : 'bg-blue-200 border-blue-500'} `}>
                                        <div className={`absolute-top-8 left-1 / 2-translate-x-1 / 2 text-[10px] px-2 py-1 rounded-sm opacity-0 group-hover: opacity-100 transition-opacity whitespace-nowrap border ${darkMode ? 'bg-bg-primary text-text-primary border-border-main' : 'bg-gray-800 text-white border-gray-900'} `}>RR: 3.5</div>
                                    </div>
                                    <div className={`flex-1 rounded-t-sm h-[60 %] hover: h-[65 %] transition-all group relative border-t border-l border-r ${darkMode ? 'bg-accent-purple/20 border-accent-purple' : 'bg-purple-200 border-purple-500'} `}>
                                        <div className={`absolute-top-8 left-1 / 2-translate-x-1 / 2 text-[10px] px-2 py-1 rounded-sm opacity-0 group-hover: opacity-100 transition-opacity whitespace-nowrap border ${darkMode ? 'bg-bg-primary text-text-primary border-border-main' : 'bg-gray-800 text-white border-gray-900'} `}>Pri: 6.0</div>
                                    </div>
                                </div>
                                <div className="text-center font-bold text-[10px] tracking-widest uppercase opacity-60 font-mono">Avg Waiting Time Comparison</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Footer Section */}
            <section className={`w-full py-32 text-center px-4 relative border-t ${darkMode ? 'bg-[#0B0E14] border-[#30363D]' : 'bg-white border-gray-200'} `}>
                <div className={`absolute inset-0 bg-gradient-to-t pointer-events-none ${darkMode ? 'from-accent-primary/10 to-transparent' : 'from-blue-500/10 to-transparent'} `}></div>

                <h2 className="text-3xl md:text-5xl font-bold mb-6 font-sans uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-[#94a3b8]">System Ready</h2>
                <p className={`font-mono text-sm max-w-xl mx-auto mb-10 ${darkMode ? 'text-text-secondary' : 'text-gray-600'} `}>
                    All modules loaded. Predict performance, analyze turnaround times, and master CPU scheduling.
                </p>

                <div className="flex justify-center group">
                    <button
                        className={`px-12 py-5 rounded-sm font-bold text-sm tracking-widest uppercase transition-all flex flex-col items-center border relative overflow-hidden ${darkMode ? 'bg-accent-primary/10 text-accent-primary border-accent-primary shadow-[0_0_20px_rgba(0,255,65,0.2)] hover:shadow-[0_0_40px_rgba(0,255,65,0.4)] hover:bg-accent-primary hover:text-[#0B0E14]' : 'bg-blue-600 text-white border-blue-700 shadow-lg hover:bg-blue-700'} `}
                        onClick={() => onNavigate('SIMULATOR')}
                    >
                        <span className="relative z-10 transition-transform group-hover:-translate-y-1">Execute ./simulator.sh</span>
                        <div className={`h-1 w-8 mt-2 rounded-full transition-all group-hover: w-full group-hover: bg-[#0B0E14] ${darkMode ? 'bg-accent-primary' : 'bg-white'} `}></div>
                    </button>
                </div>
            </section>

            <style>{`
/* Overriding the animation for brutalist snapping feel rather than smooth slide */
@keyframes scan {
    0 % { left: 0; opacity: 1; }
    100 % { left: 100 %; opacity: 1; }
}
@keyframes slideRight_snap {
    0 % { width: 0 %; opacity: 0; }
    4.9 % { opacity: 0; }
    5 % { opacity: 1; width: 40 %; }
    49.9 % { width: 40 %; }
    50 % { width: 40 %; }
    54.9 % { width: 40 %; }
    55 % { width: 20 %; }
}
`}</style>
        </div>
    );
}

export default LandingPage;
