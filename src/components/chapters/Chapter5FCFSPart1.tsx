import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { NarrativeChapter } from '../NarrativeChapter';
import { CpuCore } from '../CpuCore';

export function Chapter5FCFSPart1() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.5 });

    return (
        <NarrativeChapter
            id="chapter-5-part-1"
            headline="Chapter 5: First-Come, First-Served"
            subHeadline="Let's start at the beginning. No priorities, no complex math—just a simple line."
        >
            <div ref={ref} className="w-full max-w-6xl flex flex-col items-center gap-16 py-12">

                {/* Top Split: Theory vs Visualization */}
                <div className="w-full flex flex-col lg:flex-row items-stretch justify-between gap-12">

                    {/* The Left Side: Content */}
                    <div className="flex-1 space-y-8">
                        <div className="hand-drawn-border p-6 bg-[var(--bg-color)] border-[var(--cpu-stroke)] shadow-sm">
                            <h3 className="font-architect text-2xl mb-2 text-[var(--cpu-stroke)]">The Philosophy</h3>
                            <p className="font-sans opacity-80 text-sm leading-relaxed">
                                It is a <strong>Non-Preemptive</strong> algorithm. Once a process grabs the CPU, it doesn't let go until the work is done.
                            </p>
                        </div>

                        <div className="hand-drawn-border p-6 bg-[var(--bg-color)] border-[var(--cpu-stroke)] shadow-sm">
                            <h3 className="font-architect text-2xl mb-2 text-[var(--cpu-stroke)]">The Logic</h3>
                            <p className="font-sans opacity-80 text-sm leading-relaxed">
                                It’s exactly like a checkout counter at a grocery store. The order of execution is determined strictly by the <strong>Arrival Time</strong>.
                            </p>
                        </div>
                    </div>

                    {/* The Right Side: Canvas Action (Ideal Happy Flow) */}
                    <div className="flex-1 flex flex-col items-center justify-center relative hand-drawn-border p-8 border-[var(--grid-color)]">
                        <span className="absolute top-4 left-4 font-architect opacity-50 uppercase tracking-widest text-xs">The Ideal Flow</span>

                        <div className="flex items-center gap-12 mt-8 w-full max-w-md">
                            {/* The Ready Queue */}
                            <div className="flex flex-col gap-4 relative w-32">
                                <span className="font-architect text-center opacity-70 mb-2">Queue</span>

                                {/* P1 */}
                                <motion.div
                                    className="w-24 h-10 mx-auto bg-[var(--tag-bg)] border-2 border-[var(--tag-border)] rounded-full flex items-center justify-center font-bold text-sm shadow-sm"
                                    initial={{ x: 0, opacity: 1, scale: 1 }}
                                    animate={isInView ? {
                                        x: [0, 80, 80, 200],
                                        opacity: [1, 1, 1, 0],
                                        scale: [1, 0.9, 0.9, 0]
                                    } : {}}
                                    transition={{ duration: 6, repeat: Infinity, times: [0, 0.2, 0.4, 0.5], ease: 'easeIn' }}
                                >
                                    P1 (2ms)
                                </motion.div>

                                {/* P2 */}
                                <motion.div
                                    className="w-24 h-10 mx-auto bg-[var(--tag-bg)] border-2 border-[var(--tag-border)] rounded-full flex items-center justify-center font-bold text-sm shadow-sm"
                                    initial={{ x: 0, opacity: 1, scale: 1 }}
                                    animate={isInView ? {
                                        x: [0, 0, 80, 80, 200],
                                        opacity: [1, 1, 1, 1, 0],
                                        scale: [1, 1, 0.9, 0.9, 0],
                                        y: [0, -56, -56, -56, -56]
                                    } : {}}
                                    transition={{ duration: 6, repeat: Infinity, times: [0, 0.3, 0.5, 0.7, 0.8], ease: 'easeIn' }}
                                >
                                    P2 (3ms)
                                </motion.div>

                                {/* P3 */}
                                <motion.div
                                    className="w-24 h-10 mx-auto bg-[var(--tag-bg)] border-2 border-[var(--tag-border)] rounded-full flex items-center justify-center font-bold text-sm shadow-sm"
                                    initial={{ x: 0, opacity: 1, scale: 1 }}
                                    animate={isInView ? {
                                        x: [0, 0, 0, 80, 80, 200],
                                        opacity: [1, 1, 1, 1, 1, 0],
                                        scale: [1, 1, 1, 0.9, 0.9, 0],
                                        y: [0, -56, -112, -112, -112, -112]
                                    } : {}}
                                    transition={{ duration: 6, repeat: Infinity, times: [0, 0.3, 0.6, 0.8, 0.9, 1], ease: 'easeIn' }}
                                >
                                    P3 (2ms)
                                </motion.div>
                            </div>

                            {/* The CPU running quickly */}
                            <div className="flex flex-col items-center relative ml-8">
                                <CpuCore />

                                {/* Fake processing pulse */}
                                <motion.div
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full mix-blend-screen pointer-events-none"
                                    style={{ backgroundColor: 'var(--cpu-stroke)' }}
                                    animate={isInView ? {
                                        scale: [0.8, 1.2, 0.8, 0.8, 1.2, 0.8, 0.8, 1.2, 0.8],
                                        opacity: [0, 0.5, 0, 0, 0.5, 0, 0, 0.5, 0]
                                    } : {}}
                                    transition={{ duration: 6, repeat: Infinity, times: [0, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] }}
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </NarrativeChapter>
    );
}
