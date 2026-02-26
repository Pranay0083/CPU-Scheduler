import type { Process } from './useSandbox';

interface DraftingStudioProps {
    addProcess: () => void;
    processes: Process[];
    draftBurst: number;
    setDraftBurst: (val: number) => void;
    draftPriority: number;
    setDraftPriority: (val: number) => void;
    draftArrival: number;
    setDraftArrival: (val: number) => void;
    coresCount: number;
    setCoresCount: (count: number) => void;
    loadPreset: (preset: 'convoy' | 'starvation') => void;
    currentTime: number;
    algorithm: string;
    timeQuantum: number;
    setTimeQuantum: (tq: number) => void;
    isAgingEnabled: boolean;
    setIsAgingEnabled: (enabled: boolean) => void;
    agingInterval: number;
    setAgingInterval: (interval: number) => void;
    mlfqQ0Quantum: number;
    setMlfqQ0Quantum: (q: number) => void;
    mlfqQ1Quantum: number;
    setMlfqQ1Quantum: (q: number) => void;
    mlfqBoostInterval: number;
    setMlfqBoostInterval: (interval: number) => void;
}

const COLORS = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // green
    '#f59e0b', // yellow
    '#8b5cf6', // purple
    '#ec4899', // pink
];

export function DraftingStudio({
    addProcess,
    processes,
    draftBurst,
    setDraftBurst,
    draftPriority,
    setDraftPriority,
    draftArrival,
    setDraftArrival,
    coresCount,
    setCoresCount,
    loadPreset,
    currentTime,
    algorithm,
    timeQuantum,
    setTimeQuantum,
    isAgingEnabled,
    setIsAgingEnabled,
    agingInterval,
    setAgingInterval,
    mlfqQ0Quantum,
    setMlfqQ0Quantum,
    mlfqQ1Quantum,
    setMlfqQ1Quantum,
    mlfqBoostInterval,
    setMlfqBoostInterval
}: DraftingStudioProps) {
    const nextColor = COLORS[processes.length % COLORS.length];

    return (
        <div className="w-full h-full flex flex-col gap-8">
            {/* Top: Mode & Core Selector */}
            <div className="flex flex-col gap-4">
                <h3 className="font-architect text-xl text-[var(--cpu-stroke)]">System Config</h3>
                {/* <div className="flex gap-2 p-1 bg-[var(--grid-color)]/20 rounded-md">
                    <button className="flex-1 py-1 text-sm font-bold bg-[var(--bg-color)] shadow-sm rounded">Sandbox</button>
                    <button className="flex-1 py-1 text-sm font-bold opacity-50 hover:opacity-100 transition-opacity">Guided</button>
                </div> */}

                <div className="flex flex-col gap-2 mt-2 text-[var(--cpu-stroke)]">
                    <span className="text-sm font-bold opacity-80">Hardware Nodes (Cores)</span>
                    <div className="flex gap-2">
                        {[1, 2, 4].map(num => (
                            <button
                                key={num}
                                onClick={() => setCoresCount(num)}
                                className={`flex-1 py-2 hand-drawn-border text-sm font-mono transition-all ${coresCount === num ? 'bg-[var(--cpu-stroke)] text-[var(--bg-color)]' : 'hover:bg-[var(--grid-color)]/20'}`}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dynamic Algorithm Configs */}
                {algorithm === 'RR' && (
                    <div className="flex flex-col gap-2 text-[var(--cpu-stroke)]">
                        <span className="text-sm font-bold opacity-80 flex justify-between">
                            Time Quantum <span className="font-mono">{timeQuantum} ticks</span>
                        </span>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={timeQuantum}
                            onChange={(e) => setTimeQuantum(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full slider-thumb-heavy h-2 bg-[var(--grid-color)] rounded-lg appearance-none cursor-pointer"
                            style={{ accentColor: 'var(--cpu-stroke)' }}
                        />
                    </div>
                )}

                {algorithm === 'Priority' && (
                    <div className="flex flex-col gap-4 mt-2">
                        <div className="flex items-center justify-between text-[var(--cpu-stroke)]">
                            <span className="text-sm font-bold opacity-80">Priority Aging</span>
                            <button
                                onClick={() => setIsAgingEnabled(!isAgingEnabled)}
                                className={`w-12 h-6 rounded-full relative transition-colors ${isAgingEnabled ? 'bg-[var(--cpu-stroke)]' : 'bg-[var(--grid-color)]'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-[var(--bg-color)] absolute top-1 transition-all ${isAgingEnabled ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>

                        {isAgingEnabled && (
                            <div className="flex flex-col gap-2 text-[var(--cpu-stroke)]">
                                <span className="text-sm font-bold opacity-80 flex justify-between">
                                    Age Interval <span className="font-mono">{agingInterval} ticks</span>
                                </span>
                                <input
                                    type="range"
                                    min="5"
                                    max="30"
                                    step="5"
                                    value={agingInterval}
                                    onChange={(e) => setAgingInterval(parseInt(e.target.value) || 10)}
                                    className="w-full slider-thumb-heavy h-2 bg-[var(--grid-color)] rounded-lg appearance-none cursor-pointer"
                                    style={{ accentColor: 'var(--cpu-stroke)' }}
                                />
                            </div>
                        )}
                    </div>
                )}

                {algorithm === 'MLFQ' && (
                    <div className="flex flex-col gap-4 mt-2">
                        <div className="flex flex-col gap-2 text-[var(--cpu-stroke)]">
                            <span className="text-sm font-bold flex justify-between">
                                <span className="opacity-80">Q0 Quantum</span> <span className="font-mono">{mlfqQ0Quantum} ticks</span>
                            </span>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={mlfqQ0Quantum}
                                onChange={(e) => setMlfqQ0Quantum(parseInt(e.target.value) || 3)}
                                className="w-full slider-thumb-heavy h-2 bg-[var(--grid-color)] rounded-lg appearance-none cursor-pointer"
                                style={{ accentColor: 'var(--cpu-stroke)' }}
                            />
                        </div>
                        <div className="flex flex-col gap-2 text-[var(--cpu-stroke)]">
                            <span className="text-sm font-bold flex justify-between">
                                <span className="opacity-80">Q1 Quantum</span> <span className="font-mono">{mlfqQ1Quantum} ticks</span>
                            </span>
                            <input
                                type="range"
                                min="1"
                                max="15"
                                value={mlfqQ1Quantum}
                                onChange={(e) => setMlfqQ1Quantum(parseInt(e.target.value) || 5)}
                                className="w-full slider-thumb-heavy h-2 bg-[var(--grid-color)] rounded-lg appearance-none cursor-pointer"
                                style={{ accentColor: 'var(--cpu-stroke)' }}
                            />
                        </div>
                        <div className="flex flex-col gap-2 text-[var(--cpu-stroke)] mt-2 border-t border-dashed border-[var(--grid-color)] pt-2 relative group">
                            <span className="text-sm font-bold flex justify-between cursor-help">
                                <span className="opacity-80 border-b border-dotted border-[var(--cpu-stroke)]">Boost Interval</span> <span className="font-mono">{mlfqBoostInterval} ticks</span>
                            </span>
                            {/* Simple Tooltip */}
                            <div className="absolute left-0 -top-8 bg-[var(--bg-color)] px-2 py-1 hand-drawn-border border-[var(--grid-color)] text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                                Lifts all processes back to Q0
                            </div>
                            <input
                                type="range"
                                min="10"
                                max="50"
                                step="10"
                                value={mlfqBoostInterval}
                                onChange={(e) => setMlfqBoostInterval(parseInt(e.target.value) || 20)}
                                className="w-full slider-thumb-heavy h-2 bg-[var(--grid-color)] rounded-lg appearance-none cursor-pointer"
                                style={{ accentColor: 'var(--cpu-stroke)' }}
                            />
                        </div>
                    </div>
                )}
            </div>

            <hr className="border-dashed border-[var(--grid-color)]" />

            {/* Middle: Process Drafting Table */}
            <div className="flex flex-col gap-6 flex-1">
                <h3 className="font-architect text-xl text-[var(--cpu-stroke)] flex justify-between items-center">
                    Process Drafting
                    <span className="text-sm opacity-50 font-mono">Next: P{processes.length + 1}</span>
                </h3>

                {/* Burst Slider */}
                <div className="flex flex-col gap-2 relative mt-4">
                    <div className="flex justify-between items-center text-sm font-bold opacity-80 text-[var(--cpu-stroke)]">
                        <span>Burst Time</span>
                        <span className="font-mono">{draftBurst}ms</span>
                    </div>

                    <div
                        className="absolute top-4 w-8 h-4 border-2 hand-drawn-border flex items-center justify-center transition-all duration-75 text-[9px] font-mono font-bold pointer-events-none z-10"
                        style={{
                            left: `calc(${((draftBurst - 1) / 19) * 100}% - 16px)`,
                            backgroundColor: nextColor,
                            color: 'var(--bg-color)',
                            opacity: 0.9
                        }}
                    >
                        P{processes.length + 1}
                    </div>

                    <input
                        type="range"
                        min="1"
                        max="20"
                        value={draftBurst}
                        onChange={(e) => setDraftBurst(parseInt(e.target.value))}
                        className="w-full slider-thumb-heavy h-2 bg-[var(--grid-color)] rounded-lg appearance-none cursor-pointer"
                        style={{ accentColor: nextColor }}
                    />
                </div>

                {/* Priority Slider (Only for Priority Algorithm) */}
                {algorithm === 'Priority' && (
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-sm font-bold opacity-80 text-[var(--cpu-stroke)]">
                            <span>Priority (1=High)</span>
                            <span className="font-mono">{draftPriority}</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="5"
                            value={draftPriority}
                            onChange={(e) => setDraftPriority(parseInt(e.target.value))}
                            className="w-full slider-thumb-heavy h-2 bg-[var(--grid-color)] rounded-lg appearance-none cursor-pointer"
                            style={{ accentColor: nextColor }}
                        />
                    </div>
                )}

                {/* Arrival Tick Slider */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-sm font-bold opacity-80 text-[var(--cpu-stroke)]">
                        <span>Arrival Tick</span>
                        <span className="font-mono">{draftArrival}</span>
                    </div>
                    <input
                        type="range"
                        min={currentTime}
                        max={currentTime + 50}
                        value={draftArrival < currentTime ? currentTime : draftArrival}
                        onChange={(e) => setDraftArrival(parseInt(e.target.value))}
                        className="w-full slider-thumb-heavy h-2 bg-[var(--grid-color)] rounded-lg appearance-none cursor-pointer"
                        style={{ accentColor: nextColor }}
                    />
                </div>

                <button
                    onClick={() => addProcess()}
                    className="mt-4 w-full py-3 hand-drawn-border font-architect text-lg hover:text-[var(--bg-color)] transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden"
                    style={{
                        borderColor: nextColor,
                        color: nextColor
                    }}
                >
                    <div className="absolute inset-0 bg-current opacity-10 group-hover:opacity-100 transition-opacity z-0" style={{ color: nextColor }} />
                    <span className="z-10 relative font-bold text-current group-hover:text-[var(--bg-color)]">+ Draft Process</span>
                </button>
            </div>

            {/* <hr className="border-dashed border-[var(--grid-color)]" /> */}

            {/* Bottom: Quick Load Menu */}
            {/* <div className="flex flex-col gap-4">
                <h3 className="font-architect text-xl text-[var(--cpu-stroke)]">Quick Load</h3>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => loadPreset('convoy')}
                        className="flex flex-col items-center gap-2 p-3 hand-drawn-border border-[var(--grid-color)] hover:border-[var(--cpu-stroke)] group transition-colors"
                        title="Loads 1 massive job and 3 tiny jobs to demonstrate the Convoy Effect in FCFS."
                    >
                        <div className="w-full h-8 flex gap-1 items-end justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                            <div className="w-6 h-8 bg-red-400 hand-drawn-border"></div>
                            <div className="w-2 h-2 bg-blue-400 hand-drawn-border"></div>
                            <div className="w-2 h-2 bg-green-400 hand-drawn-border"></div>
                        </div>
                        <span className="text-xs font-bold text-[var(--cpu-stroke)]">Convoy Case</span>
                    </button>

                    <button
                        onClick={() => loadPreset('starvation')}
                        className="flex flex-col items-center gap-2 p-3 hand-drawn-border border-[var(--grid-color)] hover:border-[var(--cpu-stroke)] group transition-colors"
                        title="Loads a low priority job followed by many high priority ones to demonstrate Starvation."
                    >
                        <div className="w-full h-8 flex gap-1 items-end justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                            <div className="w-4 h-4 bg-gray-400 hand-drawn-border relative top-2"></div>
                            <div className="w-3 h-8 bg-purple-400 hand-drawn-border"></div>
                            <div className="w-3 h-8 border border-dashed border-purple-400"></div>
                        </div>
                        <span className="text-xs font-bold text-[var(--cpu-stroke)]">Starvation Case</span>
                    </button>
                </div>
            </div> */}
        </div>
    );
}
