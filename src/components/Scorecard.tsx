import { useScheduler } from '../context/SchedulerContext';
import type { PredictionResults, ScoreBreakdown } from '../types';

// Calculate prediction score
function calculatePredictionResults(
    predictions: { processId: string; processName: string; predictedCT: number | null }[],
    processes: { id: string; completionTime: number | null; waitTime: number }[],
    predictedAWT: number | null
): PredictionResults {
    const breakdown: ScoreBreakdown[] = [];
    let totalScore = 0;
    let maxScore = 0;

    // Score each process prediction
    predictions.forEach(pred => {
        const process = processes.find(p => p.id === pred.processId);
        const actualCT = process?.completionTime ?? null;
        let points = 0;
        let difference: number | null = null;

        if (pred.predictedCT !== null && actualCT !== null) {
            difference = Math.abs(pred.predictedCT - actualCT);
            if (difference === 0) {
                points = 10; // Exact match
            } else if (difference <= 1) {
                points = 5; // Within ±1
            } else if (difference <= 3) {
                points = 2; // Within ±3
            }
        }

        maxScore += 10;
        totalScore += points;

        breakdown.push({
            processId: pred.processId,
            processName: pred.processName,
            predictedCT: pred.predictedCT,
            actualCT,
            difference,
            points,
        });
    });

    // Calculate actual AWT
    const completedProcesses = processes.filter(p => p.completionTime !== null);
    const actualAWT = completedProcesses.length > 0
        ? completedProcesses.reduce((sum, p) => sum + p.waitTime, 0) / completedProcesses.length
        : 0;

    // Score AWT prediction
    let awtPoints = 0;
    let awtDifference: number | null = null;
    if (predictedAWT !== null) {
        awtDifference = Math.abs(predictedAWT - actualAWT);
        if (awtDifference <= 0.5) {
            awtPoints = 20;
        } else if (awtDifference <= 1) {
            awtPoints = 10;
        } else if (awtDifference <= 2) {
            awtPoints = 5;
        }
    }
    maxScore += 20;
    totalScore += awtPoints;

    const accuracy = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

    return {
        breakdown,
        predictedAWT,
        actualAWT,
        awtDifference,
        awtPoints,
        totalScore,
        maxScore,
        accuracy,
    };
}

function getScoreClass(points: number, maxPoints: number): string {
    const ratio = points / maxPoints;
    if (ratio >= 1) return 'bg-green-500/20 text-green-300';
    if (ratio >= 0.5) return 'bg-yellow-500/20 text-yellow-300';
    if (ratio > 0) return 'bg-orange-500/20 text-orange-300';
    return 'bg-red-500/10 text-red-300 opacity-50';
}

function getDifferenceClass(difference: number | null): string {
    if (difference === null) return '';
    if (difference === 0) return 'text-green-400 font-bold';
    if (difference <= 1) return 'text-yellow-400';
    if (difference <= 3) return 'text-orange-400';
    return 'text-red-400';
}

export function Scorecard() {
    const { state, reset } = useScheduler();
    const { predictionState, processes, interactionMode } = state;

    if (interactionMode !== 'PREDICT_VERIFY' || !predictionState.showResults) {
        return null;
    }

    const results = calculatePredictionResults(
        predictionState.predictions,
        processes,
        predictionState.predictedAWT
    );

    const accuracyClass = results.accuracy >= 80 ? 'text-green-400 border-green-500/50 shadow-green-500/20' :
        results.accuracy >= 50 ? 'text-yellow-400 border-yellow-500/50 shadow-yellow-500/20' : 'text-red-400 border-red-500/50 shadow-red-500/20';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4">
            <div className="bg-[#1e1e2e] border border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col items-center p-8 animate-scale-in">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-8">
                    📊 Results
                </h2>

                <div className={`relative w-40 h-40 rounded-full border-4 flex flex-col items-center justify-center mb-8 shadow-[0_0_30px_currentColor] ${accuracyClass}`}>
                    <span className="text-5xl font-mono font-bold tracking-tighter">{results.accuracy.toFixed(0)}%</span>
                    <span className="text-sm font-medium uppercase tracking-widest opacity-70 mt-1">Accuracy</span>
                </div>

                <div className="text-2xl font-medium text-white/90 mb-8 flex items-baseline gap-2">
                    <span className="text-4xl text-accent-cyan font-bold">{results.totalScore}</span>
                    <span className="text-white/40">/ {results.maxScore} points</span>
                </div>

                <div className="w-full bg-black/20 rounded-xl overflow-hidden border border-white/5 mb-8">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-white/50 text-xs uppercase tracking-wider border-b border-white/10">
                                <th className="px-4 py-3 font-medium">Process</th>
                                <th className="px-4 py-3 font-medium">Predicted CT</th>
                                <th className="px-4 py-3 font-medium">Actual CT</th>
                                <th className="px-4 py-3 font-medium">Diff</th>
                                <th className="px-4 py-3 font-medium text-right">Points</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm font-mono">
                            {results.breakdown.map(row => (
                                <tr key={row.processId} className={`transition-colors hover:bg-white/5`}>
                                    <td className="px-4 py-3">{row.processName}</td>
                                    <td className="px-4 py-3 text-white/70">{row.predictedCT ?? '-'}</td>
                                    <td className="px-4 py-3 text-white/70">{row.actualCT ?? '-'}</td>
                                    <td className={`px-4 py-3 ${getDifferenceClass(row.difference)}`}>
                                        {row.difference !== null ? `±${row.difference}` : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${getScoreClass(row.points, 10)}`}>
                                            +{row.points}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-white/[0.02] font-bold">
                                <td className="px-4 py-4 text-accent-secondary" colSpan={1}>AWT</td>
                                <td className="px-4 py-4 text-white/70">{results.predictedAWT?.toFixed(2) ?? '-'}</td>
                                <td className="px-4 py-4 text-white/70">{results.actualAWT.toFixed(2)}</td>
                                <td className={`px-4 py-4 ${getDifferenceClass(results.awtDifference)}`}>
                                    {results.awtDifference !== null ? `±${results.awtDifference.toFixed(2)}` : '-'}
                                </td>
                                <td className="px-4 py-4 text-right">
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${getScoreClass(results.awtPoints, 20)}`}>
                                        +{results.awtPoints}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-wrap justify-center gap-4 text-xs text-white/40 font-mono mb-8 p-4 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span>Exact +10</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500"></span>±1: +5</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500"></span>±3: +2</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span>&gt;3: +0</span>
                </div>

                <button 
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-bold shadow-lg hover:shadow-accent-primary/25 transition-all transform hover:-translate-y-1 active:translate-y-0"
                    onClick={reset}
                >
                    🔄 Try Again
                </button>
            </div>
        </div>
    );
}
