import { useScheduler } from '../context/SchedulerContext';
import { getStarvationColor, type Process } from '../types';

export function ProcessQueue() {
    const { state } = useScheduler();

    // Get all processes in READY state grouped by core
    const readyProcesses = state.processes.filter(p => p.state === 'READY');
    const waitingProcesses = state.processes.filter(p => p.state === 'WAITING');
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

        return (
            <div
                key={process.id}
                className="relative group transition-all duration-300 hover:scale-105"
                title={`${process.name} | Priority: ${process.priority} | Wait: ${process.waitTime}`}
            >
                <div 
                    className="pl-3 pr-4 py-2 rounded-lg bg-glass-light border border-white/10 flex items-center justify-between gap-3 shadow-lg backdrop-blur-sm"
                    style={{
                        borderColor: heatColor || 'rgba(255,255,255,0.1)',
                        boxShadow: heatColor ? `0 0 12px ${heatColor}40` : undefined,
                    }}
                >
                    <div className="flex items-center gap-2">
                        <span 
                            className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]"
                            style={{ backgroundColor: process.color, color: process.color }}
                        />
                        <span className="font-mono text-sm font-semibold text-white/90">{process.name}</span>
                    </div>

                    {state.agingEnabled && (
                        <span className="text-[10px] uppercase tracking-wider font-bold text-accent-cyan/80 bg-accent-cyan/10 px-1.5 py-0.5 rounded border border-accent-cyan/20">
                            P{process.priority}
                        </span>
                    )}

                    {showHeatMap && process.waitTime > 0 && (
                        <div 
                            className="w-1.5 h-1.5 rounded-full animate-pulse"
                            style={{ backgroundColor: heatColor }}
                        />
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="glass-panel p-6">
            <h3 className="glass-header mb-6">Process Queues</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Running Processes */}
                <div className="flex flex-col gap-3 min-h-[160px] p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="flex items-center gap-2 text-sm font-medium text-green-300/90 uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)] animate-pulse" />
                            Running
                        </h4>
                        <span className="text-xs font-mono bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full border border-green-500/20">
                            {runningProcesses.length}
                        </span>
                    </div>
                    
                    <div className="flex flex-col gap-2 overflow-y-auto max-h-[300px] pr-1 custom-scrollbar">
                        {runningProcesses.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-24 text-white/20 text-sm italic border-2 border-dashed border-white/5 rounded-lg">
                                No running processes
                            </div>
                        ) : (
                            runningProcesses.map(p => renderProcessChip(p))
                        )}
                    </div>
                </div>

                {/* Ready Queue */}
                <div className="flex flex-col gap-3 min-h-[160px] p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="flex items-center gap-2 text-sm font-medium text-blue-300/90 uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                            Ready Queue
                        </h4>
                        <span className="text-xs font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/20">
                            {readyProcesses.length}
                        </span>
                    </div>

                    <div className="flex flex-col gap-2 overflow-y-auto max-h-[300px] pr-1 custom-scrollbar">
                        {readyProcesses.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-24 text-white/20 text-sm italic border-2 border-dashed border-white/5 rounded-lg">
                                Queue empty
                            </div>
                        ) : (
                            readyProcesses.map(p => renderProcessChip(p, true))
                        )}
                    </div>

                    {state.agingEnabled && readyProcesses.length > 0 && (
                        <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40">
                            <span>Starvation:</span>
                            <div className="flex-1 mx-3 h-1.5 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 opacity-70" />
                            <div className="flex justify-between gap-2">
                                <span>Cool</span>
                                <span>Hot</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* I/O Wait Queue */}
                <div className="flex flex-col gap-3 min-h-[160px] p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="flex items-center gap-2 text-sm font-medium text-purple-300/90 uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.5)]" />
                            I/O Wait
                        </h4>
                        <span className="text-xs font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/20">
                            {waitingProcesses.length}
                        </span>
                    </div>

                    <div className="flex flex-col gap-2 overflow-y-auto max-h-[300px] pr-1 custom-scrollbar">
                        {waitingProcesses.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-24 text-white/20 text-sm italic border-2 border-dashed border-white/5 rounded-lg">
                                No I/O operations
                            </div>
                        ) : (
                            waitingProcesses.map(p => {
                                const currentBurst = p.bursts[p.currentBurstIndex];
                                return (
                                    <div
                                        key={p.id}
                                        className="relative group hover:scale-105 transition-transform"
                                        title={`${p.name} | I/O Remaining: ${currentBurst?.remaining ?? 0}`}
                                    >
                                        <div className="pl-3 pr-4 py-2 rounded-lg bg-glass-light border border-purple-500/20 flex items-center justify-between shadow-lg backdrop-blur-sm">
                                            <div className="flex items-center gap-2">
                                                <span 
                                                    className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]"
                                                    style={{ backgroundColor: p.color, color: p.color }}
                                                />
                                                <span className="font-mono text-sm font-semibold text-white/90">{p.name}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-purple-300 font-mono bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                                                <span>💾</span>
                                                <span>{currentBurst?.remaining ?? 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
