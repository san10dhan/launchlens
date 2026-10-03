import { AuthService } from './../auth/services/auth.service';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  if (req.url.endsWith('/api/auth/login')) {
    return next(req);
  }
  const token = authService.getAccessToken();
  if (!token) {
    return next(req);
  }
  const modifiedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
  return next(modifiedRequest);
};
