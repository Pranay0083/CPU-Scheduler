import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { NarrativeChapter } from '../NarrativeChapter';

export function Chapter4Checklist() {
    // Refs for each section to trigger background effects
    const throughputRef = useRef(null);
    const responseTimeRef = useRef(null);
    const utilizationRef = useRef(null);

    const isThroughputInView = useInView(throughputRef, { amount: 0.3 });
    const isResponseTimeInView = useInView(responseTimeRef, { amount: 0.3 });
    const isUtilizationInView = useInView(utilizationRef, { amount: 0.3 });

    return (
        <div className="relative w-full overflow-hidden">
            {/* --- DYNAMIC BACKGROUND LAYER --- */}
            <div className="absolute inset-0 z-0 pointer-events-none transition-all duration-1000">

                {/* 1. Throughput Effect: Fast moving grid dots simulating data flow */}
                <motion.div
                    className="absolute inset-0 opacity-0 transition-opacity duration-700"
                    style={{
                        backgroundImage: 'radial-gradient(var(--cpu-stroke) 1px, transparent 0)',
                        backgroundSize: '20px 20px',
                        opacity: isThroughputInView ? 0.15 : 0
                    }}
                    animate={isThroughputInView ? { backgroundPosition: ['0px 0px', '20px 20px'] } : {}}
                    transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
                />

                {/* 2. Response Time Effect: Still, happy PIDs in the background */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-around opacity-0 transition-opacity duration-700 pt-32"
                    style={{ opacity: isResponseTimeInView ? 1 : 0 }}
                >
                    {[1, 2, 3, 4, 5].map((i) => (
                        <motion.div
                            key={i}
                            className="w-12 h-12 rounded-full border-2 border-green-400 bg-green-100 dark:bg-green-900/30 flex items-center justify-center font-bold text-green-600 dark:text-green-400 opacity-20"
                            animate={isResponseTimeInView ? { y: [0, -10, 0] } : {}}
                            transition={{ duration: 3, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
                        >
                            :)
                        </motion.div>
                    ))}
                </motion.div>

                {/* 3. Utilization Effect: Glowing heat map (Warm Cream/Orange) */}
                <div
                    className="absolute inset-0 transition-opacity duration-1000 mix-blend-multiply dark:mix-blend-screen"
                    style={{
                        background: 'radial-gradient(circle at 50% 80%, rgba(251, 146, 60, 0.15) 0%, transparent 60%)',
                        opacity: isUtilizationInView ? 1 : 0
                    }}
                />
            </div>

            {/* --- CONTENT LAYER --- */}
            <div className="relative z-10 transition-colors duration-1000" style={{
                backgroundColor: isUtilizationInView ? 'rgba(255, 247, 237, 0.02)' : 'transparent'
            }}>
                <NarrativeChapter
                    id="chapter-4"
                    headline="Chapter 4: The Checklist"
                    subHeadline="When you design an OS algorithm, you are juggling these three things."
                >
                    <div className="w-full max-w-4xl flex flex-col items-center gap-24 py-12">

                        <div ref={throughputRef} className="w-full relative p-8 hand-drawn-border border-[var(--cpu-stroke)] bg-[var(--bg-color)] transition-colors duration-500 shadow-sm flex flex-col md:flex-row items-center justify-between group">
                            <div className="flex-1">
                                <h3 className="font-architect text-3xl mb-2 text-[var(--cpu-stroke)]">High Throughput</h3>
                                <p className="font-sans opacity-80 text-lg">How many tasks can we finish in a minute? Let the data flow!</p>
                            </div>
                            <div className="mt-4 md:mt-0 opacity-50 group-hover:opacity-100 transition-opacity duration-300 font-architect text-4xl">
                                Tasks / Time
                            </div>
                        </div>

                        <div ref={responseTimeRef} className="w-full relative p-8 hand-drawn-border border-[var(--cpu-stroke)] bg-[var(--bg-color)] transition-colors duration-500 shadow-sm flex flex-col md:flex-row items-center justify-between group">
                            <div className="flex-1">
                                <h3 className="font-architect text-3xl mb-2 text-[var(--cpu-stroke)]">Low Wait Time (Response)</h3>
                                <p className="font-sans opacity-80 text-lg">How fast can we give the user the first sign of progress? Happy processes don't wait.</p>
                            </div>
                            <div className="mt-4 md:mt-0 opacity-50 group-hover:opacity-100 transition-opacity duration-300 font-architect text-4xl text-green-500">
                                0.01ms
                            </div>
                        </div>

                        <div ref={utilizationRef} className="w-full relative p-8 hand-drawn-border border-[var(--cpu-stroke)] bg-[var(--bg-color)] transition-colors duration-500 shadow-sm flex flex-col md:flex-row items-center justify-between group">
                            <div className="flex-1">
                                <h3 className="font-architect text-3xl mb-2 text-orange-500">High Utilization</h3>
                                <p className="font-sans opacity-80 text-lg">Can we keep the CPU burning hot between 40% and 90% at all times?</p>
                            </div>
                            <div className="mt-4 md:mt-0 w-48 h-4 bg-[var(--grid-color)] rounded-full overflow-hidden relative border border-orange-200 dark:border-orange-900">
                                <motion.div
                                    className="absolute top-0 left-0 h-full bg-orange-500"
                                    animate={{ width: ["40%", "90%", "65%", "85%", "40%"] }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                                />
                            </div>
                        </div>

                    </div>
                </NarrativeChapter>
            </div>
        </div>
    );
}
