import { useScheduler } from '../context/SchedulerContext';

export function PlayControls() {
    const { state, start, pause, step, reset } = useScheduler();

    const isRunning = state.simulationState === 'RUNNING';
    const canStart = state.processes.length > 0;

    return (
        <div className="glass-panel flex gap-2 p-4">
            <button
                onClick={isRunning ? pause : start}
                disabled={!canStart && !isRunning}
                className={`flex-[1.5] py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 border ${isRunning ? 'bg-accent-warning/20 border-accent-warning text-accent-warning hover:bg-accent-warning/30' : 'bg-accent-success/20 border-accent-success text-accent-success hover:bg-accent-success/30 disabled:opacity-50 disabled:cursor-not-allowed'}`}
            >
                {isRunning ? '⏸ Pause' : '▶ Play'}
            </button>

            <button
                onClick={step}
                disabled={isRunning || !canStart}
                className="flex-1 py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-1 border bg-white/5 border-border-main hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-text-primary"
            >
                ⏭ Step
            </button>

            <button
                onClick={reset}
                className="flex-1 py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-1 border bg-white/5 border-border-main hover:bg-white/10 hover:text-accent-error text-text-primary"
            >
                ↺ Reset
            </button>
        </div>
    );
}
