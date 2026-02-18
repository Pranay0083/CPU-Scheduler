import React, { useState } from 'react';
import { useScheduler } from '../context/SchedulerContext';
import { parseBurstPattern } from '../types';

export function ProcessForm() {
    const { addProcess, state } = useScheduler();
    const [formData, setFormData] = useState({
        name: '',
        arrivalTime: 0,
        priority: 1,
        burstPattern: 'CPU(5)',
    });
    const [error, setError] = useState('');

    const isRunning = state.simulationState === 'RUNNING';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const bursts = parseBurstPattern(formData.burstPattern);

        if (bursts.length === 0) {
            setError('Invalid burst pattern. Use format: CPU(3) -> IO(2) -> CPU(5)');
            return;
        }

        if (!formData.name.trim()) {
            setError('Process name is required');
            return;
        }

        addProcess({
            name: formData.name.trim(),
            arrivalTime: formData.arrivalTime,
            priority: formData.priority,
            bursts,
            color: '',
        });

        // Reset form with incremented name
        const match = formData.name.match(/^P(\d+)$/);
        const nextName = match ? `P${parseInt(match[1]) + 1}` : 'P1';

        setFormData(prev => ({
            ...prev,
            name: nextName,
            arrivalTime: prev.arrivalTime + 1,
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="glass-panel flex flex-col gap-4">
            <h3 className="text-lg font-bold border-b border-border-main pb-2">Add Process</h3>

            <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col gap-1">
                    <label htmlFor="name" className="text-xs text-text-secondary uppercase tracking-wider">Name</label>
                    <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="P1"
                        disabled={isRunning}
                        className="w-full bg-bg-secondary border border-border-main rounded-md p-2 text-text-primary focus:border-accent-primary focus:outline-none text-sm"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="arrivalTime" className="text-xs text-text-secondary uppercase tracking-wider">Arrival</label>
                    <input
                        id="arrivalTime"
                        type="number"
                        min="0"
                        value={formData.arrivalTime}
                        onChange={(e) => setFormData(prev => ({
                            ...prev,
                            arrivalTime: Math.max(0, parseInt(e.target.value) || 0)
                        }))}
                        disabled={isRunning}
                        className="w-full bg-bg-secondary border border-border-main rounded-md p-2 text-text-primary focus:border-accent-primary focus:outline-none text-sm"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="priority" className="text-xs text-text-secondary uppercase tracking-wider">Priority</label>
                    <input
                        id="priority"
                        type="number"
                        min="0"
                        max="10"
                        value={formData.priority}
                        onChange={(e) => setFormData(prev => ({
                            ...prev,
                            priority: Math.max(0, Math.min(10, parseInt(e.target.value) || 0))
                        }))}
                        disabled={isRunning}
                        className="w-full bg-bg-secondary border border-border-main rounded-md p-2 text-text-primary focus:border-accent-primary focus:outline-none text-sm"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="burstPattern" className="text-xs text-text-secondary uppercase tracking-wider">Burst Pattern</label>
                <input
                    id="burstPattern"
                    type="text"
                    value={formData.burstPattern}
                    onChange={(e) => setFormData(prev => ({ ...prev, burstPattern: e.target.value }))}
                    placeholder="CPU(3) -> IO(2) -> CPU(5)"
                    disabled={isRunning}
                    className="w-full bg-bg-secondary border border-border-main rounded-md p-2 text-text-primary focus:border-accent-primary focus:outline-none text-sm font-mono"
                />
                <span className="text-xs text-text-muted">Format: CPU(n) → IO(n) → CPU(n)</span>
            </div>

            {error && <div className="text-accent-error text-xs font-bold animate-pulse">{error}</div>}

            <button
                type="submit"
                disabled={isRunning}
                className="w-full py-2 bg-accent-primary text-white rounded-md font-bold hover:bg-accent-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent-primary/20"
            >
                + Add Process
            </button>
        </form>
    );
}
