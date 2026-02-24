import { useScheduler } from '../context/SchedulerContext';
import { getStarvationColor, type Process } from '../types';

export function ProcessQueue() {
    const { state } = useScheduler();

    // Get all processes in READY state grouped by core
    const readyProcesses = state.processes.filter(p => p.state === 'READY');
    const runningProcesses = state.processes.filter(p => p.state === 'RUNNING');

    // Calculate max wait time for heat map
    const maxWaitTime = Math.max(
        ...readyProcesses.map(p => p.waitTime),
        10
    );

    const renderProcessChip = (process: Process, showHeatMap: boolean = false) => {
        const heatColor = showHeatMap
            ? getStarvationColor(process.waitTime, maxWaitTime)
            : undefined;

        // Using simple CSS transitions for layout changes.
        return (
            <div
                key={process.id}
                className="relative group transition-all duration-500 ease-in-out hover:-translate-y-1 shrink-0 animate-in fade-in slide-in-from-right-4"
                title={`${process.name} | Priority: ${process.priority} | Wait: ${process.waitTime}`}
            >
                <div
                    className="px-2 py-1 rounded bg-bg-primary border flex items-center gap-2 shadow-sm"
                    style={{
                        borderColor: heatColor || 'rgba(255,255,255,0.1)',
                    }}
                >
                    <span
                        className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]"
                        style={{ backgroundColor: process.color, color: process.color }}
                    />
                    <span className="font-mono text-xs font-semibold text-white/90">{process.name}</span>

                    {state.agingEnabled && (
                        <span className="text-[9px] uppercase font-bold text-accent-cyan/80 bg-accent-cyan/10 px-1 rounded border border-accent-cyan/20">
                            P{process.priority}
                        </span>
                    )}

                    {process.state === 'RUNNING' && (
                        <div className="flex items-center gap-1 text-[10px] text-green-300 font-mono bg-green-500/10 px-1 rounded border border-green-500/20 ml-1">
                            <span>⏱️ {process.bursts[process.currentBurstIndex]?.remaining ?? 0}</span>
                        </div>
                    )}

                    {showHeatMap && process.waitTime > 0 && (
                        <div
                            className="w-1.5 h-1.5 rounded-full animate-pulse ml-1"
                            style={{ backgroundColor: heatColor }}
                        />
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="glass-panel p-6 overflow-hidden">
            <h3 className="text-sm font-bold border-b border-border-main pb-2 mb-4 text-text-secondary">Process Pipeline</h3>

            <div className="flex flex-col md:flex-row items-stretch gap-4">
                {/* Ready Queue */}
                <div className="flex-1 flex flex-col gap-2 min-h-[120px] p-4 rounded-lg bg-blue-500/5 border border-blue-500/10 relative">
                    <div className="flex items-center justify-between mb-1">
                        <h4 className="flex items-center gap-2 text-xs font-bold text-blue-300/90 uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                            Ready Queue
                        </h4>
                        <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/20">
                            {readyProcesses.length}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[150px] content-start relative min-h-[40px]">
                        {readyProcesses.length === 0 ? (
                            <div className="w-full flex items-center justify-center p-2 text-white/20 text-xs italic border border-dashed border-white/5 rounded">
                                Queue empty
                            </div>
                        ) : (
                            readyProcesses.map(p => renderProcessChip(p, true))
                        )}
                    </div>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex items-center justify-center text-border-main">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse text-accent-primary"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </div>

                {/* CPU / Running */}
                <div className="flex-1 flex flex-col gap-2 min-h-[120px] p-4 rounded-lg bg-green-500/5 border border-green-500/10 scale-105 z-10 shadow-[0_0_30px_rgba(0,255,65,0.05)]">
                    <div className="flex items-center justify-between mb-1">
                        <h4 className="flex items-center gap-2 text-xs font-bold text-green-300/90 uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            CPU (Running)
                        </h4>
                        <span className="text-[10px] font-mono bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded border border-green-500/20">
                            {runningProcesses.length}/{state.coreCount}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[150px] content-start min-h-[40px]">
                        {runningProcesses.length === 0 ? (
                            <div className="w-full flex items-center justify-center p-2 text-white/20 text-xs italic border border-dashed border-white/5 rounded">
                                CPU Idle
                            </div>
                        ) : (
                            runningProcesses.map(p => renderProcessChip(p))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
