import React, { useState } from 'react';
import { useScheduler } from '../context/SchedulerContext';

export function ProcessForm() {
    const { addProcess, state } = useScheduler();
    const [formData, setFormData] = useState({
        id: 1,
        arrivalTime: 0,
        priority: 1,
        burstTime: 5,
    });
    const [error, setError] = useState('');

    const isRunning = state.simulationState === 'RUNNING';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.burstTime <= 0) {
            setError('Burst time must be greater than 0');
            return;
        }

        addProcess({
            name: formData.id.toString(),
            arrivalTime: formData.arrivalTime,
            priority: formData.priority,
            bursts: [{ type: 'CPU', duration: formData.burstTime, remaining: formData.burstTime }],
            color: '',
        });

        // Reset form with incremented ID
        setFormData(prev => ({
            ...prev,
            id: prev.id + 1,
            arrivalTime: prev.arrivalTime + 1,
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="glass-panel flex flex-col gap-4">
            <h3 className="text-lg font-bold border-b border-border-main pb-2">Add Process</h3>

            <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col gap-1">
                    <label htmlFor="id" className="text-xs text-text-secondary uppercase tracking-wider">ID</label>
                    <input
                        id="id"
                        type="number"
                        min="1"
                        value={formData.id}
                        onChange={(e) => setFormData(prev => ({ ...prev, id: Math.max(1, parseInt(e.target.value) || 1) }))}
                        placeholder="1"
                        disabled={isRunning}
                        className="w-full bg-bg-secondary border border-border-main rounded-md p-2 text-text-primary focus:border-accent-primary focus:outline-none text-sm font-mono"
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
                <label htmlFor="burstTime" className="text-xs text-text-secondary uppercase tracking-wider">Burst Time</label>
                <input
                    id="burstTime"
                    type="number"
                    min="1"
                    value={formData.burstTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, burstTime: Math.max(1, parseInt(e.target.value) || 1) }))}
                    placeholder="5"
                    disabled={isRunning}
                    className="w-full bg-bg-secondary border border-border-main rounded-md p-2 text-text-primary focus:border-accent-primary focus:outline-none text-sm font-mono"
                />
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
