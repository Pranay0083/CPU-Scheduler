import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { NarrativeChapter } from '../NarrativeChapter';
import { CpuCore } from '../CpuCore';

export function Chapter8RoundRobin() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.5 });

    // State for the slice clock and context switch flash
    const [sliceTime, setSliceTime] = useState(2);
    const [isSwitching, setIsSwitching] = useState(false);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isInView) {
            let ticks = 0;
            interval = setInterval(() => {
                ticks++;
                // 1 tick = 100ms. A 2ms "slice" in our demo time is roughly 20 ticks (2 seconds)
                if (ticks % 20 === 0) {
                    // Trigger context switch
                    setIsSwitching(true);
                    setSliceTime(2);
                    setTimeout(() => setIsSwitching(false), 300); // 300ms flash
                } else if (ticks % 10 === 0) {
                    setSliceTime((prev) => Math.max(0, prev - 1));
                }
            }, 100);
        } else {
            setSliceTime(2);
            setIsSwitching(false);
        }
        return () => clearInterval(interval);
    }, [isInView]);

    return (
        <NarrativeChapter
            id="chapter-8-rr"
            headline="Chapter 8: Round Robin (RR)"
            subHeadline="Democracy in the CPU. No one is special; everyone gets a slice."
        >
            <div ref={ref} className="w-full max-w-6xl flex flex-col items-center gap-16 py-12">

                {/* Top Split: Theory vs Visualization */}
                <div className="w-full flex flex-col lg:flex-row items-stretch justify-between gap-12">

                    {/* The Left Side: Content */}
                    <div className="flex-1 space-y-6 flex flex-col justify-center">
                        <div className="hand-drawn-border p-6 bg-[var(--bg-color)] border-[var(--cpu-stroke)] shadow-sm">
                            <h3 className="font-architect text-2xl mb-2 text-[var(--cpu-stroke)]">The Time Slice (Quantum)</h3>
                            <p className="font-sans opacity-80 text-sm leading-relaxed mb-4">
                                Instead of letting a process run until it finishes, the OS gives <em>every</em> process a strict, equal amount of time.
                            </p>
                            <p className="font-sans opacity-80 text-sm leading-relaxed">
                                Let's say the slice is <strong>2ms</strong>. You get 2ms. If you aren't done, you go to the back of the line.
                            </p>
                        </div>

                        <div className="hand-drawn-border p-6 bg-[var(--tag-bg)] border-[var(--grid-color)] shadow-sm relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 w-16 h-16 bg-gray-500 opacity-10 rounded-full blur-xl" />
                            <h3 className="font-architect text-2xl mb-2 text-gray-700 dark:text-gray-300">The Context Switch</h3>
                            <p className="font-sans opacity-80 text-sm leading-relaxed">
                                Swapping processes isn't free. The OS has to save the state of the old process and load the new one. This causes a tiny delay known as a Context Switch.
                            </p>
                        </div>
                    </div>

                    {/* The Right Side: Canvas Action */}
                    <div className="flex-1 flex flex-col items-center justify-center relative hand-drawn-border p-8 border-[var(--grid-color)] overflow-hidden">

                        {/* Context Switch Flash Overlay */}
                        <motion.div
                            className="absolute inset-0 bg-gray-500/20 z-10 pointer-events-none"
                            animate={{ opacity: isSwitching ? 1 : 0 }}
                            transition={{ duration: 0.1 }}
                        />
                        {isSwitching && (
                            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-architect text-gray-500 text-sm tracking-widest z-20">
                                SAVING STATE...
                            </span>
                        )}

                        <span className="absolute top-4 left-4 font-architect opacity-50 uppercase tracking-widest text-xs z-20">Live Cycling</span>

                        <div className="flex items-center gap-12 mt-16 w-full h-[300px] relative z-20">

                            {/* Circular Path / Ready Queue */}
                            <div className="flex flex-col gap-4 relative w-32 h-full justify-center">

                                {/* P1 */}
                                <motion.div
                                    className="absolute w-24 h-8 bg-[var(--tag-bg)] border-2 border-[var(--tag-border)] rounded-full flex items-center justify-center font-bold text-xs shadow-md z-30"
                                    animate={isInView ? {
                                        x: [0, 200, 200, 0, 0, 0], // Queue -> CPU -> Queue (Back) -> Queue (Front)
                                        y: [0, 0, 0, 80, 40, 0],
                                        opacity: [1, 1, 1, 0.5, 0.8, 1],
                                        scale: [1, 1.1, 1.1, 0.9, 0.95, 1]
                                    } : {}}
                                    transition={{ duration: 6, repeat: Infinity, times: [0, 0.1, 0.33, 0.4, 0.66, 1], ease: 'linear' }}
                                    style={{ top: '30%' }}
                                >
                                    P1
                                </motion.div>

                                {/* P2 */}
                                <motion.div
                                    className="absolute w-24 h-8 bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-400 rounded-full flex items-center justify-center font-bold text-xs shadow-md z-20"
                                    animate={isInView ? {
                                        x: [0, 0, 0, 200, 200, 0], // Queue (Back) -> Queue (Front) -> CPU -> Queue
                                        y: [40, 0, 0, 0, 0, 80],
                                        opacity: [0.8, 1, 1, 1, 1, 0.5],
                                        scale: [0.95, 1, 1, 1.1, 1.1, 0.9]
                                    } : {}}
                                    transition={{ duration: 6, repeat: Infinity, times: [0, 0.33, 0.4, 0.5, 0.66, 0.73], ease: 'linear' }}
                                    style={{ top: '30%' }}
                                >
                                    P2
                                </motion.div>

                                {/* P3 */}
                                <motion.div
                                    className="absolute w-24 h-8 bg-green-100 dark:bg-green-900/30 border-2 border-green-400 rounded-full flex items-center justify-center font-bold text-xs shadow-md z-10"
                                    animate={isInView ? {
                                        x: [0, 0, 0, 0, 0, 200], // Queue -> Queue -> Queue -> CPU
                                        y: [80, 40, 0, 0, 0, 0],
                                        opacity: [0.5, 0.8, 1, 1, 1, 1],
                                        scale: [0.9, 0.95, 1, 1, 1, 1.1]
                                    } : {}}
                                    transition={{ duration: 6, repeat: Infinity, times: [0, 0.33, 0.66, 0.73, 0.9, 1], ease: 'linear' }}
                                    style={{ top: '30%' }}
                                >
                                    P3
                                </motion.div>

                                {/* Curved return arrow */}
                                <svg className="absolute top-[80px] left-[10px] w-64 h-32 pointer-events-none opacity-20" overflow="visible">
                                    <path
                                        d="M 220, 20 Q 220, 100 100, 100 T -20, 60"
                                        fill="none"
                                        stroke="var(--cpu-stroke)"
                                        strokeWidth="2"
                                        strokeDasharray="5,5"
                                        markerEnd="url(#arrowhead)"
                                    />
                                    <defs>
                                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                            <polygon points="0 0, 10 3.5, 0 7" fill="var(--cpu-stroke)" />
                                        </marker>
                                    </defs>
                                </svg>

                            </div>

                            {/* The CPU running Quick Tasks */}
                            <div className="flex flex-col items-center relative ml-auto mr-8">

                                {/* The Circular Clock Overlay */}
                                <div className="absolute -top-16 flex flex-col items-center justify-center w-12 h-12 rounded-full border-2 border-[var(--cpu-stroke)] bg-[var(--bg-color)] shadow-sm z-30">
                                    <span className="font-mono text-xs font-bold">{sliceTime}ms</span>
                                    {/* Clock hand sweeping */}
                                    <motion.div
                                        className="absolute top-1/2 left-1/2 w-[2px] h-[18px] bg-red-400 origin-bottom transform -translate-x-1/2 -translate-y-full"
                                        animate={{ rotate: isSwitching ? 0 : 360 }}
                                        transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                                    />
                                </div>

                                <CpuCore />
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </NarrativeChapter>
    );
}
