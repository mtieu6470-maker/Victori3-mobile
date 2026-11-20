import type { GameState } from './types';
import type { SimulationCadence } from './calendar';

export interface ScheduledTask { id: string; cadence: SimulationCadence; priority: number; run: (state: GameState) => void }

/** Deterministic recurring-task registry. Deadlines are derived from logical time, not wall-clock timers. */
export function orderScheduledTasks(tasks: readonly ScheduledTask[]): ScheduledTask[] {
  const ids = new Set<string>();
  for (const task of tasks) {
    if (!task.id.trim()) throw new Error('Scheduled task id must not be empty');
    if (!Number.isFinite(task.priority)) throw new Error(`Invalid priority for task ${task.id}`);
    if (ids.has(task.id)) throw new Error(`Duplicate scheduled task id: ${task.id}`);
    ids.add(task.id);
  }
  return [...tasks].sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id));
}

export function runScheduledTasks(state: GameState, due: readonly SimulationCadence[], registry: readonly ScheduledTask[]): string[] {
  const dueSet = new Set(due);
  const executed: string[] = [];
  for (const task of orderScheduledTasks(registry)) {
    if (!dueSet.has(task.cadence)) continue;
    task.run(state);
    executed.push(task.id);
  }
  return executed;
}