import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export function NarrativeTransition({ text }: { text: string }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.8 }); // Wait until 80% is scrolled past to fade in

    return (
        <div ref={ref} className="w-full min-h-[40vh] flex items-center justify-center px-4 relative z-20 pointer-events-none">
            <motion.p
                className="text-2xl md:text-4xl font-architect text-center max-w-4xl leading-relaxed text-[var(--cpu-stroke)] bg-[var(--bg-color)] shadow-xl p-8 rounded-xl hand-drawn-border backdrop-blur-md"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 1, ease: 'easeOut' }}
            >
                {text}
            </motion.p>
        </div>
    );
}
