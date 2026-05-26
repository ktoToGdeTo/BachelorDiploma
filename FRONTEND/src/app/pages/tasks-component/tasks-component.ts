import { ChangeDetectorRef, Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Task } from '../../core/entity/task';
import { TaskService } from '../../core/services/task-service';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { CommonModule } from '@angular/common';
import { TaskCardComponent } from '../task-card-component/task-card-component';
@Component({
  selector: 'app-tasks-component',
  imports: [CommonModule, TaskCardComponent],
  templateUrl: './tasks-component.html',
  styleUrl: './tasks-component.css',
})
export class TasksComponent {
  tasks: Task[] = [];

  authService = inject(AuthService);
  taskService = inject(TaskService);
  router = inject(Router);
  private cd = inject(ChangeDetectorRef);

  userId$: number = 0;

  ngOnInit(): void {
    if (this.authService.hasRoles(['ROLE_ADMIN', 'ROLE_MODERATOR'])) {
      this.getAllTasks();
    }
    else if (this.authService.hasRoles(['ROLE_USER'])) {
      this.getTasksByCurrentUser();
    }
  }

  getAllTasks() {
    this.taskService.getAllTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        console.log(this.tasks)
        this.cd.markForCheck();
      },
      error: (err) => {
        console.error('Ошибка при загрузке тасок admin.', err);
      }
    });
  }

  getTasksByCurrentUser() {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        console.log(this.tasks)
        this.cd.markForCheck();
      },
      error: (err) => {
        console.error('Ошибка при загрузке тасок user.', err);
      }
    });
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe({
      next: (msg: any) => {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.cd.markForCheck();
      },
      error: (err) => {
        console.error('Error deleting task', err);
      }
    });
  }

  updateTask(id: number) {
    console.log(`Переход по ID: ${id}`);
    this.router.navigate(['/tasks/', id]);
  }
}
