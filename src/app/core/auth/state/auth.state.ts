import { User } from '../models/auth.model';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
