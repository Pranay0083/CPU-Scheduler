export function FormulaCheatSheet() {
    return (
        <div className="animate-fade-in-up">
            <header className="mb-8 border-b border-white/10 pb-6">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 flex items-center gap-4">
                    <span className="text-4xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">📐</span>
                    Formula Cheat Sheet
                </h2>
            </header>

            <div className="space-y-12">
                <section>
                    <h3 className="text-xl font-semibold text-accent-secondary mb-6 flex items-center gap-2">
                        <span className="w-1 h-6 bg-accent-secondary rounded-full"></span>
                        Core Formulas
                    </h3>
                    <p className="text-white/80 mb-6 text-lg">
                        These are the fundamental equations you'll use when solving scheduling problems:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="p-6 rounded-xl bg-accent-primary/10 border border-accent-primary/30 hover:bg-accent-primary/20 transition-all transform hover:-translate-y-1 shadow-[0_4px_20px_rgba(var(--color-accent-primary),0.1)] relative group overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl group-hover:scale-110 transition-transform">⏱️</div>
                            <h4 className="font-bold text-accent-cyan mb-4 text-lg border-b border-accent-primary/20 pb-2">Turnaround Time (TAT)</h4>
                            <div className="bg-black/30 rounded-lg p-4 mb-4 text-center border border-white/5">
                                <span className="font-mono text-xl font-bold text-white tracking-wider">TAT = CT − AT</span>
                            </div>
                            <p className="text-sm text-white/70">
                                Time from arrival to completion
                            </p>
                        </div>

                        <div className="p-6 rounded-xl bg-accent-primary/10 border border-accent-primary/30 hover:bg-accent-primary/20 transition-all transform hover:-translate-y-1 shadow-[0_4px_20px_rgba(var(--color-accent-primary),0.1)] relative group overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl group-hover:scale-110 transition-transform">⏳</div>
                            <h4 className="font-bold text-accent-cyan mb-4 text-lg border-b border-accent-primary/20 pb-2">Waiting Time (WT)</h4>
                            <div className="bg-black/30 rounded-lg p-4 mb-4 text-center border border-white/5">
                                <span className="font-mono text-xl font-bold text-white tracking-wider">WT = TAT − BT</span>
                            </div>
                            <p className="text-sm text-white/70 mb-2">
                                Time spent waiting in ready queue
                            </p>
                            <p className="text-xs text-white/50 italic border-t border-white/10 pt-2">
                                Alternative: <span className="font-mono text-accent-cyan">WT = CT − AT − BT</span>
                            </p>
                        </div>

                        <div className="p-6 rounded-xl bg-accent-primary/10 border border-accent-primary/30 hover:bg-accent-primary/20 transition-all transform hover:-translate-y-1 shadow-[0_4px_20px_rgba(var(--color-accent-primary),0.1)] relative group overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl group-hover:scale-110 transition-transform">📊</div>
                            <h4 className="font-bold text-accent-cyan mb-4 text-lg border-b border-accent-primary/20 pb-2">Average Waiting Time (AWT)</h4>
                            <div className="bg-black/30 rounded-lg p-4 mb-4 text-center border border-white/5">
                                <span className="font-mono text-xl font-bold text-white tracking-wider">AWT = Σ(WTᵢ) / n</span>
                            </div>
                            <p className="text-sm text-white/70">
                                Sum of all waiting times divided by number of processes
                            </p>
                        </div>

                        <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all md:col-span-2 lg:col-span-1">
                            <h4 className="font-bold text-white/90 mb-4 text-lg border-b border-white/10 pb-2">Average Turnaround Time (ATT)</h4>
                            <div className="bg-black/30 rounded-lg p-4 mb-4 text-center border border-white/5">
                                <span className="font-mono text-xl font-bold text-white/90 tracking-wider">ATT = Σ(TATᵢ) / n</span>
                            </div>
                            <p className="text-sm text-white/60">
                                Average time for a process to complete
                            </p>
                        </div>
                        
                        <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all md:col-span-2 lg:col-span-1">
                            <h4 className="font-bold text-white/90 mb-4 text-lg border-b border-white/10 pb-2">CPU Utilization</h4>
                            <div className="bg-black/30 rounded-lg p-4 mb-4 text-center border border-white/5">
                                <span className="font-mono text-base font-bold text-white/90 tracking-wider">Util = (Busy / Total) × 100%</span>
                            </div>
                            <p className="text-sm text-white/60">
                                Percentage of time CPU is actively processing
                            </p>
                        </div>

                        <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all md:col-span-2 lg:col-span-1">
                            <h4 className="font-bold text-white/90 mb-4 text-lg border-b border-white/10 pb-2">Throughput</h4>
                            <div className="bg-black/30 rounded-lg p-4 mb-4 text-center border border-white/5">
                                <span className="font-mono text-base font-bold text-white/90 tracking-wider">TP = Completed / Total Time</span>
                            </div>
                            <p className="text-sm text-white/60">
                                Number of processes finished per unit time
                            </p>
                        </div>
                    </div>
                </section>

                <div className="w-full h-px bg-white/10 my-8"></div>

                <section>
                    <h3 className="text-xl font-semibold text-accent-secondary mb-6 flex items-center gap-2">
                        <span className="w-1 h-6 bg-accent-secondary rounded-full"></span>
                        Pro-Tips for Tricky Scenarios
                    </h3>

                    <div className="space-y-6">
                        <div className="p-6 rounded-xl bg-blue-500/5 border border-blue-500/10 hover:border-blue-500/20 transition-colors">
                            <div className="flex items-center gap-3 mb-4 border-b border-blue-500/10 pb-3">
                                <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-xs font-mono border border-blue-500/30">🔄 Round Robin</span>
                                <h4 className="font-bold text-white text-lg">Context Switch Overhead</h4>
                            </div>
                            <div className="space-y-4">
                                <p className="text-white/70 text-sm">
                                    When calculating with context switches, add CS time after every
                                    quantum expiration (except the last):
                                </p>
                                <div className="bg-black/30 p-3 rounded font-mono text-sm text-blue-200 border border-blue-500/10">
                                    Total Time = Σ(BT) + (Number of Context Switches × CS Time)
                                </div>
                                <div className="bg-blue-500/10 p-3 rounded border border-blue-500/10 text-sm">
                                    <strong className="text-blue-200 block mb-1">Example:</strong> 
                                    <span className="text-white/70">
                                        P1(BT=7), P2(BT=4), Q=4, CS=1 <br/>
                                        Switches: P1→P2, P2→P1, P1→done = 2 switches (last doesn't count) <br/>
                                        Total = 7 + 4 + 2(1) = <strong>13 units</strong>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-xl bg-orange-500/5 border border-orange-500/10 hover:border-orange-500/20 transition-colors">
                            <div className="flex items-center gap-3 mb-4 border-b border-orange-500/10 pb-3">
                                <span className="px-2 py-1 rounded bg-orange-500/20 text-orange-300 text-xs font-mono border border-orange-500/30">⭐ Priority</span>
                                <h4 className="font-bold text-white text-lg">Priority Inversion</h4>
                            </div>
                            <div className="space-y-4">
                                <p className="text-white/70 text-sm">
                                    When a low-priority process holds a resource needed by a
                                    high-priority process:
                                </p>
                                <ul className="list-disc pl-5 space-y-1 text-sm text-white/60">
                                    <li><strong className="text-orange-200">Problem:</strong> High-priority waits for low-priority</li>
                                    <li><strong className="text-orange-200">Solution:</strong> Priority Inheritance Protocol</li>
                                </ul>
                                <div className="flex gap-2 items-start text-xs text-orange-200/60 italic bg-orange-500/5 p-2 rounded">
                                    <span>⚠️</span> 
                                    This visualizer doesn't simulate resource locks, but real systems must handle this!
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-xl bg-green-500/5 border border-green-500/10 hover:border-green-500/20 transition-colors">
                            <div className="flex items-center gap-3 mb-4 border-b border-green-500/10 pb-3">
                                <span className="px-2 py-1 rounded bg-green-500/20 text-green-300 text-xs font-mono border border-green-500/30">📈 Aging</span>
                                <h4 className="font-bold text-white text-lg">Calculating Priority with Aging</h4>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-black/30 p-3 rounded font-mono text-sm text-green-200 border border-green-500/10">
                                    New Priority = Original Priority − (Wait Time / Aging Threshold)
                                </div>
                                <p className="text-sm text-white/60 italic">
                                    <strong>Note:</strong> Lower number = Higher priority in most systems
                                </p>
                                <div className="bg-green-500/10 p-3 rounded border border-green-500/10 text-sm">
                                    <strong className="text-green-200 block mb-1">Example:</strong> 
                                    <span className="text-white/70">
                                        Priority=10, Wait=30, Threshold=10 <br/>
                                        New Priority = 10 − (30/10) = 10 − 3 = <strong>7</strong> (boosted!)
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 rounded-xl bg-purple-500/5 border border-purple-500/10 hover:border-purple-500/20 transition-colors">
                            <div className="flex items-center gap-3 mb-4 border-b border-purple-500/10 pb-3">
                                <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-300 text-xs font-mono border border-purple-500/30">🔀 MLFQ</span>
                                <h4 className="font-bold text-white text-lg">Multi-Level Feedback Queue</h4>
                            </div>
                            <div>
                                <p className="text-white/70 text-sm mb-3">Key rules to remember:</p>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-white/60">
                                    <li className="flex items-start gap-2"><span className="text-purple-400 mt-1">•</span> New processes start at highest priority queue</li>
                                    <li className="flex items-start gap-2"><span className="text-purple-400 mt-1">•</span> Full quantum use → Move down a level</li>
                                    <li className="flex items-start gap-2"><span className="text-purple-400 mt-1">•</span> I/O before quantum expire → Stay same level</li>
                                    <li className="flex items-start gap-2"><span className="text-purple-400 mt-1">•</span> Higher queues have smaller quantums</li>
                                </ul>
                            </div>
                        </div>

                        <div className="p-6 rounded-xl bg-cyan-500/5 border border-cyan-500/10 hover:border-cyan-500/20 transition-colors">
                             <div className="flex items-center gap-3 mb-4 border-b border-cyan-500/10 pb-3">
                                <span className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 text-xs font-mono border border-cyan-500/30">⚡ SRTF</span>
                                <h4 className="font-bold text-white text-lg">Optimal Average Waiting Time</h4>
                            </div>
                            <div className="space-y-4">
                                <p className="text-white/70 text-sm">
                                    <strong className="text-cyan-200">SRTF is provably optimal</strong> for minimizing average
                                    waiting time (among non-idling schedulers).
                                </p>
                                <div className="flex gap-2 items-start text-xs text-cyan-200/60 italic bg-cyan-500/5 p-2 rounded border border-cyan-500/10">
                                    <span>⚠️</span> 
                                    However, it requires knowing burst times in advance and can
                                    cause starvation of long processes!
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                <div className="w-full h-px bg-white/10 my-8"></div>

                <section>
                    <h3 className="text-xl font-semibold text-accent-secondary mb-6 flex items-center gap-2">
                        <span className="w-1 h-6 bg-accent-secondary rounded-full"></span>
                        Quick Reference Table
                    </h3>
                    <div className="overflow-x-auto rounded-xl border border-white/10 shadow-lg">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/10 text-white border-b border-white/10">
                                    <th className="p-4 font-bold">Algorithm</th>
                                    <th className="p-4 font-bold">Type</th>
                                    <th className="p-4 font-bold">Starvation?</th>
                                    <th className="p-4 font-bold">Best For</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white/5 divide-y divide-white/5">
                                <tr className="hover:bg-white/10 transition-colors">
                                    <td className="p-4 font-medium text-accent-cyan">FCFS</td>
                                    <td className="p-4 text-white/70">Non-Preemptive</td>
                                    <td className="p-4 text-green-300">No</td>
                                    <td className="p-4 text-white/60 text-sm">Batch systems</td>
                                </tr>
                                <tr className="hover:bg-white/10 transition-colors">
                                    <td className="p-4 font-medium text-accent-cyan">SJF</td>
                                    <td className="p-4 text-white/70">Non-Preemptive</td>
                                    <td className="p-4 text-red-300">Yes <span className="text-white/40 text-xs">(long processes)</span></td>
                                    <td className="p-4 text-white/60 text-sm">Known burst times</td>
                                </tr>
                                <tr className="hover:bg-white/10 transition-colors">
                                    <td className="p-4 font-medium text-accent-cyan">SRTF</td>
                                    <td className="p-4 text-white/70">Preemptive</td>
                                    <td className="p-4 text-red-300">Yes <span className="text-white/40 text-xs">(long processes)</span></td>
                                    <td className="p-4 text-white/60 text-sm">Optimal AWT</td>
                                </tr>
                                <tr className="hover:bg-white/10 transition-colors">
                                    <td className="p-4 font-medium text-accent-cyan">Round Robin</td>
                                    <td className="p-4 text-white/70">Preemptive</td>
                                    <td className="p-4 text-green-300">No</td>
                                    <td className="p-4 text-white/60 text-sm">Time-sharing, fairness</td>
                                </tr>
                                <tr className="hover:bg-white/10 transition-colors">
                                    <td className="p-4 font-medium text-accent-cyan">Priority</td>
                                    <td className="p-4 text-white/70">Both</td>
                                    <td className="p-4 text-red-300">Yes <span className="text-white/40 text-xs">(low priority)</span></td>
                                    <td className="p-4 text-white/60 text-sm">Importance-based systems</td>
                                </tr>
                                <tr className="hover:bg-white/10 transition-colors">
                                    <td className="p-4 font-medium text-accent-cyan">MLFQ</td>
                                    <td className="p-4 text-white/70">Preemptive</td>
                                    <td className="p-4 text-yellow-300">Possible</td>
                                    <td className="p-4 text-white/60 text-sm">General-purpose OS</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
                
                <section className="bg-gradient-to-br from-[#1e1e40] to-[#252540] p-8 rounded-xl border border-white/10 shadow-lg relative overflow-hidden mt-8">
                    <div className="relative z-10 text-center">
                        <h3 className="text-2xl font-bold text-white mb-4">Ready to Calculate?</h3>
                        <p className="text-white/70 max-w-2xl mx-auto mb-6">
                            Use these formulas to verify the simulator's output. Try calculating manually first, then check if your answers match!
                        </p>
                        <div className="flex justify-center gap-4">
                            <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-sm font-mono text-accent-cyan">
                                TAT = CT - AT
                            </div>
                            <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-sm font-mono text-accent-cyan">
                                WT = TAT - BT
                            </div>
                        </div>
                    </div>
                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/5 rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-secondary/5 rounded-full filter blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
                </section>
            </div>
        </div>
    );
}

export default FormulaCheatSheet;
