import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import type { HistorySegment, Core, Process } from './useSandbox';

interface HistoryTrailsProps {
    segments: HistorySegment[];
    cores: Core[];
    time: number;
    processes: Process[];
}

const SEDIMENT_COLORS = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // green
    '#f59e0b', // yellow
    '#8b5cf6', // purple
    '#ec4899', // pink
];

const PX_PER_TICK = 20;
const VIEWPORT_TICKS = 50; // How many ticks fit on screen before scrolling

export function HistoryTrails({ segments, cores, time, processes }: HistoryTrailsProps) {
    const [isTableExpanded, setIsTableExpanded] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dragPan, setDragPan] = useState(0);

    // Calculate the horizontal offset to keep the "playhead" moving or screen scrolling
    // Now incorporating manual drag panning
    const autoScrollX = time > VIEWPORT_TICKS ? -(time - VIEWPORT_TICKS) * PX_PER_TICK : 0;
    const finalScrollX = autoScrollX + dragPan;

    // Dynamically calculate the required height based on number of active cores
    // 24px padding + ~20px per core track (16px height + 4px gap)
    const ribbonHeight = Math.max(60, 24 + cores.length * 20);

    return (
        <motion.div
            className="w-full flex flex-col border-t border-dashed border-[var(--grid-color)] bg-[var(--bg-color)]/95 backdrop-blur-md shadow-[0_-10px_30px_rgba(0,0,0,0.05)] relative pointer-events-auto"
            animate={{ height: isTableExpanded ? '360px' : `${ribbonHeight}px` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
            {/* Expand Table Tab */}
            <button
                onClick={() => setIsTableExpanded(!isTableExpanded)}
                className="absolute -top-8 left-1/2 -translate-x-1/2 h-8 px-4 bg-[var(--bg-color)]/95 border-x border-t border-dashed border-[var(--grid-color)] rounded-t-lg flex items-center justify-center gap-2 hover:bg-[var(--tag-bg)] transition-colors text-[var(--cpu-stroke)] opacity-80 backdrop-blur-md z-50"
            >
                <span className="font-architect text-sm">Process Table</span>
                {isTableExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>

            {/* The Ink Ribbon Area */}
            <div
                className="flex-none pt-4 px-6 pb-2 relative overflow-hidden shrink-0 transition-all duration-300"
                style={{ height: ribbonHeight }}
            >
                <div className="absolute top-0 left-6 font-architect text-[10px] opacity-50 text-[var(--cpu-stroke)]">
                    Continuous Ink Ribbon
                </div>

                <div className="flex w-full h-full">
                    {/* Fixed Labels Column */}
                    <div className="flex flex-col gap-1 w-12 z-20 mt-[2px]">
                        {cores.map((core, i) => (
                            <div key={`label-${core.id}`} className="h-4 flex items-center justify-start">
                                <span className="font-architect text-[10px] opacity-40 text-[var(--cpu-stroke)] leading-none">
                                    C0{i + 1}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Scrolling Timeline Area */}
                    <div
                        className="relative flex-1 overflow-hidden border-l border-dashed border-[var(--grid-color)] mask-image-right pl-4 cursor-grab active:cursor-grabbing"
                        ref={containerRef}
                    >
                        <motion.div
                            className="absolute inset-0 flex flex-col gap-1 mt-[2px]" // Reduced gap
                            animate={{ x: finalScrollX }}
                            transition={{ type: 'tween', ease: 'linear', duration: 1 }}
                            drag="x"
                            dragConstraints={containerRef}
                            dragElastic={0.2}
                            onDrag={(_, info) => {
                                setDragPan(prev => prev + info.delta.x);
                            }}
                            onDragEnd={() => {
                                // Optional: Snap back logic or let it stay panned
                                // setDragPan(0); // If we wanted it to snap back
                            }}
                        >
                            {/* Playhead marker matching current time */}
                            <div
                                className="absolute top-0 bottom-0 w-[2px] bg-red-400 opacity-50 z-20"
                                style={{ left: time * PX_PER_TICK, height: '100%' }}
                            >
                                {/* Drawing Needles aligned with each track (h-6) */}
                                {cores.map((core) => {
                                    // determine if core is actively drawing a segment right traversing this time
                                    const activeSegment = segments.find(s => s.coreId === core.id && s.startTime <= time && (s.startTime + s.duration) >= time && s.processId !== null);
                                    const drawColor = activeSegment && typeof activeSegment.processIndex === 'number'
                                        ? SEDIMENT_COLORS[activeSegment.processIndex % SEDIMENT_COLORS.length]
                                        : 'var(--grid-color)';
                                    return (
                                        <div key={`needle-${core.id}`} className="relative h-4 flex items-center justify-center -translate-x-[0.5px]">
                                            <div
                                                className="w-1.5 h-1.5 rounded-full transition-colors duration-100"
                                                style={{
                                                    backgroundColor: activeSegment ? drawColor : 'transparent',
                                                    border: activeSegment ? 'none' : '1px solid var(--grid-color)',
                                                    opacity: activeSegment ? 1 : 0.4
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                            {cores.map((core) => {
                                const coreSegments = segments.filter(s => s.coreId === core.id);

                                return (
                                    <div key={core.id} className="relative h-4 flex items-center w-[9999px]">
                                        {/* Subtle background line for the track */}
                                        <div className="absolute left-0 right-0 h-[1px] bg-[var(--grid-color)] opacity-20" />

                                        {/* Segments */}
                                        {coreSegments.map(seg => {
                                            if (seg.processId === null) return null;

                                            const color = typeof seg.processIndex === 'number'
                                                ? SEDIMENT_COLORS[seg.processIndex % SEDIMENT_COLORS.length]
                                                : '#888';

                                            return (
                                                <motion.div
                                                    key={seg.id}
                                                    className="absolute h-3 rounded-[2px] shadow-sm flex items-center justify-center overflow-hidden"
                                                    style={{
                                                        left: seg.startTime * PX_PER_TICK,
                                                        width: Math.max(PX_PER_TICK - 2, seg.duration * PX_PER_TICK - 2), // -2 for slight gap
                                                        backgroundColor: color,
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        opacity: 0.8
                                                    }}
                                                    initial={{ opacity: 0, scaleY: 0 }}
                                                    animate={{ opacity: 0.8, scaleY: 1 }}
                                                >
                                                    {seg.duration > 1 && (
                                                        <span className="text-[10px] font-mono text-white mix-blend-overlay font-bold">
                                                            {seg.processId.replace('P', '')}
                                                        </span>
                                                    )}
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </motion.div>
                    </div>
                </div>

                {/* Reset Pan Button */}
                <AnimatePresence>
                    {dragPan !== 0 && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={() => setDragPan(0)}
                            className="absolute bottom-2 right-6 px-2 py-0.5 bg-[var(--bg-color)]/80 hand-drawn-border border-[var(--cpu-stroke)] text-[var(--cpu-stroke)] text-[10px] font-architect backdrop-blur-sm hover:bg-[var(--tag-bg)] transition-colors z-50 shadow-sm"
                        >
                            Reset Pan
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* Expandable Table Area */}
            <AnimatePresence>
                {isTableExpanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 overflow-y-auto px-6 pb-6 pt-2 border-t border-dashed border-[var(--grid-color)] mx-4 mt-2"
                        style={{ scrollbarWidth: 'none' }}
                    >
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="font-architect text-sm opacity-60 text-[var(--cpu-stroke)] border-b border-dashed border-[var(--grid-color)]">
                                    <th className="pb-2 font-normal">PID</th>
                                    <th className="pb-2 font-normal">Status</th>
                                    <th className="pb-2 font-normal">Arrival</th>
                                    <th className="pb-2 font-normal">Burst</th>
                                    <th className="pb-2 font-normal">Completed</th>
                                    <th className="pb-2 font-normal">Turnaround</th>
                                    <th className="pb-2 font-normal">Wait</th>
                                </tr>
                            </thead>
                            <tbody className="font-mono text-sm opacity-90 text-[var(--cpu-stroke)]">
                                {processes.map(p => (
                                    <tr key={p.id} className="border-b border-dashed border-[var(--grid-color)]/30 hover:bg-[var(--tag-bg)] transition-colors">
                                        <td className="py-2 flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: SEDIMENT_COLORS[p.index % SEDIMENT_COLORS.length] }}></div>
                                            {p.id}
                                        </td>
                                        <td className="py-2 capitalize">
                                            <span className={`px-2 py-0.5 rounded-full text-xs ${p.status === 'completed' ? 'bg-green-500/20 text-green-700' : p.status === 'running' ? 'bg-blue-500/20 text-blue-700' : 'bg-gray-500/20 text-gray-700'}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="py-2">{p.arrivalTime}ms</td>
                                        <td className="py-2">{p.burstTime}ms</td>
                                        <td className="py-2">{p.completionTime !== undefined ? `${p.completionTime}ms` : '-'}</td>
                                        <td className="py-2">{p.turnaroundTime !== undefined ? `${p.turnaroundTime}ms` : '-'}</td>
                                        <td className="py-2">{p.waitTime !== undefined ? `${p.waitTime}ms` : '-'}</td>
                                    </tr>
                                ))}
                                {processes.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="py-4 text-center opacity-50 font-architect text-xl">No processes drafted yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </motion.div>
                )}
            </AnimatePresence>

        </motion.div>
    );
}
