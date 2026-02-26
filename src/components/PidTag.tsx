import { motion } from 'framer-motion';

export function PidTag({ pid, state }: { pid: number, state: 'ready' | 'running' | 'waiting' }) {
    // Add a slight wobble when running
    const wobble = state === 'running' ? { rotate: [-2, 2, -2] } : {};

    return (
        <motion.div
            className="inline-flex items-center px-4 py-2 m-2 hand-drawn-border font-sans font-bold shadow-sm cursor-pointer transition-colors duration-500"
            style={{
                backgroundColor: 'var(--tag-bg)',
                borderColor: 'var(--tag-border)',
                color: 'var(--tag-border)',
            }}
            animate={wobble}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.05, rotate: 2 }}
        >
            <span className="opacity-60 mr-2 text-sm font-architect">PID</span>
            <span>{pid}</span>
        </motion.div>
    );
}
