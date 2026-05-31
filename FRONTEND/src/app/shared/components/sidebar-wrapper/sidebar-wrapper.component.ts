import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject } from '@angular/core';
import { User } from '../../../core/entity/user';
import { Task } from '../../../core/entity/task';
import { AuthService } from '../../../core/services/auth-service';
import { TaskService } from '../../../core/services/task-service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

declare global {
  interface Window {
    sidebar_app?: any;
  }
}

@Component({
  selector: 'app-sidebar-wrapper',
  template: `<div id="sidebar-root"></div>`,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class SidebarWrapperComponent implements OnInit, OnDestroy, OnChanges {
  @Input() user: User | null = null;
  @Input() tasks: Task[] = [];

  private reactRoot: any = null;
  private SidebarComponent: any = null;
  sidebarTasks: Task[] = [];
  authUser: User | any = null;

  private authService = inject(AuthService);
  private taskService = inject(TaskService);
  private router = inject(Router);

  private taskUpdateSubscription!: Subscription;
  private userSubscription!: Subscription;

  async ngOnInit() {
    await this.loadSidebar();

    this.taskUpdateSubscription = this.taskService.taskChanged$.subscribe(() => {
      this.loadSidebarTasks();
    });

    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.authUser = user;
      if (user) {
        this.loadSidebarTasks();
      }
    });
  }

  onLogoutHandle(): void {
    this.authService.logout();
  }

  onNavigateHandle(path: string | undefined): void {
    this.router.navigate([path]);
  }

  private loadSidebarTasks(): void {
    const isAdminOrMod = this.authService.hasRoles(['ROLE_ADMIN', 'ROLE_MODERATOR']);
    const isUser = this.authService.hasRoles(['ROLE_USER']);

    if (!isAdminOrMod && !isUser) return; // Пользователь ещё не аутентифицирован

    const request$ = isAdminOrMod
      ? this.taskService.getAllTasks()
      : this.taskService.getTasks();

    request$.subscribe({
      next: (tasks) => {
        this.tasks = tasks.slice(0, 5).reverse();
        this.renderSidebar();
      },
      error: (err) => {
        console.error('Ошибка загрузки задач для сайдбара', err);
        this.sidebarTasks = [];
        this.renderSidebar();
      }
    });
  }

  ngOnDestroy() {
    this.taskUpdateSubscription?.unsubscribe();
    this.userSubscription?.unsubscribe();

    if (this.reactRoot && this.reactRoot.unmount) {
      this.reactRoot.unmount();
    }
  }

  private async loadSidebar() {
    try {
      const script = document.createElement('script');
      script.src = 'http://localhost:3001/remoteEntry.js';
      script.type = 'text/javascript';

      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });

      if (window.sidebar_app) {
        await window.sidebar_app.init({
          shareScope: 'default',
        });
      }

      const factory = await window.sidebar_app.get('./Sidebar');
      const module = factory();

      this.SidebarComponent = module.default || module;
    } catch (error) {
      console.error('Failed to load sidebar microfrontend:', error);
    }
  }

  private renderSidebar() {
    if (!this.SidebarComponent) return;

    const container = document.getElementById('sidebar-root');
    if (!container) return;

    const props = {
      user: {
        username: this.authUser?.username,
        roles: this.authUser?.roles?.toString()?.replace('ROLE_USER', 'Пользователь').replace('ROLE_ADMIN', 'Администратор').replace('ROLE_MODERATOR', 'Модератор').replace(',', ', ')
      },
      tasks: this.tasks.map(t => ({
        id: t.id,
        title: t.title,
        status: t.status
      })),
      onLogout: () => this.onLogoutHandle(),
      onNavigate: (path: string) => this.onNavigateHandle(path)
    };

    const React = (window as any).React;
    const ReactDOM = (window as any).ReactDOM;

    const element = React.createElement(this.SidebarComponent, props);

    if (!this.reactRoot) {
      this.reactRoot = ReactDOM.createRoot(container);
    }
    this.reactRoot.render(element);
  }

  ngOnChanges() {
    if (this.SidebarComponent) {
      this.renderSidebar();
    }
  }
}