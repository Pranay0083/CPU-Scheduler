import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { NarrativeChapter } from '../NarrativeChapter';
import { CpuCore } from '../CpuCore';
import { PidTag } from '../PidTag';

export function Chapter2Rulebook() {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.5 });
    const [completedPids, setCompletedPids] = useState<number[]>([]);

    useEffect(() => {
        if (isInView) {
            const timer1 = setTimeout(() => setCompletedPids([1042]), 1000);
            const timer2 = setTimeout(() => setCompletedPids([1042, 3110]), 3000);
            const timer3 = setTimeout(() => setCompletedPids([1042, 3110, 8080]), 5000);
            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
                clearTimeout(timer3);
            };
        } else {
            setCompletedPids([]);
        }
    }, [isInView]);

    return (
        <NarrativeChapter
            id="chapter-2"
            headline="Chapter 2: The Rulebook"
            subHeadline="To know if a scheduler is 'good', we measure its performance using four vital signs."
        >
            <div ref={ref} className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-12 py-12">

                {/* The Definitions Panel */}
                <div className="flex-1 space-y-6">
                    <div className="hand-drawn-border p-6 bg-[var(--tag-bg)] border-[var(--tag-border)] transition-colors duration-500">
                        <h3 className="font-architect text-2xl mb-2 text-[var(--tag-border)]">Arrival Time</h3>
                        <p className="font-sans opacity-80 text-sm">When did the task show up to the party?</p>
                    </div>
                    <div className="hand-drawn-border p-6 bg-[var(--tag-bg)] border-[var(--tag-border)] transition-colors duration-500">
                        <h3 className="font-architect text-2xl mb-2 text-[var(--tag-border)]">Burst Time</h3>
                        <p className="font-sans opacity-80 text-sm">How much actual work (time) does this task need?</p>
                    </div>
                    <div className="hand-drawn-border p-6 bg-[var(--tag-bg)] border-[var(--tag-border)] transition-colors duration-500">
                        <h3 className="font-architect text-2xl mb-2 text-[var(--tag-border)]">Waiting Time</h3>
                        <p className="font-sans opacity-80 text-sm">How long did it sit in the Ready Queue before its turn?</p>
                    </div>
                    <div className="hand-drawn-border p-6 bg-[var(--tag-bg)] border-[var(--tag-border)] transition-colors duration-500">
                        <h3 className="font-architect text-2xl mb-2 text-[var(--tag-border)]">Turnaround Time</h3>
                        <p className="font-sans opacity-80 text-sm">The total "Life Span" of the process (Arrival to Completion).</p>
                    </div>
                </div>

                {/* The Animated Scoreboard */}
                <div className="flex-1 flex flex-col items-center">
                    <div className="relative mb-8">
                        <CpuCore />
                        <motion.div
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-4 z-20 pointer-events-none"
                            animate={isInView ? { scale: [1, 1.1, 1], opacity: [1, 1, 0] } : {}}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <PidTag pid={4201} state="running" />
                        </motion.div>
                    </div>

                    <div className="w-full max-w-sm hand-drawn-border p-6 bg-[var(--bg-color)] border-[var(--grid-color)] transition-colors duration-500 shadow-md">
                        <h3 className="font-architect text-2xl mb-4 text-center tracking-widest uppercase border-b-2 border-dashed border-[var(--grid-color)] pb-2">
                            process table
                        </h3>

                        <div className="flex flex-col gap-3 font-mono text-sm">
                            <div className="flex justify-between font-bold opacity-50 uppercase text-xs mb-2">
                                <span>PID</span>
                                <span>Burst</span>
                                <span>Turnaround</span>
                            </div>

                            {[
                                { id: 1042, burst: 4, ta: 12 },
                                { id: 3110, burst: 8, ta: 22 },
                                { id: 8080, burst: 2, ta: 25 },
                            ].map((proc) => (
                                <motion.div
                                    key={proc.id}
                                    className="flex justify-between items-center py-2"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: completedPids.includes(proc.id) ? 1 : 0.3, x: completedPids.includes(proc.id) ? 0 : -10 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <span className="font-bold">[{proc.id}]</span>
                                    <span>{proc.burst}ms</span>
                                    <span className={completedPids.includes(proc.id) ? 'text-green-500 dark:text-green-400' : 'opacity-0'}>
                                        {proc.ta}ms ✓
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </NarrativeChapter>
    );
}
