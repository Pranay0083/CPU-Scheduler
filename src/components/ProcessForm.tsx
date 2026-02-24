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

        if (state.processes.some(p => p.name === formData.id.toString())) {
            setError('Process ID already exists.');
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
        <form onSubmit={handleSubmit} className="glass-panel flex flex-col gap-2">
            <h3 className="text-sm font-bold border-b border-border-main pb-2 text-text-secondary">Quick Add Process</h3>

            <div className="flex flex-wrap items-end gap-2">
                <div className="flex flex-col gap-1 w-16">
                    <label htmlFor="id" className="text-[10px] text-text-muted uppercase tracking-wider">ID</label>
                    <input
                        id="id"
                        type="number"
                        min="1"
                        value={formData.id}
                        onChange={(e) => setFormData(prev => ({ ...prev, id: Math.max(1, parseInt(e.target.value) || 1) }))}
                        placeholder="1"
                        disabled={isRunning}
                        className="w-full bg-bg-primary border border-border-main rounded p-1.5 text-text-primary focus:border-accent-primary focus:outline-none text-xs font-mono"
                    />
                </div>

                <div className="flex flex-col gap-1 w-20">
                    <label htmlFor="arrivalTime" className="text-[10px] text-text-muted uppercase tracking-wider">Arrival</label>
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
                        className="w-full bg-bg-primary border border-border-main rounded p-1.5 text-text-primary focus:border-accent-primary focus:outline-none text-xs"
                    />
                </div>

                <div className="flex flex-col gap-1 w-20">
                    <label htmlFor="priority" className="text-[10px] text-text-muted uppercase tracking-wider">Priority</label>
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
                        className="w-full bg-bg-primary border border-border-main rounded p-1.5 text-text-primary focus:border-accent-primary focus:outline-none text-xs"
                    />
                </div>

                <div className="flex flex-col gap-1 flex-1 min-w-[80px]">
                    <label htmlFor="burstTime" className="text-[10px] text-text-muted uppercase tracking-wider">Burst Time</label>
                    <input
                        id="burstTime"
                        type="number"
                        min="1"
                        value={formData.burstTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, burstTime: Math.max(1, parseInt(e.target.value) || 1) }))}
                        placeholder="5"
                        disabled={isRunning}
                        className="w-full bg-bg-primary border border-border-main rounded p-1.5 text-text-primary focus:border-accent-primary focus:outline-none text-xs font-mono"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isRunning}
                    className="h-[30px] px-3 bg-accent-primary/20 text-accent-primary border border-accent-primary/50 hover:bg-accent-primary/30 rounded text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
                >
                    Add
                </button>
            </div>

            {error && <div className="text-accent-error text-[10px] font-bold mt-1">{error}</div>}
        </form>
    );
}
