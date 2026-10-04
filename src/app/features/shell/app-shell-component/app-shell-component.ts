import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../../../core/auth/services/auth.service';

@Component({
  selector: 'app-app-shell-component',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app-shell-component.html',
  styleUrl: './app-shell-component.css',
})
export class AppShellComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly user = this.authService.user;

  readonly navigation = [
    {
      label: 'Dashboard',
      path: '/app/dashboard',
      icon: '📊',
    },
    {
      label: 'Experiments',
      path: '/app/experiments',
      icon: '🧪',
    },
    {
      label: 'Users',
      path: '/app/manage-user',
      icon: '👥',
    },
  ];

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
