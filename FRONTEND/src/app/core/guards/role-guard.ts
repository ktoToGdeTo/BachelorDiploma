import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => 
  (route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    return auth.hasRoles(allowedRoles) ? true : router.parseUrl('/tasks');

  };
