import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth-service';
import { User } from '../../core/entity/user';
import { FormsModule } from '@angular/forms';
import { RoleNamePipe } from '../../core/pipes/role-name-pipe';

@Component({
  selector: 'app-users-component',
  imports: [FormsModule, RoleNamePipe],
  templateUrl: './users-component.html',
  styleUrl: './users-component.css',
})
export class UsersComponent implements OnInit{
  authService = inject(AuthService);
  private cd = inject(ChangeDetectorRef);

  editUsername: string | null = null;
  newPassword = '';

  users: User[] = [];

  ngOnInit(): void {
    this.authService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.cd.markForCheck();
      },
      error: (err) => {
        console.error('Ошибка при получении пользователей', err);
      }
    });
  }

  onDelete(user: User){
    if (!confirm(`Удалить ${user.username}?`)) return;

    this.authService.deleteUser(user.username).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.username !== user.username);
        this.cd.markForCheck();
      },
      error: (err) => {
        console.error('Error deleting user', err);
      }
    });
  }

  startEdit(username: string){
    this.editUsername = username;
    this.newPassword = '';
  }

  cancelEdit(){
    this.editUsername =  null;
    this.newPassword = '';
  }

  saveEdit(){
    if (!this.editUsername || !this.newPassword.trim()) return;

    this.authService.changePassword(this.editUsername, this.newPassword).subscribe({
      next: () => {
        alert("Пароль успешно изменён");
        this.cancelEdit();
        this.cd.markForCheck();
      },
      error: (err) => console.error('Ошибка смены пароля', err)
    });
  }

  onAssign(username: string, role: string){
  this.authService.assignRole(username, role).subscribe({
      next: () => {
        alert("Модератор успешно добавлен");
        this.cd.markForCheck();
      },
      error: (err) => console.error('Ошибка смены модератора', err)
    });
  
  }

  onDeAssign(username: string, role: string){
  this.authService.deAssignRole(username, role).subscribe({
      next: () => {
        alert("Модератор успешно удален");
        this.cd.markForCheck();
      },
      error: (err) => console.error('Ошибка смены модератора', err)
    });
  }
}
