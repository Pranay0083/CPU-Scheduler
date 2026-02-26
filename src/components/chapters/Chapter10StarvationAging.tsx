import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { NarrativeChapter } from '../NarrativeChapter';
import { CpuCore } from '../CpuCore';

export function Chapter10StarvationAging() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.5 });

    // Timer for aging and starvation
    const [ageScore, setAgeScore] = useState(0);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isInView) {
            setAgeScore(0);
            let ticks = 0;
            interval = setInterval(() => {
                ticks++;
                if (ticks < 100) {
                    setAgeScore((prev) => prev + 1); // Slowly age up
                }
                if (ticks > 150) {
                    ticks = 0; // Reset loop for demo purposes
                    setAgeScore(0);
                }
            }, 100);
        } else {
            setAgeScore(0);
        }
        return () => clearInterval(interval);
    }, [isInView]);

    const isAgedOut = ageScore >= 80;

    return (
        <NarrativeChapter
            id="chapter-10-starvation-aging"
            headline="Chapter 10: Starvation & Aging"
            subHeadline="What happens when a low-priority task is surrounded by VIPs?"
        >
            <div ref={ref} className="w-full max-w-6xl flex flex-col items-center gap-16 py-12">

                {/* Top Split: Theory vs Visualization */}
                <div className="w-full flex flex-col lg:flex-row items-stretch justify-between gap-12">

                    {/* The Left Side: Content */}
                    <div className="flex-1 space-y-6 flex flex-col justify-center">
                        <div className="hand-drawn-border p-6 bg-[var(--bg-color)] border-[var(--cpu-stroke)] shadow-sm">
                            <h3 className="font-architect text-2xl mb-2 text-red-500 dark:text-red-400">The Problem: Starvation</h3>
                            <p className="font-sans opacity-80 text-sm leading-relaxed">
                                If a steady stream of high-priority tasks keeps arriving, lower-priority tasks can be pushed to the back forever. They are effectively "starved" of CPU time.
                            </p>
                        </div>

                        <div className="hand-drawn-border p-6 bg-[var(--tag-bg)] border-yellow-400 shadow-sm relative overflow-hidden transition-all duration-1000"
                            style={{
                                borderColor: isAgedOut ? '#EAB308' : 'var(--grid-color)',
                                boxShadow: isAgedOut ? '0 0 20px rgba(234, 179, 8, 0.2)' : 'none'
                            }}
                        >
                            <div className="absolute -right-4 -top-4 w-16 h-16 bg-yellow-500 opacity-20 rounded-full blur-xl transition-opacity duration-1000" style={{ opacity: isAgedOut ? 0.4 : 0.1 }} />
                            <h3 className="font-architect text-2xl mb-2 text-yellow-600 dark:text-yellow-400">The Fix: Aging</h3>
                            <p className="font-sans opacity-80 text-sm leading-relaxed">
                                The OS combats this by slowly increasing the priority of a task the longer it waits. Eventually, its "Age" overrides everyone else, and it forcefully takes the CPU.
                            </p>
                        </div>
                    </div>

                    {/* The Right Side: Canvas Action */}
                    <div className="flex-1 flex flex-col items-center justify-center relative hand-drawn-border p-8 border-[var(--grid-color)] overflow-hidden">
                        <span className="absolute top-4 left-4 font-architect opacity-50 uppercase tracking-widest text-xs">Simulated Aging</span>

                        <div className="flex items-center gap-12 mt-16 w-full h-[300px]">
                            {/* The Arrival Zone / Ready Queue */}
                            <div className="flex flex-col gap-4 relative w-32 h-full justify-center mt-8">
                                <span className="absolute -top-12 w-full font-architect text-center opacity-70 border-b border-dashed border-[var(--grid-color)] pb-2">Queue</span>

                                {/* Endless Tiny VIP Jobs Stream */}
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-20 h-8 bg-red-100 dark:bg-red-900/30 border-2 border-red-500 rounded-full flex items-center justify-center font-bold text-[10px] shadow-md z-10"
                                        initial={{ x: -150, y: -40, opacity: 0 }}
                                        animate={isInView ? {
                                            x: isAgedOut ? [-150, 0, 0] : [-150, 0, 0, 200, 250], // Stops at queue when P1 takes over
                                            y: [-40, -40, -40, -40, -40],
                                            opacity: isAgedOut ? [0, 1, 1] : [0, 1, 1, 1, 0],
                                            scale: isAgedOut ? [1, 1, 1] : [1, 1, 1.2, 0, 0]
                                        } : {}}
                                        transition={{
                                            duration: 6,
                                            repeat: Infinity,
                                            delay: i * 2, // Stagger them endlessly
                                            times: [0, 0.2, 0.4, 0.6, 1],
                                            ease: 'linear'
                                        }}
                                        style={{ top: '30%' }}
                                    >
                                        VIP
                                        <span className="absolute -right-10 text-red-500 font-mono text-[10px] opacity-0" style={{ opacity: isAgedOut ? 1 : 0 }}>
                                            Blocked!
                                        </span>
                                    </motion.div>
                                ))}

                                {/* The Faded Massive Job */}
                                <motion.div
                                    className="absolute w-32 bg-[var(--bg-color)] border-4 rounded-xl flex items-center justify-center font-bold text-base shadow-sm z-30 transition-all duration-500"
                                    style={{
                                        top: '60%',
                                        height: '80px',
                                        // Transition from faded grey to golden/powerful based on ageScore
                                        borderColor: isAgedOut ? '#EAB308' : 'var(--grid-color)',
                                        boxShadow: isAgedOut ? '0 0 30px rgba(234, 179, 8, 0.6)' : 'none',
                                        backgroundColor: isAgedOut ? 'rgba(234, 179, 8, 0.1)' : 'var(--bg-color)',
                                        opacity: isAgedOut ? 1 : 0.5 + (ageScore / 160) // Slowly gains opacity
                                    }}
                                    animate={{
                                        // Jumps to CPU when aged out
                                        x: isAgedOut ? 200 : 0,
                                        y: isAgedOut ? -40 : 0,
                                        scale: isAgedOut ? 1.1 : 1
                                    }}
                                    transition={{ duration: 1, type: "spring", stiffness: 50 }}
                                >
                                    P1 (Pri: 5)

                                    {/* Age Bar inside */}
                                    <div className="absolute top-2 right-2 flex flex-col items-center">
                                        <span className="font-mono text-[10px] opacity-50 uppercase">Age</span>
                                        <div className="w-2 h-12 bg-gray-200 dark:bg-gray-800 rounded-full mt-1 overflow-hidden border border-[var(--grid-color)]">
                                            <div
                                                className="w-full bottom-0 absolute transition-all duration-200"
                                                style={{
                                                    height: `${Math.min(100, (ageScore / 80) * 100)}%`,
                                                    backgroundColor: isAgedOut ? '#EAB308' : '#3B82F6'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <span
                                        className="absolute -bottom-6 w-full text-center font-mono text-xs font-bold transition-colors duration-500"
                                        style={{ color: isAgedOut ? '#EAB308' : 'var(--cpu-stroke)' }}
                                    >
                                        {isAgedOut ? 'PRIORITY OVERRIDE!' : `Starving: ${ageScore}/80`}
                                    </span>
                                </motion.div>
                            </div>

                            {/* The CPU running Quick Tasks Endlessly */}
                            <div className="flex flex-col items-center relative ml-auto mr-8">
                                <CpuCore />

                                {/* Flash effect when massive job hits CPU */}
                                <motion.div
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full mix-blend-screen pointer-events-none"
                                    style={{ backgroundColor: '#EAB308' }}
                                    animate={{
                                        scale: isAgedOut ? [0.5, 1.5, 1] : 0,
                                        opacity: isAgedOut ? [0, 0.5, 0.2] : 0
                                    }}
                                    transition={{ duration: 1 }}
                                />

                                {/* VIP flash ticks */}
                                <motion.div
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full mix-blend-screen pointer-events-none"
                                    style={{ backgroundColor: 'var(--tag-border)' }}
                                    animate={isInView && !isAgedOut ? {
                                        scale: [0.5, 1.2, 0.5],
                                        opacity: [0, 0.5, 0]
                                    } : { opacity: 0 }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </NarrativeChapter>
    );
}
