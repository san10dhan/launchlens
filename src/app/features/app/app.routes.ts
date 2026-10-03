import { Routes } from '@angular/router';
import { PermissionGuard } from '../../core/guards/auth-permission-guard';

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../shell/app-shell-component/app-shell-component').then((m) => m.AppShellComponent),
    children: [
      {
        path: 'experiments',
        loadComponent: () =>
          import('../experiments-component/experiments-component').then(
            (a) => a.ExperimentsComponent,
          ),
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
        path: 'manage-user',
        loadComponent: () =>
          import('../user-management-component/user-management-component').then(
            (a) => a.UserManagementComponent,
          ),
        canActivate: [PermissionGuard('users.manage')],
      },
    ],
  },
];
