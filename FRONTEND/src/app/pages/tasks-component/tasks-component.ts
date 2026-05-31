import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Task } from '../../core/entity/task';
import { TaskService } from '../../core/services/task-service';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { CommonModule } from '@angular/common';
import { TaskCardComponent } from '../task-card-component/task-card-component';

@Component({
  selector: 'app-tasks-component',
  standalone: true,
  imports: [CommonModule, TaskCardComponent],
  templateUrl: './tasks-component.html',
  styleUrl: './tasks-component.css',
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];

  private authService = inject(AuthService);
  private taskService = inject(TaskService);
  private router = inject(Router);
  private cd = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadTasks();
  }

  private loadTasks(): void {
    const isAdminOrMod = this.authService.hasRoles(['ROLE_ADMIN', 'ROLE_MODERATOR']);
    const request$ = isAdminOrMod
      ? this.taskService.getAllTasks()
      : this.taskService.getTasks();

    request$.subscribe({
      next: (data) => this.tasks = data,
      error: (err) => console.error('Ошибка загрузки задач:', err),
      complete: () => this.cd.markForCheck()
    });
  }

  deleteTask(id: number): void {
    if (!confirm('Удалить задачу?')) return;

    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(task => task.id !== id);
      },
      error: (err) => console.error('Ошибка удаления задачи:', err)
    });
  }

  updateTask(id: number): void {
    this.router.navigate(['/tasks', id]);
  }
}