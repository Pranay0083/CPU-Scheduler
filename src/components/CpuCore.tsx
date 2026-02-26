import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import { Cpu } from 'lucide-react';

interface CpuCoreProps {
    progress?: number; // 0 to 100
    activeColor?: string;
}

export function CpuCore({ progress, activeColor }: CpuCoreProps) {
    const { theme } = useTheme();

    return (
        <div className="relative flex flex-col items-center my-16">
            <motion.div
                className="relative w-48 h-48 hand-drawn-border flex items-center justify-center bg-[var(--bg-color)] z-10 transition-colors duration-500 overflow-hidden"
                style={{
                    borderColor: activeColor || 'var(--cpu-stroke)',
                    color: activeColor || 'var(--cpu-stroke)'
                }}
                animate={{
                    boxShadow: progress !== undefined
                        ? [`0 0 15px ${activeColor}40`, `0 0 35px ${activeColor}90`, `0 0 15px ${activeColor}40`]
                        : theme === 'dark'
                            ? ['0 0 5px rgba(255,255,255,0.05)', '0 0 15px rgba(255,255,255,0.1)', '0 0 5px rgba(255,255,255,0.05)']
                            : ['0 0 0px rgba(0,0,0,0)']
                }}
                transition={{
                    duration: progress !== undefined ? 0.8 : 4, // Fast pulse when active, slow breathe when idle
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
            >
                {/* Progress Fill Background (Liquid-like) */}
                {progress !== undefined && activeColor && (
                    <motion.div
                        className="absolute bottom-0 w-full opacity-30"
                        animate={{ height: `${progress}%` }}
                        transition={{ type: 'tween', ease: 'linear', duration: 1 }} // Matches 1s tick approximately
                        style={{ backgroundColor: activeColor }}
                    />
                )}

                {/* Isometric details inside the chip */}
                <div className="absolute inset-4 hand-drawn-border opacity-50 transition-colors duration-500 z-20 pointer-events-none" style={{ borderColor: activeColor || 'var(--cpu-stroke)' }} />
                <div className="absolute inset-8 hand-drawn-border flex justify-center items-center transition-colors duration-500 z-20 pointer-events-none" style={{ borderColor: activeColor || 'var(--cpu-stroke)' }}>
                    <Cpu size={48} strokeWidth={1} style={{ color: activeColor || 'var(--cpu-stroke)' }} />
                </div>

                {/* Pins */}
                <div className="absolute -top-3 left-8 w-2 h-4 border-2 rounded-sm transition-colors duration-500" style={{ borderColor: activeColor || 'var(--cpu-stroke)' }} />
                <div className="absolute -top-3 left-16 w-2 h-4 border-2 rounded-sm transition-colors duration-500" style={{ borderColor: activeColor || 'var(--cpu-stroke)' }} />
                <div className="absolute -top-3 right-8 w-2 h-4 border-2 rounded-sm transition-colors duration-500" style={{ borderColor: activeColor || 'var(--cpu-stroke)' }} />
                <div className="absolute -top-3 right-16 w-2 h-4 border-2 rounded-sm transition-colors duration-500" style={{ borderColor: activeColor || 'var(--cpu-stroke)' }} />

                <div className="absolute -bottom-3 left-8 w-2 h-4 border-2 rounded-sm transition-colors duration-500" style={{ borderColor: activeColor || 'var(--cpu-stroke)' }} />
                <div className="absolute -bottom-3 left-16 w-2 h-4 border-2 rounded-sm transition-colors duration-500" style={{ borderColor: activeColor || 'var(--cpu-stroke)' }} />
                <div className="absolute -bottom-3 right-8 w-2 h-4 border-2 rounded-sm transition-colors duration-500" style={{ borderColor: activeColor || 'var(--cpu-stroke)' }} />
                <div className="absolute -bottom-3 right-16 w-2 h-4 border-2 rounded-sm transition-colors duration-500" style={{ borderColor: activeColor || 'var(--cpu-stroke)' }} />
            </motion.div>
            <p className="mt-4 font-architect text-xl text-[var(--cpu-stroke)] tracking-widest uppercase transition-colors duration-500 relative z-10">
                Central Processing Unit
            </p>
        </div>
    );
}
