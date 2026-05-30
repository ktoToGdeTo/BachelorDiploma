import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login-component/login-component';
import { TasksComponent } from './pages/tasks-component/tasks-component';
import { EditAddTaskComponent } from './pages/edit-add-task-component/edit-add-task-component';
import { RegisterComponent } from './pages/register-component/register-component';
import { UsersComponent } from './pages/users-component/users-component';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
export const routes: Routes = [
  { path: "", redirectTo:"tasks", pathMatch:"full" },
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
  { path: "users/all", component: UsersComponent, canActivate: [authGuard, roleGuard(['ROLE_ADMIN'])] },
  { 
    path: "tasks", 
    children: [
      { path: "", component: TasksComponent },
      { path: ":id", component: EditAddTaskComponent },
      { path: "new", component: EditAddTaskComponent }
    ],
    canActivate: [authGuard]    
  },
  
  { path: "**", redirectTo: "login" }
];
