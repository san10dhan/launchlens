import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./core/auth/login-component/login-component').then((m) => m.LoginComponent),
  },
  {
    path: 'forbidden',
    loadComponent: () =>
      import('./shared/components/forbidden-component/forbidden-component').then(
        (m) => m.ForbiddenComponent,
      ),
  },
  {
    path: 'app',
    loadChildren: () => import('../app/features/app/app.routes').then((m) => m.APP_ROUTES),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'app',
    pathMatch: 'full',
  },
];
