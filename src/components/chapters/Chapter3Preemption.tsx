import React from 'react';
import { motion, useInView } from 'framer-motion';
import { NarrativeChapter } from '../NarrativeChapter';
import { CpuCore } from '../CpuCore';
import { PidTag } from '../PidTag';

export function Chapter3Preemption() {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.5 });

    return (
        <NarrativeChapter
            id="chapter-3"
            headline="Chapter 3: Preemption"
            subHeadline="The biggest fork in the road. What happens when a VIP task arrives?"
        >
            <div ref={ref} className="w-full max-w-5xl flex flex-col md:flex-row items-stretch justify-center gap-16 py-12">

                {/* Non-Preemptive Column */}
                <div className="flex-1 flex flex-col items-center">
                    <div className="text-center mb-8">
                        <h3 className="font-architect text-3xl mb-2">1. Non-Preemptive</h3>
                        <p className="font-sans opacity-70 text-sm italic">The Committed</p>
                    </div>

                    <div className="flex-1 w-full hand-drawn-border p-6 flex flex-col items-center border-[var(--grid-color)] relative transition-colors duration-500">
                        <p className="font-sans text-sm text-center mb-8 leading-relaxed opacity-80">
                            Once a process starts, it keeps the CPU until it’s totally finished. No interruptions.
                        </p>
                        <p className="font-architect text-center text-[var(--cpu-stroke)] bg-[var(--grid-color)] bg-opacity-20 px-4 py-1 rounded-full text-sm mb-12">
                            Vibe: A traditional grocery store line.
                        </p>

                        <div className="relative">
                            <CpuCore />
                            <motion.div
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-4 z-20 pointer-events-none"
                                animate={isInView ? { scale: [1, 1.05, 1] } : {}}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <PidTag pid={4201} state="running" />
                            </motion.div>

                            {/* The VIP waiting */}
                            <motion.div
                                className="absolute -top-16 -right-16 z-30"
                                animate={isInView ? { x: [0, -10, 0] } : {}}
                                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <div className="relative">
                                    <PidTag pid={9999} state="ready" />
                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-red-500 font-bold text-xs uppercase tracking-widest whitespace-nowrap">
                                        VIP WAITING
                                    </span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Preemptive Column */}
                <div className="flex-1 flex flex-col items-center">
                    <div className="text-center mb-8">
                        <h3 className="font-architect text-3xl mb-2">2. Preemptive</h3>
                        <p className="font-sans opacity-70 text-sm italic">The Agile</p>
                    </div>

                    <div className="flex-1 w-full hand-drawn-border p-6 flex flex-col items-center border-[var(--cpu-stroke)] relative shadow-lg transition-colors duration-500">
                        <p className="font-sans text-sm text-center mb-8 leading-relaxed opacity-80">
                            The OS can pause a running task at any moment to give the CPU to a more "important" or "shorter" task.
                        </p>
                        <p className="font-architect text-center text-white bg-red-500 bg-opacity-10 px-4 py-1 rounded-full text-sm mb-12">
                            Vibe: An Emergency Room. Critical goes first.
                        </p>

                        <div className="relative">
                            <CpuCore />

                            {/* Evicted task */}
                            <motion.div
                                className="absolute top-1/2 left-1/2 mt-4 z-20 pointer-events-none"
                                initial={{ x: '-50%', y: '-50%', opacity: 1, scale: 1 }}
                                animate={isInView ? {
                                    x: ['-50%', '50%', '50%', '50%', '-50%'],
                                    y: ['-50%', '-50%', '-150%', '-150%', '-50%'],
                                    opacity: [1, 0.5, 0.5, 0.5, 1],
                                    scale: [1, 0.8, 0.8, 0.8, 1]
                                } : {}}
                                transition={{ duration: 4, repeat: Infinity, times: [0, 0.2, 0.4, 0.8, 1], ease: 'backInOut' }}
                            >
                                <PidTag pid={4201} state="waiting" />
                                <motion.span
                                    className="absolute -top-6 left-1/2 -translate-x-1/2 text-[var(--cpu-stroke)] font-bold text-xs uppercase"
                                    animate={isInView ? { opacity: [0, 1, 1, 0, 0] } : {}}
                                    transition={{ duration: 4, repeat: Infinity, times: [0, 0.2, 0.8, 0.9, 1] }}
                                >
                                    EVICTED
                                </motion.span>
                            </motion.div>

                            {/* VIP task sliding into CPU */}
                            <motion.div
                                className="absolute top-1/2 left-1/2 mt-4 z-30 pointer-events-none"
                                initial={{ x: '-150%', y: '-150%', opacity: 0 }}
                                animate={isInView ? {
                                    x: ['-150%', '-50%', '-50%', '-50%', '-150%'],
                                    y: ['-150%', '-50%', '-50%', '-50%', '-150%'],
                                    opacity: [0, 1, 1, 1, 0],
                                    scale: [1.2, 1, 1, 1, 1.2]
                                } : {}}
                                transition={{ duration: 4, repeat: Infinity, times: [0, 0.25, 0.75, 0.9, 1], ease: 'backInOut' }}
                            >
                                <div className="relative shadow-[0_0_20px_rgba(239,68,68,0.4)] rounded-full">
                                    <PidTag pid={9999} state="running" />
                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-red-500 font-bold text-xs uppercase tracking-widest whitespace-nowrap">
                                        VIP RUNNING
                                    </span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

            </div>
        </NarrativeChapter>
    );
}
