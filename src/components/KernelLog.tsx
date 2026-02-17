import { useRef, useEffect } from 'react';
import { useScheduler } from '../context/SchedulerContext';

export function KernelLog() {
    const { state } = useScheduler();
    const logRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [state.kernelLog.length]);

    const getEventIcon = (type: string): string => {
        switch (type) {
            case 'PROCESS_ARRIVED': return '📥';
            case 'PROCESS_STARTED': return '▶️';
            case 'PROCESS_PREEMPTED': return '⏸️';
            case 'PROCESS_COMPLETED': return '✅';
            case 'PROCESS_IO_START': return '💾';
            case 'PROCESS_IO_COMPLETE': return '📤';
            case 'CONTEXT_SWITCH': return '🔄';
            case 'PRIORITY_AGED': return '⬆️';
            case 'QUEUE_LEVEL_DEMOTED': return '⬇️';
            case 'LOAD_BALANCED': return '⚖️';
            default: return '📋';
        }
    };

    const getEventClass = (type: string): string => {
        switch (type) {
            case 'PROCESS_PREEMPTED': return 'border-l-2 border-accent-warning bg-accent-warning/5';
            case 'PROCESS_COMPLETED': return 'border-l-2 border-accent-success bg-accent-success/5';
            case 'PROCESS_IO_START':
            case 'PROCESS_IO_COMPLETE': return 'border-l-2 border-accent-info bg-accent-info/5';
            case 'PRIORITY_AGED': return 'border-l-2 border-accent-secondary bg-accent-secondary/5';
            default: return 'border-l-2 border-transparent hover:bg-white/5';
        }
    };

    return (
        <div className="glass-panel flex flex-col h-full overflow-hidden">
            <h3 className="flex items-center justify-between p-4 border-b border-border-main font-bold text-lg">
                <span>Kernel Log</span>
                <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs font-mono">{state.kernelLog.length}</span>
            </h3>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 scrollbar-thin" ref={logRef}>
                {state.kernelLog.length === 0 ? (
                    <div className="text-text-muted text-center italic text-sm mt-10">
                        No events yet. Start the simulation to see scheduler decisions.
                    </div>
                ) : (
                    state.kernelLog.map((event, idx) => (
                        <div key={idx} className={`text-sm flex gap-2 items-start p-2 rounded transition-colors ${getEventClass(event.type)}`}>
                            <span className="font-mono text-text-muted text-xs min-w-[30px]">[{event.timestamp}]</span>
                            <span className="text-lg leading-none">{getEventIcon(event.type)}</span>
                            <span className="text-text-primary flex-1">{event.message}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
