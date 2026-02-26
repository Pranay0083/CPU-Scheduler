import { useState, useRef, useEffect } from 'react';
import { Play, Pause, StepForward, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AlgorithmType } from './useSandbox';

interface SandboxHeaderProps {
    algorithm: AlgorithmType;
    setAlgorithm: (alg: AlgorithmType) => void;
    isPlaying: boolean;
    setIsPlaying: (playing: boolean) => void;
    speedMultiplier: number;
    setSpeedMultiplier: (speed: number) => void;
    stepForward: () => void;
}

const ALGORITHMS: AlgorithmType[] = ['FCFS', 'SJF', 'SRTF', 'RR', 'Priority', 'MLFQ'];

export function SandboxHeader({
    algorithm,
    setAlgorithm,
    isPlaying,
    setIsPlaying,
    speedMultiplier,
    setSpeedMultiplier,
    stepForward
}: SandboxHeaderProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex items-center gap-6">
            {/* The Control Center Pill */}
            <div className="hand-drawn-border bg-[var(--bg-color)] border-[var(--cpu-stroke)] shadow-sm px-6 py-3 flex items-center gap-6">

                {/* Algorithm Selector (Custom Dropdown) */}
                <div
                    ref={dropdownRef}
                    className={`relative flex items-center gap-3 border-r-2 border-dashed border-[var(--grid-color)] pr-6 transition-all duration-300 ${isPlaying ? 'text-blue-500 drop-shadow-md' : ''}`}
                >
                    <span className={`font-architect font-bold text-sm opacity-50 uppercase tracking-widest ${isPlaying ? 'animate-pulse' : ''}`}>Brain</span>

                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`flex items-center gap-2 bg-transparent font-architect text-xl font-bold cursor-pointer outline-none hover:text-blue-400 transition-colors ${isPlaying ? 'shadow-[0_0_15px_rgba(59,130,246,0.5)] rounded-md px-2' : ''}`}
                    >
                        {algorithm}
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute top-full left-12 mt-4 min-w-[140px] hand-drawn-border bg-[var(--bg-color)]/95 backdrop-blur-md shadow-lg z-50 overflow-hidden flex flex-col"
                            >
                                {ALGORITHMS.map(alg => (
                                    <button
                                        key={alg}
                                        onClick={() => {
                                            setAlgorithm(alg);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`px-4 py-2 font-architect text-left hover:bg-[var(--tag-bg)] transition-colors ${algorithm === alg ? 'text-blue-500 bg-[var(--tag-bg)]/50' : 'text-[var(--cpu-stroke)]'}`}
                                    >
                                        {alg}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Play Controls */}
                <div className="flex items-center gap-4 border-r-2 border-dashed border-[var(--grid-color)] pr-6">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-10 h-10 rounded-full border-2 border-[var(--cpu-stroke)] flex items-center justify-center hover:bg-[var(--cpu-stroke)] hover:text-[var(--bg-color)] transition-colors"
                    >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                    </button>

                    <button
                        onClick={stepForward}
                        disabled={isPlaying}
                        className={`w-10 h-10 rounded-full border-2 border-dashed border-[var(--cpu-stroke)] flex items-center justify-center transition-colors ${isPlaying ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[var(--tag-bg)]'}`}
                        title="Step Forward (1 Tick)"
                    >
                        <StepForward className="w-4 h-4" />
                    </button>
                </div>

                {/* Speed Slider */}
                <div className="flex items-center gap-3">
                    <span className="font-architect font-bold text-sm opacity-50 uppercase tracking-widest min-w-[32px]">{speedMultiplier}x</span>
                    <input
                        type="range"
                        min="0.5"
                        max="5"
                        step="0.5"
                        value={speedMultiplier}
                        onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
                        className="w-24 slider-thumb-heavy h-2 bg-[var(--grid-color)] rounded-lg appearance-none cursor-pointer"
                        style={{ accentColor: 'var(--cpu-stroke)' }}
                    />
                </div>

            </div>
        </div>
    );
}
