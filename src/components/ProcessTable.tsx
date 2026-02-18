import { useScheduler } from '../context/SchedulerContext';
import { formatBurstPattern, type Process } from '../types';

export function ProcessTable() {
    const { state, removeProcess } = useScheduler();
    const isRunning = state.simulationState === 'RUNNING';

    const getStateStyles = (processState: Process['state']): string => {
        switch (processState) {
            case 'NEW': return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
            case 'READY': return 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30';
            case 'RUNNING': return 'bg-green-500/10 text-green-300 border-green-500/30 animate-pulse';
            case 'WAITING': return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
            case 'TERMINATED': return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
            default: return 'bg-gray-500/10 text-gray-300';
        }
    };

    const getStateLabel = (processState: Process['state']): string => {
        switch (processState) {
            case 'NEW': return 'New';
            case 'READY': return 'Ready';
            case 'RUNNING': return 'Running';
            case 'WAITING': return 'I/O Wait';
            case 'TERMINATED': return 'Done';
            default: return processState;
        }
    };

    const getRemainingBurst = (process: Process): string => {
        const currentBurst = process.bursts[process.currentBurstIndex];
        if (!currentBurst) return '-';
        return `${currentBurst.type}(${currentBurst.remaining})`;
    };

    if (state.processes.length === 0) {
        return (
            <div className="glass-panel p-8 text-center border-dashed border-2 border-white/10">
                <p className="text-white/60 text-lg mb-2">No processes added yet</p>
                <p className="text-sm text-white/40">Use the control panel above to add processes or load a preset.</p>
            </div>
        );
    }

    return (
        <div className="glass-panel p-6 overflow-hidden">
            <h3 className="glass-header mb-4">Process Table</h3>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-white/50">
                            <th className="px-4 py-3 font-medium">PID</th>
                            <th className="px-4 py-3 font-medium">Arrival</th>
                            <th className="px-4 py-3 font-medium">Priority</th>
                            <th className="px-4 py-3 font-medium">Burst Pattern</th>
                            <th className="px-4 py-3 font-medium">Current</th>
                            <th className="px-4 py-3 font-medium">State</th>
                            <th className="px-4 py-3 font-medium">Wait</th>
                            <th className="px-4 py-3 font-medium">TAT</th>
                            <th className="px-4 py-3 font-medium"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {state.processes.map(process => (
                            <tr 
                                key={process.id} 
                                className={`transition-colors duration-200 hover:bg-white/5 ${
                                    process.state === 'RUNNING' ? 'bg-white/[0.02]' : ''
                                }`}
                            >
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <span
                                            className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]"
                                            style={{ backgroundColor: process.color }}
                                        />
                                        <span className="font-mono text-white/90 font-medium">{process.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-white/70 font-mono">{process.arrivalTime}</td>
                                <td className="px-4 py-3 text-white/70 font-mono">{process.priority}</td>
                                <td className="px-4 py-3">
                                    <span className="font-mono text-xs text-white/60 bg-black/20 px-2 py-1 rounded border border-white/5">
                                        {formatBurstPattern(process.bursts)}
                                    </span>
                                </td>
                                <td className="px-4 py-3 font-mono text-sm text-accent-cyan/90">
                                    {getRemainingBurst(process)}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getStateStyles(process.state)}`}>
                                        {getStateLabel(process.state)}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-white/70 font-mono">{process.waitTime}</td>
                                <td className="px-4 py-3 text-white/70 font-mono">
                                    {process.state === 'TERMINATED'
                                        ? process.turnaroundTime
                                        : '-'}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        onClick={() => removeProcess(process.id)}
                                        disabled={isRunning}
                                        className="p-1.5 rounded hover:bg-red-500/20 hover:text-red-400 text-white/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                        title="Remove process"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
