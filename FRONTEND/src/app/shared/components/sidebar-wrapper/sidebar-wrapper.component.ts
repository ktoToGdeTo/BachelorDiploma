import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../core/entity/user';
import { Task } from '../../core/entity/task';

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
export class SidebarWrapperComponent implements OnInit, OnDestroy {
  @Input() isAuthenticated = false;
  @Input() user: User | null = null;
  @Input() tasks: Task[] = [];
  @Output() logout = new EventEmitter<void>();
  @Output() navigate = new EventEmitter<string>();
  @Output() taskSelect = new EventEmitter<number>();

  private reactRoot: any = null;
  private SidebarComponent: any = null;

  async ngOnInit() {
    await this.loadSidebar();
    this.renderSidebar();
  }

  ngOnDestroy() {
    if (this.reactRoot && this.reactRoot.unmount) {
      this.reactRoot.unmount();
    }
  }

  private async loadSidebar() {
    try {
      // Загрузка remoteEntry.js из микрофронтенда сайдбара
      const script = document.createElement('script');
      script.src = 'http://localhost:3001/remoteEntry.js';
      script.type = 'text/javascript';
      
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });

      // Инициализация контейнера
      if (window.sidebar_app) {
        await window.sidebar_app.init({
          shareScope: 'default',
        });
      }

      // Получение компонента Sidebar
      const factory = await window.sidebar_app.get('./Sidebar');
      this.SidebarComponent = factory();
    } catch (error) {
      console.error('Failed to load sidebar microfrontend:', error);
    }
  }

  private renderSidebar() {
    if (!this.SidebarComponent) return;

    const container = document.getElementById('sidebar-root');
    if (!container) return;

    // Создание React-компонента с пропсами
    const props = {
      isAuthenticated: this.isAuthenticated,
      user: this.user ? { id: this.user.id, name: this.user.name, email: this.user.email } : null,
      tasks: this.tasks.map(t => ({ id: t.id, title: t.title, status: t.status })),
      onLogout: () => this.logout.emit(),
      onNavigate: (path: string) => this.navigate.emit(path),
      onTaskSelect: (taskId: number) => this.taskSelect.emit(taskId),
    };

    // Рендеринг через ReactDOM (требуется глобальный React)
    const React = (window as any).React;
    const ReactDOM = (window as any).ReactDOM;

    if (React && ReactDOM) {
      const element = React.createElement(this.SidebarComponent, props);
      this.reactRoot = ReactDOM.createRoot(container);
      this.reactRoot.render(element);
    } else {
      console.error('React or ReactDOM not found in window');
    }
  }

  ngOnChanges() {
    // Перерисовка при изменении входных данных
    if (this.SidebarComponent) {
      this.renderSidebar();
    }
  }
}
