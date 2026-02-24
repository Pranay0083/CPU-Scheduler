import { useState } from 'react';
import { useScheduler } from '../context/SchedulerContext';
import { parseBurstPattern } from '../types';
import type { Algorithm, CoreCount, SimulationSpeed } from '../types';



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
        algorithm: 'FCFS',
        coreCount: 1,
        timeQuantum: undefined,
        processes: [
            { name: '1', arrivalTime: 0, priority: 1, burstPattern: 'CPU(5)' },
            { name: '2', arrivalTime: 1, priority: 1, burstPattern: 'CPU(3)' },
            { name: '3', arrivalTime: 2, priority: 1, burstPattern: 'CPU(4)' },
        ],
    },
    {
        name: 'Multi-Core FCFS',
        algorithm: 'FCFS',
        coreCount: 2,
        timeQuantum: undefined,
        processes: [
            { name: '1', arrivalTime: 0, priority: 1, burstPattern: 'CPU(6)' },
            { name: '2', arrivalTime: 1, priority: 1, burstPattern: 'CPU(4)' },
            { name: '3', arrivalTime: 2, priority: 1, burstPattern: 'CPU(5)' },
        ],
    },
    {
        name: 'Multi-Core SJF',
        algorithm: 'SJF',
        coreCount: 2,
        timeQuantum: undefined,
        processes: [
            { name: '1', arrivalTime: 0, priority: 1, burstPattern: 'CPU(7)' },
            { name: '2', arrivalTime: 1, priority: 1, burstPattern: 'CPU(2)' },
            { name: '3', arrivalTime: 2, priority: 1, burstPattern: 'CPU(4)' },
        ],
    },
    {
        name: 'Multi-Core SRTF',
        algorithm: 'SRTF',
        coreCount: 2,
        timeQuantum: undefined,
        processes: [
            { name: '1', arrivalTime: 0, priority: 1, burstPattern: 'CPU(8)' },
            { name: '2', arrivalTime: 1, priority: 1, burstPattern: 'CPU(4)' },
            { name: '3', arrivalTime: 2, priority: 1, burstPattern: 'CPU(2)' },
            { name: '4', arrivalTime: 3, priority: 1, burstPattern: 'CPU(1)' },
        ],
    },
    {
        name: 'Multi-Core Round Robin',
        algorithm: 'ROUND_ROBIN',
        timeQuantum: 2,
        coreCount: 2,
        processes: [
            { name: '1', arrivalTime: 0, priority: 1, burstPattern: 'CPU(5)' },
            { name: '2', arrivalTime: 1, priority: 1, burstPattern: 'CPU(4)' },
            { name: '3', arrivalTime: 2, priority: 1, burstPattern: 'CPU(3)' },
        ],
    },
    {
        name: 'Multi-Core Priority (Non-Preempt)',
        algorithm: 'PRIORITY_NON_PREEMPTIVE',
        coreCount: 2,
        timeQuantum: undefined,
        processes: [
            { name: '1', arrivalTime: 0, priority: 3, burstPattern: 'CPU(5)' },
            { name: '2', arrivalTime: 1, priority: 1, burstPattern: 'CPU(4)' },
            { name: '3', arrivalTime: 2, priority: 2, burstPattern: 'CPU(6)' },
        ],
    },
    {
        name: 'Multi-Core Priority (Preemptive)',
        algorithm: 'PRIORITY_PREEMPTIVE',
        coreCount: 2,
        timeQuantum: undefined,
        processes: [
            { name: '1', arrivalTime: 0, priority: 3, burstPattern: 'CPU(5)' },
            { name: '2', arrivalTime: 1, priority: 1, burstPattern: 'CPU(4)' },
            { name: '3', arrivalTime: 2, priority: 2, burstPattern: 'CPU(6)' },
            { name: '4', arrivalTime: 3, priority: 1, burstPattern: 'CPU(2)' },
        ],
    },
    {
        name: 'Multi-Core MLFQ',
        algorithm: 'MLFQ',
        timeQuantum: 2,
        coreCount: 2,
        processes: [
            { name: '1', arrivalTime: 0, priority: 1, burstPattern: 'CPU(8)' },
            { name: '2', arrivalTime: 1, priority: 1, burstPattern: 'CPU(4)' },
            { name: '3', arrivalTime: 2, priority: 1, burstPattern: 'CPU(2)' },
        ],
    },
];

export function ControlPanel() {
    const [isQuickLoadExpanded, setIsQuickLoadExpanded] = useState(false);
    const {
        state,
        setAlgorithm,
        setCoreCount,
        setTimeQuantum,
        setSpeed,
        toggleAging,
        clearProcesses,
        addProcess,
        setInteractionMode,
    } = useScheduler();

    const isRunning = state.simulationState === 'RUNNING';

    const loadPreset = (preset: typeof PRESETS[0]) => {
        clearProcesses();
        if (preset.algorithm) setAlgorithm(preset.algorithm as Algorithm);
        if (preset.coreCount) setCoreCount(preset.coreCount as CoreCount);
        if (preset.timeQuantum) setTimeQuantum(preset.timeQuantum);
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
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Mode</h3>
                    <div className="flex items-center gap-2">
                        <span className={`text-xs ${state.interactionMode === 'NORMAL' ? 'text-accent-primary font-bold' : 'text-text-muted'}`}>Normal</span>
                        <button
                            onClick={() => setInteractionMode(state.interactionMode === 'NORMAL' ? 'PREDICT_VERIFY' : 'NORMAL')}
                            disabled={isRunning}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${state.interactionMode === 'PREDICT_VERIFY' ? 'bg-accent-purple' : 'bg-bg-tertiary border border-border-main'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${state.interactionMode === 'PREDICT_VERIFY' ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                        <span className={`text-xs ${state.interactionMode === 'PREDICT_VERIFY' ? 'text-accent-purple font-bold' : 'text-text-muted'}`}>Predict & Verify</span>
                    </div>
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
                <button
                    onClick={() => setIsQuickLoadExpanded(!isQuickLoadExpanded)}
                    className="flex items-center justify-between text-xs font-bold text-text-secondary uppercase tracking-wider hover:text-text-primary transition-colors text-left w-full"
                >
                    Quick Load
                    <span className="text-text-muted">{isQuickLoadExpanded ? '▲' : '▼'}</span>
                </button>
                {isQuickLoadExpanded && (
                    <div className="flex flex-wrap gap-2 mt-1">
                        {PRESETS.map(preset => (
                            <button
                                key={preset.name}
                                onClick={() => loadPreset(preset)}
                                disabled={isRunning}
                                className="px-2 py-1 text-[10px] uppercase font-bold text-text-muted bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                                title={`Load ${preset.name}`}
                            >
                                {preset.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}
