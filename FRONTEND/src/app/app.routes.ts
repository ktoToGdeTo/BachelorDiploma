import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login-component/login-component';
import { TasksComponent } from './pages/tasks-component/tasks-component';
import { EditAddTaskComponent } from './pages/edit-add-task-component/edit-add-task-component';
import { RegisterComponent } from './pages/register-component/register-component';
import { UsersComponent } from './pages/users-component/users-component';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
import { CreateChainComponent } from './pages/create-chain-component/create-chain-component';
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
  { path: "chain",
    children: [
      { path: ":id", component: CreateChainComponent },
      { path: "create", component: CreateChainComponent }
      
    ],
    canActivate: [authGuard, roleGuard(['ROLE_ADMIN', 'ROLE_MODERATOR'])] },
  
  { path: "**", redirectTo: "login" }
];
