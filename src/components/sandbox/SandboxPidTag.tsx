import { motion } from 'framer-motion';

interface SandboxPidTagProps {
    pid: string;
    state?: 'ready' | 'running' | 'waiting' | 'completed';
    priority?: number;
    colorIndex?: number;
    isNext?: boolean;
}

const COLORS = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // green
    '#f59e0b', // yellow
    '#8b5cf6', // purple
    '#ec4899', // pink
];

export function SandboxPidTag({ pid, state = 'ready', priority, colorIndex = 0, isNext = false }: SandboxPidTagProps) {
    const wobble = state === 'running' ? { rotate: [-2, 2, -2] } : {};
    const color = COLORS[colorIndex % COLORS.length];

    // If it's the next up, add a pulsating glow based on its color.
    const glowAnimation = isNext ? {
        boxShadow: [`0 0 5px ${color}40`, `0 0 20px ${color}`, `0 0 5px ${color}40`]
    } : {};

    return (
        <motion.div
            className="inline-flex flex-col items-center justify-center px-3 py-1 m-1 hand-drawn-border font-sans font-bold shadow-sm cursor-pointer transition-colors duration-500 relative"
            style={{
                backgroundColor: 'var(--tag-bg)',
                borderColor: color,
                color: color,
            }}
            animate={{ ...wobble, ...glowAnimation }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.05, rotate: 2 }}
        >
            <div className="flex items-center gap-1">
                <span className="opacity-60 text-xs font-architect">PID</span>
                <span className="text-sm">{pid.replace('P', '')}</span>
            </div>

            {priority !== undefined && (
                <div className="absolute -top-3 -right-3 w-5 h-5 bg-[var(--bg-color)] border border-dashed rounded-full flex items-center justify-center text-[10px]" style={{ borderColor: color }}>
                    {priority}
                </div>
            )}
        </motion.div>
    );
}
