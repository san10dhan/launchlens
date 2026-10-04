import { Component, inject, signal } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { User, UserRole } from '../../core/auth/models/auth.model';
import { UserService } from '../../core/auth/services/user.service';

@Component({
  selector: 'app-user-management',
  imports: [ReactiveFormsModule],
  templateUrl: './user-management-component.html',
  styleUrl: './user-management-component.css',
})
export class UserManagementComponent {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);

  readonly users = signal<User[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly editingUserId = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['analyst' as UserRole, Validators.required],
  });

  constructor() {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.loading.set(true);

    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },

      error: () => {
        this.loading.set(false);
        this.error.set('Unable to load users.');
      },
    });
  }

  saveUser(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    const payload = this.form.getRawValue();
    const id = this.editingUserId();

    const request$ = id
      ? this.userService.updateUser(id, payload)
      : this.userService.createUser(payload);

    request$.subscribe({
      next: (user) => {
        if (id) {
          this.users.update((users) =>
            users.map((existing) => (existing.id === user.id ? user : existing)),
          );
        } else {
          this.users.update((users) => [...users, user]);
        }

        this.resetForm();
      },

      error: () => {
        this.saving.set(false);
        this.error.set('Unable to save user.');
      },
    });
  }

  editUser(user: User): void {
    this.editingUserId.set(user.id);

    this.form.setValue({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  }

  deleteUser(user: User): void {
    if (!confirm(`Delete ${user.name}?`)) {
      return;
    }

    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.users.update((users) => users.filter((existing) => existing.id !== user.id));
      },

      error: () => {
        this.error.set('Unable to delete user.');
      },
    });
  }

  resetForm(): void {
    this.editingUserId.set(null);

    this.form.reset({
      name: '',
      email: '',
      role: 'analyst',
    });

    this.saving.set(false);
  }
}
