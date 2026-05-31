import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, Router } from '@angular/router';
import { SidebarWrapperComponent } from "./shared/components/sidebar-wrapper/sidebar-wrapper.component";
import { AuthService } from './core/services/auth-service';
import { AsyncPipe } from '@angular/common';
import { TaskService } from './core/services/task-service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,  AsyncPipe, SidebarWrapperComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  auth = inject(AuthService);
  taskService = inject(TaskService);
   router = inject(Router);

  onNavigate(path: string) {
    this.router.navigate([path]);
  }

  onTaskSelect(taskId: number) {
    this.router.navigate(['/tasks', taskId]);
  }
}
