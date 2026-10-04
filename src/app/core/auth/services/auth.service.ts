import { User } from './../models/auth.model';
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthRequest, AuthResponse } from '../models/auth-login.model';
import { Observable, tap } from 'rxjs';
import { Permission, ROLE_PERMISSION } from '../models/user-permission.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly secretKey = 'launchlens_secret_key';
  private readonly currentUser = signal<User | null>(this.getUser());
  readonly user = this.currentUser.asReadonly();
  login(credentials: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login', credentials).pipe(
      tap((response) => {
        sessionStorage.setItem(this.secretKey, JSON.stringify(response));
        this.currentUser.set(response.user);
      }),
    );
  }
  logout(): void {
    sessionStorage.removeItem(this.secretKey);
    this.currentUser.set(null);
  }
  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }
  getAccessToken(): string | null {
    const storedData = sessionStorage.getItem(this.secretKey);

    if (!storedData) {
      return null;
    }

    try {
      const response = JSON.parse(storedData) as AuthResponse;

      return response.accessToken ?? null;
    } catch {
      this.logout();
      return null;
    }
  }

  getUser(): User | null {
    let storedObj = sessionStorage.getItem(this.secretKey);
    if (storedObj) {
      return JSON.parse(storedObj).user;
    }
    return null;
  }
  can(permission: Permission): boolean {
    let user = this.user();
    if (!user) {
      return false;
    }
    return ROLE_PERMISSION[user.role].includes(permission);
  }
}
