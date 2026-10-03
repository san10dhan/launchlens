import { UserRole } from './auth.model';

export type Permission = 'experiment.read' | 'experiment.write' | 'users.manage';

export const ROLE_PERMISSION: Record<UserRole, Permission[]> = {
  admin: ['experiment.read', 'experiment.write', 'users.manage'],
  analyst: ['experiment.read'],
  manager: ['experiment.read', 'experiment.write'],
};
