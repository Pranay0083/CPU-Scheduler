import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { NarrativeChapter } from '../NarrativeChapter';
import { CpuCore } from '../CpuCore';

export function Chapter11MLFQ() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.3 });

    return (
        <NarrativeChapter
            id="chapter-11-mlfq"
            headline="Chapter 11: Multi-Level Feedback Queue (MLFQ)"
            subHeadline="What if the scheduler was smart enough to learn?"
        >
            <div ref={ref} className="w-full max-w-7xl flex flex-col items-center gap-16 py-12">

                {/* Top Split: Theory vs Visualization */}
                <div className="w-full flex flex-col xl:flex-row items-stretch justify-between gap-12">

                    {/* The Left Side: Content */}
                    <div className="flex-1 space-y-6 flex flex-col justify-center min-w-[300px]">
                        <div className="hand-drawn-border p-6 bg-[var(--bg-color)] border-[var(--cpu-stroke)] shadow-sm">
                            <h3 className="font-architect text-2xl mb-2 text-[var(--cpu-stroke)]">The Philosophy</h3>
                            <p className="font-sans opacity-80 text-sm leading-relaxed mb-4">
                                MLFQ is the "Swiss Army Knife" of schedulers. It balances the need for low response time for interactive tasks (like your mouse) with high throughput for heavy tasks (like a video export).
                            </p>
                            <h3 className="font-architect text-2xl mb-2 text-[var(--cpu-stroke)] mt-6">The Structure</h3>
                            <p className="font-sans opacity-80 text-sm leading-relaxed">
                                Instead of one line, the canvas now has three horizontal lanes (High, Medium, and Low Priority).
                            </p>
                        </div>

                        <div className="hand-drawn-border p-6 bg-[var(--tag-bg)] border-[var(--grid-color)] shadow-sm relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 w-16 h-16 bg-[var(--cpu-stroke)] opacity-10 rounded-full blur-xl" />
                            <h3 className="font-architect text-2xl mb-4 text-[var(--cpu-stroke)]">The Dynamic Rules</h3>
                            <ul className="font-sans opacity-80 text-sm leading-relaxed space-y-3 list-disc list-inside">
                                <li><strong>The Trial:</strong> Every new task starts in the Top Lane (Highest Priority).</li>
                                <li><strong className="text-red-500">The Penalty:</strong> If a task uses up its entire "Time Slice" without finishing, it is "demoted" to the lane below.</li>
                                <li><strong className="text-green-500">The Reward:</strong> If a task finishes quickly or waits for I/O, it stays in the fast lane.</li>
                                <li><strong>The Priority Rule:</strong> The CPU always finishes everything in the Top Lane before it even looks at the middle or bottom lanes.</li>
                            </ul>
                        </div>
                    </div>

                    {/* The Right Side: Canvas Action */}
                    <div className="flex-[2] flex flex-col relative hand-drawn-border p-8 border-[var(--grid-color)] overflow-hidden min-h-[500px]">

                        {/* The Horizontal Lanes Background */}
                        <div className="absolute inset-0 flex flex-col items-start justify-center pl-8 pt-12 pr-40 z-0">

                            {/* High Priority Lane Q0 */}
                            <div className="w-full h-1/3 border-b-2 border-dashed border-[var(--grid-color)] relative flex items-center bg-green-500/5">
                                <span className="absolute -left-4 top-1/2 -translate-y-1/2 -rotate-90 font-architect text-xs text-green-500 font-bold tracking-widest uppercase">High (Q0)</span>
                            </div>

                            {/* Medium Priority Lane Q1 */}
                            <div className="w-full h-1/3 border-b-2 border-dashed border-[var(--grid-color)] relative flex items-center bg-yellow-500/5">
                                <span className="absolute -left-4 top-1/2 -translate-y-1/2 -rotate-90 font-architect text-xs text-yellow-500 font-bold tracking-widest uppercase">Med (Q1)</span>
                            </div>

                            {/* Low Priority Lane Q2 */}
                            <div className="w-full h-1/3 border-b-2 border-dashed border-[var(--grid-color)] relative flex items-center bg-red-500/5">
                                <span className="absolute -left-4 top-1/2 -translate-y-1/2 -rotate-90 font-architect text-xs text-red-500 font-bold tracking-widest uppercase">Low (Q2)</span>
                            </div>

                        </div>

                        <div className="flex items-center gap-12 mt-8 w-full h-full relative z-20">

                            {/* The Lanes Area */}
                            <div className="flex-1 h-full relative pl-8">

                                {/* Process 1: The CPU Hog (Drops down over time) */}
                                <motion.div
                                    className="absolute left-16 w-32 h-14 bg-[var(--bg-color)] border-4 border-red-500 rounded-lg flex items-center justify-center font-bold text-sm shadow-xl z-30 flex-col"
                                    initial={{ top: '16%' }}
                                    animate={isInView ? {
                                        top: ['16%', '16%', '49%', '49%', '82%', '82%'], // Drops: High -> Med -> Low
                                    } : {}}
                                    transition={{ duration: 12, repeat: Infinity, times: [0, 0.2, 0.3, 0.5, 0.6, 1], ease: 'easeInOut' }}
                                    style={{ marginTop: '-28px' }}
                                >
                                    P1 (Heavy)
                                    {/* Sinking "Weight" visual */}
                                    <div className="absolute -bottom-8 flex gap-2 opacity-50">
                                        <div className="w-1 h-6 bg-red-500 rounded animate-bounce" style={{ animationDelay: '0s' }} />
                                        <div className="w-1 h-6 bg-red-500 rounded animate-bounce" style={{ animationDelay: '0.2s' }} />
                                        <div className="w-1 h-6 bg-red-500 rounded animate-bounce" style={{ animationDelay: '0.4s' }} />
                                    </div>
                                    <motion.span
                                        className="text-[10px] text-red-500 font-mono absolute -bottom-12"
                                        animate={{ opacity: [0, 1, 0, 1, 0, 0] }}
                                        transition={{ duration: 12, repeat: Infinity, times: [0, 0.2, 0.3, 0.6, 0.7, 1] }}
                                    >
                                        Demoted! ↓
                                    </motion.span>
                                </motion.div>

                                {/* Process 2 & 3: The Interactive tasks (Fast Lane flashing by) */}
                                {[1, 2].map((i) => (
                                    <motion.div
                                        key={`int-${i}`}
                                        className="absolute left-0 w-24 h-10 bg-[var(--tag-bg)] border-2 border-green-500 rounded-lg flex items-center justify-center font-bold text-xs shadow-md z-20"
                                        initial={{ top: '16%' }}
                                        animate={isInView ? {
                                            left: ['-50%', '130%'], // Fly across the fast lane
                                            opacity: [0, 1, 0],
                                            scale: [0.8, 1, 0.8]
                                        } : {}}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: i * 1.5,
                                            ease: 'linear'
                                        }}
                                        style={{ marginTop: '-20px' }}
                                    >
                                        Int. {i}
                                        {/* Speed Lines */}
                                        <div className="absolute -left-8 flex flex-col gap-1 w-6 overflow-hidden">
                                            <div className="h-[2px] w-full bg-green-400 opacity-50 transform -translate-x-full animate-[slide_0.5s_linear_infinite]" />
                                            <div className="h-[2px] w-3/4 bg-green-400 opacity-50 transform -translate-x-full animate-[slide_0.5s_linear_infinite_0.1s]" />
                                            <div className="h-[2px] w-1/2 bg-green-400 opacity-50 transform -translate-x-full animate-[slide_0.5s_linear_infinite_0.2s]" />
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Process 4 & 5: The Batch tasks (Medium Lane flashing by) */}
                                {[1, 2].map((i) => (
                                    <motion.div
                                        key={`batch-${i}`}
                                        className="absolute left-0 w-24 h-10 bg-[var(--tag-bg)] border-2 border-yellow-500 rounded-lg flex items-center justify-center font-bold text-xs shadow-md z-20"
                                        initial={{ top: '49%' }}
                                        animate={isInView ? {
                                            left: ['-50%', '130%'], // Fly across the med lane slower
                                            opacity: [0, 1, 0],
                                            scale: [0.8, 1, 0.8]
                                        } : {}}
                                        transition={{
                                            duration: 3.5,
                                            repeat: Infinity,
                                            delay: i * 2.2,
                                            ease: 'linear'
                                        }}
                                        style={{ marginTop: '-20px' }}
                                    >
                                        Batch {i}
                                        {/* Speed Lines */}
                                        <div className="absolute -left-8 flex flex-col gap-1 w-6 overflow-hidden">
                                            <div className="h-[2px] w-full bg-yellow-400 opacity-50 transform -translate-x-full animate-[slide_0.5s_linear_infinite]" />
                                            <div className="h-[2px] w-3/4 bg-yellow-400 opacity-50 transform -translate-x-full animate-[slide_0.5s_linear_infinite_0.1s]" />
                                            <div className="h-[2px] w-1/2 bg-yellow-400 opacity-50 transform -translate-x-full animate-[slide_0.5s_linear_infinite_0.2s]" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* The CPU */}
                            <div className="flex flex-col items-center justify-center relative w-48 shrink-0 h-full">
                                <CpuCore />

                                {/* Flash effect for Interactive tasks hitting CPU */}
                                <motion.div
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full mix-blend-screen pointer-events-none"
                                    style={{ backgroundColor: 'rgba(34, 197, 94, 0.5)' }}
                                    animate={isInView ? {
                                        scale: [0.5, 1.5, 0.5],
                                        opacity: [0, 0.8, 0]
                                    } : {}}
                                    transition={{ duration: 2, repeat: Infinity, delay: 1.8 }}
                                />

                                {/* Flash effect for Batch tasks hitting CPU */}
                                <motion.div
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full mix-blend-screen pointer-events-none"
                                    style={{ backgroundColor: 'rgba(234, 179, 8, 0.5)' }} // Yellow Flash
                                    animate={isInView ? {
                                        scale: [0.5, 1.5, 0.5],
                                        opacity: [0, 0.8, 0]
                                    } : {}}
                                    transition={{ duration: 3.5, repeat: Infinity, delay: 2.5 }}
                                />
                            </div>
                        </div>

                    </div>
                </div>

                {/* The MLFQ Summary Card */}
                <div className="w-full max-w-4xl hand-drawn-border p-8 bg-[var(--bg-color)] border-[var(--cpu-stroke)] shadow-lg transform -rotate-1 relative mt-8">
                    {/* Tape effect */}
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-[grid-color] opacity-20 backdrop-blur-sm -rotate-2" />

                    <h3 className="font-architect text-3xl mb-6 text-center border-b border-dashed border-[var(--grid-color)] pb-4 text-[var(--cpu-stroke)]">The MLFQ Summary Card</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <p className="font-mono text-sm opacity-50 uppercase tracking-widest mb-1 text-[var(--cpu-stroke)]">Metric</p>
                            <div className="font-sans font-bold text-lg mb-4 text-[var(--cpu-stroke)]">Intelligence</div>

                            <p className="font-mono text-sm opacity-50 uppercase tracking-widest mb-1 mt-6 text-[var(--cpu-stroke)]">Metric</p>
                            <div className="font-sans font-bold text-lg mb-4 text-[var(--cpu-stroke)]">Response Time</div>

                            <p className="font-mono text-sm opacity-50 uppercase tracking-widest mb-1 mt-6 text-[var(--cpu-stroke)]">Metric</p>
                            <div className="font-sans font-bold text-lg text-[var(--cpu-stroke)]">Starvation</div>
                        </div>

                        <div>
                            <p className="font-mono text-sm opacity-50 uppercase tracking-widest mb-1 text-[var(--cpu-stroke)]">The Modern Standard</p>
                            <div className="font-sans text-lg mb-4 flex items-center gap-2">
                                <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                                <span className="text-sm opacity-80 text-[var(--cpu-stroke)]">(Adapts to behavior)</span>
                            </div>

                            <p className="font-mono text-sm opacity-50 uppercase tracking-widest mb-1 mt-6 text-[var(--cpu-stroke)]">The Modern Standard</p>
                            <div className="font-sans text-green-500 font-bold text-lg mb-4 flex items-center gap-2">
                                🟢 Ultra-Fast <span className="text-sm font-normal text-[var(--cpu-stroke)] opacity-80">(For interactive tasks)</span>
                            </div>

                            <p className="font-mono text-sm opacity-50 uppercase tracking-widest mb-1 mt-6 text-[var(--cpu-stroke)]">The Modern Standard</p>
                            <div className="font-sans text-yellow-500 font-bold text-lg flex items-center gap-2">
                                🟡 Risk <span className="text-sm font-normal text-[var(--cpu-stroke)] opacity-80">(Fixed by "Priority Boosts")</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </NarrativeChapter>
    );
}
