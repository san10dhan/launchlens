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
});
