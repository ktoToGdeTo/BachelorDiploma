import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state): boolean | UrlTree=> {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Если пользователь авторизован → разрешаем доступ
  if (authService.isAuthenticated) {
    return true;
  }


  // Иначе → редирект на логин с сохранением целевого URL
  return router.parseUrl(`/login?returnUrl=${encodeURIComponent(state.url)}`);
};
