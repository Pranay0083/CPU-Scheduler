import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { LearningModuleId, GlossaryTerm } from '../types';
import { FormulaCheatSheet } from './FormulaCheatSheet';
import { ModuleContent } from './ModuleContent';
import { AlgorithmContent } from './AlgorithmContent';

// Glossary terms data
const GLOSSARY_TERMS: GlossaryTerm[] = [
    {
        term: 'Preemption',
        definition: 'The act of temporarily interrupting a running process to allow another process to execute, typically done by the scheduler based on priority or time quantum.',
        example: 'In SRTF, when a new process arrives with a shorter burst than the remaining time of the current process, preemption occurs.',
    },
    {
        term: 'Time Quantum',
        definition: 'A fixed time slice allocated to each process in Round Robin scheduling. When expired, the process is moved to the back of the ready queue.',
        example: 'With a quantum of 4ms, each process runs for at most 4ms before being switched out.',
    },
    {
        term: 'Starvation',
        definition: 'A situation where a process waits indefinitely because other processes are continuously given preference.',
        example: 'In Priority Scheduling without aging, low-priority processes may starve if high-priority processes keep arriving.',
    },
    {
        term: 'Convoy Effect',
        definition: 'A phenomenon in FCFS where short processes must wait behind long processes, leading to poor average waiting time.',
        example: 'If process P1 with burst 100ms arrives first, processes P2, P3, P4 with bursts of 1ms each must all wait 100+ ms.',
    },
    {
        term: 'Context Switch',
        definition: 'The process of saving the state of a running process and loading the state of another process to continue execution.',
        example: 'Moving from P1 to P2 requires saving P1\'s registers and loading P2\'s state.',
    },
    {
        term: 'Turnaround Time',
        definition: 'Total time from process arrival to completion. Formula: Turnaround Time = Completion Time − Arrival Time.',
    },
    {
        term: 'Waiting Time',
        definition: 'Total time a process spends waiting in the ready queue. Formula: Waiting Time = Turnaround Time − Burst Time.',
    },
    {
        term: 'Throughput',
        definition: 'The number of processes completed per unit time. Higher throughput indicates better system efficiency.',
    },
    {
        term: 'Response Time',
        definition: 'Time from process arrival to first execution on the CPU. Critical for interactive systems.',
    },
    {
        term: 'Aging',
        definition: 'A technique to prevent starvation by gradually increasing the priority of waiting processes over time.',
        example: 'After every 10 time units of waiting, increase a process\'s priority by 1.',
    },
];

// Module navigation groups
interface ModuleGroup {
    category: string;
    items: { id: LearningModuleId; title: string; icon: string }[];
}

const MODULE_GROUPS: ModuleGroup[] = [
    {
        category: 'Getting Started',
        items: [
            { id: 'basics', title: 'The Basics', icon: '📚' },
            { id: 'scheduling-criteria', title: 'Scheduling Criteria', icon: '📊' },
            { id: 'preemption', title: 'Preemption', icon: '🔄' },
        ],
    },
    {
        category: 'Algorithms',
        items: [
            { id: 'fcfs', title: 'First Come First Serve', icon: '🏃' },
            { id: 'sjf', title: 'Shortest Job First', icon: '⚡' },
            { id: 'srtf', title: 'Shortest Remaining Time', icon: '⏱️' },
            { id: 'rr', title: 'Round Robin', icon: '🎡' },
            { id: 'priority', title: 'Priority Scheduling', icon: '⭐' },
            { id: 'mlfq', title: 'Multi-Level Feedback', icon: '🏢' },
        ],
    },
    {
        category: 'Advanced & Resources',
        items: [
            { id: 'advanced', title: 'Advanced Concepts', icon: '🎓' },
            { id: 'formulas', title: 'Formula Cheat Sheet', icon: '📐' },
        ],
    },
];

const MODULES = MODULE_GROUPS.flatMap(g => g.items);

interface LearnPageProps {
    onNavigateToSimulator: (algorithm?: string, preset?: string) => void;
    darkMode: boolean;
    onToggleDarkMode: () => void;
}

export function LearnPage({ onNavigateToSimulator, darkMode, onToggleDarkMode }: LearnPageProps) {
    const [activeModule, setActiveModule] = useState<LearningModuleId>('basics');
    const [hoveredTerm, setHoveredTerm] = useState<string | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const moduleRefs = useRef<Record<LearningModuleId, HTMLElement | null>>({
        'basics': null,
        'scheduling-criteria': null,
        'preemption': null,
        'advanced': null,
        'formulas': null,
        'fcfs': null,
        'sjf': null,
        'srtf': null,
        'rr': null,
        'priority': null,
        'mlfq': null,
    });

    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
        'Getting Started': true,
        'Algorithms': true,
        'Advanced & Resources': true
    });

    // Handle scroll to update active module
    useEffect(() => {
        const handleScroll = () => {
            if (!contentRef.current) return;

            const scrollTop = contentRef.current.scrollTop;
            const offset = 100;

            for (const module of MODULES) {
                const el = moduleRefs.current[module.id];
                if (el) {
                    const top = el.offsetTop - offset;
                    const bottom = top + el.offsetHeight;
                    if (scrollTop >= top && scrollTop < bottom) {
                        setActiveModule(module.id);
                        break;
                    }
                }
            }
        };

        const content = contentRef.current;
        content?.addEventListener('scroll', handleScroll);
        return () => content?.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll to module when clicking sidebar
    const scrollToModule = (moduleId: LearningModuleId) => {
        const el = moduleRefs.current[moduleId];
        if (el && contentRef.current) {
            contentRef.current.scrollTo({
                top: el.offsetTop - 20,
                behavior: 'smooth',
            });
            setActiveModule(moduleId);
        }
    };

    // Register module ref
    const registerModuleRef = (id: LearningModuleId, el: HTMLElement | null) => {
        moduleRefs.current[id] = el;
    };

    // Find glossary term definition
    const getTermDefinition = (term: string): GlossaryTerm | undefined => {
        return GLOSSARY_TERMS.find(g => g.term.toLowerCase() === term.toLowerCase());
    };

    return (
        <div className="flex h-[calc(100vh-80px)] overflow-hidden">
            {/* Sidebar Navigation */}
            <aside className="w-72 bg-[#16162a] border-r border-white/10 flex flex-col shrink-0 z-20">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-bold text-white/90 uppercase tracking-wider text-sm">📖 Learning Modules</h3>
                    <button
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 transition-colors"
                        onClick={onToggleDarkMode}
                        title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {darkMode ? '☀️' : '🌙'}
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-6 custom-scrollbar">
                    {MODULE_GROUPS.map((group) => (
                        <div key={group.category} className="flex flex-col gap-1">
                            <button
                                className="flex items-center justify-between px-4 mb-2 text-white/40 hover:text-white/70 transition-colors group"
                                onClick={() => setExpandedGroups(prev => ({ ...prev, [group.category]: !prev[group.category] }))}
                            >
                                <h4 className="text-[10px] font-bold uppercase tracking-widest">
                                    {group.category}
                                </h4>
                                {expandedGroups[group.category] ? (
                                    <ChevronDown className="w-4 h-4" />
                                ) : (
                                    <ChevronRight className="w-4 h-4" />
                                )}
                            </button>

                            {/* Render items if expanded */}
                            {expandedGroups[group.category] && (
                                <div className="flex flex-col gap-1 animate-fade-in">
                                    {group.items.map((module) => (
                                        <button
                                            key={module.id}
                                            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all w-full text-left
                                                ${activeModule === module.id
                                                    ? 'bg-accent-primary/20 text-accent-primary shadow-[0_0_15px_rgba(0,255,136,0.15)] border border-accent-primary/30'
                                                    : 'text-white/60 hover:bg-white/5 hover:text-white/90 border border-transparent'}`}
                                            onClick={() => scrollToModule(module.id)}
                                        >
                                            <span className="text-base opacity-80">{module.icon}</span>
                                            <span>{module.title}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5 bg-[#1a1a2e]">
                    <button
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-bold shadow-lg hover:shadow-accent-primary/25 transition-all transform hover:-translate-y-1 active:translate-y-0 text-sm"
                        onClick={() => onNavigateToSimulator()}
                    >
                        ⚡ Open Simulator
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto scroll-smooth relative p-8 md:p-12 custom-scrollbar bg-[#0f0f1d]" ref={contentRef}>
                <div className="max-w-4xl mx-auto space-y-24 pb-24">
                    {MODULES.map((module) => (
                        <section
                            key={module.id}
                            id={module.id}
                            className="scroll-mt-8"
                            ref={(el) => registerModuleRef(module.id, el)}
                        >
                            {['fcfs', 'sjf', 'srtf', 'rr', 'priority', 'mlfq'].includes(module.id) ? (
                                <AlgorithmContent
                                    moduleId={module.id}
                                    title={module.title}
                                    icon={module.icon}
                                    onNavigateToSimulator={onNavigateToSimulator}
                                />
                            ) : module.id === 'formulas' ? (
                                <FormulaCheatSheet />
                            ) : (
                                <ModuleContent
                                    moduleId={module.id}
                                    title={module.title}
                                    icon={module.icon}
                                    hoveredTerm={hoveredTerm}
                                    setHoveredTerm={setHoveredTerm}
                                    getTermDefinition={getTermDefinition}
                                    onNavigateToSimulator={onNavigateToSimulator}
                                />
                            )}
                        </section>
                    ))}
                </div>
            </main>

            {/* Floating Glossary Tooltip */}
            {hoveredTerm && getTermDefinition(hoveredTerm) && (
                <div className="fixed bottom-8 right-8 z-50 w-80 bg-[#1e1e3a] border border-accent-primary/50 text-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-5 animate-fade-in-up md:max-w-md backdrop-blur-md">
                    <h4 className="text-accent-cyan font-bold text-lg mb-2 border-b border-white/10 pb-2">
                        {getTermDefinition(hoveredTerm)!.term}
                    </h4>
                    <p className="text-white/80 text-sm leading-relaxed mb-3">
                        {getTermDefinition(hoveredTerm)!.definition}
                    </p>
                    {getTermDefinition(hoveredTerm)!.example && (
                        <p className="text-xs bg-white/5 p-2 rounded border-l-2 border-accent-secondary italic text-white/60">
                            <strong>Example:</strong> {getTermDefinition(hoveredTerm)!.example}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

export default LearnPage;
