import { useScheduler } from '../context/SchedulerContext';
import { formatBurstPattern, parseBurstPattern, type Process } from '../types';

export function ProcessTable() {
    const {
        state,
        removeProcess,
        addProcess,
        clearProcesses,
        setAlgorithm,
        setCoreCount,
        setPrediction,
        setAWTPrediction,
        submitPredictions,
        initPredictions
    } = useScheduler();

    const { predictionState, interactionMode, simulationState } = state;
    const isRunning = simulationState === 'RUNNING';
    const isPredictMode = interactionMode === 'PREDICT_VERIFY';

    // Initialize predictions when entering predict mode if needed
    const shouldInit = state.processes.length > 0 &&
        predictionState.predictions.length !== state.processes.length &&
        !predictionState.submitted;

    if (shouldInit && isPredictMode) {
        initPredictions();
    }

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

    const loadScenario = (scenario: 'bottleneck' | 'priority' | 'marathon') => {
        clearProcesses();

        const scenarios = {
            bottleneck: {
                algo: 'RR',
                processes: [
                    { name: '1', arr: 0, pri: 1, burst: 'CPU(2)-IO(6)-CPU(1)' },
                    { name: '2', arr: 1, pri: 1, burst: 'CPU(1)-IO(8)-CPU(2)' },
                    { name: '3', arr: 2, pri: 1, burst: 'CPU(3)-IO(5)-CPU(1)' },
                    { name: '4', arr: 3, pri: 1, burst: 'CPU(2)-IO(7)-CPU(2)' }
                ]
            },
            priority: {
                algo: 'PRIORITY_PREEMPTIVE',
                processes: [
                    { name: '1', arr: 0, pri: 5, burst: 'CPU(8)' },
                    { name: '2', arr: 2, pri: 1, burst: 'CPU(4)' },
                    { name: '3', arr: 4, pri: 2, burst: 'CPU(6)' },
                    { name: '4', arr: 6, pri: 0, burst: 'CPU(2)' }
                ]
            },
            marathon: {
                algo: 'FCFS',
                processes: [
                    { name: '1', arr: 0, pri: 1, burst: 'CPU(15)' },
                    { name: '2', arr: 2, pri: 1, burst: 'CPU(12)' },
                    { name: '3', arr: 4, pri: 1, burst: 'CPU(18)' }
                ]
            }
        };

        const selected = scenarios[scenario];
        if (selected.algo === 'RR') setAlgorithm('ROUND_ROBIN');
        else if (selected.algo === 'PRIORITY_PREEMPTIVE') setAlgorithm('PRIORITY_PREEMPTIVE');
        else setAlgorithm('FCFS');

        setCoreCount(1);

        selected.processes.forEach(p => {
            addProcess({
                name: p.name,
                arrivalTime: p.arr,
                priority: p.pri,
                bursts: parseBurstPattern(p.burst),
                color: ''
            });
        });
    };

    const handlePredictionChange = (processId: string, field: 'predictedCT' | 'predictedWT' | 'predictedTAT', value: string) => {
        const numValue = value === '' ? null : parseInt(value, 10);
        setPrediction(processId, field, numValue);
    };

    const handleAWTChange = (value: string) => {
        const numValue = value === '' ? null : parseFloat(value);
        setAWTPrediction(numValue);
    };

    const allPredictionsFilled = predictionState.predictions.every(p => p.predictedCT !== null && p.predictedWT !== null && p.predictedTAT !== null) &&
        predictionState.predictedAWT !== null;

    const isPredictionDisabled = predictionState.submitted || isRunning;

    if (state.processes.length === 0) {
        return (
            <div className="glass-panel p-6 border-dashed border-2 border-white/10 h-full flex flex-col justify-center">
                <div className="text-center mb-6">
                    <p className="text-white/60 text-lg mb-1 font-bold">No processes detected.</p>
                    <p className="text-xs text-white/40">Add a process manually or select a quick-start scenario below:</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button onClick={() => loadScenario('bottleneck')} className="flex flex-col gap-2 p-4 rounded-lg bg-bg-secondary border border-border-main hover:border-accent-info hover:bg-accent-info/5 transition-all text-left group">
                        <span className="text-accent-info font-bold text-sm tracking-wider uppercase flex items-center gap-2">
                            <span className="text-lg group-hover:scale-110 transition-transform">🚦</span> The Bottleneck
                        </span>
                        <span className="text-xs text-text-muted">4 tasks with short CPU bursts but very long I/O wait times. Watch the ready queue empty.</span>
                    </button>

                    <button onClick={() => loadScenario('priority')} className="flex flex-col gap-2 p-4 rounded-lg bg-bg-secondary border border-border-main hover:border-accent-warning hover:bg-accent-warning/5 transition-all text-left group">
                        <span className="text-accent-warning font-bold text-sm tracking-wider uppercase flex items-center gap-2">
                            <span className="text-lg group-hover:scale-110 transition-transform">⚔️</span> Priority Battle
                        </span>
                        <span className="text-xs text-text-muted">High priority tasks arriving late will preempt the currently running long tasks.</span>
                    </button>

                    <button onClick={() => loadScenario('marathon')} className="flex flex-col gap-2 p-4 rounded-lg bg-bg-secondary border border-border-main hover:border-accent-success hover:bg-accent-success/5 transition-all text-left group">
                        <span className="text-accent-success font-bold text-sm tracking-wider uppercase flex items-center gap-2">
                            <span className="text-lg group-hover:scale-110 transition-transform">🏃‍♂️</span> The Marathon
                        </span>
                        <span className="text-xs text-text-muted">3 CPU-bound tasks with massive computation requirements and zero I/O.</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-panel p-6 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between shrink-0 mb-4">
                <h3 className="glass-header !mb-0">Process Table</h3>

                {isPredictMode && (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg">
                            <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Predict AWT:</label>
                            <div className="flex flex-col gap-1 items-end">
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={predictionState.predictedAWT ?? ''}
                                    onChange={(e) => handleAWTChange(e.target.value)}
                                    disabled={isPredictionDisabled}
                                    className={`w-20 bg-black/30 border rounded px-2 py-1 text-right font-mono text-sm font-bold focus:outline-none focus:ring-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                                        ${predictionState.showResults && Math.abs((predictionState.predictedAWT || 0) - state.metrics.avgWaitingTime) > 0.05
                                            ? 'border-red-500 text-red-300 focus:border-red-500 bg-red-500/10'
                                            : predictionState.showResults && Math.abs((predictionState.predictedAWT || 0) - state.metrics.avgWaitingTime) <= 0.05
                                                ? 'border-green-500 text-green-300 bg-green-500/10'
                                                : predictionState.predictedAWT === null && !predictionState.submitted
                                                    ? 'border-yellow-500/50 text-indigo-200 animate-pulse focus:border-indigo-400 focus:ring-indigo-400'
                                                    : 'border-indigo-500/30 text-indigo-200 focus:border-indigo-400 focus:ring-indigo-400'}`}
                                    placeholder="?"
                                />
                                {predictionState.showResults && Math.abs((predictionState.predictedAWT || 0) - state.metrics.avgWaitingTime) > 0.05 && (
                                    <span className="text-[10px] text-red-400 font-bold bg-red-500/20 px-1.5 rounded absolute -bottom-5 right-0 whitespace-nowrap">Actual: {state.metrics.avgWaitingTime.toFixed(2)}</span>
                                )}
                            </div>
                        </div>
                        {!predictionState.submitted ? (
                            <button
                                onClick={submitPredictions}
                                disabled={!allPredictionsFilled}
                                className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${allPredictionsFilled
                                    ? 'bg-accent-success/20 text-accent-success border border-accent-success hover:bg-accent-success/30'
                                    : 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'
                                    }`}
                            >
                                🔒 Lock Predictions
                            </button>
                        ) : (
                            <span className="bg-red-500/20 text-red-300 px-3 py-1.5 rounded text-xs font-bold border border-red-500/30 flex items-center gap-1.5">
                                <span>🔒</span> Locked
                            </span>
                        )}
                    </div>
                )}
            </div>

            <div className="overflow-x-auto overflow-y-auto flex-1 scrollbar-thin pr-2">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-white/50">
                            <th className="px-4 py-3 font-medium">PID</th>
                            <th className="px-4 py-3 font-medium">Arrival</th>
                            <th className="px-4 py-3 font-medium">Priority</th>
                            <th className="px-4 py-3 font-medium">Burst Pattern</th>
                            {isPredictMode && (
                                <>
                                    <th className="px-4 py-3 font-bold text-indigo-300 bg-indigo-500/5 border-b border-indigo-500/20">Pred CT</th>
                                    <th className="px-4 py-3 font-bold text-indigo-300 bg-indigo-500/5 border-b border-indigo-500/20">Pred WT</th>
                                    <th className="px-4 py-3 font-bold text-indigo-300 bg-indigo-500/5 border-b border-indigo-500/20">Pred TAT</th>
                                </>
                            )}
                            <th className="px-4 py-3 font-medium">Current</th>
                            <th className="px-4 py-3 font-medium">State</th>
                            <th className="px-4 py-3 font-medium">Wait</th>
                            <th className="px-4 py-3 font-medium">TAT</th>
                            <th className="px-4 py-3 font-medium"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {state.processes.map(process => {
                            const prediction = predictionState.predictions.find(p => p.processId === process.id);

                            return (
                                <tr
                                    key={process.id}
                                    className={`transition-colors duration-200 hover:bg-white/5 ${process.state === 'RUNNING' ? 'bg-white/[0.02]' : ''
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
                                    {isPredictMode && (
                                        <>
                                            <td className="px-4 py-3 bg-indigo-500/5">
                                                <div className="flex flex-col gap-1 items-end">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        title="Predicted Completion Time"
                                                        value={prediction?.predictedCT ?? ''}
                                                        onChange={(e) => handlePredictionChange(process.id, 'predictedCT', e.target.value)}
                                                        disabled={isPredictionDisabled}
                                                        className={`w-16 bg-black/30 border rounded px-2 py-1 text-right font-mono text-white focus:outline-none focus:ring-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                                                            ${predictionState.showResults && prediction?.predictedCT !== process.completionTime
                                                                ? 'border-red-500 text-red-300 focus:border-red-500 focus:ring-red-500 bg-red-500/10'
                                                                : predictionState.showResults && prediction?.predictedCT === process.completionTime
                                                                    ? 'border-green-500 text-green-300 bg-green-500/10'
                                                                    : prediction?.predictedCT === null && !predictionState.submitted
                                                                        ? 'border-yellow-500/50 bg-yellow-500/5 animate-pulse focus:border-accent-primary focus:ring-accent-primary'
                                                                        : 'border-white/10 focus:border-accent-primary focus:ring-accent-primary'}`}
                                                        placeholder="?"
                                                    />
                                                    {predictionState.showResults && prediction?.predictedCT !== process.completionTime && (
                                                        <span className="text-[10px] text-red-400 font-bold bg-red-500/20 px-1.5 rounded">Act: {process.completionTime}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 bg-indigo-500/5">
                                                <div className="flex flex-col gap-1 items-end">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        title="Predicted Wait Time"
                                                        value={prediction?.predictedWT ?? ''}
                                                        onChange={(e) => handlePredictionChange(process.id, 'predictedWT', e.target.value)}
                                                        disabled={isPredictionDisabled}
                                                        className={`w-16 bg-black/30 border rounded px-2 py-1 text-right font-mono text-white focus:outline-none focus:ring-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                                                            ${predictionState.showResults && prediction?.predictedWT !== process.waitTime
                                                                ? 'border-red-500 text-red-300 focus:border-red-500 focus:ring-red-500 bg-red-500/10'
                                                                : predictionState.showResults && prediction?.predictedWT === process.waitTime
                                                                    ? 'border-green-500 text-green-300 bg-green-500/10'
                                                                    : prediction?.predictedWT === null && !predictionState.submitted
                                                                        ? 'border-yellow-500/50 bg-yellow-500/5 animate-pulse focus:border-accent-primary focus:ring-accent-primary'
                                                                        : 'border-white/10 focus:border-accent-primary focus:ring-accent-primary'}`}
                                                        placeholder="?"
                                                    />
                                                    {predictionState.showResults && prediction?.predictedWT !== process.waitTime && (
                                                        <span className="text-[10px] text-red-400 font-bold bg-red-500/20 px-1.5 rounded">Act: {process.waitTime}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 bg-indigo-500/5">
                                                <div className="flex flex-col gap-1 items-end">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        title="Predicted Turnaround Time"
                                                        value={prediction?.predictedTAT ?? ''}
                                                        onChange={(e) => handlePredictionChange(process.id, 'predictedTAT', e.target.value)}
                                                        disabled={isPredictionDisabled}
                                                        className={`w-16 bg-black/30 border rounded px-2 py-1 text-right font-mono text-white focus:outline-none focus:ring-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                                                            ${predictionState.showResults && prediction?.predictedTAT !== process.turnaroundTime
                                                                ? 'border-red-500 text-red-300 focus:border-red-500 focus:ring-red-500 bg-red-500/10'
                                                                : predictionState.showResults && prediction?.predictedTAT === process.turnaroundTime
                                                                    ? 'border-green-500 text-green-300 bg-green-500/10'
                                                                    : prediction?.predictedTAT === null && !predictionState.submitted
                                                                        ? 'border-yellow-500/50 bg-yellow-500/5 animate-pulse focus:border-accent-primary focus:ring-accent-primary'
                                                                        : 'border-white/10 focus:border-accent-primary focus:ring-accent-primary'}`}
                                                        placeholder="?"
                                                    />
                                                    {predictionState.showResults && prediction?.predictedTAT !== process.turnaroundTime && (
                                                        <span className="text-[10px] text-red-400 font-bold bg-red-500/20 px-1.5 rounded">Act: {process.turnaroundTime}</span>
                                                    )}
                                                </div>
                                            </td>
                                        </>
                                    )}
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
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
