import { motion } from 'framer-motion';

export function HeroCurtain() {
    return (
        <div className="relative w-full z-20 flex flex-col transition-colors duration-500">
            {/* Top solid portion */}
            <div className="w-full h-[calc(100vh-80px)] md:h-[calc(100vh-120px)] bg-[var(--curtain-bg)] flex flex-col items-center justify-center transition-colors duration-500 rounded-b-none relative">
                <div className="text-center px-4 z-10 -mt-10 flex flex-col items-center">
                    <h2 className="text-xl md:text-2xl font-architect mb-2 text-[var(--text-color)] opacity-70 tracking-widest uppercase">
                        The Hidden Choreographer
                    </h2>
                    <h1 className="text-6xl md:text-8xl font-sans font-bold mb-6 text-[var(--text-color)] tracking-tight">
                        THE OPERATING SYSTEM
                    </h1>
                    <p className="text-2xl md:text-3xl font-architect max-w-2xl mx-auto text-[var(--text-color)] opacity-90 mb-2">
                        A beautifully built journey from the curtain to the core.
                    </p>
                    <p className="text-sm font-sans text-[var(--text-color)] opacity-50 uppercase tracking-[0.3em]">
                        Where logic meets the machine.
                    </p>
                </div>

                {/* Scroll Prompt */}
                <motion.div
                    className="absolute bottom-4 flex flex-col items-center z-10 opacity-70"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <span className="text-sm font-sans uppercase tracking-[0.2em] mb-2 font-bold opacity-60">Scroll to unfold</span>
                    <svg className="w-6 h-6 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </motion.div>

                {/* System Status Details */}
                <div className="absolute bottom-4 right-8 flex flex-col items-end text-xs font-mono opacity-40 z-10 gap-1 uppercase">
                    <span>[ System: Ready ]</span>
                    <span>[ Scheduler: Idle ]</span>
                    <span>[ Journey: 0% ]</span>
                </div>
            </div>

            {/* Wavy bottom edge - sits exactly below the solid block */}
            <div className="relative w-full h-[80px] md:h-[120px] overflow-hidden -mt-1 pointer-events-none">
                <motion.div
                    className="absolute bottom-0 left-0 w-[200%] h-full"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                >
                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full block">
                        {/* Fill that matches curtain color, transparent below */}
                        <path
                            d="M0,0 L0,60 C150,140 350,-20 600,60 C850,140 1050,-20 1200,60 L1200,0 Z"
                            style={{ fill: 'var(--curtain-bg)' }}
                            className="transition-colors duration-500"
                        />
                        {/* Stroke line for the wave itself */}
                        <path
                            d="M0,60 C150,140 350,-20 600,60 C850,140 1050,-20 1200,60"
                            style={{ fill: 'none', stroke: 'var(--curtain-wave)' }}
                            strokeWidth="6"
                            strokeLinecap="round"
                            className="transition-colors duration-500"
                        />
                    </svg>
                </motion.div>
            </div>
        </div>
    );
}
