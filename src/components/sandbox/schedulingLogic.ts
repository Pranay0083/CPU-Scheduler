import type { Process, Core, AlgorithmType } from './useSandbox';

interface TickResult {
    newProcesses: Process[];
    newCores: Core[];
}

export function runSchedulerTick(
    time: number,
    algorithm: AlgorithmType,
    currentProcesses: Process[],
    currentCores: Core[],
    timeQuantum: number = 3,
    isAgingEnabled: boolean = true,
    agingInterval: number = 10,
    mlfqQ0Quantum: number = 3,
    mlfqQ1Quantum: number = 5,
    mlfqBoostInterval: number = 20
): TickResult {
    // 1. Clone state
    let processes = currentProcesses.map(p => ({ ...p }));
    let cores = currentCores.map(c => ({ ...c }));

    // 2. Identify newly arrived & Apply Aging
    processes.forEach(p => {
        if (p.arrivalTime === time && p.status !== 'completed' && p.status !== 'running') {
            p.status = 'ready';
        }

        // Apply Priority Aging (Every agingInterval ticks waiting in ready queue, boost priority by 1)
        if (algorithm === 'Priority' && isAgingEnabled && p.status === 'ready' && p.arrivalTime <= time) {
            const waitedTicks = time - p.arrivalTime;
            // Boost priority (lower number is higher priority) every X ticks
            if (waitedTicks > 0 && waitedTicks % agingInterval === 0 && p.priority > 1) {
                p.priority -= 1;
            }
        }
    });

    // Apply MLFQ Priority Boost (Starvation Prevention)
    if (algorithm === 'MLFQ' && time > 0 && time % mlfqBoostInterval === 0) {
        processes.forEach(p => {
            if (p.status !== 'completed') {
                p.lane = 0;
            }
        });
    }

    // 3. Process the currently running tasks (tick them down)
    cores.forEach(core => {
        if (core.currentProcessId) {
            const pIndex = processes.findIndex(p => p.id === core.currentProcessId);
            if (pIndex !== -1) {
                const p = processes[pIndex];
                p.remainingTime -= 1;

                // Track time quantum for RR and MLFQ
                if (algorithm === 'RR' || algorithm === 'MLFQ') {
                    p.timeQuantumUsed = (p.timeQuantumUsed || 0) + 1;
                }

                if (p.remainingTime <= 0) {
                    // It finished!
                    p.status = 'completed';
                    p.completionTime = time + 1;
                    p.turnaroundTime = p.completionTime - p.arrivalTime;
                    p.waitTime = p.turnaroundTime - p.burstTime;

                    // Free the core
                    core.currentProcessId = null;
                } else if (algorithm === 'RR' && p.timeQuantumUsed && p.timeQuantumUsed >= timeQuantum) {
                    // Round Robin timeslice
                    p.status = 'ready';
                    core.currentProcessId = null;
                } else if (algorithm === 'MLFQ' && p.timeQuantumUsed) {
                    // MLFQ logic: Demote after slice
                    const slice = p.lane === 0 ? mlfqQ0Quantum : (p.lane === 1 ? mlfqQ1Quantum : Infinity);
                    if (p.timeQuantumUsed >= slice) {
                        p.status = 'ready';
                        p.timeQuantumUsed = 0; // reset
                        p.lane = Math.min((p.lane || 0) + 1, 2); // demote
                        core.currentProcessId = null;
                    }
                }
            } else {
                core.currentProcessId = null;
            }
        }
    });

    // 4. Preemption Check (for SRTF, Priority, MLFQ)
    // If preemptive, we might kick processes out even if they didn't finish or hit quantum
    if (algorithm === 'SRTF' || algorithm === 'Priority') {
        const availableReady = processes.filter(p => p.status === 'ready' && p.arrivalTime <= time);
        cores.forEach(core => {
            if (core.currentProcessId) {
                const runningP = processes.find(p => p.id === core.currentProcessId);
                if (runningP) {
                    let shouldPreempt = false;
                    if (algorithm === 'SRTF') {
                        const betterShrt = availableReady.find(p => p.remainingTime < runningP.remainingTime);
                        if (betterShrt) shouldPreempt = true;
                    } else if (algorithm === 'Priority') {
                        const betterPrio = availableReady.find(p => p.priority < runningP.priority);
                        if (betterPrio) shouldPreempt = true;
                    }

                    if (shouldPreempt) {
                        runningP.status = 'ready';
                        core.currentProcessId = null;
                        // Time quantum logic resets on preempt
                        runningP.timeQuantumUsed = 0;
                    }
                }
            }
        });
    }

    // MLFQ absolute priority preemption (High lane preempts lower lanes)
    if (algorithm === 'MLFQ') {
        cores.forEach(core => {
            if (core.currentProcessId) {
                const runningP = processes.find(p => p.id === core.currentProcessId);
                if (runningP) {
                    const higherLaneReady = processes.find(p => p.status === 'ready' && p.arrivalTime <= time && (p.lane || 0) < (runningP.lane || 0));
                    if (higherLaneReady) {
                        runningP.status = 'ready';
                        core.currentProcessId = null;
                    }
                }
            }
        });
    }

    // 5. Fill empty cores (Scheduling)
    cores.forEach(core => {
        if (!core.currentProcessId) {
            let nextProc: Process | undefined;
            const readyQueue = processes.filter(p => p.status === 'ready' && p.arrivalTime <= time);

            if (readyQueue.length > 0) {
                switch (algorithm) {
                    case 'FCFS':
                    case 'RR':
                        // Oldest arrival
                        nextProc = readyQueue.sort((a, b) => a.arrivalTime - b.arrivalTime)[0];
                        break;
                    case 'SJF':
                    case 'SRTF':
                        // Shortest burst/remaining
                        nextProc = readyQueue.sort((a, b) => a.remainingTime - b.remainingTime || a.arrivalTime - b.arrivalTime)[0];
                        break;
                    case 'Priority':
                        // Lowest priority number is highest priority
                        nextProc = readyQueue.sort((a, b) => a.priority - b.priority || a.arrivalTime - b.arrivalTime)[0];
                        break;
                    case 'MLFQ':
                        // Check queues from 0 to 2
                        for (let lane = 0; lane <= 2; lane++) {
                            const laneQueue = readyQueue.filter(p => (p.lane || 0) === lane);
                            if (laneQueue.length > 0) {
                                // Within lane, RR or FCFS
                                nextProc = laneQueue.sort((a, b) => a.arrivalTime - b.arrivalTime)[0];
                                break;
                            }
                        }
                        break;
                }
            }

            if (nextProc) {
                nextProc.status = 'running';
                if (nextProc.startTime === undefined) {
                    nextProc.startTime = time;
                }
                nextProc.timeQuantumUsed = 0;
                core.currentProcessId = nextProc.id;
            }
        }
    });

    return {
        newProcesses: processes,
        newCores: cores
    };
}
