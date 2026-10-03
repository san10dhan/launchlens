export type UserRole = 'admin' | 'manager' | 'analyst';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
