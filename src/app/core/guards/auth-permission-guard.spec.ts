import { TestBed } from '@angular/core/testing';
import { PermissionGuard } from './auth-permission-guard';
import { AuthService } from '../auth/services/auth.service';
import { Router } from '@angular/router';

describe('permissionGuard', () => {
  let auth: {
    can: ReturnType<typeof vi.fn>;
  };

  let router: {
    createUrlTree: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    auth = {
      can: vi.fn(),
    };

    router = {
      createUrlTree: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: auth,
        },
        {
          provide: Router,
          useValue: router,
        },
      ],
    });
  });

  it('allows navigation when permission exists', () => {
    auth.can.mockReturnValue(true);

    const guard = PermissionGuard('experiment.read');

    const result = TestBed.runInInjectionContext(() =>
      guard({} as any, { url: '/app/experiments' } as any),
    );

    expect(auth.can).toHaveBeenCalledWith('experiments.view');

    expect(result).toBe(true);
  });
  it('redirects when permission is missing', () => {
    auth.can.mockReturnValue(false);

    const urlTree = {
      redirect: '/forbidden',
    };

    router.createUrlTree.mockReturnValue(urlTree);

    const guard = PermissionGuard('users.manage');

    const result = TestBed.runInInjectionContext(() =>
      guard({} as any, { url: '/app/manage-users' } as any),
    );

    expect(auth.can).toHaveBeenCalledWith('users.manage');

    expect(router.createUrlTree).toHaveBeenCalledWith(['/forbidden'], {
      queryParams: {
        returnUrl: '/app/manage-users',
      },
    });

    expect(result).toBe(urlTree);
  });
});
