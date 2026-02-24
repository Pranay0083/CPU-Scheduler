import { ControlPanel } from './ControlPanel';
import { ProcessForm } from './ProcessForm';
import { PlayControls } from './PlayControls';
import { ProcessTable } from './ProcessTable';
import { GanttChart } from './GanttChart';
import { ProcessQueue } from './ProcessQueue';
import { KernelLog } from './KernelLog';
import { Scorecard } from './Scorecard';

export function SimulatorPage() {
  return (
    <>
      <main className="grid grid-cols-[300px_1fr] gap-6 p-6 h-[calc(100vh-120px)] overflow-hidden">
        {/* Left Sidebar: The Setup */}
        <aside className="flex flex-col gap-4 h-full">
          <div className="flex flex-col gap-4 overflow-y-auto scrollbar-thin flex-1 pr-2 pb-2">
            <ControlPanel />
            <ProcessForm />
          </div>
          <div className="shrink-0 pb-2">
            <PlayControls />
          </div>
        </aside>

        {/* Main View: Execution & Results */}
        <div className="flex flex-col gap-6 h-full overflow-y-auto scrollbar-thin pr-2">

          {/* Top Stage: Execution Visualization */}
          <section className="min-h-[200px]">
            <GanttChart />
          </section>

          {/* Middle Stage: Process Pipeline */}
          <section className="shrink-0 flex items-center min-h-[180px]">
            <div className="w-full">
              <ProcessQueue />
            </div>
          </section>

          {/* Bottom Stage: Output & Results */}
          <section className="gap-6 grid grid-cols-2 flex-1 min-h-[400px]">
            <ProcessTable />
            <div className="flex-1 min-h-[200px]">
              <KernelLog />
            </div>
          </section>
        </div>
      </main>

      <footer className="glass-footer text-text-secondary">
        <p>
          Algorithms: FCFS • SJF • SRTF • Round Robin • Priority • MLFQ |
          Multi-Core Support • I/O Bursts • Priority Aging
        </p>
      </footer>

      <Scorecard />
    </>
  );
}
