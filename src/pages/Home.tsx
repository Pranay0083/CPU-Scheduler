import { useNavigate } from 'react-router-dom';
import { HeroCurtain } from '../components/HeroCurtain';
import { CanvasMap } from '../components/CanvasMap';
import { Chapter1TrafficController } from '../components/chapters/Chapter1TrafficController';
import { Chapter2Rulebook } from '../components/chapters/Chapter2Rulebook';
import { Chapter3Preemption } from '../components/chapters/Chapter3Preemption';
import { Chapter4Checklist } from '../components/chapters/Chapter4Checklist';
import { Chapter5FCFSPart1 } from '../components/chapters/Chapter5FCFSPart1';
import { Chapter5FCFSPart2 } from '../components/chapters/Chapter5FCFSPart2';
import { Chapter6SJF } from '../components/chapters/Chapter6SJF';
import { Chapter7SRTF } from '../components/chapters/Chapter7SRTF';
import { Chapter8RoundRobin } from '../components/chapters/Chapter8RoundRobin';
import { Chapter9Priority } from '../components/chapters/Chapter9Priority';
import { Chapter10StarvationAging } from '../components/chapters/Chapter10StarvationAging';
import { Chapter11MLFQ } from '../components/chapters/Chapter11MLFQ';
import { NarrativeTransition } from '../components/NarrativeTransition';
import { ThemeToggle } from '../components/ThemeToggle';

export function Home() {
    const navigate = useNavigate();

    return (
        <div className="relative w-full min-h-screen">
            {/* Theme Toggle mapped directly to home page right corner */}
            <div className="absolute top-6 right-6 z-50">
                <ThemeToggle />
            </div>

            <HeroCurtain />
            <CanvasMap>

                <div className="w-full flex justify-around items-start relative z-10 w-full flex-col">
                    <NarrativeTransition text="Welcome to the core. Before we see the machines move, we need to understand the rules of the game." />

                    <Chapter1TrafficController />
                    <div className="w-px h-16 bg-[var(--cpu-stroke)] mx-auto opacity-20 border-l-2 border-dashed hand-drawn-border my-8" />

                    <NarrativeTransition text="To talk like an OS, you have to speak its language. Let’s look at how we measure time in a world of microseconds." />

                    <Chapter2Rulebook />
                    <div className="w-px h-16 bg-[var(--cpu-stroke)] mx-auto opacity-20 border-l-2 border-dashed hand-drawn-border my-8" />

                    <NarrativeTransition text="But here is the real question: Should a process be allowed to keep the CPU until it's done, or should the OS have the power to cut it off?" />

                    <Chapter3Preemption />
                    <div className="w-px h-16 bg-[var(--cpu-stroke)] mx-auto opacity-20 border-l-2 border-dashed hand-drawn-border my-8" />

                    <NarrativeTransition text="Knowing the numbers is one thing. Balancing them is another. Here is the checklist every great scheduler follows." />

                    <Chapter4Checklist />
                    <div className="w-px h-32 bg-[var(--cpu-stroke)] mx-auto opacity-20 border-l-2 border-dashed hand-drawn-border my-16" />

                    <NarrativeTransition text="Enough theory. Let’s see these rules in action with the simplest logic there is: The first one to arrive gets the crown." />

                    <Chapter5FCFSPart1 />
                    <div className="w-px h-16 bg-[var(--cpu-stroke)] mx-auto opacity-20 border-l-2 border-dashed hand-drawn-border my-8" />

                    <NarrativeTransition text="But what happens when one process refuses to leave?" />

                    <Chapter5FCFSPart2 />
                    <div className="w-px h-32 bg-[var(--cpu-stroke)] mx-auto opacity-20 border-l-2 border-dashed hand-drawn-border my-16" />

                    <NarrativeTransition text="Waiting for a giant to finish is exhausting. What if we just... let the quick tasks go first? Let’s re-order the queue and see what happens to our wait times." />

                    <Chapter6SJF />
                    <div className="w-px h-16 bg-[var(--cpu-stroke)] mx-auto opacity-20 border-l-2 border-dashed hand-drawn-border my-8" />

                    <NarrativeTransition text="SJF is great if all tasks arrive at once. But what if a massive job starts running, and a tiny job arrives right after?" />

                    <Chapter7SRTF />
                    <div className="w-px h-16 bg-[var(--cpu-stroke)] mx-auto opacity-20 border-l-2 border-dashed hand-drawn-border my-8" />

                    <NarrativeTransition text="But priority queues have problems. Sometimes it's better to just give everyone an equal, tiny slice of time." />

                    <Chapter8RoundRobin />
                    <div className="w-px h-16 bg-[var(--cpu-stroke)] mx-auto opacity-20 border-l-2 border-dashed hand-drawn-border my-8" />

                    <NarrativeTransition text="What if some processes are just more important than others? Enter the VIPs." />

                    <Chapter9Priority />
                    <div className="w-px h-16 bg-[var(--cpu-stroke)] mx-auto opacity-20 border-l-2 border-dashed hand-drawn-border my-8" />

                    <NarrativeTransition text="But what happens when low-priority tasks never get a turn? Enter Starvation, and its ultimate cure: Aging." />

                    <Chapter10StarvationAging />
                    <div className="w-px h-16 bg-[var(--cpu-stroke)] mx-auto opacity-20 border-l-2 border-dashed hand-drawn-border my-8" />

                    <NarrativeTransition text="What if the scheduler was smart enough to learn? In the real world, we don't just treat everyone the same—we reward the efficient and manage the demanding. Welcome to the brain of a modern OS." />

                    <Chapter11MLFQ />
                    <div className="w-px h-32 bg-[var(--cpu-stroke)] mx-auto opacity-20 border-l-2 border-dashed hand-drawn-border my-16" />

                    <div className="min-h-[30vh] flex flex-col items-center justify-center w-full mt-24 mb-16 hand-drawn-border border-[var(--grid-color)] p-12 bg-[var(--bg-color)] shadow-sm max-w-4xl mx-auto">
                        <h2 className="font-architect text-4xl mb-6 text-[var(--cpu-stroke)] text-center">
                            You've reached the core.
                        </h2>
                        <p className="font-sans opacity-80 text-lg text-center leading-relaxed mb-12">
                            From the simple line of FCFS to the adaptive intelligence of MLFQ, you now see how your computer thinks. The curtain is up—the rest is up to you.
                        </p>

                        {/* Sandbox CTA */}
                        <button
                            onClick={() => navigate('/sandbox')}
                            className="px-8 py-4 hand-drawn-border border-[var(--cpu-stroke)] bg-[var(--cpu-stroke)] text-[var(--bg-color)] font-architect text-2xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                        >
                            Explore Sandbox Mode &rarr;
                        </button>
                    </div>

                </div>

            </CanvasMap>
        </div>
    );
}
