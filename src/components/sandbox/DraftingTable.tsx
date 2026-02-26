import { Plus } from 'lucide-react';
import type { Process } from './useSandbox';

interface DraftingTableProps {
    addProcess: () => void;
    processes: Process[];
    draftBurst: number;
    setDraftBurst: (val: number) => void;
    draftPriority: number;
    setDraftPriority: (val: number) => void;
}

const COLORS = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // green
    '#f59e0b', // yellow
    '#8b5cf6', // purple
    '#ec4899', // pink
];

export function DraftingTable({
    addProcess,
    processes,
    draftBurst,
    setDraftBurst,
    draftPriority,
    setDraftPriority
}: DraftingTableProps) {
    const handleAdd = () => {
        addProcess();
    };

    // The next PID will have this color index
    const nextColor = COLORS[processes.length % COLORS.length];

    return (
        <div className="absolute bottom-48 left-8 z-40 flex flex-col gap-4 w-72">

            {/* The Drafting Tools Card */}
            <div className="hand-drawn-border bg-[var(--tag-bg)] border-[var(--grid-color)] shadow-lg p-6 flex flex-col gap-6 backdrop-blur-sm relative">

                {/* Visual "Ink Flow" origin point marker */}
                {/* <div
                    className="absolute -right-3 top-1/2 w-4 h-4 rounded-full border-2 border-[var(--bg-color)] z-10"
                    style={{ backgroundColor: nextColor }}
                /> */}

                <h3 className="font-architect text-xl text-[var(--cpu-stroke)] border-b border-dashed border-[var(--grid-color)] pb-2 flex items-center justify-between">
                    Process Drafting
                    <span className="text-sm opacity-50">Next: P{processes.length + 1}</span>
                </h3>

                {/* Burst Slider */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-sm font-bold opacity-80 text-[var(--cpu-stroke)]">
                        <span>Burst Time</span>
                        <span className="font-mono">{draftBurst}ms</span>
                    </div>
                    {/* Using inline style for accent color dynamically */}
                    <input
                        type="range"
                        min="1"
                        max="20"
                        value={draftBurst}
                        onChange={(e) => setDraftBurst(parseInt(e.target.value))}
                        className="w-full slider-thumb-heavy h-2 bg-[var(--grid-color)] rounded-lg appearance-none cursor-pointer"
                        style={{ accentColor: nextColor }}
                    />
                </div>

                {/* Priority Slider */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-sm font-bold opacity-80 text-[var(--cpu-stroke)]">
                        <span>Priority (1=High)</span>
                        <span className="font-mono">{draftPriority}</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="5"
                        value={draftPriority}
                        onChange={(e) => setDraftPriority(parseInt(e.target.value))}
                        className="w-full slider-thumb-heavy h-2 bg-[var(--grid-color)] rounded-lg appearance-none cursor-pointer"
                        style={{ accentColor: nextColor }}
                    />
                </div>

                {/* Add Button */}
                <button
                    onClick={handleAdd}
                    className="mt-2 w-full py-3 hand-drawn-border font-architect text-lg hover:text-[var(--bg-color)] transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden"
                    style={{
                        borderColor: nextColor,
                        color: nextColor
                    }}
                >
                    <div className="absolute inset-0 bg-current opacity-10 group-hover:opacity-100 transition-opacity z-0" style={{ color: nextColor }} />
                    <Plus className="w-5 h-5 z-10 relative text-current group-hover:text-[var(--bg-color)]" />
                    <span className="z-10 relative text-current group-hover:text-[var(--bg-color)]">Draft Process</span>
                </button>
            </div>

            {/* Total Count Marker */}
            <div className="font-architect text-sm opacity-50 px-2 text-[var(--cpu-stroke)]">
                Total Drafted: {processes.length}
            </div>

        </div>
    );
}
