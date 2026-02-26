import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { NarrativeChapter } from '../NarrativeChapter';
import { CpuCore } from '../CpuCore';

export function Chapter5FCFSPart2() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.5 });
    const [waitTimer, setWaitTimer] = useState(0);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isInView) {
            setWaitTimer(0);
            let ticks = 0;
            interval = setInterval(() => {
                // Only run for the duration of P4's execution (approx 6 seconds based on animation)
                if (ticks < 60) {
                    setWaitTimer((prev) => prev + 1);
                    ticks++;
                }
            }, 100); // Fast counting effect
        } else {
            setWaitTimer(0);
        }
        return () => clearInterval(interval);
    }, [isInView]);

    return (
        <NarrativeChapter
            id="chapter-5-part-2"
            headline="The Convoy Effect"
            subHeadline="What happens when one process refuses to leave the CPU?"
        >
            <div ref={ref} className="w-full max-w-6xl flex flex-col items-center gap-16 py-12">

                {/* Top Split: Theory vs Visualization */}
                <div className="w-full flex flex-col lg:flex-row items-stretch justify-between gap-12">

                    {/* The Left Side: Content */}
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="hand-drawn-border p-6 bg-[var(--tag-bg)] border-red-400 shadow-sm relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 w-16 h-16 bg-red-400 opacity-10 rounded-full blur-xl" />
                            <h3 className="font-architect text-2xl mb-2 text-red-500">The Fatal Flaw</h3>
                            <p className="font-sans opacity-80 text-sm leading-relaxed mb-4">
                                If a massive, CPU-hungry process arrives first, every small task behind it is stuck waiting.
                            </p>
                            <p className="font-sans opacity-80 text-sm leading-relaxed">
                                Even if the smaller tasks only need a millisecond to finish, they are forced to wait the entire duration of the massive task. This severely hurts the overall average waiting time.
                            </p>
                        </div>
                    </div>

                    {/* The Right Side: Canvas Action */}
                    <div className="flex-1 flex flex-col items-center justify-center relative hand-drawn-border p-8 border-[var(--grid-color)]">
                        <span className="absolute top-4 left-4 font-architect opacity-50 uppercase tracking-widest text-xs">Live Visualization</span>

                        <div className="flex items-center gap-12 mt-8">
                            {/* The Ready Queue */}
                            <div className="flex flex-col gap-4 relative">
                                <span className="font-architect text-center opacity-70 mb-2">Queue (Waiting)</span>

                                {/* P5 - Tiny Sliver */}
                                <div className="relative">
                                    <motion.div
                                        className="w-32 h-8 bg-[var(--tag-bg)] border-2 border-[var(--tag-border)] rounded-full flex items-center justify-center font-bold text-sm shadow-sm"
                                        animate={isInView ? { x: [-2, 2, -2, 2, 0], y: [-1, 1, 0] } : {}}
                                        transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
                                    >
                                        P5 (1ms)
                                    </motion.div>
                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-red-500 font-mono text-xs font-bold whitespace-nowrap">
                                        +{waitTimer}ms 🔴
                                    </span>
                                </div>

                                {/* P6 - Tiny Sliver */}
                                <div className="relative">
                                    <motion.div
                                        className="w-32 h-8 bg-[var(--tag-bg)] border-2 border-[var(--tag-border)] rounded-full flex items-center justify-center font-bold text-sm shadow-sm"
                                        animate={isInView ? { x: [2, -2, 2, -2, 0], y: [1, -1, 0] } : {}}
                                        transition={{ duration: 0.4, repeat: Infinity, ease: 'linear' }}
                                    >
                                        P6 (2ms)
                                    </motion.div>
                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-red-500 font-mono text-xs font-bold whitespace-nowrap">
                                        +{waitTimer}ms 🔴
                                    </span>
                                </div>
                            </div>

                            {/* The CPU running P4 */}
                            <div className="flex flex-col items-center relative">
                                <CpuCore />

                                {/* P4 - Huge Block */}
                                <motion.div
                                    className="absolute top-1/2 left-1/2 mt-4 z-20 overflow-hidden bg-[var(--bg-color)] border-4 border-[var(--cpu-stroke)] rounded-xl flex items-center justify-center font-bold text-lg shadow-lg"
                                    style={{ width: '120px', height: '120px', originX: 0.5, originY: 0.5, transform: 'translate(-50%, -50%)' }}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={isInView ? { scale: 1, opacity: 1 } : {}}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className="relative w-full h-full flex items-center justify-center z-10">
                                        P4 (99ms)
                                    </div>
                                    {/* Filling up progress effect */}
                                    <motion.div
                                        className="absolute bottom-0 left-0 w-full bg-[var(--cpu-stroke)] opacity-20"
                                        initial={{ height: '0%' }}
                                        animate={isInView ? { height: '100%' } : { height: '0%' }}
                                        transition={{ duration: 6, ease: 'linear', repeat: Infinity }}
                                    />
                                </motion.div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* The Summary Card */}
                <div className="w-full max-w-2xl mx-auto hand-drawn-border p-8 bg-[var(--tag-bg)] shadow-md transform rotate-1">
                    <h3 className="font-architect text-3xl mb-6 text-center border-b-2 border-dashed border-[var(--tag-border)] pb-4">FCFS Report Card</h3>

                    <table className="w-full text-left font-sans text-sm md:text-base border-collapse">
                        <thead>
                            <tr className="opacity-50 uppercase tracking-wider text-xs border-b border-[var(--grid-color)]">
                                <th className="pb-2 w-1/3">Metric</th>
                                <th className="pb-2 w-2/3">Performance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--grid-color)] divide-dashed">
                            <tr>
                                <td className="py-4 font-bold">Simplicity</td>
                                <td className="py-4 flex gap-1 text-yellow-500">⭐⭐⭐⭐⭐ <span className="text-[var(--text-color)] opacity-60 ml-2 font-normal">(Easiest to build)</span></td>
                            </tr>
                            <tr>
                                <td className="py-4 font-bold">Fairness</td>
                                <td className="py-4 flex gap-1 text-yellow-500">⭐⭐⭐ <span className="text-[var(--text-color)] opacity-60 ml-2 font-normal">(Fair in order, limits short tasks)</span></td>
                            </tr>
                            <tr>
                                <td className="py-4 font-bold">Wait Time</td>
                                <td className="py-4 text-red-500 font-bold">🔴 High <span className="text-[var(--text-color)] opacity-60 ml-2 font-normal">(Due to the Convoy Effect)</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </NarrativeChapter>
    );
}
