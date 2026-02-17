import { useScheduler } from '../context/SchedulerContext';

export function PredictionTable() {
    const { state, setPrediction, setAWTPrediction, submitPredictions, initPredictions } = useScheduler();
    const { predictionState, processes, interactionMode, simulationState } = state;

    // Initialize predictions when processes change
    const shouldInit = processes.length > 0 &&
        predictionState.predictions.length !== processes.length &&
        !predictionState.submitted;

    if (shouldInit && interactionMode === 'PREDICT_VERIFY') {
        initPredictions();
    }

    if (interactionMode !== 'PREDICT_VERIFY') {
        return null;
    }

    if (processes.length === 0) {
        return (
            <div className="glass-panel p-8 text-center border-dashed border-2 border-white/10">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                    <span>📝</span>
                    Predict & Verify
                </h3>
                <p className="text-white/60">Add processes first, then make your predictions!</p>
            </div>
        );
    }

    const handlePredictionChange = (processId: string, value: string) => {
        const numValue = value === '' ? null : parseInt(value, 10);
        setPrediction(processId, numValue);
    };

    const handleAWTChange = (value: string) => {
        const numValue = value === '' ? null : parseFloat(value);
        setAWTPrediction(numValue);
    };

    const handleSubmit = () => {
        submitPredictions();
    };

    const allPredictionsFilled = predictionState.predictions.every(p => p.predictedCT !== null) &&
        predictionState.predictedAWT !== null;

    const isDisabled = predictionState.submitted || simulationState === 'RUNNING';

    return (
        <div className="glass-panel p-6 w-full max-w-4xl mx-auto my-8 animate-fade-in">
            <h3 className="glass-header mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                    <span className="text-2xl">📝</span>
                    Predict & Verify
                </span>
                {predictionState.submitted && (
                    <span className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm font-medium border border-red-500/30 flex items-center gap-1.5 animate-pulse">
                        <span>🔒</span> Locked
                    </span>
                )}
            </h3>

            <p className="text-white/60 mb-6 bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg flex items-start gap-3">
                <span className="text-blue-400 text-xl">ℹ️</span>
                <span>Predict the Completion Time (CT) for each process and the Average Waiting Time (AWT).</span>
            </p>

            <div className="bg-black/20 rounded-xl overflow-hidden border border-white/5 mb-6">
                <div className="grid grid-cols-4 gap-4 p-4 bg-white/5 border-b border-white/10 text-sm font-medium text-white/50 uppercase tracking-wider">
                    <span>Process</span>
                    <span className="text-center">Arrival</span>
                    <span className="text-center">Burst</span>
                    <span className="text-right pr-4">Predicted CT</span>
                </div>

                {predictionState.predictions.map(prediction => {
                    const process = processes.find(p => p.id === prediction.processId);
                    if (!process) return null;

                    const totalBurst = process.bursts.reduce((sum, b) => sum + b.duration, 0);

                    return (
                        <div key={prediction.processId} className="grid grid-cols-4 gap-4 p-4 border-b border-white/5 last:border-b-0 items-center hover:bg-white/[0.02] transition-colors">
                            <span className="flex items-center gap-3">
                                <span
                                    className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]"
                                    style={{ backgroundColor: process.color }}
                                />
                                <span className="font-mono text-white/90">{prediction.processName}</span>
                            </span>
                            <span className="text-center font-mono text-white/70">{process.arrivalTime}</span>
                            <span className="text-center font-mono text-white/70">{totalBurst}</span>
                            <div className="flex justify-end pr-2">
                                <input
                                    type="number"
                                    min="0"
                                    value={prediction.predictedCT ?? ''}
                                    onChange={(e) => handlePredictionChange(prediction.processId, e.target.value)}
                                    disabled={isDisabled}
                                    className={`w-24 bg-black/30 border border-white/10 rounded px-3 py-1.5 text-right font-mono text-white focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed
                                        ${prediction.predictedCT === null ? 'border-yellow-500/50 bg-yellow-500/5 animate-pulse' : ''}`}
                                    placeholder="?"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-col items-end gap-3 mb-6 p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                <label className="flex items-center gap-4 text-indigo-200">
                    <span className="font-medium">Predicted Avg Waiting Time (AWT):</span>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={predictionState.predictedAWT ?? ''}
                        onChange={(e) => handleAWTChange(e.target.value)}
                        disabled={isDisabled}
                        className={`w-32 bg-black/30 border border-indigo-500/30 rounded px-3 py-2 text-right font-mono text-xl font-bold text-indigo-300 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                            ${predictionState.predictedAWT === null ? 'border-yellow-500/50 animate-pulse' : ''}`}
                        placeholder="?"
                    />
                </label>
            </div>

            {!predictionState.submitted && (
                <div className="flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={!allPredictionsFilled}
                        className={`px-6 py-3 rounded-lg font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
                            ${allPredictionsFilled 
                                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-green-500/25 ring-1 ring-green-400/30' 
                                : 'bg-gray-700 cursor-not-allowed text-gray-400'}`}
                    >
                        {allPredictionsFilled ? '🔒 Lock Predictions & Start' : 'Fill all predictions first'}
                    </button>
                </div>
            )}

            {predictionState.submitted && simulationState === 'STOPPED' && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20 animate-bounce-in">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xl">✅</div>
                    <p className="text-green-300 font-medium">
                        Predictions locked! Click <strong className="text-white bg-green-600 px-1.5 py-0.5 rounded text-sm mx-1">Play</strong> to start the simulation.
                    </p>
                </div>
            )}
        </div>
    );
}
