import { useState } from 'react';
import {
    Lightbulb, Clock, Zap, CheckCircle2, RefreshCw,
    Hourglass, Target, Rocket, Ban, AlertTriangle,
    Turtle, Rabbit, Scale
} from 'lucide-react';
import type { LearningModuleId, GlossaryTerm } from '../types';

interface ModuleContentProps {
    moduleId: LearningModuleId;
    title: string;
    icon: string;
    hoveredTerm: string | null;
    setHoveredTerm: (term: string | null) => void;
    getTermDefinition: (term: string) => GlossaryTerm | undefined;
    onNavigateToSimulator: (algorithm?: string, preset?: string) => void;
}

// Glossary term wrapper component
function GlossaryLink({
    term,
    setHoveredTerm
}: {
    term: string;
    setHoveredTerm: (term: string | null) => void;
}) {
    return (
        <span
            className="text-accent-cyan underline decoration-dotted decoration-accent-cyan/50 cursor-pointer hover:text-white hover:decoration-solid transition-colors font-medium relative group"
            onMouseEnter={() => setHoveredTerm(term)}
            onMouseLeave={() => setHoveredTerm(null)}
        >
            {term}
        </span>
    );
}

// Toggleable example component
function ToggleableExample({
    title,
    children
}: {
    title: string;
    children: React.ReactNode;
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`mt - 6 rounded - lg border transition - all duration - 300 overflow - hidden ${isOpen ? 'bg-white/5 border-accent-primary/50' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'} `}>
            <button
                className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3 font-medium text-white/90">
                    <span className="text-xl">📝</span>
                    <span>{title.replace('📝 ', '')}</span>
                </div>
                <span className={`text - white / 40 transition - transform duration - 300 ${isOpen ? 'rotate-180' : ''} `}>▼</span>
            </button>
            {isOpen && (
                <div className="p-5 pt-0 border-t border-white/5 animate-fade-in">
                    {children}
                </div>
            )}
        </div>
    );
}

export function ModuleContent({
    moduleId,
    title,
    icon,
    setHoveredTerm,
    onNavigateToSimulator
}: ModuleContentProps) {
    const [activeStateStep, setActiveStateStep] = useState(0);

    // Module 1: The Basics
    if (moduleId === 'basics') {
        return (
            <div className="animate-fade-in-up">
                <header className="mb-8 border-b border-white/10 pb-6">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 flex items-center gap-4">
                        <span className="text-4xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{icon}</span>
                        {title}
                    </h2>
                </header>

                <div className="space-y-12">
                    <section>
                        <h3 className="text-xl font-semibold text-accent-secondary mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-accent-secondary rounded-full"></span>
                            What is a CPU Scheduler?
                        </h3>
                        <p className="text-white/80 leading-loose mb-4 text-lg">
                            The <strong className="text-white font-medium">CPU Scheduler</strong> (also called the <em className="text-white/90 not-italic border-b border-white/20">Short-term Scheduler</em>)
                            is the component of an operating system responsible for selecting which process
                            from the <strong className="text-white font-medium">ready queue</strong> should be executed next on the CPU.
                        </p>
                        <div className="backdrop-blur-md bg-white/5 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] p-5 rounded-xl flex gap-4 my-6 relative overflow-hidden group hover:border-white/20 transition-colors">
                            <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
                            <div className="p-2 bg-yellow-500/20 rounded-lg h-fit group-hover:bg-yellow-500/30 transition-colors">
                                <Lightbulb className="w-6 h-6 text-yellow-400" />
                            </div>
                            <div>
                                <h4 className="text-yellow-200 font-bold text-sm uppercase tracking-wider mb-1">Spotlight Idea</h4>
                                <p className="text-yellow-100/90 italic leading-loose text-sm">
                                    Think of the scheduler as a "traffic controller" for processes – it decides
                                    who gets to use the CPU and for how long.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold text-accent-secondary mb-6 flex items-center gap-2">
                            <span className="w-1 h-6 bg-accent-secondary rounded-full"></span>
                            Types of Schedulers
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-5 rounded-xl bg-blue-500/5 border border-blue-500/20 hover:border-blue-500/40 transition-all hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(59,130,246,0.15)] group relative overflow-hidden">
                                <h4 className="font-bold text-blue-300 mb-2 flex items-center gap-2 relative z-10">
                                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                    Long-term Scheduler
                                </h4>
                                <p className="text-sm text-white/70 leading-loose mb-4 group-hover:text-white/90 transition-colors relative z-10">
                                    Controls the <strong className="text-blue-200">degree of multiprogramming</strong>. Decides which
                                    processes are admitted to the system from the job pool.
                                </p>
                                <span className="inline-block px-2 py-1 rounded bg-blue-500/10 text-blue-300 text-xs font-mono border border-blue-500/20 relative z-10">
                                    Runs: Infrequently (min)
                                </span>
                            </div>
                            <div className="p-5 rounded-xl bg-green-500/5 border border-green-500/20 hover:border-green-500/40 hover:bg-green-500/10 transition-all transform hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(74,222,128,0.15)] relative overflow-hidden group">
                                <h4 className="font-bold text-green-300 mb-2 flex items-center gap-2 relative z-10">
                                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                    Short-term Scheduler
                                </h4>
                                <p className="text-sm text-white/70 leading-loose mb-4 relative z-10">
                                    Selects from processes in the <strong className="text-green-200">ready queue</strong> and allocates
                                    CPU time. This is what we simulate in this tool!
                                </p>
                                <span className="inline-block px-2 py-1 rounded bg-green-500/10 text-green-300 text-xs font-mono border border-green-500/20 relative z-10">
                                    Runs: Frequently (ms)
                                </span>
                                {/* Mini-simulator animation */}
                                <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:opacity-20 transition-opacity">
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 rounded bg-green-400 animate-bounce delay-75"></div>
                                        <div className="w-8 h-8 rounded bg-green-500 animate-bounce delay-150"></div>
                                        <div className="w-8 h-8 rounded bg-green-600 animate-bounce delay-300"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 rounded-xl bg-yellow-500/5 border border-yellow-500/20 hover:border-yellow-500/40 transition-all hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(234,179,8,0.15)] group relative overflow-hidden">
                                <h4 className="font-bold text-yellow-300 mb-2 flex items-center gap-2 relative z-10">
                                    <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                                    Medium-term Scheduler
                                </h4>
                                <p className="text-sm text-white/70 leading-loose mb-4 group-hover:text-white/90 transition-colors relative z-10">
                                    Handles <strong className="text-yellow-200">swapping</strong> – temporarily removing processes from
                                    memory to reduce multiprogramming degree.
                                </p>
                                <span className="inline-block px-2 py-1 rounded bg-yellow-500/10 text-yellow-300 text-xs font-mono border border-yellow-500/20 relative z-10">
                                    Runs: Occasionally (sec)
                                </span>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold text-accent-secondary mb-6 flex items-center gap-2">
                            <span className="w-1 h-6 bg-accent-secondary rounded-full"></span>
                            Process States
                        </h3>
                        <p className="text-white/80 mb-6 leading-loose">
                            A process transitions through various states during its lifecycle.
                            Click through the steps below to trace its journey:
                        </p>

                        <div className="bg-white/5 rounded-xl p-6 mb-8 border border-white/10 backdrop-blur-sm">
                            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                                {['1: Arrival', '2: Ready', '3: Execution', '4: I/O (Optional)', '5: Completion'].map((step, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveStateStep(idx)}
                                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap border ${activeStateStep === idx
                                                ? 'bg-accent-primary/20 text-accent-cyan border-accent-primary/50 shadow-[0_0_15px_rgba(0,255,136,0.2)]'
                                                : 'bg-white/5 text-white/50 border-white/5 hover:bg-white/10 hover:text-white/80'
                                            }`}
                                    >
                                        Step {step}
                                    </button>
                                ))}
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 items-center min-h-[200px]">
                                {/* Visual Animation Container */}
                                <div className="h-[200px] bg-black/30 rounded-lg border border-white/5 relative overflow-hidden flex items-center justify-center p-4">
                                    {/* Queue containers */}
                                    <div className="absolute left-4 top-4 bottom-4 w-24 border-2 border-dashed border-white/10 rounded-lg flex flex-col items-center justify-end p-2 gap-2">
                                        <span className="text-xs text-white/30 uppercase absolute top-2">Ready Queue</span>
                                    </div>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-32 h-32 border-4 border-white/5 rounded-full flex flex-col items-center justify-center">
                                        <span className="text-sm font-bold text-white/20 uppercase">CPU</span>
                                    </div>
                                    <div className="absolute left-1/2 bottom-4 -translate-x-1/2 w-32 h-20 border-2 border-dashed border-purple-500/20 rounded-lg flex flex-col items-center justify-center">
                                        <span className="text-xs text-purple-300/40 uppercase">I/O Device</span>
                                    </div>

                                    {/* Animated Process Box */}
                                    <div className={`w-12 h-12 rounded shadow-lg flex items-center justify-center font-bold text-white absolute transition-all duration-700 ease-in-out z-10 ${activeStateStep === 0 ? 'top-[-50px] left-10 bg-blue-500 shadow-blue-500/50' : // New
                                            activeStateStep === 1 ? 'bottom-6 left-10 bg-yellow-500 shadow-yellow-500/50' : // Ready
                                                activeStateStep === 2 ? 'top-1/2 right-14 -translate-y-1/2 bg-green-500 shadow-[0_0_20px_rgba(74,222,128,0.6)] scale-110' : // Running
                                                    activeStateStep === 3 ? 'bottom-8 left-1/2 -translate-x-1/2 bg-purple-500 shadow-purple-500/50' : // Waiting
                                                        'top-1/2 right-[-50px] -translate-y-1/2 bg-gray-500 opacity-50 shadow-none' // Terminated
                                        }`}>
                                        P1
                                    </div>

                                    {activeStateStep === 2 && (
                                        <div className="absolute right-14 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-green-400 animate-ping opacity-20 z-0"></div>
                                    )}
                                </div>

                                {/* Text Description */}
                                <div className="space-y-4">
                                    {activeStateStep === 0 && (
                                        <div className="animate-fade-in">
                                            <span className="inline-block px-3 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono text-sm font-bold mb-3">NEW State</span>
                                            <p className="text-white/80 leading-loose">
                                                A process is being created and its PCB (Process Control Block) is initialized.
                                                It has been admitted into the system by the long-term scheduler but is not yet ready to execute.
                                            </p>
                                        </div>
                                    )}
                                    {activeStateStep === 1 && (
                                        <div className="animate-fade-in">
                                            <span className="inline-block px-3 py-1 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 font-mono text-sm font-bold mb-3">READY State</span>
                                            <p className="text-white/80 leading-loose">
                                                The process has been loaded into main memory and is waiting in the <strong className="text-white text-yellow-200">Ready Queue</strong>.
                                                It is fully prepared to execute as soon as the CPU becomes available.
                                            </p>
                                        </div>
                                    )}
                                    {activeStateStep === 2 && (
                                        <div className="animate-fade-in">
                                            <span className="inline-block px-3 py-1 rounded bg-green-500/20 text-green-300 border border-green-500/30 font-mono text-sm font-bold mb-3 shadow-[0_0_10px_rgba(74,222,128,0.2)]">RUNNING State</span>
                                            <p className="text-white/80 leading-loose">
                                                The Short-term Scheduler has picked this process. It is currently executing instructions on the <strong className="text-green-200">CPU</strong>.
                                                Only one process can be in this state per processor core.
                                            </p>
                                        </div>
                                    )}
                                    {activeStateStep === 3 && (
                                        <div className="animate-fade-in">
                                            <span className="inline-block px-3 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono text-sm font-bold mb-3">WAITING State</span>
                                            <p className="text-white/80 leading-loose">
                                                The process paused execution to wait for an event (like user input or disk read).
                                                It vacates the CPU so another process can run. Once the <strong className="text-purple-200">I/O</strong> completes, it goes back to READY.
                                            </p>
                                        </div>
                                    )}
                                    {activeStateStep === 4 && (
                                        <div className="animate-fade-in">
                                            <span className="inline-block px-3 py-1 rounded bg-gray-500/20 text-gray-300 border border-gray-500/30 font-mono text-sm font-bold mb-3">TERMINATED State</span>
                                            <p className="text-white/80 leading-loose">
                                                The process has finished execution or was explicitly killed.
                                                The OS reclaims its memory space and its PCB is deleted from the system.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    <button
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-bold shadow-[0_0_20px_rgba(0,255,136,0.15)] hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 group border border-accent-primary/50"
                        onClick={() => onNavigateToSimulator('FCFS')}
                    >
                        <Rocket className="w-5 h-5 text-white" />
                        Try FCFS Simulation
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                </div>
            </div>
        );
    }

    // Module 2: Scheduling Criteria
    if (moduleId === 'scheduling-criteria') {
        return (
            <div className="animate-fade-in-up">
                <header className="mb-8 border-b border-white/10 pb-6">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 flex items-center gap-4">
                        <span className="text-4xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{icon}</span>
                        {title}
                    </h2>
                </header>

                <div className="space-y-12">
                    <section>
                        <h3 className="text-xl font-semibold text-accent-secondary mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-accent-secondary rounded-full"></span>
                            Key Time Metrics
                        </h3>
                        <p className="text-white/80 mb-6">
                            Understanding these metrics is essential for analyzing scheduler performance:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <h4 className="font-bold text-white mb-2 flex items-center gap-2"><Clock className="w-4 h-4 text-blue-400" /> Arrival Time (AT)</h4>
                                <p className="text-sm text-white/60 mb-3 min-h-[40px] leading-loose">The time at which a process enters the ready queue.</p>
                                <code className="block bg-black/30 p-2 rounded text-xs font-mono text-accent-cyan">AT = Arrival Instant</code>
                            </div>
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <h4 className="font-bold text-white mb-2 flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-400" /> Burst Time (BT)</h4>
                                <p className="text-sm text-white/60 mb-3 min-h-[40px] leading-loose">Total CPU time required by a process to complete.</p>
                                <code className="block bg-black/30 p-2 rounded text-xs font-mono text-accent-cyan">BT = CPU Cycles Needed</code>
                            </div>
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <h4 className="font-bold text-white mb-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> Completion Time (CT)</h4>
                                <p className="text-sm text-white/60 mb-3 min-h-[40px] leading-loose">The time at which a process finishes execution.</p>
                                <code className="block bg-black/30 p-2 rounded text-xs font-mono text-accent-cyan">CT = End Time</code>
                            </div>
                            <div className="p-4 rounded-lg bg-accent-primary/10 border border-accent-primary/30 hover:bg-accent-primary/20 transition-colors shadow-[0_0_15px_rgba(0,255,136,0.1)]">
                                <h4 className="font-bold text-accent-cyan mb-2 flex items-center gap-2"><RefreshCw className="w-4 h-4" /> <GlossaryLink term="Turnaround Time" setHoveredTerm={setHoveredTerm} /></h4>
                                <p className="text-sm text-white/70 mb-3 min-h-[40px] leading-loose">Total time from arrival to completion.</p>
                                <code className="block bg-black/30 p-2 rounded text-xs font-mono text-white/90 font-bold border-l-2 border-accent-cyan">TAT = CT − AT</code>
                            </div>
                            <div className="p-4 rounded-lg bg-accent-primary/10 border border-accent-primary/30 hover:bg-accent-primary/20 transition-colors shadow-[0_0_15px_rgba(0,255,136,0.1)]">
                                <h4 className="font-bold text-accent-cyan mb-2 flex items-center gap-2"><Hourglass className="w-4 h-4" /> <GlossaryLink term="Waiting Time" setHoveredTerm={setHoveredTerm} /></h4>
                                <p className="text-sm text-white/70 mb-3 min-h-[40px] leading-loose">Time spent waiting in the ready queue.</p>
                                <code className="block bg-black/30 p-2 rounded text-xs font-mono text-white/90 font-bold border-l-2 border-accent-cyan">WT = TAT − BT</code>
                            </div>
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <h4 className="font-bold text-white mb-2 flex items-center gap-2"><Target className="w-4 h-4 text-purple-400" /> <GlossaryLink term="Response Time" setHoveredTerm={setHoveredTerm} /></h4>
                                <p className="text-sm text-white/60 mb-3 min-h-[40px] leading-loose">Time from arrival to first CPU execution.</p>
                                <code className="block bg-black/30 p-2 rounded text-xs font-mono text-accent-cyan">RT = First CPU − AT</code>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold text-accent-secondary mb-6 flex items-center gap-2">
                            <span className="w-1 h-6 bg-accent-secondary rounded-full"></span>
                            Why Optimize for Average Waiting Time (AWT)?
                        </h3>
                        <div className="bg-gradient-to-br from-[#1e1e40] to-[#252540] p-6 rounded-xl border border-white/10 shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
                            </div>

                            <h4 className="text-lg font-bold text-white mb-4 relative z-10">🎯 The Scheduling Goal</h4>
                            <p className="text-white/80 mb-4 relative z-10">
                                Most scheduling algorithms aim to <strong className="text-green-400">minimize Average Waiting Time (AWT)</strong> because:
                            </p>
                            <ul className="space-y-2 mb-6 text-sm text-white/70 relative z-10">
                                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Reduces overall system delay experienced by users</li>
                                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Improves CPU utilization efficiency</li>
                                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Balances fairness across processes</li>
                                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Directly impacts user satisfaction in interactive systems</li>
                            </ul>
                            <div className="bg-black/40 p-4 rounded-lg text-center relative z-10">
                                <code className="font-mono text-lg text-accent-cyan font-bold">
                                    AWT = (WT₁ + WT₂ + ... + WTₙ) / n
                                </code>
                            </div>
                        </div>
                    </section>

                    <ToggleableExample title="📝 Example: Calculating Turnaround and Waiting Time">
                        <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                            <p className="mb-4 text-white/80"><strong>Given:</strong> Process P1 with AT=0, BT=5, and it completes at CT=8</p>
                            <div className="space-y-2 font-mono text-sm mb-4 pl-4 border-l-2 border-white/20">
                                <p className="text-white/70">Turnaround Time = CT − AT = 8 − 0 = <strong className="text-white">8 units</strong></p>
                                <p className="text-white/70">Waiting Time = TAT − BT = 8 − 5 = <strong className="text-white">3 units</strong></p>
                            </div>
                            <p className="text-sm text-yellow-200/80 italic flex items-center gap-2">
                                <span>💡</span> P1 spent 3 time units waiting in the ready queue before completing!
                            </p>
                        </div>
                    </ToggleableExample>

                    <button
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-bold shadow-[0_0_20px_rgba(0,255,136,0.15)] hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 group border border-accent-primary/50"
                        onClick={() => onNavigateToSimulator('SJF')}
                    >
                        <Rocket className="w-5 h-5 text-white" />
                        Try SJF Simulation (Optimal AWT)
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                </div>
            </div>
        );
    }

    // Module 3: Preemption
    if (moduleId === 'preemption') {
        return (
            <div className="animate-fade-in-up">
                <header className="mb-8 border-b border-white/10 pb-6">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 flex items-center gap-4">
                        <span className="text-4xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{icon}</span>
                        {title}
                    </h2>
                </header>

                <div className="space-y-12">
                    <section>
                        <h3 className="text-xl font-semibold text-accent-secondary mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-accent-secondary rounded-full"></span>
                            What is <GlossaryLink term="Preemption" setHoveredTerm={setHoveredTerm} />?
                        </h3>
                        <p className="text-white/80 leading-relaxed mb-6 text-lg">
                            <strong className="text-white">Preemption</strong> is the act of <em className="text-white/90 not-italic border-b border-white/20">interrupting</em> a currently
                            running process to allow another process to execute. The interrupted process
                            is moved back to the ready queue.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 rounded-xl bg-red-500/5 border border-red-500/10 hover:border-red-500/20 transition-all hover:shadow-[0_4px_20px_rgba(239,68,68,0.1)] hover:-translate-y-1">
                                <h4 className="flex items-center gap-2 text-red-300 font-bold mb-4 text-lg">
                                    <Ban className="w-5 h-5" /> Non-Preemptive
                                </h4>
                                <p className="text-sm text-white/70 mb-4 min-h-[40px] leading-loose">Once a process starts, it runs until completion or I/O.</p>
                                <ul className="space-y-4 text-sm text-white/60 mb-6 pl-1 marker:text-red-400">
                                    <li className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-white/40" /> Simpler to implement</li>
                                    <li className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-white/40" /> Lower context switch overhead</li>
                                    <li className="flex gap-2 items-center"><AlertTriangle className="w-4 h-4 text-red-400/80" /> Can cause <GlossaryLink term="Convoy Effect" setHoveredTerm={setHoveredTerm} /></li>
                                </ul>
                                <div className="text-xs font-mono text-red-200/60 pt-4 border-t border-red-500/10">
                                    Examples: FCFS, SJF
                                </div>
                            </div>
                            <div className="p-6 rounded-xl bg-green-500/5 border border-green-500/10 hover:border-green-500/20 transition-all hover:shadow-[0_4px_20px_rgba(74,222,128,0.1)] hover:-translate-y-1">
                                <h4 className="flex items-center gap-2 text-green-300 font-bold mb-4 text-lg">
                                    <CheckCircle2 className="w-5 h-5" /> Preemptive
                                </h4>
                                <p className="text-sm text-white/70 mb-4 min-h-[40px] leading-loose">Scheduler can interrupt a running process at any time.</p>
                                <ul className="space-y-4 text-sm text-white/60 mb-6 pl-1 marker:text-green-400">
                                    <li className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-green-400/80" /> Better response time</li>
                                    <li className="flex gap-2 items-center"><AlertTriangle className="w-4 h-4 text-yellow-400/80" /> More <GlossaryLink term="Context Switch" setHoveredTerm={setHoveredTerm} /> overhead</li>
                                    <li className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-green-400/80" /> Prevents long processes from hogging CPU</li>
                                </ul>
                                <div className="text-xs font-mono text-green-200/60 pt-4 border-t border-green-500/10">
                                    Examples: SRTF, Round Robin, Priority (P)
                                </div>
                            </div>
                        </div>
                    </section>

                    <ToggleableExample title="🔍 Click: See SRTF as Preemptive SJF">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                                    <h5 className="font-bold text-white mb-2">SJF (Non-Preemptive)</h5>
                                    <p className="text-xs text-white/60 mb-2">Selects the process with the shortest <em>total</em> burst time.</p>
                                    <p className="text-xs text-white/60">Once selected, the process runs to completion.</p>
                                </div>
                                <div className="p-4 rounded-lg bg-accent-primary/5 border border-accent-primary/20">
                                    <h5 className="font-bold text-accent-cyan mb-2">SRTF (Preemptive SJF)</h5>
                                    <p className="text-xs text-white/60 mb-2">Selects the process with the shortest <em>remaining</em> time.</p>
                                    <p className="text-xs text-white/60">If a new process arrives with shorter remaining time, it preempts!</p>
                                </div>
                            </div>
                            <div className="p-4 bg-black/30 rounded-lg border border-white/5">
                                <p className="text-sm text-white/80 mb-4"><strong>Scenario:</strong> P1 (BT=10) arrives at t=0, P2 (BT=3) arrives at t=2</p>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-xs font-mono">
                                        <span className="w-12 text-white/40">SJF:</span>
                                        <div className="flex h-6 w-full max-w-sm rounded overflow-hidden">
                                            <div className="bg-blue-500/40 w-[76%] flex items-center justify-center text-white text-[10px] border-r border-black/20">P1 (0-10)</div>
                                            <div className="bg-yellow-500/40 w-[24%] flex items-center justify-center text-white text-[10px]">P2 (10-13)</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-mono">
                                        <span className="w-12 text-accent-cyan">SRTF:</span>
                                        <div className="flex h-6 w-full max-w-sm rounded overflow-hidden">
                                            <div className="bg-blue-500 flex items-center justify-center text-white text-[10px] w-[15%] border-r border-black/20">P1</div>
                                            <div className="bg-yellow-500 flex items-center justify-center text-black font-bold text-[10px] w-[23%] border-r border-black/20 shadow-lg z-10 scale-105">P2 PREEMPTS!</div>
                                            <div className="bg-blue-500/80 flex items-center justify-center text-white text-[10px] w-[62%]">P1 RESUMES</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ToggleableExample>

                    <button
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-bold shadow-[0_0_20px_rgba(0,255,136,0.15)] hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 group border border-accent-primary/50"
                        onClick={() => onNavigateToSimulator('SRTF')}
                    >
                        <Rocket className="w-5 h-5 text-white" />
                        Try SRTF (Preemptive) Simulation
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                </div>
            </div>
        );
    }

    // Module 4: Advanced Concepts
    if (moduleId === 'advanced') {
        return (
            <div className="animate-fade-in-up">
                <header className="mb-8 border-b border-white/10 pb-6">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 flex items-center gap-4">
                        <span className="text-4xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{icon}</span>
                        {title}
                    </h2>
                </header>

                <div className="space-y-12">
                    <section>
                        <h3 className="text-xl font-semibold text-accent-secondary mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-accent-secondary rounded-full"></span>
                            <GlossaryLink term="Convoy Effect" setHoveredTerm={setHoveredTerm} />
                        </h3>
                        <p className="text-white/80 mb-6">
                            A phenomenon in <strong>FCFS</strong> where many short processes "convoy"
                            behind a long process, causing poor average waiting time.
                        </p>

                        <div className="bg-orange-500/10 border-l-4 border-orange-500 p-4 rounded-r-lg mb-6">
                            <div className="flex gap-3">
                                <AlertTriangle className="w-6 h-6 text-orange-400 shrink-0" />
                                <div>
                                    <p className="text-orange-200 font-bold mb-1">Why it happens:</p>
                                    <p className="text-orange-100/80 text-sm leading-loose">
                                        If a CPU-bound process with high burst time arrives first, all
                                        subsequent short I/O-bound processes must wait, even if they
                                        only need the CPU for 1-2 units.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <ToggleableExample title="📊 Convoy Effect Example">
                            <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                                <p className="text-sm text-white/80 mb-4 leading-loose">Consider: P1 (BT=100) arrives at t=0, P2, P3, P4 (BT=1 each) arrive at t=1</p>
                                <div className="p-4 bg-black/30 rounded-lg border border-white/5 flex items-center overflow-x-auto mb-4">
                                    <div className="bg-red-500/80 text-white font-bold p-2 px-6 rounded-l-lg border-r-2 border-dashed border-white/50 text-sm whitespace-nowrap flex items-center gap-2">P1 (100) <AlertTriangle className="w-3 h-3" /></div>
                                    <div className="flex bg-white/10 p-2 rounded-r-lg text-xs gap-2 whitespace-nowrap">
                                        <span className="bg-blue-500 px-2 py-1 rounded">P2</span>
                                        <span className="bg-green-500 px-2 py-1 rounded">P3</span>
                                        <span className="bg-purple-500 px-2 py-1 rounded">P4</span>
                                        <span className="text-white/40 italic flex items-center text-[10px]">waiting...</span>
                                    </div>
                                </div>
                                <p className="text-sm text-white/70 bg-red-500/10 p-3 rounded border border-red-500/20 leading-loose">
                                    With FCFS: P2 waits 99 units, P3 waits 100, P4 waits 101! <br />
                                    <span className="font-mono text-red-300 block mt-1">Average WT = (0 + 99 + 100 + 101) / 4 = <strong>75 units</strong></span>
                                </p>
                            </div>
                        </ToggleableExample>
                    </section>

                    <div className="w-full h-px bg-white/10 my-8"></div>

                    <section>
                        <h3 className="text-xl font-semibold text-accent-secondary mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-accent-secondary rounded-full"></span>
                            <GlossaryLink term="Starvation" setHoveredTerm={setHoveredTerm} />
                        </h3>
                        <p className="text-white/80 mb-6">
                            A situation where a process <strong>waits indefinitely</strong> because
                            other processes continuously receive preference.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-5 rounded-lg bg-red-500/5 border border-red-500/10 hover:border-red-500/20 transition-all hover:shadow-[0_4px_20px_rgba(239,68,68,0.1)] hover:-translate-y-1">
                                <div className="flex gap-3 mb-2">
                                    <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />
                                    <div>
                                        <h4 className="text-red-300 font-bold text-sm uppercase tracking-wide">The Problem</h4>
                                        <p className="text-xs text-red-200/60 mt-1">Common in Priority Scheduling</p>
                                    </div>
                                </div>
                                <p className="text-sm text-white/70 leading-loose">
                                    Low-priority processes may never run if high-priority processes
                                    keep arriving.
                                </p>
                            </div>

                            <div className="p-5 rounded-lg bg-green-500/5 border border-green-500/10 hover:border-green-500/20 transition-all hover:shadow-[0_4px_20px_rgba(74,222,128,0.1)] hover:-translate-y-1">
                                <div className="flex gap-3 mb-2">
                                    <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0" />
                                    <div>
                                        <h4 className="text-green-300 font-bold text-sm uppercase tracking-wide">
                                            The Solution: <GlossaryLink term="Aging" setHoveredTerm={setHoveredTerm} />
                                        </h4>
                                    </div>
                                </div>
                                <p className="text-sm text-white/70 leading-loose">
                                    Gradually increase the priority of waiting processes over time.
                                    Eventually, even low-priority processes will become high-priority.
                                </p>
                            </div>
                        </div>
                    </section>

                    <div className="w-full h-px bg-white/10 my-8"></div>

                    <section>
                        <h3 className="text-xl font-semibold text-accent-secondary mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-accent-secondary rounded-full"></span>
                            <GlossaryLink term="Time Quantum" setHoveredTerm={setHoveredTerm} /> (Round Robin)
                        </h3>
                        <p className="text-white/80 mb-6">
                            In Round Robin, each process receives a fixed time slice called the
                            <strong> time quantum</strong> (or time slice).
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-all hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(255,255,255,0.05)]">
                                <Turtle className="w-8 h-8 text-blue-400 mb-3 block" />
                                <h5 className="font-bold text-white mb-1">Too Large</h5>
                                <p className="text-sm text-white/60 leading-relaxed">Degrades to FCFS behavior, poor response time</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-all hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(255,255,255,0.05)]">
                                <Rabbit className="w-8 h-8 text-purple-400 mb-3 block" />
                                <h5 className="font-bold text-white mb-1">Too Small</h5>
                                <p className="text-sm text-white/60 leading-relaxed">High context switch overhead, CPU time wasted</p>
                            </div>
                            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20 hover:bg-green-500/20 transition-all shadow-[0_0_15px_rgba(74,222,128,0.15)] hover:-translate-y-1">
                                <Scale className="w-8 h-8 text-green-400 mb-3 block" />
                                <h5 className="font-bold text-green-300 mb-1">Optimal</h5>
                                <p className="text-sm text-green-100/70 leading-relaxed">~80% of CPU bursts should complete within one quantum</p>
                            </div>
                        </div>

                        <ToggleableExample title="🔢 Round Robin with Context Switches">
                            <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                                <p className="text-sm text-white/80 mb-4"><strong>Given:</strong> P1 (BT=10), P2 (BT=4), Quantum=4, Context Switch=1</p>
                                <div className="flex items-center w-full gap-0.5 mb-4 overflow-x-auto p-2 pb-4">
                                    <div className="h-8 bg-blue-500 w-20 flex items-center justify-center text-[10px] text-white rounded-sm shrink-0">P1 (4)</div>
                                    <div className="h-8 bg-red-500/50 w-6 flex items-center justify-center text-[8px] text-white rounded-sm shrink-0 border border-white/20">CS</div>
                                    <div className="h-8 bg-yellow-500 w-20 flex items-center justify-center text-[10px] text-white rounded-sm shrink-0">P2 (4)</div>
                                    <div className="h-8 bg-red-500/50 w-6 flex items-center justify-center text-[8px] text-white rounded-sm shrink-0 border border-white/20">CS</div>
                                    <div className="h-8 bg-blue-500 w-20 flex items-center justify-center text-[10px] text-white rounded-sm shrink-0">P1 (4)</div>
                                    <div className="h-8 bg-red-500/50 w-6 flex items-center justify-center text-[8px] text-white rounded-sm shrink-0 border border-white/20">CS</div>
                                    <div className="h-8 bg-blue-500 w-10 flex items-center justify-center text-[10px] text-white rounded-sm shrink-0">P1 (2)</div>
                                </div>
                                <p className="text-sm bg-black/40 p-3 rounded border-l-2 border-red-400 text-white/70 leading-loose">
                                    <Lightbulb className="inline w-4 h-4 text-yellow-400 mr-1 align-sub" /> With context switches, total time = 10 + 4 + 3(CS) = <strong className="text-white">17 units</strong> instead of 14!
                                </p>
                            </div>
                        </ToggleableExample>
                    </section>

                    <button
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-bold shadow-[0_0_20px_rgba(0,255,136,0.15)] hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 group border border-accent-primary/50"
                        onClick={() => onNavigateToSimulator('ROUND_ROBIN')}
                    >
                        <Rocket className="w-5 h-5 text-white" />
                        Try Round Robin Simulation
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                </div>
            </div>
        );
    }

    // Default fallback
    return null;
}

export default ModuleContent;
