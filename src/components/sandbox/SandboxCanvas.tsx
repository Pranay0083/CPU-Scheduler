import { motion } from 'framer-motion';
import { CpuCore } from '../CpuCore';
import { SandboxPidTag } from './SandboxPidTag';
import type { Process, Core, AlgorithmType } from './useSandbox';

const COLORS = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // green
    '#f59e0b', // yellow
    '#8b5cf6', // purple
    '#ec4899', // pink
];

interface SandboxCanvasProps {
    processes: Process[];
    cores: Core[];
    algorithm: AlgorithmType;
    draftBurst: number;
    draftPriority: number;
    time: number;
}

export function SandboxCanvas({ processes, cores, algorithm, draftBurst, draftPriority, time }: SandboxCanvasProps) {
    const readyQueue = processes.filter(p => (p.status === 'ready' && p.arrivalTime <= time) || p.status === 'running');

    // Sort queue visually: Running tasks first, then ready ones
    const displayQueue = [...readyQueue].sort((a, b) => {
        if (a.status === 'running' && b.status !== 'running') return -1;
        if (a.status !== 'running' && b.status === 'running') return 1;
        return a.arrivalTime - b.arrivalTime;
    });

    const nextPidId = displayQueue.find(p => p.status === 'ready')?.id;

    return (
        <div className="w-full h-full flex flex-row items-center justify-center gap-16 relative">

            {/* Power Lines (Energy Flow) - Drawn under everything */}
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-0"
                style={{ stroke: 'var(--grid-color)', strokeWidth: 2, strokeDasharray: '6 6', strokeLinecap: 'round' }}
            >
                {/* Path: Into Ready Queue (From Drafting Table on left) */}
                <path
                    d="M 0 50% L 10% 50%"
                    fill="none"
                    opacity="0.4"
                    className="circuit-path-anim"
                />

                {/* Paths: Ready Queue to CPUs */}
                {cores.map((_, i) => {
                    // Calculate dynamic path endings based on grid layout
                    let yOffset = 0;
                    let xOffset = 0;

                    if (cores.length <= 2) {
                        // Vertical column
                        yOffset = cores.length > 1 ? (i - (cores.length - 1) / 2) * 140 : 0;
                    } else {
                        // 2x2 Grid setup
                        const row = Math.floor(i / 2);
                        const col = i % 2;
                        yOffset = (row === 0 ? -70 : 70);
                        xOffset = (col === 0 ? -40 : 70);
                    }

                    return (
                        <path
                            key={`path-to-core-${i}`}
                            d={`M 45% 50% Q 55% 50% 60% calc(50% + ${yOffset}px) L calc(75% + ${xOffset}px) calc(50% + ${yOffset}px)`}
                            fill="none"
                            opacity="0.4"
                            className="circuit-path-anim"
                        />
                    );
                })}
            </svg>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes dash-flow {
                    from { stroke-dashoffset: 24; }
                    to { stroke-dashoffset: 0; }
                }
                .circuit-path-anim {
                    animation: dash-flow 1s linear infinite;
                }
            `}} />

            {/* Center-Left: The Ready Queue(s) */}
            <div className="flex flex-col gap-4 z-20 w-full max-w-md">

                {algorithm === 'MLFQ' ? (
                    /* --- MLFQ: 3 Distinct Lanes --- */
                    [0, 1, 2].map((laneIndex) => {
                        const laneQueue = displayQueue.filter(p => (p.lane || 0) === laneIndex);
                        const isHigh = laneIndex === 0;

                        return (
                            <div key={`mlfq-lane-${laneIndex}`} className={`w-full hand-drawn-border border-[var(--grid-color)] border-dashed p-3 relative flex flex-row-reverse items-center justify-start gap-3 overflow-x-auto overflow-y-hidden bg-[var(--bg-color)]/50 backdrop-blur-sm ${isHigh ? 'h-32' : 'h-24 opacity-80'}`}>
                                <span className={`absolute -top-3 left-4 bg-[var(--bg-color)] px-2 font-architect text-[var(--cpu-stroke)] ${isHigh ? 'text-sm opacity-90' : 'text-xs opacity-60'}`}>
                                    {isHigh ? 'High Priority (Q0)' : laneIndex === 1 ? 'Medium Priority (Q1)' : 'Low Priority (Q2)'}
                                </span>

                                {laneQueue.length === 0 && (!isHigh || processes.length > 0) && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 font-architect text-sm text-[var(--cpu-stroke)]">
                                        Empty
                                    </div>
                                )}

                                {/* Only show the "No active" message in the top lane if everything is empty */}
                                {isHigh && processes.length === 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 font-architect text-xl text-[var(--cpu-stroke)]">
                                        No active processes.
                                    </div>
                                )}

                                {laneQueue.map((p) => (
                                    <motion.div
                                        key={p.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.8, x: -50 }}
                                        animate={{ opacity: 1, scale: isHigh ? 1 : 0.85, x: 0 }}
                                        className={p.status === 'running' ? 'opacity-30 grayscale pointer-events-none' : 'cursor-grab active:cursor-grabbing hover:-translate-y-2 transition-transform'}
                                        title={`Burst: ${p.burstTime}ms | Prio: ${p.priority} | Arr: ${p.arrivalTime}`}
                                    >
                                        <SandboxPidTag pid={p.id} colorIndex={p.index} />
                                        <div className="text-center mt-1 text-xs font-mono opacity-60 text-[var(--cpu-stroke)]">
                                            {p.remainingTime}ms
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Ghost Draft only in top lane */}
                                {isHigh && (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 0.4, scale: 1 }}
                                        className="pointer-events-none border-dashed"
                                    >
                                        <SandboxPidTag
                                            pid={`P${processes.length + 1}`}
                                            colorIndex={processes.length}
                                        />
                                        <div className="text-center mt-1 text-xs font-mono opacity-60 text-[var(--cpu-stroke)]">
                                            {draftBurst}ms
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    /* --- Standard Algorithms: Single Unified Queue --- */
                    <div className="w-full h-32 hand-drawn-border border-[var(--grid-color)] border-dashed p-4 relative flex flex-row-reverse items-center justify-start gap-4 overflow-x-auto overflow-y-hidden bg-[var(--bg-color)]/50 backdrop-blur-sm">
                        <span className="absolute -top-4 left-6 bg-[var(--bg-color)] px-2 font-architect text-sm text-[var(--cpu-stroke)] opacity-70">
                            The Ready Queue
                        </span>

                        {displayQueue.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 font-architect text-xl text-[var(--cpu-stroke)]">
                                No active processes.
                            </div>
                        )}

                        {displayQueue.map((p) => (
                            <motion.div
                                key={p.id}
                                layout
                                initial={{ opacity: 0, scale: 0.8, x: -50 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                className={p.status === 'running' ? 'opacity-30 grayscale pointer-events-none' : 'cursor-grab active:cursor-grabbing hover:-translate-y-2 transition-transform'}
                                title={`Burst: ${p.burstTime}ms | Prio: ${p.priority} | Arr: ${p.arrivalTime}`}
                            >
                                <SandboxPidTag pid={p.id} colorIndex={p.index} priority={algorithm === 'Priority' ? p.priority : undefined} isNext={p.id === nextPidId} />
                                <div className="text-center mt-2 text-xs font-mono opacity-60 text-[var(--cpu-stroke)]">
                                    {p.remainingTime}ms
                                </div>
                            </motion.div>
                        ))}

                        {/* Ghost Preview Process */}
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 0.4, scale: 1 }}
                            className="pointer-events-none border-dashed"
                        >
                            <SandboxPidTag
                                pid={`P${processes.length + 1}`}
                                colorIndex={processes.length}
                                priority={algorithm === 'Priority' ? draftPriority : undefined}
                            />
                            <div className="text-center mt-2 text-xs font-mono opacity-60 text-[var(--cpu-stroke)]">
                                {draftBurst}ms
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>

            {/* Bottom-Center: System Overrides (Chaos) */}
            {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-[var(--bg-color)] px-6 py-4 hand-drawn-border border-dashed border-[var(--grid-color)] z-30 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--bg-color)] px-2 font-architect text-xs opacity-50 text-[var(--cpu-stroke)] whitespace-nowrap">
                    System Overrides
                </div>

                <button
                    onClick={addCore}
                    className="flex items-center justify-center gap-2 hand-drawn-border border-[var(--cpu-stroke)] px-4 py-2 hover:bg-[var(--tag-bg)] transition-colors text-sm font-bold text-[var(--cpu-stroke)] w-32"
                >
                    <PlusSquare className="w-4 h-4" /> Add Core
                </button>

                <button
                    className="flex items-center justify-center gap-2 hand-drawn-border border-red-500 text-red-500 px-4 py-2 hover:bg-red-500 hover:text-white transition-all shadow-[0_0_10px_rgba(239,68,68,0.2)] hover:shadow-[0_0_20px_rgba(239,68,68,0.6)] text-sm font-bold opacity-80 cursor-not-allowed w-40 relative group"
                    title="Manual Hardware Interrupts coming soon"
                >
                    <Zap className="w-4 h-4" /> Interrupt (WIP)
                    <div className="absolute inset-0 pointer-events-none opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,var(--tw-gradient-from)_10px,var(--tw-gradient-from)_20px)] from-red-500" />
                </button>
            </div> */}

            {/* Center-Right: CPUs (The Factory) */}
            <div className={`grid ${cores.length > 2 ? 'grid-cols-2 gap-x-16 gap-y-12' : 'grid-cols-1 gap-12'} place-items-center z-20`}>
                {cores.map((core, i) => {
                    const runningProc = processes.find(p => p.id === core.currentProcessId);
                    const progress = runningProc ? Math.round(((runningProc.burstTime - runningProc.remainingTime) / runningProc.burstTime) * 100) : undefined;
                    const activeColor = runningProc ? COLORS[runningProc.index % COLORS.length] : undefined;

                    // Scale down slightly if there are many cores to fit on screen
                    const scaleClass = cores.length > 2 ? 'scale-[0.85]' : 'scale-100';

                    return (
                        <div key={core.id} className={`relative flex flex-col items-center ${scaleClass} transform-gpu transition-transform`}>
                            <span className="font-architect text-sm opacity-50 absolute -top-8 text-[var(--cpu-stroke)] uppercase tracking-widest whitespace-nowrap">
                                Core {i + 1}
                            </span>

                            <CpuCore progress={progress} activeColor={activeColor} />

                            {runningProc && (
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 scale-125 pointer-events-none w-full flex justify-center">
                                    <SandboxPidTag
                                        pid={runningProc.id}
                                        priority={algorithm === 'Priority' ? runningProc.priority : undefined}
                                        colorIndex={runningProc.index}
                                    />
                                    <motion.div
                                        className="absolute -bottom-6 w-full text-center text-xs font-mono font-bold"
                                        animate={{ opacity: [1, 0.5, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        style={{ color: activeColor }}
                                    >
                                        {runningProc.remainingTime}ms
                                    </motion.div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Decision Indicator Placeholder */}
                {/* <div className="font-architect text-lg italic text-[var(--cpu-stroke)] opacity-80 mt-4 border-b border-[var(--grid-color)] border-dashed pb-1">
                    Algorithm Choice: {
                        algorithm === 'FCFS' ? 'First Arrival' :
                            algorithm === 'SJF' ? 'Shortest Burst' :
                                algorithm === 'SRTF' ? 'Shortest Remaining' :
                                    algorithm === 'Priority' ? 'Highest Priority' :
                                        algorithm === 'RR' ? 'Time Sliced' : 'Lane Evaluated'
                    }
                </div> */}
            </div>

        </div>
    );
}
