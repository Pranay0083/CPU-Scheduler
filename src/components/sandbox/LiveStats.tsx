interface LiveStatsProps {
    time: number;
    avgWaitTime: number;
    completedCount: number;
    totalCount: number;
}

export function LiveStats({ time, avgWaitTime, completedCount, totalCount }: LiveStatsProps) {
    // Calculate pseudo CPU Utilization (just for simple visual feedback)
    // If processes are completed, CPU was utilized. If zero time, 0.
    const utilization = time === 0 ? 0 : Math.min(100, Math.round(((completedCount * 5) / time) * 100));

    const waitingCount = totalCount - completedCount - (time > 0 && totalCount > completedCount ? 1 : 0); // rough active estimate

    let vibeCheck = "Idle. Draft some work to begin.";
    if (time > 0) {
        if (waitingCount > 3) {
            vibeCheck = "CPU is sweating! Tasks are backing up.";
        } else if (utilization > 80) {
            vibeCheck = "Running hot and efficient.";
        } else if (waitingCount > 0) {
            vibeCheck = `System is healthy. ${waitingCount} waiting.`;
        } else if (completedCount > 0 && waitingCount === 0) {
            vibeCheck = "All caught up. Awaiting input.";
        }
    }

    const isWarning = avgWaitTime > 30 || waitingCount > 4;

    return (
        <div className="w-full">
            <div className={`hand-drawn-border bg-[var(--bg-color)]/60 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.1)] p-5 flex flex-col gap-4 transition-all duration-1000 ${isWarning ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)] animate-pulse' : 'border-[var(--grid-color)]'}`}>
                <div className="border-b border-dashed border-[var(--grid-color)] pb-3">
                    <h3 className="font-architect text-lg text-[var(--cpu-stroke)] flex items-center justify-between mb-1">
                        Live Telemetry
                        <span className="animate-pulse text-red-500 text-sm">● REC</span>
                    </h3>
                    <p className="font-sans text-xs italic opacity-70 text-[var(--cpu-stroke)] leading-tight">
                        "{vibeCheck}"
                    </p>
                </div>

                <div className="flex flex-col gap-3 font-mono text-sm opacity-80 text-[var(--cpu-stroke)]">

                    {/* System Time */}
                    <div className="flex justify-between items-center relative group cursor-help">
                        <span className="uppercase tracking-wider opacity-60 text-xs">System Time</span>
                        <span className="text-lg font-bold">{time} ms</span>

                        {/* Sticky Note Tooltip */}
                        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 w-48 p-3 bg-yellow-100 border border-yellow-300 transform -rotate-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-md hand-drawn-border text-yellow-900 font-architect text-sm normal-case tracking-normal">
                            The total ticks elapsed since you started the simulation.
                        </div>
                    </div>

                    {/* Avg Wait */}
                    <div className="flex justify-between items-center relative group cursor-help">
                        <span className="uppercase tracking-wider opacity-60 text-xs">Avg Wait</span>
                        <span className="text-lg font-bold">{avgWaitTime.toFixed(1)} ms</span>

                        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 w-48 p-3 bg-orange-100 border border-orange-300 transform rotate-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-md hand-drawn-border text-orange-900 font-architect text-sm normal-case tracking-normal">
                            Average time processes spent waiting in the Ready Queue before finishing.
                        </div>
                    </div>

                    {/* Throughput */}
                    <div className="flex justify-between items-center relative group cursor-help">
                        <span className="uppercase tracking-wider opacity-60 text-xs">Throughput</span>
                        <span className="text-lg font-bold">{completedCount} / {totalCount}</span>

                        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 w-48 p-3 bg-blue-100 border border-blue-300 transform -rotate-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-md hand-drawn-border text-blue-900 font-architect text-sm normal-case tracking-normal">
                            How many jobs the CPU has successfully finished out of total drafted.
                        </div>
                    </div>

                    {/* Est CPU Util */}
                    <div className="flex justify-between items-center relative group cursor-help">
                        <span className="uppercase tracking-wider opacity-60 text-xs">Est. CPU Util</span>
                        <span className="text-lg font-bold">{utilization}%</span>

                        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 w-48 p-3 bg-pink-100 border border-pink-300 transform rotate-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-md hand-drawn-border text-pink-900 font-architect text-sm normal-case tracking-normal">
                            Rough estimate of time the processor was actively working vs idling.
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}
