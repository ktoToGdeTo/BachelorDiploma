import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Task } from '../../core/entity/task';
import { TaskService } from '../../core/services/task-service';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { CommonModule } from '@angular/common';
import { TaskCardComponent } from '../task-card-component/task-card-component';
import { ChainTasks } from '../../core/entity/chainTasks';
import { FormsModule } from '@angular/forms';
import { InfoTaskModal } from '../info-task-modal/info-task-modal';
import { PluralPipe } from '../../core/pipes/plural-pipe';
import { CdkDropList } from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-tasks-component',
  standalone: true,
  imports: [CommonModule, TaskCardComponent, FormsModule, InfoTaskModal, PluralPipe, CdkDropList],
  templateUrl: './tasks-component.html',
  styleUrl: './tasks-component.css',
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  allChains: ChainTasks[] = [];
   expandedChains = new Set<number>();

  sortField: 'title' | 'created_time' | 'modified_time' = 'created_time';
  sortOrder: 'asc' | 'desc' = 'desc';
  groupBy: 'none' | 'status' | 'user' = 'none';

  authService = inject(AuthService);
  private taskService = inject(TaskService);
  private router = inject(Router);
  private cd = inject(ChangeDetectorRef);

  selectedTask: Task | null = null;
  selectedTaskChain: ChainTasks | null = null;

  ngOnInit(): void {
    this.loadTasks();
  }

  private sortTasks(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => {
      if (this.sortField === 'title') {
        const valA = (a.title || '').toLowerCase();
        const valB = (b.title || '').toLowerCase();
        return this.sortOrder === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        const dateA = a[this.sortField];
        const dateB = b[this.sortField];
        const valA = dateA ? new Date(dateA).getTime() : 0;
        const valB = dateB ? new Date(dateB).getTime() : 0;
        return this.sortOrder === 'asc' ? valA - valB : valB - valA;
      }
    });
  }

  // Геттер для отсортированного и сгруппированного списка
  get processedTasks(): { key: string; tasks: Task[] }[] {
    if (!this.tasks || this.tasks.length === 0) return [];

    let tasks = [...this.standaloneTasks];

    // 1. Сортировка
    const sorted = this.sortTasks(tasks);

    // 2. Группировка
    if (this.groupBy === 'none') {
      return [{ key: 'Все задачи', tasks: sorted }];
    }

    const groups = new Map<string, Task[]>();

    sorted.forEach(task => {
      let groupKey = 'Без группы';

      if (this.groupBy === 'status') {
        groupKey = task.status;
      } else if (this.groupBy === 'user') {
        // В вашем интерфейсе есть только created_by
        groupKey = task.created_by || 'Неизвестный пользователь';
      }

      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push(task);
    });

    return Array.from(groups, ([key, tasks]) => ({ key, tasks }));
  }

  get standaloneTasks(): Task[] {
    return this.sortTasks(this.tasks.filter(t => !t.chain_id));
  }

  get taskChains(): ChainTasks[] {
    const chainMap = new Map<number, ChainTasks>();
    
    for (const chain of this.allChains) {
        chainMap.set(chain.id!, {
          id: chain.id,
          titleChain: chain.titleChain,
          tasksChain: chain.tasksChain,
          deadlineTime: chain.deadlineTime
        });
      
    }

    const chains = Array.from(chainMap.values());
      return chains;
    
  }


  openTaskDetails(task: Task, chain?: ChainTasks): void {
    this.selectedTask = task;
    this.selectedTaskChain = chain ?? null;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.selectedTask = null;
    this.selectedTaskChain = null;
    document.body.style.overflow = '';
  }


toggleChain(chainId?: number): void {
    if (this.expandedChains.has(chainId!)) {
      this.expandedChains.delete(chainId!);
    } else {
      this.expandedChains.add(chainId!);
    }
  }

  isChainExpanded(chainId?: number): boolean {
    return this.expandedChains.has(chainId!);
  }





















  private loadTasks(): void {
    const isAdminOrMod = this.authService.hasRoles(['ROLE_ADMIN', 'ROLE_MODERATOR']);
    const request$ = isAdminOrMod
      ? this.taskService.getAllTasks()
      : this.taskService.getTasks();

    request$.subscribe({
      next: (data) => { this.tasks = data },
      error: (err) => console.error('Ошибка загрузки задач:', err),
      complete: () => this.cd.markForCheck()
    });

    const request2$ = isAdminOrMod
      ? this.taskService.getAllChains()
      : this.taskService.getChains(this.authService.getCurrentUser()?.username!);

    request2$.subscribe({
      next: (data) => { this.allChains = data },
      complete: () => this.cd.markForCheck()
    });
  }

  deleteTask(id: number): void {
    if (!confirm('Удалить задачу?')) return;

    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.cd.markForCheck();
      },
      error: (err) => console.error('Ошибка удаления задачи:', err)
    });
  }

  updateTask(id: number): void {
    this.router.navigate(['/tasks', id]);
  }

  confirmTask(task: Task): void {
    task.status = 'DONE';
    this.taskService.updateTask(task).subscribe({
      next: (response) => {
        this.router.navigate(['/tasks']);
      },
      error: (error) => {
        alert('Ошибка изменения задачи.')
        console.error('Error updating task:', error);
      }
    });
  }

  deleteChain(id: number): void {
    this.taskService.deleteChain(id).subscribe({
      next: () => {
        this.cd.markForCheck();
      },
      error: (err) => console.error('Ошибка удаления цепочки:', err),
      complete: () => this.cd.markForCheck()
    });
  }

  createTask(): void {
    this.router.navigate(['/tasks/new']);
  }

  editChain(id: number): void {
    this.router.navigate(['/chain/', id]);
  }

  isChainCompleted(chain: any): boolean {
    if (!chain.tasksChain || chain.tasksChain.length === 0) {
      return false; 
    }
    // every() вернет true только если каждая задача имеет статус 'DONE'
    return chain.tasksChain.every((task: any) => task.status === 'DONE');
  }
}