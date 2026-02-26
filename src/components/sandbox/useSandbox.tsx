import { useState, useCallback, useRef, useEffect } from 'react';
import { runSchedulerTick } from './schedulingLogic';

// --- TYPES ---
export type AlgorithmType = 'FCFS' | 'SJF' | 'SRTF' | 'RR' | 'Priority' | 'MLFQ';

export interface Process {
    id: string; // e.g. "P1"
    index: number; // for coloring/display
    priority: number; // 1-5
    burstTime: number; // Total ms required
    remainingTime: number; // Ms left
    arrivalTime: number; // Tick it was created
    startTime?: number; // First tick it ran
    completionTime?: number; // Tick it finished
    turnaroundTime?: number; // completionTime - arrivalTime
    waitTime?: number; // turnaroundTime - burstTime

    // UI states
    status: 'ready' | 'running' | 'completed';
    lane?: number; // For MLFQ (0=High, 1=Med, 2=Low)
    timeQuantumUsed?: number; // For RR and MLFQ
}

export interface Core {
    id: string;
    currentProcessId: string | null;
}

export interface HistorySegment {
    id: string; // Unique ID
    coreId: string;
    processId: string | null;
    processIndex?: number;
    startTime: number;
    duration: number; // Ticks it has been running
}

// --- CONSTANTS ---
const BASE_TICK_RATE = 1000; // 1 second per tick at 1x speed

export function useSandbox() {
    // -- CORE STATE --
    const [algorithm, setAlgorithm] = useState<AlgorithmType>('FCFS');
    const [isPlaying, setIsPlaying] = useState(false);
    const [speedMultiplier, setSpeedMultiplier] = useState(1); // 0.5x to 5x
    const [time, setTime] = useState(0);
    const [timeQuantum, setTimeQuantum] = useState(3);
    const [isAgingEnabled, setIsAgingEnabled] = useState(true);
    const [agingInterval, setAgingInterval] = useState(10);
    const [mlfqQ0Quantum, setMlfqQ0Quantum] = useState(3);
    const [mlfqQ1Quantum, setMlfqQ1Quantum] = useState(5);
    const [mlfqBoostInterval, setMlfqBoostInterval] = useState(20);

    // -- DRAFTING STATE (for ghost preview) --
    const [draftBurst, setDraftBurst] = useState(5);
    const [draftPriority, setDraftPriority] = useState(3);
    const [draftArrival, setDraftArrival] = useState(0);

    // -- ENTITIES --
    const [cores, setCores] = useState<Core[]>([{ id: 'core-1', currentProcessId: null }]);
    const [processes, setProcesses] = useState<Process[]>([]);
    const [segments, setSegments] = useState<HistorySegment[]>([]);

    // -- REFS FOR TICK LOOP --
    const lastTickRef = useRef<number>(0);
    const frameRef = useRef<number | null>(null);

    // -- STATE REFS FOR TICK SCOPE --
    // We use refs to avoid closing over stale state in the fast requestAnimationFrame loop
    const stateRef = useRef({ time, algorithm, processes, cores, segments, timeQuantum, isAgingEnabled, agingInterval, mlfqQ0Quantum, mlfqQ1Quantum, mlfqBoostInterval });
    useEffect(() => {
        stateRef.current = { time, algorithm, processes, cores, segments, timeQuantum, isAgingEnabled, agingInterval, mlfqQ0Quantum, mlfqQ1Quantum, mlfqBoostInterval };
    }, [time, algorithm, processes, cores, segments, timeQuantum, isAgingEnabled, agingInterval, mlfqQ0Quantum, mlfqQ1Quantum, mlfqBoostInterval]);

    // -- METRICS --
    const completedProcesses = processes.filter(p => p.status === 'completed');
    const avgWaitTime = completedProcesses.length > 0
        ? completedProcesses.reduce((acc, p) => acc + (p.waitTime || 0), 0) / completedProcesses.length
        : 0;

    // -- ACTIONS --
    const addProcess = useCallback(() => {
        setProcesses(prev => [
            ...prev,
            {
                id: `P${prev.length + 1}`,
                index: prev.length,
                priority: draftPriority,
                burstTime: draftBurst,
                remainingTime: draftBurst,
                arrivalTime: Math.max(time, draftArrival),
                status: 'ready',
                lane: 0, // MLFQ high lane
                timeQuantumUsed: 0
            }
        ]);
        // Randomize next draft for fun
        setDraftBurst(Math.floor(Math.random() * 8) + 2);
        setDraftPriority(Math.floor(Math.random() * 5) + 1);
        setDraftArrival(time + Math.floor(Math.random() * 4)); // absolute time + 0-3 ticks default
    }, [time, draftBurst, draftPriority, draftArrival]);

    const addCore = useCallback(() => {
        setCores(prev => [...prev, { id: `core-${prev.length + 1}`, currentProcessId: null }]);
    }, []);

    const reset = useCallback(() => {
        setIsPlaying(false);
        setTime(0);
        setProcesses([]);
        setCores([{ id: 'core-1', currentProcessId: null }]);
        setSegments([]);
    }, []);

    const setCoresCount = useCallback((count: number) => {
        setCores(prev => {
            const newCores = [];
            for (let i = 0; i < count; i++) {
                if (i < prev.length) {
                    newCores.push(prev[i]);
                } else {
                    newCores.push({ id: `core-${i + 1}`, currentProcessId: null });
                }
            }
            return newCores;
        });
    }, []);

    const loadPreset = useCallback((preset: 'convoy' | 'starvation') => {
        setIsPlaying(false);
        setTime(0);
        setSegments([]);
        setCores([{ id: 'core-1', currentProcessId: null }]);

        if (preset === 'convoy') {
            setAlgorithm('FCFS');
            setProcesses([
                { id: 'P1', index: 0, priority: 3, burstTime: 18, remainingTime: 18, arrivalTime: 0, status: 'ready', timeQuantumUsed: 0 },
                { id: 'P2', index: 1, priority: 3, burstTime: 2, remainingTime: 2, arrivalTime: 1, status: 'ready', timeQuantumUsed: 0 },
                { id: 'P3', index: 2, priority: 3, burstTime: 2, remainingTime: 2, arrivalTime: 2, status: 'ready', timeQuantumUsed: 0 },
                { id: 'P4', index: 3, priority: 3, burstTime: 2, remainingTime: 2, arrivalTime: 3, status: 'ready', timeQuantumUsed: 0 },
            ]);
        } else if (preset === 'starvation') {
            setAlgorithm('Priority');
            setProcesses([
                { id: 'P1', index: 0, priority: 5, burstTime: 10, remainingTime: 10, arrivalTime: 0, status: 'ready', timeQuantumUsed: 0 }, // Low priority
                { id: 'P2', index: 1, priority: 1, burstTime: 5, remainingTime: 5, arrivalTime: 2, status: 'ready', timeQuantumUsed: 0 }, // High priority
                { id: 'P3', index: 2, priority: 1, burstTime: 5, remainingTime: 5, arrivalTime: 4, status: 'ready', timeQuantumUsed: 0 },
                { id: 'P4', index: 3, priority: 1, burstTime: 5, remainingTime: 5, arrivalTime: 6, status: 'ready', timeQuantumUsed: 0 },
            ]);
        }
    }, [setAlgorithm, setIsPlaying, setTime, setSegments, setCores, setProcesses]);

    const stepForward = useCallback(() => {
        // Expose a manual tick function
        processTick();
    }, []); // Hook dependencies will be handled inside processTick using mutable refs if needed, or by ensuring state flows correctly

    // -- THE SCHEDULER LOGIC --
    const processTick = useCallback(() => {
        const current = stateRef.current;

        const { newProcesses, newCores } = runSchedulerTick(
            current.time,
            current.algorithm,
            current.processes,
            current.cores,
            current.timeQuantum,
            current.isAgingEnabled,
            current.agingInterval,
            current.mlfqQ0Quantum,
            current.mlfqQ1Quantum,
            current.mlfqBoostInterval
        );

        // Track continuous segments
        const newSegments = [...current.segments];
        newCores.forEach(core => {
            if (core.currentProcessId) {
                const proc = newProcesses.find(p => p.id === core.currentProcessId)!;
                const coreSegments = newSegments.filter(s => s.coreId === core.id);
                const lastSegment = coreSegments[coreSegments.length - 1];

                if (lastSegment && lastSegment.processId === proc.id) {
                    // Extend duration
                    lastSegment.duration += 1;
                } else {
                    // Start new segment
                    newSegments.push({
                        id: `seg-${core.id}-${current.time}`,
                        coreId: core.id,
                        processId: proc.id,
                        processIndex: proc.index,
                        startTime: current.time,
                        duration: 1
                    });
                }
            } else {
                // Idle time tracking
                const coreSegments = newSegments.filter(s => s.coreId === core.id);
                const lastSegment = coreSegments[coreSegments.length - 1];
                if (lastSegment && lastSegment.processId === null) {
                    lastSegment.duration += 1;
                } else {
                    newSegments.push({
                        id: `seg-idle-${core.id}-${current.time}`,
                        coreId: core.id,
                        processId: null,
                        startTime: current.time,
                        duration: 1
                    });
                }
            }
        });

        setProcesses(newProcesses);
        setCores(newCores);
        setSegments(newSegments);
        setTime(t => t + 1);
        // Also auto-advance the draftArrival if it falls behind clock time
        setDraftArrival(da => Math.max(da, current.time + 1));
    }, []);

    // -- THE RUN LOOP --
    useEffect(() => {
        if (!isPlaying) return;

        const loop = (timestamp: number) => {
            const currentInterval = BASE_TICK_RATE / speedMultiplier;
            if (timestamp - lastTickRef.current >= currentInterval) {
                processTick();
                lastTickRef.current = timestamp;
            }
            frameRef.current = requestAnimationFrame(loop);
        };

        frameRef.current = requestAnimationFrame((timestamp) => {
            lastTickRef.current = timestamp;
            loop(timestamp);
        });

        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [isPlaying, speedMultiplier, processTick]);

    return {
        // State
        algorithm,
        isPlaying,
        speedMultiplier,
        time,
        timeQuantum,
        isAgingEnabled,
        agingInterval,
        mlfqQ0Quantum,
        mlfqQ1Quantum,
        mlfqBoostInterval,
        cores,
        processes,
        segments,
        avgWaitTime,

        // Mutators
        setAlgorithm,
        setIsPlaying,
        setSpeedMultiplier,
        setTimeQuantum,
        setIsAgingEnabled,
        setAgingInterval,
        setMlfqQ0Quantum,
        setMlfqQ1Quantum,
        setMlfqBoostInterval,
        setDraftBurst,
        setDraftPriority,
        setDraftArrival,

        // Actions
        addProcess,
        addCore,
        setCoresCount,
        loadPreset,
        reset,
        stepForward,

        // Draft State
        draftBurst,
        draftPriority,
        draftArrival
    };
}
