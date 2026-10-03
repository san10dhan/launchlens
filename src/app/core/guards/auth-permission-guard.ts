import { CanActivateFn, Router } from '@angular/router';
import { Permission } from '../auth/models/user-permission.model';
import { AuthService } from '../auth/services/auth.service';
import { inject } from '@angular/core';

export const PermissionGuard = (permission: Permission): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    if (authService.can(permission)) {
      return true;
    }
    return router.createUrlTree(['/forbidden']);
  };
};
