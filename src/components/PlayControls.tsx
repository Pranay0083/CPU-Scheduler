import { useScheduler } from '../context/SchedulerContext';
import { Play, Pause, StepForward, RotateCcw } from 'lucide-react';

export function PlayControls() {
    const { state, start, pause, step, reset } = useScheduler();

    const isRunning = state.simulationState === 'RUNNING';
    const canStart = state.processes.length > 0;

    return (
        <div className="glass-panel flex gap-2 p-4">
            <button
                onClick={isRunning ? pause : start}
                disabled={!canStart && !isRunning}
                className={`flex-[1.5] py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 border ${isRunning
                        ? 'bg-accent-warning/20 border-accent-warning text-accent-warning hover:bg-accent-warning/30 hover:shadow-[0_0_15px_rgba(255,170,0,0.2)] hover:-translate-y-0.5'
                        : 'bg-accent-success/20 border-accent-success text-accent-success hover:bg-accent-success/30 hover:shadow-[0_0_15px_rgba(0,255,136,0.2)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none'
                    }`}
            >
                {isRunning ? (
                    <><Pause className="w-4 h-4" /> Pause</>
                ) : (
                    <><Play className="w-4 h-4 fill-current" /> Play</>
                )}
            </button>

            <button
                onClick={step}
                disabled={isRunning || !canStart}
                className="flex-[1.2] py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 border bg-white/5 border-border-main hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:-translate-y-0.5 text-text-primary"
            >
                <StepForward className="w-4 h-4" /> Step
            </button>

            <button
                onClick={reset}
                className="flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 border bg-white/5 border-border-main hover:bg-white/10 hover:text-accent-error hover:border-accent-error/50 hover:shadow-[0_0_15px_rgba(255,51,102,0.15)] hover:-translate-y-0.5 text-text-primary"
            >
                <RotateCcw className="w-4 h-4" /> Reset
            </button>
        </div>
    );
}
