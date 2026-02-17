import { useScheduler } from '../context/SchedulerContext';
import { parseBurstPattern } from '../types';
import type { Algorithm, CoreCount, SimulationSpeed, InteractionMode } from '../types';

const INTERACTION_MODES: { value: InteractionMode; label: string; icon: string }[] = [
    { value: 'NORMAL', label: 'Normal', icon: '▶️' },
    { value: 'PREDICT_VERIFY', label: 'Predict & Verify', icon: '📝' },
];

const ALGORITHMS: { value: Algorithm; label: string }[] = [
    { value: 'FCFS', label: 'First Come First Serve' },
    { value: 'SJF', label: 'Shortest Job First' },
    { value: 'SRTF', label: 'Shortest Remaining Time' },
    { value: 'ROUND_ROBIN', label: 'Round Robin' },
    { value: 'PRIORITY_PREEMPTIVE', label: 'Priority (Preemptive)' },
    { value: 'PRIORITY_NON_PREEMPTIVE', label: 'Priority (Non-Preemptive)' },
    { value: 'MLFQ', label: 'Multi-Level Feedback Queue' },
];

const PRESETS = [
    {
        name: 'Basic FCFS',
        processes: [
            { name: 'P1', arrivalTime: 0, priority: 1, burstPattern: 'CPU(5)' },
            { name: 'P2', arrivalTime: 1, priority: 1, burstPattern: 'CPU(3)' },
            { name: 'P3', arrivalTime: 2, priority: 1, burstPattern: 'CPU(4)' },
        ],
    },
    {
        name: 'Preemption Demo',
        processes: [
            { name: 'P1', arrivalTime: 0, priority: 3, burstPattern: 'CPU(8)' },
            { name: 'P2', arrivalTime: 2, priority: 1, burstPattern: 'CPU(4)' },
            { name: 'P3', arrivalTime: 4, priority: 2, burstPattern: 'CPU(2)' },
        ],
    },
    {
        name: 'I/O Bound',
        processes: [
            { name: 'P1', arrivalTime: 0, priority: 1, burstPattern: 'CPU(3) -> IO(2) -> CPU(2)' },
            { name: 'P2', arrivalTime: 1, priority: 2, burstPattern: 'CPU(2) -> IO(3) -> CPU(3)' },
            { name: 'P3', arrivalTime: 2, priority: 1, burstPattern: 'CPU(4)' },
        ],
    },
    {
        name: 'Multi-Core Load',
        processes: [
            { name: 'P1', arrivalTime: 0, priority: 1, burstPattern: 'CPU(6)' },
            { name: 'P2', arrivalTime: 0, priority: 2, burstPattern: 'CPU(4)' },
            { name: 'P3', arrivalTime: 0, priority: 1, burstPattern: 'CPU(5)' },
            { name: 'P4', arrivalTime: 0, priority: 3, burstPattern: 'CPU(3)' },
        ],
    },
];

export function ControlPanel() {
    const {
        state,
        setAlgorithm,
        setCoreCount,
        setTimeQuantum,
        setSpeed,
        toggleAging,
        start,
        pause,
        step,
        reset,
        clearProcesses,
        addProcess,
        setInteractionMode,
    } = useScheduler();

    const isRunning = state.simulationState === 'RUNNING';
    const canStart = state.processes.length > 0;

    const loadPreset = (preset: typeof PRESETS[0]) => {
        clearProcesses();
        preset.processes.forEach(p => {
            const bursts = parseBurstPattern(p.burstPattern);
            addProcess({
                name: p.name,
                arrivalTime: p.arrivalTime,
                priority: p.priority,
                bursts,
                color: '',
            });
        });
    };

    return (
        <div className="glass-panel flex flex-col gap-4 text-sm">
            {/* Simulation Mode Selector */}
            <div className="flex flex-col gap-2 border-b border-border-main pb-4">
                <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Mode</h3>
                <div className="grid grid-cols-2 gap-2">
                    {INTERACTION_MODES.map(mode => (
                        <button
                            key={mode.value}
                            onClick={() => setInteractionMode(mode.value)}
                            disabled={isRunning}
                            className={`p-2 rounded-lg transition-all flex flex-col items-center gap-1 border ${state.interactionMode === mode.value ? 'bg-accent-primary/20 border-accent-primary/50 text-accent-primary' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                            title={mode.label}
                        >
                            <span className="text-xl">{mode.icon}</span>
                            <span className="text-xs font-medium">{mode.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-2 border-b border-border-main pb-4">
                <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Algorithm</h3>
                <select
                    value={state.algorithm}
                    onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
                    disabled={isRunning}
                    className="w-full bg-bg-secondary border border-border-main rounded-md p-2 text-text-primary focus:border-accent-primary focus:outline-none"
                    title="Select Scheduling Algorithm"
                >
                    {ALGORITHMS.map(algo => (
                        <option key={algo.value} value={algo.value}>
                            {algo.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-2 border-b border-border-main pb-4">
                <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">CPU Cores</h3>
                <div className="flex gap-2">
                    {[1, 2, 4].map(count => (
                        <button
                            key={count}
                            onClick={() => setCoreCount(count as CoreCount)}
                            disabled={isRunning}
                            className={`flex-1 py-1 px-2 rounded transition border ${state.coreCount === count ? 'bg-accent-primary text-white border-accent-primary' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                        >
                            {count}
                        </button>
                    ))}
                </div>
            </div>

            {(state.algorithm === 'ROUND_ROBIN' || state.algorithm === 'MLFQ') && (
                <div className="flex flex-col gap-2 border-b border-border-main pb-4">
                    <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Time Quantum</h3>
                    <input
                        type="number"
                        min="1"
                        max="10"
                        value={state.timeQuantum}
                        onChange={(e) => setTimeQuantum(Math.max(1, parseInt(e.target.value) || 1))}
                        disabled={isRunning}
                        className="w-full bg-bg-secondary border border-border-main rounded-md p-2 text-text-primary focus:border-accent-primary focus:outline-none"
                        placeholder="Time Quantum"
                        title="Set Time Quantum"
                    />
                </div>
            )}

            <div className="flex flex-col gap-2 border-b border-border-main pb-4">
                <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Speed</h3>
                <div className="flex gap-2">
                    {[0.5, 1, 2, 4].map(speed => (
                        <button
                            key={speed}
                            onClick={() => setSpeed(speed as SimulationSpeed)}
                            className={`flex-1 py-1 px-2 rounded transition border ${state.speed === speed ? 'bg-accent-primary text-white border-accent-primary' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                        >
                            {speed}x
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-2 border-b border-border-main pb-4">
                <label className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded transition">
                    <input
                        type="checkbox"
                        checked={state.agingEnabled}
                        onChange={(e) => toggleAging(e.target.checked)}
                        disabled={isRunning}
                        className="w-4 h-4 accent-accent-primary"
                        title="Enable Priority Aging"
                    />
                    <span>Priority Aging</span>
                </label>
            </div>

            <div className="flex flex-col gap-2 border-b border-border-main pb-4">
                <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Presets</h3>
                <select
                    onChange={(e) => {
                        const preset = PRESETS.find(p => p.name === e.target.value);
                        if (preset) loadPreset(preset);
                    }}
                    disabled={isRunning}
                    className="w-full bg-bg-secondary border border-border-main rounded-md p-2 text-text-primary focus:border-accent-primary focus:outline-none"
                    defaultValue=""
                    title="Load Preset Scenario"
                >
                    <option value="" disabled>Load preset...</option>
                    {PRESETS.map(preset => (
                        <option key={preset.name} value={preset.name}>
                            {preset.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                    onClick={isRunning ? pause : start}
                    disabled={!canStart && !isRunning}
                    className={`col-span-2 py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 border ${isRunning ? 'bg-accent-warning/20 border-accent-warning text-accent-warning hover:bg-accent-warning/30' : 'bg-accent-success/20 border-accent-success text-accent-success hover:bg-accent-success/30 disabled:opacity-50 disabled:cursor-not-allowed'}`}
                >
                    {isRunning ? '⏸ Pause' : '▶ Play'}
                </button>

                <button
                    onClick={step}
                    disabled={isRunning || !canStart}
                    className="py-2 rounded-lg font-bold transition flex items-center justify-center gap-1 border bg-white/5 border-border-main hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    ⏭ Step
                </button>

                <button
                    onClick={reset}
                    className="py-2 rounded-lg font-bold transition flex items-center justify-center gap-1 border bg-white/5 border-border-main hover:bg-white/10 hover:text-accent-error"
                >
                    ↺ Reset
                </button>
            </div>

            <div className="mt-4 flex flex-col items-center justify-center p-4 bg-bg-secondary/50 rounded-lg border border-border-main">
                <span className="text-xs text-text-secondary uppercase tracking-widest mb-1">Clock</span>
                <span className="text-4xl font-mono font-bold text-accent-info">{state.clock}</span>
            </div>
        </div>
    );
}
