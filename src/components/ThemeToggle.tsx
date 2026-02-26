import { useTheme } from './ThemeProvider';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            onClick={toggleTheme}
            className="relative flex shrink-0 items-center justify-center w-12 h-12 rounded-full border-2 border-[var(--cpu-stroke)] bg-[var(--bg-color)] text-[var(--cpu-stroke)] shadow-sm hover:scale-105 transition-transform duration-200 overflow-hidden"
            style={{
                borderRadius: '48% 52% 49% 51% / 51% 47% 53% 49%',
            }}
            whileHover={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 0.3 }}
        >
            <span className="sr-only">Toggle theme</span>
            <motion.div
                initial={false}
                animate={{
                    rotate: theme === 'dark' ? 180 : 0,
                    scale: theme === 'dark' ? 0 : 1,
                    opacity: theme === 'dark' ? 0 : 1,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute"
            >
                <Sun size={24} strokeWidth={1.5} />
            </motion.div>

            <motion.div
                initial={false}
                animate={{
                    rotate: theme === 'dark' ? 0 : -180,
                    scale: theme === 'dark' ? 1 : 0,
                    opacity: theme === 'dark' ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute"
            >
                <Moon size={24} strokeWidth={1.5} />
            </motion.div>
        </motion.button>
    );
}
