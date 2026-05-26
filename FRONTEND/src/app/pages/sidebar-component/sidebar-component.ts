import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { TaskService } from '../../core/services/task-service';
import { Task } from '../../core/entity/task';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-sidebar-component',
  imports: [ReactiveFormsModule, AsyncPipe, RouterLinkWithHref, RouterLinkActive],
  templateUrl: './sidebar-component.html',
  styleUrl: './sidebar-component.css',
})
export class SidebarComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  taskService = inject(TaskService);
  private taskUpdateSubscription!: Subscription;
  private userSubscription!: Subscription;
  router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

get displayRoles(): string {
  const roles = this.authService.getCurrentUser()?.roles?.toString();

  const result = roles?.replace('ROLE_USER', 'Пользователь').replace('ROLE_ADMIN', 'Администратор').replace('ROLE_MODERATOR', 'Модератор').replace(',',', ');
  return result!;
  
}

sidebarTasks: Task[] = [];

  ngOnInit(): void {
    this.taskUpdateSubscription = this.taskService.taskChanged$.subscribe(() => {
      this.loadSidebarTasks();
    });

    // 🔔 Подписываемся на текущего пользователя — загрузим задачи, когда он станет известен
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.loadSidebarTasks();
      }
    });
  }

  ngOnDestroy(): void {
    this.taskUpdateSubscription?.unsubscribe();
    this.userSubscription?.unsubscribe();
  }

  private loadSidebarTasks(): void {
    // Теперь здесь можно безопасно читать роли — user уже загружен
    const isAdminOrMod = this.authService.hasRoles(['ROLE_ADMIN', 'ROLE_MODERATOR']);
    const isUser = this.authService.hasRoles(['ROLE_USER']);
    
    if (!isAdminOrMod && !isUser) return; // Пользователь ещё не аутентифицирован

    const request$ = isAdminOrMod 
      ? this.taskService.getAllTasks() 
      : this.taskService.getTasks();

    request$.subscribe({
      next: (tasks) => this.sidebarTasks = tasks.slice(0, 5).reverse(),
      error: (err) => console.error('Ошибка загрузки задач для сайдбара', err)
    });
  
  }

  getStatusColor(status: string | undefined): string {
    const s = status?.toUpperCase();
    switch (s) {
      case 'OPEN': return '#2196F3';      // Синий
      case 'IN_PROGRESS': return '#FF9800'; // Оранжевый
      case 'DONE': return '#4CAF50';      // Зелёный
      case 'CLOSED': return '#9E9E9E';    // Серый
      default: return '#E0E0E0';
    }
  }

  navigateToTask(id: number | undefined): void {
    if (id) this.router.navigate(['/tasks', id]);
  }


}
