import { useRef, useEffect } from 'react';
import { useScheduler } from '../context/SchedulerContext';
import type { GanttEntry } from '../types';

const CELL_WIDTH = 40;

export function GanttChart() {
    const { state } = useScheduler();
    const containerRef = useRef<HTMLDivElement>(null);

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
            <div key={coreId} className="flex border-b border-white/5 last:border-b-0 min-h-[60px]">
                <div className="w-24 shrink-0 bg-white/5 border-r border-white/10 flex items-center justify-center font-bold text-white/70 sticky left-0 z-10 backdrop-blur-md shadow-lg">
                    Core {coreId}
                </div>
                <div className="relative flex-1 h-[60px] bg-black/10">
                    {history.map((entry, idx) => {
                        const width = (entry.endTime - entry.startTime) * CELL_WIDTH;
                        const left = entry.startTime * CELL_WIDTH;

                        return (
                            <div
                                key={`${entry.processId}-${entry.startTime}-${idx}`}
                                className={`absolute h-10 top-2.5 rounded border shadow-sm transition-all hover:brightness-110 flex items-center justify-center overflow-hidden
                                    ${entry.processId ? 'border-black/20' : 'border-white/5 bg-white/5'}`}
                                style={{
                                    width: `${width}px`,
                                    left: `${left}px`,
                                    backgroundColor: entry.color,
                                }}
                                title={`${entry.processName}: ${entry.startTime} - ${entry.endTime}`}
                            >
                                {entry.processId && width >= 30 && (
                                    <span className="text-xs font-mono font-bold text-white drop-shadow-md truncate px-1">
                                        {entry.processName}
                                    </span>
                                )}
                            </div>
                        );
                    })}

                    {/* Current time indicator */}
                    <div
                        className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20 pointer-events-none shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                        style={{ left: `${state.clock * CELL_WIDTH}px` }}
                    >
                        <div className="absolute -top-1 -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full" />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="glass-panel p-6 flex flex-col overflow-hidden">
            <h3 className="glass-header mb-4">Gantt Chart</h3>

            <div className="flex-1 overflow-hidden rounded-lg border border-white/10 bg-black/20 flex flex-col">
                <div className="overflow-x-auto custom-scrollbar" ref={containerRef}>
                    <div className="min-w-fit" style={{ width: `${(maxTime + 1) * CELL_WIDTH + 100}px` }}>
                        {/* Time axis */}
                        <div className="flex border-b border-white/10 bg-white/5 h-8 sticky top-0 z-20">
                            <div className="w-24 shrink-0 border-r border-white/10 sticky left-0 z-30 bg-[#1a1c2e] flex items-center justify-center text-xs font-medium text-white/40">
                                Time
                            </div>
                            <div className="relative flex-1">
                                {timeMarkers.map(time => (
                                    <div
                                        key={time}
                                        className={`absolute top-0 bottom-0 flex items-center justify-center w-[40px] text-[10px] font-mono border-l border-white/5 
                                            ${time === state.clock ? 'text-red-400 font-bold bg-red-500/5' : 'text-white/30'}`}
                                        style={{ left: `${time * CELL_WIDTH}px` }}
                                    >
                                        {time}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Core rows */}
                        <div className="divide-y divide-white/5">
                            {state.cores.map(core => renderGanttRow(core.id, core.ganttHistory))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/60">
                {state.processes.map(process => (
                    <div key={process.id} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded shadow-sm"
                            style={{ backgroundColor: process.color }}
                        />
                        <span className="font-mono text-xs">{process.name}</span>
                    </div>
                ))}
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-white/10 border border-white/10" />
                    <span className="font-mono text-xs italic">Idle</span>
                </div>
            </div>
        </div>
    );
}
