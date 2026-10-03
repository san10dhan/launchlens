import { AuthInterceptor } from './auth.interceptor';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '../auth/services/auth.service';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';

describe('AuthInterceptor', () => {
  let httpController: HttpTestingController;
  let authServiceMock: { getAccessToken: ReturnType<typeof vi.fn> };
  let httpClient: HttpClient;
  beforeEach(() => {
    authServiceMock = { getAccessToken: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        provideHttpClient(withInterceptors([AuthInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    httpController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });
  afterEach(() => {
    httpController.verify();
  });
  it('Add authorization headers to trusted domain', () => {
    authServiceMock.getAccessToken.mockReturnValue('test-token-123');
    httpClient.get('/api/experiments').subscribe();
    let req = httpController.expectOne('/api/experiments');
    expect(req.request.headers.has('Authorization')).toBe(true);
  });
});
