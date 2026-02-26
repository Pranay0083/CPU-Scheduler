import { useEffect, useRef, useState } from 'react';
import type { HistorySegment, Process } from './useSandbox';

interface KernelLogProps {
    segments: HistorySegment[];
    processes: Process[];
    time: number;
}

interface LogEntry {
    time: number;
    message: string;
}

export function KernelLog({ segments, processes, time }: KernelLogProps) {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const lastProcessedTimeRef = useRef<number>(-1);
    const scrollEndRef = useRef<HTMLDivElement>(null);

    // Generate logs based on new segments or process states
    useEffect(() => {
        if (time <= lastProcessedTimeRef.current) {
            // If time went backwards (e.g. reset), clear logs
            if (time === 0) setLogs([]);
            return;
        }

        const newLogs: LogEntry[] = [];

        // Find processes that just completed or arrived
        processes.forEach(p => {
            if (p.arrivalTime === time && p.status === 'ready') {
                // If it just arrived this exact tick (this might be tricky if arrivalTime < time in state, but wait, arrivalTime === time is exact)
                newLogs.push({ time, message: `${p.id} loaded into Ready Queue.` });
            }
        });

        // Find segments that just started exactly at 'time' or 'time-1'
        segments.forEach(seg => {
            if (seg.startTime === time) {
                if (seg.processId) {
                    newLogs.push({ time, message: `Context Switch: ${seg.processId} onto CPU.` });
                } else {
                    newLogs.push({ time, message: `CPU transitioned to Idle.` });
                }
            }
        });

        // Find completed processes this tick
        processes.forEach(p => {
            if (p.status === 'completed' && p.completionTime === time) {
                newLogs.push({ time, message: `${p.id} Terminated. Wait: ${p.waitTime}ms.` });
            }
        });

        if (newLogs.length > 0) {
            setLogs(prev => [...prev.slice(-40), ...newLogs].sort((a, b) => a.time - b.time)); // keep last 40, sort by time
        }

        lastProcessedTimeRef.current = time;
    }, [time, segments, processes]);

    // Auto-scroll to bottom
    useEffect(() => {
        scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="flex-1 w-full bg-[var(--tag-bg)] hand-drawn-border border-[var(--grid-color)] p-4 flex flex-col gap-2 overflow-hidden backdrop-blur-sm pointer-events-auto">
            <h3 className="font-architect text-lg text-[var(--cpu-stroke)] border-b border-dashed border-[var(--grid-color)] pb-2 flex items-center justify-between">
                Kernel Log
                <span className="animate-pulse w-2 h-2 rounded-full bg-green-500"></span>
            </h3>

            <div className="flex-1 overflow-y-auto font-mono text-xs opacity-70 flex flex-col gap-1 text-[var(--cpu-stroke)]">
                {logs.length === 0 && (
                    <div className="italic opacity-50">Waiting for system events...</div>
                )}
                {logs.map((log, i) => (
                    <div key={`${log.time}-${i}`} className="flex gap-2">
                        <span className="opacity-50">[{log.time.toString().padStart(3, '0')}ms]</span>
                        <span>{log.message}</span>
                    </div>
                ))}
                <div ref={scrollEndRef} />
            </div>
        </div>
    );
}
