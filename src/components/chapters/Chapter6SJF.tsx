import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { NarrativeChapter } from '../NarrativeChapter';
import { CpuCore } from '../CpuCore';

export function Chapter6SJF() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.5 });

    // Timer for P1 waiting (since it gets pushed to the back)
    const [p1WaitTimer, setP1WaitTimer] = useState(0);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isInView) {
            setP1WaitTimer(0);
            let ticks = 0;
            interval = setInterval(() => {
                // P1 waits while P2 and P3 execute (approx 4 seconds total)
                if (ticks < 40) {
                    setP1WaitTimer((prev) => prev + 1);
                    ticks++;
                }
            }, 100);
        } else {
            setP1WaitTimer(0);
        }
        return () => clearInterval(interval);
    }, [isInView]);

    return (
        <NarrativeChapter
            id="chapter-6-sjf"
            headline="Chapter 6: Shortest Job First"
            subHeadline="Waiting for a giant to finish is exhausting. What if we just... let the quick tasks go first?"
        >
            <div ref={ref} className="w-full max-w-6xl flex flex-col items-center gap-16 py-12">

                {/* Top Split: Theory vs Visualization */}
                <div className="w-full flex flex-col lg:flex-row items-stretch justify-between gap-12">

                    {/* The Left Side: Content */}
                    <div className="flex-1 space-y-6">
                        <div className="hand-drawn-border p-6 bg-[var(--bg-color)] border-[var(--cpu-stroke)] shadow-sm">
                            <h3 className="font-architect text-2xl mb-2 text-[var(--cpu-stroke)]">The Philosophy</h3>
                            <p className="font-sans opacity-80 text-sm leading-relaxed">
                                SJF is the "Optimal" strategy for minimizing average waiting time.
                            </p>
                        </div>

                        <div className="hand-drawn-border p-6 bg-[var(--bg-color)] border-[var(--cpu-stroke)] shadow-sm">
                            <h3 className="font-architect text-2xl mb-2 text-[var(--cpu-stroke)]">The Logic</h3>
                            <p className="font-sans opacity-80 text-sm leading-relaxed">
                                When the CPU is free, it looks at all available processes in the Ready Queue and picks the one with the <strong>smallest Burst Time</strong>.
                            </p>
                        </div>

                        <div className="hand-drawn-border p-6 bg-[var(--tag-bg)] border-green-500 shadow-sm relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 w-16 h-16 bg-green-500 opacity-10 rounded-full blur-xl" />
                            <h3 className="font-architect text-2xl mb-2 text-green-600 dark:text-green-400">The Big Advantage</h3>
                            <p className="font-sans opacity-80 text-sm leading-relaxed">
                                It clears the queue as fast as possible, making the system feel incredibly snappy for small tasks.
                            </p>
                        </div>
                    </div>

                    {/* The Right Side: Canvas Action */}
                    <div className="flex-1 flex flex-col items-center justify-center relative hand-drawn-border p-8 border-[var(--grid-color)] overflow-hidden">
                        <span className="absolute top-4 left-4 font-architect opacity-50 uppercase tracking-widest text-xs">Live Re-Sort</span>

                        <div className="flex items-center gap-12 mt-8 w-full">
                            {/* The Ready Queue */}
                            <div className="flex flex-col gap-4 relative w-32 h-64 justify-end">
                                <span className="absolute -top-6 w-full font-architect text-center opacity-70">Queue</span>

                                {/* P1 - Huge Block (Starts front, gets pushed back) */}
                                <motion.div
                                    className="absolute w-32 bg-[var(--tag-bg)] border-4 border-[var(--tag-border)] rounded-xl flex items-center justify-center font-bold text-lg shadow-sm z-10"
                                    initial={{ y: 0, height: 100 }}
                                    animate={isInView ? {
                                        y: [0, 100, 100, 100, 0], // Gets pushed down by P2/P3, then up when they leave
                                    } : {}}
                                    transition={{ duration: 10, repeat: Infinity, times: [0, 0.1, 0.4, 0.8, 0.9], ease: 'easeInOut' }}
                                    style={{ bottom: 0 }}
                                >
                                    P1 (99ms)
                                    <motion.span
                                        className="absolute -right-16 text-red-500 font-mono text-xs font-bold whitespace-nowrap"
                                        animate={{ opacity: p1WaitTimer > 0 ? 1 : 0 }}
                                    >
                                        +{p1WaitTimer}ms
                                    </motion.span>
                                </motion.div>

                                {/* P2 - Tiny Sliver (Starts middle, jumps front, executes) */}
                                <motion.div
                                    className="absolute w-32 h-8 bg-[var(--tag-bg)] border-2 border-[var(--tag-border)] rounded-full flex items-center justify-center font-bold text-sm shadow-md z-20"
                                    initial={{ y: -110, x: 0, opacity: 1, scale: 1 }}
                                    animate={isInView ? {
                                        y: [-110, -50, -50, -50, -50, -110], // Jumps down to front of queue (above P1)
                                        x: [0, 0, 150, 200, 200, 0], // Flies to CPU
                                        opacity: [1, 1, 1, 0, 0, 1], // Fades out after execution
                                        scale: [1, 1, 1.2, 0, 0, 1]
                                    } : {}}
                                    transition={{ duration: 10, repeat: Infinity, times: [0, 0.1, 0.3, 0.4, 0.9, 1], ease: 'easeInOut' }}
                                    style={{ bottom: 0 }}
                                >
                                    P2 (1ms)
                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-green-500 font-mono text-xs font-bold whitespace-nowrap">
                                        +0ms ✓
                                    </span>
                                </motion.div>

                                {/* P3 - Tiny Sliver (Starts back, jumps middle, executes) */}
                                <motion.div
                                    className="absolute w-32 h-8 bg-[var(--tag-bg)] border-2 border-[var(--tag-border)] rounded-full flex items-center justify-center font-bold text-sm shadow-md z-30"
                                    initial={{ y: -150, x: 0, opacity: 1, scale: 1 }}
                                    animate={isInView ? {
                                        y: [-150, -90, -90, -90, -90, -150], // Jumps down to middle of queue
                                        x: [0, 0, 0, 150, 200, 0], // Flies to CPU after P2
                                        opacity: [1, 1, 1, 1, 0, 1], // Fades out
                                        scale: [1, 1, 1, 1.2, 0, 1]
                                    } : {}}
                                    transition={{ duration: 10, repeat: Infinity, times: [0, 0.1, 0.4, 0.5, 0.6, 1], ease: 'easeInOut' }}
                                    style={{ bottom: 0 }}
                                >
                                    P3 (2ms)
                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-green-500 font-mono text-xs font-bold whitespace-nowrap">
                                        +0ms ✓
                                    </span>
                                </motion.div>
                            </div>

                            {/* The CPU running Quick Tasks */}
                            <div className="flex flex-col items-center relative ml-auto mr-8">
                                <CpuCore />

                                {/* Flash effect when tasks complete instantly */}
                                <motion.div
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full mix-blend-screen pointer-events-none"
                                    style={{ backgroundColor: 'var(--cpu-stroke)' }}
                                    animate={isInView ? {
                                        scale: [0.5, 1.5, 0.5, 0.5, 1.5, 0.5, 0.5],
                                        opacity: [0, 0.8, 0, 0, 0.8, 0, 0]
                                    } : {}}
                                    transition={{ duration: 10, repeat: Infinity, times: [0, 0.35, 0.4, 0.4, 0.55, 0.6, 1] }}
                                // Timings matched to P2 (0.35) and P3 (0.55) hitting the CPU
                                />
                            </div>
                        </div>

                    </div>
                </div>

                {/* The Summary Card */}
                <div className="w-full max-w-2xl mx-auto hand-drawn-border p-8 bg-[var(--tag-bg)] shadow-md transform -rotate-1">
                    <h3 className="font-architect text-3xl mb-6 text-center border-b-2 border-dashed border-[var(--tag-border)] pb-4">SJF Report Card</h3>

                    <table className="w-full text-left font-sans text-sm md:text-base border-collapse">
                        <thead>
                            <tr className="opacity-50 uppercase tracking-wider text-xs border-b border-[var(--grid-color)]">
                                <th className="pb-2 w-1/3">Metric</th>
                                <th className="pb-2 w-2/3">Performance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--grid-color)] divide-dashed">
                            <tr>
                                <td className="py-4 font-bold">Efficiency</td>
                                <td className="py-4 flex gap-1 text-green-500 font-bold">⭐⭐⭐⭐⭐ <span className="text-[var(--text-color)] opacity-60 ml-2 font-normal">(The best for speed!)</span></td>
                            </tr>
                            <tr>
                                <td className="py-4 font-bold">Fairness</td>
                                <td className="py-4 text-red-500 font-bold">🔴 Low <span className="text-[var(--text-color)] opacity-60 ml-2 font-normal">(Long tasks get bullied)</span></td>
                            </tr>
                            <tr>
                                <td className="py-4 font-bold">Complexity</td>
                                <td className="py-4 text-yellow-500 font-bold">🟡 Medium <span className="text-[var(--text-color)] opacity-60 ml-2 font-normal">(The OS has to predict task length)</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </NarrativeChapter>
    );
}
