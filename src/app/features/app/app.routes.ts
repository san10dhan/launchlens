import { Routes } from '@angular/router';
import { PermissionGuard } from '../../core/guards/auth-permission-guard';

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../shell/app-shell-component/app-shell-component').then((m) => m.AppShellComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('../dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'experiments',
        loadComponent: () =>
          import('../experiments/experiments-component').then((a) => a.ExperimentsComponent),
        canActivate: [PermissionGuard('experiment.read')],
      },
      {
        path: 'experiments/new',
        loadComponent: () =>
          import('../experiments-editor-component/experiments-editor-component').then(
            (a) => a.ExperimentsEditorComponent,
          ),
        canActivate: [PermissionGuard('experiment.write')],
      },
      {
        path: 'experiments/:id/edit',
        loadComponent: () =>
          import('../experiments-editor-component/experiments-editor-component').then(
            (m) => m.ExperimentsEditorComponent,
          ),
        canActivate: [PermissionGuard('experiment.write')],
      },
      {
        path: 'experiments/:id',
        loadComponent: () =>
          import('../experiment-detail-component/experiment-detail-component').then(
            (m) => m.ExperimentDetailComponent,
          ),
        canActivate: [PermissionGuard('experiment.read')],
      },
      {
        path: 'manage-user',
        loadComponent: () =>
          import('../user-management-component/user-management-component').then(
            (a) => a.UserManagementComponent,
          ),
        canActivate: [PermissionGuard('users.manage')],
      },
      {
        path: '**',
        redirectTo: 'dashboard',
      },
    ],
  },
];
