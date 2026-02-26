import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { NarrativeChapter } from '../NarrativeChapter';
import { CpuCore } from '../CpuCore';

export function Chapter9Priority() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.5 });

    return (
        <NarrativeChapter
            id="chapter-9-priority"
            headline="Chapter 9: Priority Scheduling"
            subHeadline="Sometimes, all tasks are not created equal. Enter the VIPs."
        >
            <div ref={ref} className="w-full max-w-6xl flex flex-col items-center gap-16 py-12">

                {/* Top Split: Theory vs Visualization */}
                <div className="w-full flex flex-col lg:flex-row items-stretch justify-between gap-12">

                    {/* The Left Side: Content */}
                    <div className="flex-1 space-y-6 flex flex-col justify-center">
                        <div className="hand-drawn-border p-6 bg-[var(--bg-color)] border-[var(--cpu-stroke)] shadow-sm">
                            <h3 className="font-architect text-2xl mb-2 text-[var(--cpu-stroke)]">The Class System</h3>
                            <p className="font-sans opacity-80 text-sm leading-relaxed mb-4">
                                Every process is assigned a "Priority Score." The OS always runs the process with the highest priority first, regardless of when it arrived or how long it takes.
                            </p>
                        </div>

                        <div className="hand-drawn-border p-6 bg-[var(--tag-bg)] border-red-400 shadow-sm relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 w-16 h-16 bg-red-500 opacity-10 rounded-full blur-xl" />
                            <h3 className="font-architect text-2xl mb-2 text-red-600 dark:text-red-400">Preemptive vs Non-Preemptive</h3>
                            <ul className="font-sans opacity-80 text-sm leading-relaxed space-y-2 list-disc list-inside">
                                <li><strong>Non-Preemptive:</strong> The VIP waits for the current task to finish, but jumps to the absolute front of the line.</li>
                                <li><strong>Preemptive:</strong> The VIP kicks the current task out of the CPU immediately!</li>
                            </ul>
                        </div>
                    </div>

                    {/* The Right Side: Canvas Action */}
                    <div className="flex-1 flex flex-col items-center justify-center relative hand-drawn-border p-8 border-[var(--grid-color)] overflow-hidden">

                        <span className="absolute top-4 left-4 font-architect opacity-50 uppercase tracking-widest text-xs z-20">VIP Override</span>

                        <div className="flex items-center gap-12 mt-16 w-full h-[300px] relative z-20">

                            {/* The Arrival Zone / Ready Queue */}
                            <div className="flex flex-col gap-4 relative w-32 h-full justify-center">
                                <span className="absolute -top-12 w-full font-architect text-center opacity-70 border-b border-dashed border-[var(--grid-color)] pb-2">Queue</span>

                                {/* Standard Process (Blue) */}
                                <motion.div
                                    className="absolute w-24 h-8 bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-400 rounded-full flex items-center justify-center font-bold text-xs shadow-md z-10"
                                    animate={isInView ? {
                                        x: [0, 0, 0, 200, 200], // Waits in queue, then goes to CPU after Red finishes
                                        y: [0, 0, 0, 0, 0],
                                        opacity: [1, 1, 1, 1, 0],
                                        scale: [1, 1, 1, 1.2, 0]
                                    } : {}}
                                    transition={{ duration: 6, repeat: Infinity, times: [0, 0.4, 0.5, 0.8, 1], ease: 'easeInOut' }}
                                    style={{ top: '50%', marginTop: '-16px' }}
                                >
                                    P2 (Pri: 5)
                                </motion.div>

                                {/* VIP Process (Red) - Arrives late but cuts the line */}
                                <motion.div
                                    className="absolute w-28 h-10 bg-red-100 dark:bg-red-900/30 border-2 border-red-500 rounded-full flex items-center justify-center font-bold text-sm shadow-md z-30"
                                    initial={{ x: -150, opacity: 0 }}
                                    animate={isInView ? {
                                        x: [-150, 0, 0, 200, 200, 200], // Arrives -> Queue (Front) -> CPU -> CPU -> Done
                                        y: [-50, -50, -50, -50, -50, -50], // Hovers above P2
                                        opacity: [0, 1, 1, 1, 0, 0],
                                        scale: [1, 1, 1.1, 1.3, 0, 0]
                                    } : {}}
                                    transition={{ duration: 6, repeat: Infinity, times: [0, 0.2, 0.3, 0.4, 0.5, 1], ease: 'easeInOut' }}
                                    style={{ top: '50%', marginTop: '-16px' }}
                                >
                                    P1 (Pri: 1)
                                    <span className="absolute -top-6 text-red-500 font-mono text-xs font-bold whitespace-nowrap">
                                        Line Cutter!
                                    </span>
                                </motion.div>

                            </div>

                            {/* The CPU */}
                            <div className="flex flex-col items-center relative ml-auto mr-8">
                                <CpuCore />

                                {/* Flash effect for VIP */}
                                <motion.div
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full mix-blend-screen pointer-events-none"
                                    style={{ backgroundColor: 'var(--tag-border)' }}
                                    animate={isInView ? {
                                        scale: [0.5, 1.2, 0.5],
                                        opacity: [0, 0.5, 0]
                                    } : {}}
                                    transition={{ duration: 6, repeat: Infinity, times: [0.4, 0.45, 0.5] }}
                                />

                                {/* Flash effect for Standard */}
                                <motion.div
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full mix-blend-screen pointer-events-none"
                                    style={{ backgroundColor: 'var(--cpu-stroke)' }}
                                    animate={isInView ? {
                                        scale: [0.5, 1.2, 0.5],
                                        opacity: [0, 0.5, 0]
                                    } : {}}
                                    transition={{ duration: 6, repeat: Infinity, times: [0.95, 0.98, 1] }}
                                />
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </NarrativeChapter>
    );
}
