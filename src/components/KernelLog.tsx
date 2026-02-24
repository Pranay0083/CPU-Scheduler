import { useRef, useEffect, useState, useMemo } from 'react';
import { useScheduler } from '../context/SchedulerContext';

export function KernelLog() {
    const { state } = useScheduler();
    const logRef = useRef<HTMLDivElement>(null);
    const [filter, setFilter] = useState<'ALL' | 'SCHEDULING' | 'IO'>('ALL');
    const [autoScroll, setAutoScroll] = useState(true);

    // Auto-scroll to bottom
    useEffect(() => {
        if (autoScroll && logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [state.kernelLog.length, autoScroll]);

    const getEventActionTag = (type: string): { label: string, colorClass: string } => {
        switch (type) {
            case 'PROCESS_ARRIVED': return { label: 'ARRIVED', colorClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
            case 'PROCESS_STARTED': return { label: 'STARTED', colorClass: 'bg-green-500/20 text-green-300 border-green-500/30' };
            case 'PROCESS_PREEMPTED': return { label: 'PREEMPT', colorClass: 'bg-orange-500/20 text-orange-300 border-orange-500/30' };
            case 'PROCESS_COMPLETED': return { label: 'DONE', colorClass: 'bg-gray-500/20 text-gray-300 border-gray-500/30' };
            case 'PROCESS_IO_START': return { label: 'I/O WAIT', colorClass: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
            case 'PROCESS_IO_COMPLETE': return { label: 'I/O DONE', colorClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
            case 'CONTEXT_SWITCH': return { label: 'SWITCH', colorClass: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' };
            case 'PRIORITY_AGED': return { label: 'AGED', colorClass: 'bg-pink-500/20 text-pink-300 border-pink-500/30' };
            case 'QUEUE_LEVEL_DEMOTED': return { label: 'DEMOTED', colorClass: 'bg-red-500/20 text-red-300 border-red-500/30' };
            case 'LOAD_BALANCED': return { label: 'BALANCE', colorClass: 'bg-teal-500/20 text-teal-300 border-teal-500/30' };
            default: return { label: 'SYS', colorClass: 'bg-white/10 text-white/50 border-white/20' };
        }
    };

    const filteredLogs = useMemo(() => {
        let logs = state.kernelLog;
        if (filter === 'IO') logs = logs.filter(e => e.type.includes('IO'));
        if (filter === 'SCHEDULING') logs = logs.filter(e => !e.type.includes('IO'));

        // Smart Grouping for sequential identical types (like idle or repeated preemptions if they are noisy)
        // For standard logs, we'll group if message and type are identical and timestamps are sequential or identical
        const groupedLogs: (typeof logs[0] & { count?: number, endTimestamp?: number })[] = [];

        for (const log of logs) {
            const lastLog = groupedLogs[groupedLogs.length - 1];
            if (lastLog && lastLog.message === log.message && lastLog.type === log.type) {
                lastLog.count = (lastLog.count || 1) + 1;
                lastLog.endTimestamp = log.timestamp;
            } else {
                groupedLogs.push({ ...log, count: 1, endTimestamp: log.timestamp });
            }
        }
        return groupedLogs;
    }, [state.kernelLog, filter]);

    return (
        <div className="glass-panel flex flex-col h-full overflow-hidden relative">
            <div className="flex flex-col gap-2 p-3 border-b border-border-main bg-bg-secondary/50">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-text-secondary uppercase tracking-wider flex items-center gap-2">
                        Kernel Log
                        <span className="px-1.5 py-0.5 bg-white/10 rounded-full text-[10px] font-mono">{filteredLogs.length}</span>
                    </h3>

                    <label className="flex items-center gap-1.5 cursor-pointer text-xs text-text-muted hover:text-text-primary transition-colors">
                        <input
                            type="checkbox"
                            checked={autoScroll}
                            onChange={(e) => setAutoScroll(e.target.checked)}
                            className="w-3 h-3 accent-accent-primary"
                        />
                        Auto-scroll
                    </label>
                </div>

                <div className="flex gap-1">
                    {['ALL', 'SCHEDULING', 'IO'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-2 py-1 text-[10px] uppercase font-bold rounded transition-colors ${filter === f ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/50' : 'bg-white/5 text-text-muted hover:bg-white/10 border border-transparent'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 scrollbar-thin" ref={logRef}>
                {filteredLogs.length === 0 ? (
                    <div className="text-text-muted text-center italic text-xs mt-10">
                        No events for this filter.
                    </div>
                ) : (
                    filteredLogs.map((event, idx) => {
                        const actionTag = getEventActionTag(event.type);
                        const process = event.processId ? state.processes.find(p => p.id === event.processId) : null;

                        return (
                            <div key={idx} className="text-xs flex flex-wrap gap-2 items-center p-2 rounded bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                {/* Timestamp */}
                                <span className="font-mono text-text-muted font-bold text-[10px] min-w-[35px]">
                                    {event.count && event.count > 1 ? `[${event.timestamp}-${event.endTimestamp}]` : `[${event.timestamp}]`}
                                </span>

                                {/* Process ID Pill */}
                                {process && (
                                    <span
                                        className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono border"
                                        style={{
                                            backgroundColor: `${process.color}20`,
                                            color: process.color,
                                            borderColor: `${process.color}50`
                                        }}
                                    >
                                        PID:{process.name}
                                    </span>
                                )}

                                {/* Action Tag Pill */}
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider border ${actionTag.colorClass}`}>
                                    {actionTag.label}
                                </span>

                                {/* Message Context */}
                                <span className="text-text-primary flex-1 opacity-90">
                                    {event.message.replace(/^P\d+\s/, '').replace(/^\d+\s/, '')}
                                </span>

                                {/* Repetition Badge */}
                                {event.count && event.count > 1 && (
                                    <span className="text-[10px] font-mono text-text-muted bg-black/30 px-1.5 py-0.5 rounded ml-auto">
                                        x{event.count}
                                    </span>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
