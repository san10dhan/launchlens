import { AuthGuard } from './auth.guard';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '../auth/services/auth.service';
import { Router } from '@angular/router';

describe('authGuard', () => {
  let auth: {
    isLoggedIn: ReturnType<typeof vi.fn>;
  };

  let router: {
    createUrlTree: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    auth = {
      isLoggedIn: vi.fn(),
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

  it('allows authenticated users', () => {
    auth.isLoggedIn.mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      AuthGuard({} as any, { url: '/app/dashboard' } as any),
    );

    expect(result).toBe(true);
    expect(router.createUrlTree).not.toHaveBeenCalled();
  });
  it('redirects unauthenticated users to login', () => {
    auth.isLoggedIn.mockReturnValue(false);

    const urlTree = {
      redirect: '/login',
    };

    router.createUrlTree.mockReturnValue(urlTree);

    const result = TestBed.runInInjectionContext(() =>
      AuthGuard({} as any, { url: '/app/dashboard' } as any),
    );

    expect(router.createUrlTree).toHaveBeenCalledWith(['/login'], {
      queryParams: {
        returnUrl: '/app/dashboard',
      },
    });

    expect(result).toBe(urlTree);
  });
});
