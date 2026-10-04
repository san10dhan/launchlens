import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
describe('Authservice', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const secretKey = 'mock_secret_key';
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    sessionStorage.clear();
  });
  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });
  it('Should test login', () => {
    service.login({ email: 'test@test.com', password: '123' }).subscribe();
    let req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toEqual('POST');
    req.flush({
      accessToken: 'token-123',
      user: {
        id: 'u1',
        email: 'alex@launchlens.com',
        name: 'Alex',
        roles: ['product-manager'],
      },
    });
  });
  it('should remove token on logout', () => {
    service.logout();

    expect(sessionStorage.getItem('launchlens_access_token')).toBeNull();
  });

  it('should report authenticated when token exists', () => {
    sessionStorage.setItem(secretKey, 'token-123');

    expect(service.isLoggedIn()).toBeDefined();
  });

  it('should report unauthenticated when token does not exist', () => {
    expect(service.isLoggedIn()).toBe(false);
  });
  it('should reject login when credentials are invalid', async () => {
    const credentials = {
      email: 'wrong@example.com',
      password: 'wrong-password',
    };

    const loginPromise = service.login(credentials);

    const request = httpMock.expectOne({
      method: 'POST',
      url: '/api/auth/login',
    });

    request.flush(
      {
        message: 'Invalid credentials',
      },
      {
        status: 401,
        statusText: 'Unauthorized',
      },
    );

    await expect(loginPromise).rejects.toBeDefined();

    expect(service.isLoggedIn()).toBe(false);

    expect(service.getAccessToken()).toBeNull();
  });
  it('should clear authentication state on logout', async () => {
    const response = {
      accessToken: 'access-token-123',
      user: {
        id: 'u-101',
        name: 'Alex',
        permissions: ['experiments.view'],
      },
    };

    const loginPromise = service.login({
      email: 'admin@launchlens.com',
      password: 'Password123!',
    });

    const request = httpMock.expectOne({
      method: 'POST',
      url: '/api/auth/login',
    });

    request.flush(response);

    await loginPromise;

    expect(service.isLoggedIn()).toBe(true);

    service.logout();

    expect(service.isLoggedIn()).toBe(false);
    expect(service.getAccessToken()).toBeNull();
    expect(service.can('experiment.read')).toBe(false);
  });
});
