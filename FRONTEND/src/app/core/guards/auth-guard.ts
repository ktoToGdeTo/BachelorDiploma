import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state): boolean | UrlTree=> {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated) {
    return true;
  }

  return router.parseUrl(`/login?returnUrl=${encodeURIComponent(state.url)}`);
};
