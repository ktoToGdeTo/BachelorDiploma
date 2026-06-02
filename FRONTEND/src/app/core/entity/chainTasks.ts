import { Task } from './task';

export interface ChainTasks {
  id: number;
  titleChain: string;
  deadlineTime?: string;
  tasksChain: Task[];
}