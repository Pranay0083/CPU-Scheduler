import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { NarrativeChapter } from '../NarrativeChapter';
import { CpuCore } from '../CpuCore';

export function Chapter7SRTF() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.5 });

    // Timer for P1 (Medium) waiting after being kicked out
    const [p1WaitTimer, setP1WaitTimer] = useState(0);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isInView) {
            setP1WaitTimer(0);
            let ticks = 0;
            interval = setInterval(() => {
                // P1 waits while P2 comes in and executes (from approx 4s to 8s mark in animation)
                if (ticks > 40 && ticks < 80) {
                    setP1WaitTimer((prev) => prev + 1);
                }
                ticks++;
                if (ticks > 120) ticks = 0; // reset loop
            }, 100);
        } else {
            setP1WaitTimer(0);
        }
        return () => clearInterval(interval);
    }, [isInView]);

    return (
        <NarrativeChapter
            id="chapter-7-srtf"
            headline="Chapter 7: Preemptive SJF"
            subHeadline="What if a massive job starts running, and a tiny job arrives right after?"
        >
            <div ref={ref} className="w-full max-w-6xl flex flex-col items-center gap-16 py-12">

                {/* Top Split: Theory vs Visualization */}
                <div className="w-full flex flex-col lg:flex-row items-stretch justify-between gap-12">

                    {/* The Left Side: Content */}
                    <div className="flex-1 space-y-6 flex flex-col justify-center">
                        <div className="hand-drawn-border p-6 bg-[var(--bg-color)] border-[var(--cpu-stroke)] shadow-sm">
                            <h3 className="font-architect text-2xl mb-2 text-[var(--cpu-stroke)]">The Philosophy</h3>
                            <p className="font-sans opacity-80 text-sm leading-relaxed mb-4">
                                This algorithm is also known as <strong>Shortest Remaining Time First (SRTF)</strong>. Think of it as the high-speed, aggressive version of SJF.
                            </p>
                            <p className="font-sans opacity-80 text-sm leading-relaxed">
                                Unlike standard SJF which is "Non-Preemptive", SRTF gives the OS the power to interrupt.
                            </p>
                        </div>

                        <div className="hand-drawn-border p-6 bg-[var(--tag-bg)] border-[var(--grid-color)] shadow-sm">
                            <h3 className="font-architect text-2xl mb-2 text-[var(--cpu-stroke)]">The Logic</h3>
                            <p className="font-sans opacity-80 text-sm leading-relaxed">
                                The OS constantly compares the <strong>remaining time</strong> of the currently running process with the <strong>burst time</strong> of any newly arriving process.
                            </p>
                        </div>

                        <div className="hand-drawn-border p-6 bg-[var(--bg-color)] border-blue-400 shadow-sm relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-500 opacity-10 rounded-full blur-xl" />
                            <h3 className="font-architect text-2xl mb-2 text-blue-500 dark:text-blue-400">The Power to Evict</h3>
                            <p className="font-sans opacity-80 text-sm leading-relaxed">
                                If the new job is shorter than what's left of the current job, the OS hits pause, kicks the current job back to the Ready Queue, and instantly runs the quick one!
                            </p>
                        </div>
                    </div>

                    {/* The Right Side: Canvas Action */}
                    <div className="flex-1 flex flex-col items-center justify-center relative hand-drawn-border p-8 border-[var(--grid-color)] overflow-hidden">
                        <span className="absolute top-4 left-4 font-architect opacity-50 uppercase tracking-widest text-xs">Live Eviction</span>

                        <div className="flex items-center gap-12 mt-16 w-full h-[300px]">
                            {/* The Arrival Zone / Ready Queue */}
                            <div className="flex flex-col gap-4 relative w-32 h-full justify-center">
                                <span className="absolute -top-12 w-full font-architect text-center opacity-70 border-b border-dashed border-[var(--grid-color)] pb-2">Queue</span>

                                {/* P2 - Tiny Job (Arrives Late) */}
                                <motion.div
                                    className="absolute w-24 h-8 bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-400 rounded-full flex items-center justify-center font-bold text-sm shadow-md z-30"
                                    initial={{ x: -100, y: 0, opacity: 0 }}
                                    animate={isInView ? {
                                        x: [-100, 0, 0, 150, 200, 200], // Flies in from left, waits, then flies to CPU
                                        y: [0, 0, 0, 0, 0, 0],
                                        opacity: [0, 1, 1, 1, 0, 0], // Appears, then fades out in CPU
                                        scale: [1, 1, 1, 1.2, 0, 0]
                                    } : {}}
                                    transition={{ duration: 12, repeat: Infinity, times: [0, 0.2, 0.3, 0.5, 0.6, 1], ease: 'easeInOut' }}
                                    style={{ top: '50%', marginTop: '-16px' }}
                                >
                                    P2 (1ms)
                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-blue-500 font-mono text-xs font-bold whitespace-nowrap">
                                        Arrived!
                                    </span>
                                </motion.div>

                                {/* P1 - Medium Job (Starts in CPU, gets kicked back) */}
                                <motion.div
                                    className="absolute w-32 h-16 bg-[var(--tag-bg)] border-4 border-[var(--tag-border)] rounded-xl flex items-center justify-center font-bold text-base shadow-sm z-20"
                                    initial={{ x: 200, y: 0, scale: 1.2 }}
                                    animate={isInView ? {
                                        x: [200, 200, 200, 0, 0, 200, 200], // Starts in CPU (200), gets kicked to queue (0), goes back to CPU (200), disappears
                                        y: [0, 0, 0, 50, 50, 0, 0], // Drops down when kicked back
                                        scale: [1.2, 1.2, 1.2, 1, 1, 1.2, 0],
                                        opacity: [1, 1, 1, 1, 1, 1, 0]
                                    } : {}}
                                    transition={{ duration: 12, repeat: Infinity, times: [0, 0.2, 0.3, 0.5, 0.7, 0.9, 1], ease: 'easeInOut' }}
                                    style={{ top: '50%', marginTop: '-32px' }}
                                >
                                    P1 (15ms)
                                    <motion.span
                                        className="absolute -bottom-6 w-full text-center text-red-500 font-mono text-xs font-bold"
                                        animate={{ opacity: p1WaitTimer > 0 ? 1 : 0 }}
                                    >
                                        Paused (+{p1WaitTimer}ms)
                                    </motion.span>
                                </motion.div>
                            </div>

                            {/* The CPU running Quick Tasks */}
                            <div className="flex flex-col items-center relative ml-auto mr-8">
                                <span className="absolute -top-16 font-architect text-red-500 text-sm whitespace-nowrap opacity-0"
                                    style={{ animation: isInView ? 'fadePulse 12s infinite' : 'none' }}>
                                    ! INTERRUPT !
                                </span>
                                <style>{`
                                    @keyframes fadePulse {
                                        0%, 30%, 50%, 100% { opacity: 0; transform: translateY(0); }
                                        35%, 45% { opacity: 1; transform: translateY(-10px); color: red; }
                                    }
                                `}</style>

                                <CpuCore />

                                {/* Flash effect when P2 completes instantly */}
                                <motion.div
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full mix-blend-screen pointer-events-none"
                                    style={{ backgroundColor: 'var(--cpu-stroke)' }}
                                    animate={isInView ? {
                                        scale: [0.5, 1.5, 0.5],
                                        opacity: [0, 0.8, 0]
                                    } : {}}
                                    transition={{ duration: 12, repeat: Infinity, times: [0.5, 0.55, 0.6] }}
                                // Timings matched to P2 hitting CPU
                                />

                                {/* Flash effect when P1 (Finally!) completes */}
                                <motion.div
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full mix-blend-screen pointer-events-none"
                                    style={{ backgroundColor: 'var(--cpu-stroke)' }}
                                    animate={isInView ? {
                                        scale: [0.5, 1.5, 0.5],
                                        opacity: [0, 0.5, 0]
                                    } : {}}
                                    transition={{ duration: 12, repeat: Infinity, times: [0.95, 0.98, 1] }}
                                // Timings matched to P1 hitting CPU for the second time and ending
                                />
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </NarrativeChapter>
    );
}
