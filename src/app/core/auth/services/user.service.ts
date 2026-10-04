import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User, UserRole } from '../models/auth.model';

export interface CreateUserRequest {
  name: string;
  email: string;
  role: UserRole;
}

export type UpdateUserRequest = CreateUserRequest;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }

  createUser(payload: CreateUserRequest): Observable<User> {
    return this.http.post<User>('/api/users', payload);
  }

  updateUser(id: string, payload: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`/api/users/${id}`, payload);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`/api/users/${id}`);
  }
}
