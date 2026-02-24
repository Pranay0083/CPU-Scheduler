import { useRef, useEffect, useState } from 'react';
import { useScheduler } from '../context/SchedulerContext';
import type { GanttEntry } from '../types';

const CELL_WIDTH = 40;

export function GanttChart() {
    const { state } = useScheduler();
    const containerRef = useRef<HTMLDivElement>(null);
    const { metrics, clock } = state;

    const [cpuHistory, setCpuHistory] = useState<number[]>([]);
    const [waitHistory, setWaitHistory] = useState<number[]>([]);

    // Track metrics history for sparklines and background
    useEffect(() => {
        if (state.simulationState === 'STOPPED' || clock === 0) {
            setCpuHistory([]);
            setWaitHistory([]);
            return;
        }

        if (state.simulationState === 'RUNNING' || state.simulationState === 'STEP') {
            setCpuHistory(prev => [...prev.slice(-20), metrics.cpuUtilization]);
            setWaitHistory(prev => [...prev.slice(-20), metrics.avgWaitingTime]);
        }
    }, [clock, metrics.cpuUtilization, metrics.avgWaitingTime, state.simulationState]);

    // Auto-scroll to current time
    useEffect(() => {
        if (containerRef.current) {
            const scrollPosition = (state.clock - 10) * CELL_WIDTH;
            containerRef.current.scrollLeft = Math.max(0, scrollPosition);
        }
    }, [state.clock]);

    const maxTime = Math.max(state.clock + 10, 20);
    const timeMarkers = Array.from({ length: maxTime + 1 }, (_, i) => i);

    const renderGanttRow = (coreId: number, history: GanttEntry[]) => {
        return (
            <div key={coreId} className="flex border-b border-[#30363D] last:border-b-0 min-h-[60px]">
                <div className="w-24 shrink-0 bg-[#161B22] border-r border-[#30363D] flex items-center justify-center font-mono font-bold text-xs uppercase tracking-widest text-[#f1f5f9] sticky left-0 z-10 backdrop-blur-md shadow-lg">
                    Core {coreId}
                </div>
                <div className="relative flex-1 h-[60px] bg-[#0B0E14]">
                    {history.map((entry, idx) => {
                        const width = (entry.endTime - entry.startTime) * CELL_WIDTH;
                        const left = entry.startTime * CELL_WIDTH;

                        return (
                            <div
                                key={`${entry.processId}-${entry.startTime}-${idx}`}
                                className={`absolute h-10 top-2.5 border transition-all hover:brightness-125 flex items-center justify-center overflow-hidden rounded-sm
                                    ${entry.processId ? 'border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] z-10' : 'border-[#30363D] bg-transparent opacity-50'}`}
                                style={{
                                    width: `${width}px`,
                                    left: `${left}px`,
                                    backgroundColor: entry.processId ? entry.color : 'transparent',
                                    /* Inject glow effect from the color itself */
                                    boxShadow: entry.processId ? `0 0 10px ${entry.color}40, inset 0 0 5px rgba(0,0,0,0.5)` : 'none'
                                }}
                                title={`${entry.processName}: ${entry.startTime} - ${entry.endTime}`}
                            >
                                {entry.processId && width >= 30 && (
                                    <span className="text-xs font-mono font-bold text-[#0B0E14] truncate px-1" style={{ textShadow: '0 0 2px rgba(255,255,255,0.5)' }}>
                                        {entry.processName}
                                    </span>
                                )}
                            </div>
                        );
                    })}

                    {/* Current time indicator - Matrix Green */}
                    <div
                        className="absolute top-0 bottom-0 w-0.5 bg-[#00FF41] z-20 pointer-events-none shadow-[0_0_10px_#00FF41]"
                        style={{ left: `${state.clock * CELL_WIDTH}px` }}
                    >
                        <div className="absolute -top-1 -translate-x-1/2 w-2 h-2 bg-[#00FF41] shadow-[0_0_5px_#00FF41]" />
                    </div>
                </div>
            </div>
        );
    };

    const formatNumber = (num: number, decimals: number = 2): string => num.toFixed(decimals);

    const getUtilizationColor = (util: number): string => {
        if (util >= 80) return 'text-accent-error';
        if (util >= 50) return 'text-accent-warning';
        return 'text-accent-success';
    };

    const renderHeaderSparkline = (data: number[], color: string, maxVal: number = 100) => {
        if (data.length < 2) return null;

        const actualMax = Math.max(...data, maxVal);
        const w = 40;
        const h = 16;

        const points = data.map((val, i) => {
            const x = (i / (data.length - 1)) * w;
            const y = h - ((val / actualMax) * h);
            return `${x},${y}`;
        }).join(' ');

        return (
            <svg width={w} height={h} className="opacity-80">
                <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
            </svg>
        );
    };

    const renderBackgroundAreaGraph = () => {
        if (cpuHistory.length < 2) return null;

        const w = Math.max((maxTime + 1) * CELL_WIDTH, containerRef.current?.clientWidth || 0);
        const h = state.cores.length * 60 + 32; // core rows + time axis height

        // Map cpu history to the entire width of the chart 
        const points = cpuHistory.map((val, i) => {
            const x = (i / (cpuHistory.length - 1)) * w;
            const y = h - ((val / 100) * h);
            return `${x},${y}`;
        });

        const areaPoints = `0,${h} ${points.join(' ')} ${w},${h}`;

        return (
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03] z-0" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="cpuGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#00FF41" stopOpacity="1" />
                        <stop offset="100%" stopColor="#00FF41" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <polygon points={areaPoints} fill="url(#cpuGradient)" />
                <polyline fill="none" stroke="#00FF41" strokeWidth="1" strokeOpacity="0.5" points={points.join(' ')} />
            </svg>
        );
    };

    return (
        <div className="glass-panel p-0 flex flex-col overflow-hidden bg-bg-primary rounded-md shadow-2xl relative font-sans">
            {/* Status Ribbon Header */}
            <div className="flex items-center justify-between p-4 border-b border-border-main bg-bg-secondary z-20 relative shadow-md">
                <h3 className="flex items-center gap-2 font-mono font-bold text-sm tracking-widest text-accent-primary uppercase">
                    <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse shadow-[0_0_8px_#00FF41]"></span>
                    Live Analysis
                </h3>

                <div className="flex items-center gap-6">
                    {/* CPU Badge */}
                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-3 py-1.5 rounded-md">
                        <div className="flex flex-col">
                            <span className="text-[9px] text-text-muted uppercase tracking-wider font-bold">CPU Util</span>
                            <span className={`text-sm font-mono font-bold ${getUtilizationColor(metrics.cpuUtilization)}`}>
                                {formatNumber(metrics.cpuUtilization, 1)}%
                            </span>
                        </div>
                        {renderHeaderSparkline(cpuHistory, metrics.cpuUtilization >= 80 ? '#FF5F5F' : metrics.cpuUtilization >= 50 ? '#f59e0b' : '#50FA7B')}
                    </div>

                    {/* Wait Badge */}
                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-3 py-1.5 rounded-md">
                        <div className="flex flex-col">
                            <span className="text-[9px] text-text-muted uppercase tracking-wider font-bold">Avg Wait</span>
                            <span className="text-sm font-mono font-bold text-accent-warning">
                                {formatNumber(metrics.avgWaitingTime)}
                            </span>
                        </div>
                        {renderHeaderSparkline(waitHistory, '#f59e0b', Math.max(10, ...waitHistory))}
                    </div>

                    {/* Throughput Badge */}
                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-3 py-1.5 rounded-md">
                        <div className="flex flex-col">
                            <span className="text-[9px] text-text-muted uppercase tracking-wider font-bold">Throughput</span>
                            <span className="text-sm font-mono font-bold text-accent-info">
                                {formatNumber(metrics.throughput)}/t
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-hidden bg-bg-primary flex flex-col relative z-10 w-full">
                {renderBackgroundAreaGraph()}

                <div className="overflow-x-auto scrollbar-webkit relative z-10" ref={containerRef}>
                    <div className="min-w-fit" style={{ width: `${(maxTime + 1) * CELL_WIDTH + 100}px` }}>
                        {/* Time axis */}
                        <div className="flex border-b border-[#30363D] bg-[#161B22] h-8 sticky top-0 z-20">
                            <div className="w-24 shrink-0 border-r border-[#30363D] sticky left-0 z-30 bg-[#161B22] flex items-center justify-center text-[10px] font-mono font-bold tracking-widest text-[#94a3b8] uppercase">
                                Time
                            </div>
                            <div className="relative flex-1">
                                {timeMarkers.map(time => (
                                    <div
                                        key={time}
                                        className={`absolute top-0 bottom-0 flex items-center justify-center w-[40px] text-[10px] font-mono border-l border-[#30363D] 
                                            ${time === state.clock ? 'text-[#00FF41] font-bold bg-[#00FF41]/10 shadow-[inset_0_0_10px_rgba(0,255,65,0.2)]' : 'text-[#64748b]'}`}
                                        style={{ left: `${time * CELL_WIDTH}px` }}
                                    >
                                        {time}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Core rows */}
                        <div className="divide-y divide-[#30363D]">
                            {state.cores.map(core => renderGanttRow(core.id, core.ganttHistory))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="p-4 flex flex-wrap gap-4 text-xs font-mono text-text-muted relative z-20 bg-bg-secondary/50 border-t border-border-main">
                {state.processes.map(process => (
                    <div key={process.id} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 border border-[#30363D]"
                            style={{ backgroundColor: process.color, boxShadow: `0 0 5px ${process.color}80` }}
                        />
                        <span>{process.name}</span>
                    </div>
                ))}
                <div className="flex items-center gap-2 ml-4">
                    <div className="w-3 h-3 bg-transparent border border-[#64748b] border-dashed" />
                    <span className="italic">Idle_CYCLES</span>
                </div>
            </div>
        </div>
    );
}
