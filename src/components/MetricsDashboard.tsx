import { useScheduler } from '../context/SchedulerContext';

export function MetricsDashboard() {
    const { state } = useScheduler();
    const { metrics, clock } = state;

    const formatNumber = (num: number, decimals: number = 2): string => {
        return num.toFixed(decimals);
    };

    const getUtilizationColor = (util: number): string => {
        if (util >= 80) return 'text-accent-error';
        if (util >= 50) return 'text-accent-warning';
        return 'text-accent-success';
    };

    return (
        <div className="glass-panel flex flex-col gap-4 h-full">
            <h3 className="text-lg font-bold border-b border-border-main pb-2">Live Metrics</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 h-full">
                <div className="glass-panel p-3 border border-border-main flex flex-col items-center justify-center gap-1 min-h-[100px] relative overflow-hidden bg-bg-secondary/30">
                    <div className={`text-2xl font-mono font-bold ${getUtilizationColor(metrics.cpuUtilization)}`}>
                        {formatNumber(metrics.cpuUtilization, 1)}%
                    </div>
                    <div className="text-xs text-text-secondary uppercase tracking-wider text-center">CPU Utilization</div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                        <div
                            className={`h-full transition-all duration-300 ${utilizationColorClass(metrics.cpuUtilization)}`}
                            style={{ width: `${Math.min(100, metrics.cpuUtilization)}%` }}
                        />
                    </div>
                </div>

                <div className="glass-panel p-3 border border-border-main flex flex-col items-center justify-center gap-1 min-h-[100px] relative overflow-hidden bg-bg-secondary/30">
                    <div className="text-2xl font-mono font-bold text-accent-info">
                        {formatNumber(metrics.throughput, 3)}
                    </div>
                    <div className="text-xs text-text-secondary uppercase tracking-wider text-center">Throughput (P/unit)</div>
                    <div className="text-[10px] text-text-muted mt-1">
                        {metrics.completedProcesses} completed / {clock} time
                    </div>
                </div>

                <div className="glass-panel p-3 border border-border-main flex flex-col items-center justify-center gap-1 min-h-[100px] relative overflow-hidden bg-bg-secondary/30">
                    <div className="text-2xl font-mono font-bold text-accent-warning">
                        {formatNumber(metrics.avgWaitingTime, 2)}
                    </div>
                    <div className="text-xs text-text-secondary uppercase tracking-wider text-center">Avg Wait Time</div>
                </div>

                <div className="glass-panel p-3 border border-border-main flex flex-col items-center justify-center gap-1 min-h-[100px] relative overflow-hidden bg-bg-secondary/30">
                    <div className="text-2xl font-mono font-bold text-accent-secondary">
                        {formatNumber(metrics.avgTurnaroundTime, 2)}
                    </div>
                    <div className="text-xs text-text-secondary uppercase tracking-wider text-center">Avg Turnaround</div>
                </div>

                <div className="glass-panel p-3 border border-border-main flex flex-col items-center justify-center gap-1 min-h-[100px] relative overflow-hidden bg-bg-secondary/30">
                    <div className="text-2xl font-mono font-bold text-accent-primary">
                        {formatNumber(metrics.avgResponseTime, 2)}
                    </div>
                    <div className="text-xs text-text-secondary uppercase tracking-wider text-center">Avg Response</div>
                </div>

                <div className="glass-panel p-3 border border-border-main flex flex-col items-center justify-center gap-1 min-h-[100px] relative overflow-hidden bg-bg-secondary/30">
                    <div className="text-2xl font-mono font-bold text-accent-success">
                        {metrics.completedProcesses}
                        <span className="text-sm font-normal text-text-muted ml-1">/ {state.processes.length}</span>
                    </div>
                    <div className="text-xs text-text-secondary uppercase tracking-wider text-center">Completed</div>
                </div>
            </div>
        </div>
    );
}

function utilizationColorClass(util: number): string {
    if (util >= 80) return 'bg-accent-error';
    if (util >= 50) return 'bg-accent-warning';
    return 'bg-accent-success';
}
