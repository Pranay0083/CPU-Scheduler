import { useState } from 'react';
import { CheckCircle2, AlertTriangle, MonitorPlay } from 'lucide-react';
import type { LearningModuleId } from '../types';

interface AlgorithmContentProps {
    moduleId: LearningModuleId;
    title: string;
    icon: string;
    onNavigateToSimulator: (algorithm?: string, preset?: string) => void;
}

// Data store for algorithm information
const ALGORITHM_DATA: Record<string, any> = {
    fcfs: {
        definition: 'First-Come, First-Served (FCFS) is the simplest scheduling algorithm. Processes are dispatched according to their arrival time on the ready queue. Once a process has the CPU, it runs to completion.',
        pros: ['Simple to understand and implement', 'No starvation (every process gets its turn eventually)'],
        cons: ['Prone to the Convoy Effect (short processes waiting behind long ones)', 'Poor average wait time and response time', 'Non-preemptive'],
        timeComplexity: 'O(N) to find next if queue is unsorted, O(1) if maintained as FIFO queue.',
        useCase: 'Batch systems where order of execution matters and turnaround time is not critical.',
        pythonCode: `def fcfs_scheduling(processes):
    processes.sort(key=lambda x: x['arrival_time'])
    current_time = 0
    
    for p in processes:
        if current_time < p['arrival_time']:
            current_time = p['arrival_time']
        
        # Process execution
        p['start_time'] = current_time
        p['completion_time'] = current_time + p['burst_time']
        p['turnaround_time'] = p['completion_time'] - p['arrival_time']
        p['wait_time'] = p['turnaround_time'] - p['burst_time']
        
        current_time = p['completion_time']
    return processes`,
        cppCode: `struct Process { int id, at, bt, ct, tat, wt; };

void calculateFCFS(vector<Process>& processes) {
    // Sort by arrival time
    sort(processes.begin(), processes.end(), 
         [](Process& a, Process& b) { return a.at < b.at; });
         
    int currentTime = 0;
    for (auto& p : processes) {
        if (currentTime < p.at) currentTime = p.at;
        
        p.ct = currentTime + p.bt;
        p.tat = p.ct - p.at;
        p.wt = p.tat - p.bt;
        
        currentTime = p.ct;
    }
}`
    },
    sjf: {
        definition: 'Shortest Job First (SJF) selects the waiting process with the smallest execution time to execute next. It provides the provably optimal minimum average waiting time for a given set of processes.',
        pros: ['Optimal average waiting time', 'High throughput'],
        cons: ['Requires knowing burst time in advance (impossible in practice)', 'Can cause starvation for long processes'],
        timeComplexity: 'O(N^2) or O(N log N) using a priority queue.',
        useCase: 'Environments where task length is known beforehand, like certain batch processing jobs.',
        pythonCode: `def sjf_scheduling(processes):
    processes.sort(key=lambda x: x['arrival_time'])
    current_time = 0
    completed = []
    ready_queue = []
    
    while processes or ready_queue:
        # Move arrived processes to ready queue
        while processes and processes[0]['arrival_time'] <= current_time:
            ready_queue.append(processes.pop(0))
            
        if not ready_queue:
            current_time = processes[0]['arrival_time']
            continue
            
        # Select shortest job
        ready_queue.sort(key=lambda x: x['burst_time'])
        p = ready_queue.pop(0)
        
        p['completion_time'] = current_time + p['burst_time']
        p['turnaround_time'] = p['completion_time'] - p['arrival_time']
        p['wait_time'] = p['turnaround_time'] - p['burst_time']
        current_time = p['completion_time']
        completed.append(p)
        
    return completed`,
        cppCode: `struct Process { int id, at, bt, ct, tat, wt; };

void calculateSJF(vector<Process>& processes) {
    int n = processes.size();
    vector<bool> isCompleted(n, false);
    int currentTime = 0, completedCount = 0;
    
    while(completedCount < n) {
        int idx = -1;
        int minBurst = numeric_limits<int>::max();
        
        for(int i = 0; i < n; i++) {
            if(processes[i].at <= currentTime && !isCompleted[i]) {
                if(processes[i].bt < minBurst) {
                    minBurst = processes[i].bt;
                    idx = i;
                }
            }
        }
        
        if(idx != -1) {
            currentTime += processes[idx].bt;
            processes[idx].ct = currentTime;
            processes[idx].tat = processes[idx].ct - processes[idx].at;
            processes[idx].wt = processes[idx].tat - processes[idx].bt;
            
            isCompleted[idx] = true;
            completedCount++;
        } else {
            currentTime++;
        }
    }
}`
    },
    srtf: {
        definition: 'Shortest Remaining Time First (SRTF) is the preemptive version of SJF. The scheduler always chooses the process with the shortest remaining processing time. When a new process arrives, its remaining time is compared with the currently running process.',
        pros: ['Provides exactly the minimum average waiting time', 'Better response time than SJF'],
        cons: ['Context switching overhead can be high', 'Requires predicting burst times', 'Starvation of longer processes'],
        timeComplexity: 'O(N log N) with priority queue per time step.',
        useCase: 'Systems where tight wait-time constraints are needed and burst times can be accurately estimated.',
        pythonCode: `def srtf_scheduling(processes):
    # Initialize remaining times
    for p in processes:
        p['rt'] = p['burst_time']
        
    current_time = 0
    completed = 0
    n = len(processes)
    
    while completed != n:
        # Find process with minimum remaining time at current_time
        idx = -1
        min_rt = float('inf')
        
        for i, p in enumerate(processes):
            if p['arrival_time'] <= current_time and p['rt'] > 0:
                if p['rt'] < min_rt:
                    min_rt = p['rt']
                    idx = i
                    
        if idx != -1:
            processes[idx]['rt'] -= 1
            current_time += 1
            
            if processes[idx]['rt'] == 0:
                completed += 1
                processes[idx]['completion_time'] = current_time
                processes[idx]['turnaround_time'] = current_time - processes[idx]['arrival_time']
                processes[idx]['wait_time'] = processes[idx]['turnaround_time'] - processes[idx]['burst_time']
        else:
            current_time += 1`,
        cppCode: `void calculateSRTF(vector<Process>& processes) {
    int n = processes.size();
    vector<int> rt(n);
    for(int i=0; i<n; i++) rt[i] = processes[i].bt;
    
    int complete = 0, t = 0, minm = INT_MAX;
    int shortest = 0;
    bool check = false;
    
    while (complete != n) {
        for (int j = 0; j < n; j++) {
            if ((processes[j].at <= t) && (rt[j] < minm) && rt[j] > 0) {
                minm = rt[j];
                shortest = j;
                check = true;
            }
        }
        if (check == false) { t++; continue; }
        
        rt[shortest]--;
        minm = rt[shortest];
        if (minm == 0) minm = INT_MAX;
        
        if (rt[shortest] == 0) {
            complete++;
            check = false;
            int finish_time = t + 1;
            processes[shortest].wt = finish_time - processes[shortest].bt - processes[shortest].at;
            if (processes[shortest].wt < 0) processes[shortest].wt = 0;
        }
        t++;
    }
}`
    },
    rr: {
        definition: 'Round Robin (RR) assigns a fixed time slice (quantum) to each process in equal portions and in circular order, handling all processes without priority. It is designed specifically for time-sharing systems.',
        pros: ['Guarantees fairness (no starvation)', 'Excellent response time for interactive systems'],
        cons: ['Performance depends heavily on the time quantum length', 'High context switching overhead if quantum is too small'],
        timeComplexity: 'O(1) per scheduling decision if using a queue.',
        useCase: 'Time-sharing operating systems (like standard Desktop OS GUI threads) where responsiveness to users is key.',
        pythonCode: `def rr_scheduling(processes, quantum):
    for p in processes:
        p['rt'] = p['burst_time']
        
    current_time = 0
    queue = []
    # Add initial processes at t=0
    
    while True:
        done = True
        for p in processes:
            if p['rt'] > 0:
                done = False
                if p['rt'] > quantum:
                    current_time += quantum
                    p['rt'] -= quantum
                else:
                    current_time = current_time + p['rt']
                    p['wait_time'] = current_time - p['burst_time'] - p['arrival_time']
                    p['rt'] = 0
                    
        if done == True:
            break`,
        cppCode: `void calculateRR(vector<Process>& processes, int quantum) {
    int n = processes.size();
    vector<int> rem_bt(n);
    for (int i = 0 ; i < n ; i++) rem_bt[i] = processes[i].bt;
    
    int t = 0; // Current time
    while (1) {
        bool done = true;
        for (int i = 0 ; i < n; i++) {
            if (rem_bt[i] > 0) {
                done = false;
                if (rem_bt[i] > quantum) {
                    t += quantum;
                    rem_bt[i] -= quantum;
                } else {
                    t = t + rem_bt[i];
                    processes[i].wt = t - processes[i].bt - processes[i].at;
                    rem_bt[i] = 0;
                }
            }
        }
        if (done == true) break;
    }
}`
    },
    priority: {
        definition: 'Priority Scheduling assigns a priority to each process. The CPU is allocated to the process with the highest priority (usually smallest integer = highest priority). It can be preemptive or non-preemptive.',
        pros: ['Important tasks are executed faster'],
        cons: ['Can cause starvation of low-priority processes (solved by Aging)'],
        timeComplexity: 'O(N log N) with a priority queue.',
        useCase: 'Systems where tasks have strict urgency levels, like Real-Time systems or OS kernel operations vs user operations.',
        pythonCode: `def priority_scheduling(processes):
    # Non-preemptive priority (lower number = higher priority)
    processes.sort(key=lambda x: x['arrival_time'])
    current_time = 0
    completed = []
    ready_queue = []
    
    while processes or ready_queue:
        while processes and processes[0]['arrival_time'] <= current_time:
            ready_queue.append(processes.pop(0))
            
        if not ready_queue:
            current_time = processes[0]['arrival_time']
            continue
            
        # Select highest priority
        ready_queue.sort(key=lambda x: x['priority'])
        p = ready_queue.pop(0)
        
        p['completion_time'] = current_time + p['burst_time']
        p['turnaround_time'] = p['completion_time'] - p['arrival_time']
        p['wait_time'] = p['turnaround_time'] - p['burst_time']
        current_time = p['completion_time']
        
        completed.append(p)
    return completed`,
        cppCode: `void calculatePriority(vector<Process>& processes) {
    // Non-preemptive priority 
    int n = processes.size();
    vector<bool> isCompleted(n, false);
    int currentTime = 0, completedCount = 0;
    
    while(completedCount < n) {
        int idx = -1;
        int minPriority = numeric_limits<int>::max();
        
        for(int i = 0; i < n; i++) {
            if(processes[i].at <= currentTime && !isCompleted[i]) {
                if(processes[i].priority < minPriority) {
                    minPriority = processes[i].priority;
                    idx = i;
                }
            }
        }
        
        if(idx != -1) {
            currentTime += processes[idx].bt;
            processes[idx].ct = currentTime;
            processes[idx].tat = processes[idx].ct - processes[idx].at;
            processes[idx].wt = processes[idx].tat - processes[idx].bt;
            
            isCompleted[idx] = true;
            completedCount++;
        } else {
            currentTime++;
        }
    }
}`
    },
    mlfq: {
        definition: 'Multi-Level Feedback Queue (MLFQ) is an intricate algorithm that uses multiple queues with different priorities and scheduling algorithms. Processes can move between queues based on their behavior (e.g., using too much CPU downgrades priority, waiting too long upgrades it).',
        pros: ['Adaptive: learns process behavior over time', 'Excellent balance of response time for I/O bounds and throughput for CPU bounds', 'No manual priority assignment needed'],
        cons: ['Highly complex to implement and tune (needs correct quantum sizes and aging algorithms)', 'Hardware overhead to maintain multiple queues'],
        timeComplexity: 'Complex, generally O(1) scheduling decision but O(N) aging checks.',
        useCase: 'Modern general-purpose operating systems like Windows, macOS, and Linux.',
        pythonCode: `def mlfq_scheduling(processes, queue_quantums=[2, 4, 8]):
    # simplified representation
    queues = [[] for _ in range(len(queue_quantums) + 1)] # Last is FCFS
    current_time = 0
    # Add processes to highest priority queue (0) upon arrival
    
    # In a real system:
    # 1. Start process in Queue 0
    # 2. If it uses full quantum, demote to Queue 1
    # 3. If it does I/O before quantum ends, keep priority
    # 4. Periodically boost all processes to Queue 0 (Aging to prevent starvation)
    
    pass # Implementation requires tracking state across time ticks`,
        cppCode: `void calculateMLFQ(vector<Process>& processes) {
    // Complex implementation using std::queue
    queue<Process*> q0, q1, q2; // q0=RR(2), q1=RR(4), q2=FCFS
    
    // Core logic:
    // 1. If q0 not empty, run process with Q=2
    //    If uncompleted, push to q1
    // 2. Else if q1 not empty, run process with Q=4
    //    If uncompleted, push to q2
    // 3. Else run q2 with FCFS
    
    // Check out the simulator's performTick() function in 
    // SchedulerContext.tsx for a real implementation!
}`
    }
};

export function AlgorithmContent({ moduleId, title, icon, onNavigateToSimulator }: AlgorithmContentProps) {
    const [language, setLanguage] = useState<'python' | 'cpp'>('python');

    // Map module ID to expected string
    let key = moduleId;
    if (key === 'scheduling-criteria' || key === 'preemption' || key === 'advanced' || key === 'formulas' || key === 'basics') {
        return null;
    }

    const data = ALGORITHM_DATA[key];
    if (!data) return null;

    const navigateMap = {
        'fcfs': 'FCFS',
        'sjf': 'SJF',
        'srtf': 'SRTF',
        'rr': 'ROUND_ROBIN',
        'priority': 'PRIORITY_NON_PREEMPTIVE',
        'mlfq': 'MLFQ'
    };

    return (
        <div className="animate-fade-in-up">
            <header className="mb-8 border-b border-white/10 pb-6">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 flex items-center gap-4">
                    <span className="text-4xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{icon}</span>
                    {title}
                </h2>
            </header>

            <div className="space-y-10">
                <section>
                    <h3 className="text-xl font-semibold text-accent-secondary mb-4 flex items-center gap-2">
                        Definition
                    </h3>
                    <p className="text-white/80 leading-loose text-lg mb-6 bg-white/5 border border-white/10 rounded-xl p-6 shadow-inner">
                        {data.definition}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
                            <h4 className="text-white/60 font-mono text-sm uppercase mb-1">Time Complexity</h4>
                            <p className="text-white font-medium">{data.timeComplexity}</p>
                        </div>
                        <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
                            <h4 className="text-white/60 font-mono text-sm uppercase mb-1">Best Use Case</h4>
                            <p className="text-white font-medium">{data.useCase}</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-semibold text-accent-secondary mb-6 flex items-center gap-2">
                        Pros & Cons
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-6">
                            <h4 className="text-green-400 font-bold mb-4 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" /> Advantages
                            </h4>
                            <ul className="space-y-3">
                                {data.pros.map((p: string, i: number) => (
                                    <li key={i} className="text-white/80 flex items-start gap-2 text-sm leading-loose">
                                        <span className="text-green-400 mt-1">•</span> {p}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
                            <h4 className="text-red-400 font-bold mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" /> Disadvantages
                            </h4>
                            <ul className="space-y-3">
                                {data.cons.map((c: string, i: number) => (
                                    <li key={i} className="text-white/80 flex items-start gap-2 text-sm leading-loose">
                                        <span className="text-red-400 mt-1">•</span> {c}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-accent-secondary flex items-center gap-2">
                            Implementation Code
                        </h3>
                        <div className="flex bg-white/5 rounded-lg border border-white/10 p-1">
                            <button
                                className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${language === 'python' ? 'bg-accent-primary text-black shadow-md' : 'text-white/50 hover:text-white'}`}
                                onClick={() => setLanguage('python')}
                            >
                                Python
                            </button>
                            <button
                                className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${language === 'cpp' ? 'bg-blue-500 text-white shadow-md' : 'text-white/50 hover:text-white'}`}
                                onClick={() => setLanguage('cpp')}
                            >
                                C++
                            </button>
                        </div>
                    </div>
                    <div className="bg-[#1e1e1e] border border-white/10 rounded-xl p-4 overflow-x-auto shadow-inner">
                        <pre className="font-mono text-xs md:text-sm text-[#d4d4d4] leading-relaxed">
                            <code>{language === 'python' ? data.pythonCode : data.cppCode}</code>
                        </pre>
                    </div>
                </section>

                <div className="pt-4 border-t border-white/10">
                    <button
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-bold shadow-[0_0_20px_rgba(0,255,136,0.15)] hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 group border border-accent-primary/50"
                        onClick={() => onNavigateToSimulator(navigateMap[key as keyof typeof navigateMap])}
                    >
                        <MonitorPlay className="w-5 h-5 text-white" />
                        Try {title} Simulator
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
