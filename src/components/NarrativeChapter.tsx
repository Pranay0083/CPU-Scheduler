import { motion } from 'framer-motion';

interface NarrativeChapterProps {
    id: string;
    headline: string;
    subHeadline: string;
    children: React.ReactNode;
}

export function NarrativeChapter({ id, headline, subHeadline, children }: NarrativeChapterProps) {
    return (
        <motion.div
            id={id}
            className="w-full min-h-[80vh] flex flex-col items-center justify-center p-8 relative z-10"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <div className="text-center mb-16 max-w-3xl">
                <h2 className="text-4xl md:text-5xl font-architect mb-4 text-[var(--text-color)] tracking-wide">
                    {headline}
                </h2>
                <p className="text-xl md:text-2xl font-sans text-[var(--text-color)] opacity-80 leading-relaxed">
                    {subHeadline}
                </p>
            </div>

            <div className="w-full flex justify-center items-center">
                {children}
            </div>
        </motion.div>
    );
}
