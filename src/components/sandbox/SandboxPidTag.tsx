import { motion } from 'framer-motion';

interface SandboxPidTagProps {
    pid: string;
    state?: 'ready' | 'running' | 'waiting' | 'completed';
    priority?: number;
    colorIndex?: number;
    isNext?: boolean;
    isStarving?: boolean;
    starvationPercentage?: number;
    isConvoyed?: boolean;
}

const COLORS = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // green
    '#f59e0b', // yellow
    '#8b5cf6', // purple
    '#ec4899', // pink
];

export function SandboxPidTag({ pid, state = 'ready', priority, colorIndex = 0, isNext = false, isStarving = false, starvationPercentage = 0, isConvoyed = false }: SandboxPidTagProps) {
    const wobble = state === 'running' ? { rotate: [-2, 2, -2] } : {};

    // Add aggressive shake for starving processes
    const shake = isStarving ? { x: [-2, 2, -2, 2, 0], transition: { duration: 0.3, repeat: Infinity } } : {};

    let color = COLORS[colorIndex % COLORS.length];
    if (isStarving) color = '#ef4444'; // Turn red if starving
    if (isConvoyed) color = '#f59e0b'; // Turn yellow if convoyed

    // If it's the next up, add a pulsating glow based on its color.
    const glowAnimation = isNext ? {
        boxShadow: [`0 0 5px ${color}40`, `0 0 20px ${color}`, `0 0 5px ${color}40`]
    } : {};

    const combinedAnimation = { ...wobble, ...shake, ...glowAnimation };

    return (
        <motion.div
            className={`inline-flex flex-col items-center justify-center px-3 py-1 m-1 hand-drawn-border font-sans font-bold shadow-sm cursor-pointer transition-colors duration-500 relative overflow-hidden`}
            style={{
                backgroundColor: isStarving ? 'rgba(239, 68, 68, 0.1)' : isConvoyed ? 'rgba(245, 158, 11, 0.1)' : 'var(--tag-bg)',
                borderColor: color,
                color: color,
            }}
            animate={combinedAnimation}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.05, rotate: 2 }}
        >
            <div className="flex items-center gap-1">
                <span className="opacity-60 text-xs font-architect">PID</span>
                <span className="text-sm">{pid.replace('P', '')}</span>
            </div>

            {priority !== undefined && (
                <div className="absolute -top-3 -right-3 w-5 h-5 bg-[var(--bg-color)] border border-dashed rounded-full flex items-center justify-center text-[10px]" style={{ borderColor: color, zIndex: 10 }}>
                    {priority}
                </div>
            )}

            {/* Convoy Indicator */}
            {isConvoyed && (
                <div className="absolute -top-3 -left-3 w-5 h-5 bg-[var(--bg-color)] border border-dashed rounded-full flex items-center justify-center text-[12px]" style={{ borderColor: color, zIndex: 10 }} title="Convoy Effect: Short task stuck behind huge task">
                    🐌
                </div>
            )}

            {/* Starvation Buildup Bar (only shown when waiting in ready queue) */}
            {state === 'ready' && starvationPercentage > 0 && (
                <div className="absolute bottom-0 left-0 h-1 bg-red-500/50 transition-all duration-300" style={{ width: `${starvationPercentage}%` }} />
            )}
        </motion.div>
    );
}
