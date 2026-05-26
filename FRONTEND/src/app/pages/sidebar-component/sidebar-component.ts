import { Component, inject} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
@Component({
  selector: 'app-sidebar-component',
  imports: [ReactiveFormsModule, AsyncPipe, RouterLinkWithHref, RouterLinkActive],
  templateUrl: './sidebar-component.html',
  styleUrl: './sidebar-component.css',
})
export class SidebarComponent {
  auth = inject(AuthService);
  router = inject(Router);

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  // sidebar-component.ts
get displayRoles(): string {
  const roles = this.auth.getCurrentUser()?.roles;
  if (!roles?.length) return '';

  const roleMap: Record<string, string> = {
    'ROLE_USER': 'Пользователь',
    'ROLE_MODERATOR': 'Модератор',
    'ROLE_ADMIN': 'Администратор'
  };

  return roles.map(r => {
    // 🔒 Безопасно извлекаем имя роли
    const name = r?.name || '';
    // Сначала ищем в карте, если нет — убираем префикс ROLE_
    return roleMap[name] ?? name.replace(/^ROLE_/, '');
  }).join(', ');
}


}
