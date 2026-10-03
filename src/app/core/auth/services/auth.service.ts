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
  private user = this.currentUser.asReadonly();
  login(credentials: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login', credentials).pipe(
      tap((response) => {
        sessionStorage.setItem(this.secretKey, JSON.stringify(response));
      }),
    );
  }
  logout(): void {
    sessionStorage.removeItem(this.secretKey);
  }
  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }
  getAccessToken(): string | null {
    let storedData = sessionStorage.getItem(this.secretKey);
    if (!storedData) {
      return null;
    }
    return JSON.parse(storedData).accessToken;
  }
  getUser(): User | null {
    let storedObj = sessionStorage.getItem(this.secretKey);
    if (storedObj) {
      return JSON.parse(storedObj).User;
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
