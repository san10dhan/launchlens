import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';

import { Observable, delay, of, throwError } from 'rxjs';

import { AuthRequest, AuthResponse } from '../auth/models/auth-login.model';

import { User } from '../auth/models/auth.model';

import { Experiment } from '../../features/experiments/models/experiment.model';
import { MOCK_EXPERIMENTS } from './mock-data/experiment.mock';

const USERS: Array<User & { password: string }> = [
  {
    id: 'u1',
    name: 'Alex Johnson',
    email: 'admin@launchlens.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    id: 'u2',
    name: 'Sarah Miller',
    email: 'manager@launchlens.com',
    password: 'manager123',
    role: 'manager',
  },
  {
    id: 'u3',
    name: 'David Wilson',
    email: 'analyst@launchlens.com',
    password: 'analyst123',
    role: 'analyst',
  },
];

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  // Authentication
  if (req.url === '/api/auth/login') {
    return login(req);
  }

  // Experiments
  if (req.url === '/api/experiments') {
    return handleExperiments(req);
  }

  const experimentMatch = req.url.match(/^\/api\/experiments\/(.+)$/);

  if (experimentMatch) {
    return handleExperimentById(req, experimentMatch[1]);
  }

  return next(req);
};

function login(req: Parameters<HttpInterceptorFn>[0]): Observable<HttpEvent<unknown>> {
  const credentials = req.body as AuthRequest;

  const user = USERS.find(
    (candidate) =>
      candidate.email === credentials.email && candidate.password === credentials.password,
  );

  if (!user) {
    return throwError(
      () =>
        new HttpErrorResponse({
          status: 401,
          statusText: 'Unauthorized',
          error: {
            message: 'Invalid credentials',
          },
        }),
    );
  }

  const response: AuthResponse = {
    accessToken: `mock-token-${user.id}`,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };

  return of(
    new HttpResponse({
      status: 200,
      body: response,
    }),
  ).pipe(delay(400));
}

function handleExperiments(req: Parameters<HttpInterceptorFn>[0]): Observable<HttpEvent<unknown>> {
  if (req.method === 'GET') {
    return getExperiments(req);
  }

  if (req.method === 'POST') {
    return createExperiment(req);
  }

  return methodNotAllowed();
}

function getExperiments(req: Parameters<HttpInterceptorFn>[0]): Observable<HttpEvent<unknown>> {
  const query = req.params.get('query')?.trim().toLowerCase() ?? '';

  const status = req.params.get('status');

  let result = [...MOCK_EXPERIMENTS];

  if (query) {
    result = result.filter((experiment) => experiment.name.toLowerCase().includes(query));
  }

  if (status) {
    result = result.filter((experiment) => experiment.status === status);
  }

  return of(
    new HttpResponse({
      status: 200,
      body: result,
    }),
  ).pipe(delay(300));
}

function createExperiment(req: Parameters<HttpInterceptorFn>[0]): Observable<HttpEvent<unknown>> {
  const experiment = req.body as Experiment;

  const created: Experiment = {
    ...experiment,
    id: `exp-${Date.now()}`,
  };

  MOCK_EXPERIMENTS.push(created);

  return of(
    new HttpResponse({
      status: 201,
      body: created,
    }),
  ).pipe(delay(300));
}

function handleExperimentById(
  req: Parameters<HttpInterceptorFn>[0],
  id: string,
): Observable<HttpEvent<unknown>> {
  const index = MOCK_EXPERIMENTS.findIndex((experiment) => experiment.id === id);

  if (index === -1) {
    return notFound();
  }

  if (req.method === 'GET') {
    return of(
      new HttpResponse({
        status: 200,
        body: MOCK_EXPERIMENTS[index],
      }),
    ).pipe(delay(250));
  }

  if (req.method === 'PUT') {
    const updated: Experiment = {
      ...MOCK_EXPERIMENTS[index],
      ...(req.body as Partial<Experiment>),
      id,
    };

    MOCK_EXPERIMENTS[index] = updated;

    return of(
      new HttpResponse({
        status: 200,
        body: updated,
      }),
    ).pipe(delay(300));
  }

  if (req.method === 'DELETE') {
    MOCK_EXPERIMENTS.splice(index, 1);

    return of(
      new HttpResponse({
        status: 204,
      }),
    ).pipe(delay(300));
  }

  return methodNotAllowed();
}

function notFound(): Observable<never> {
  return throwError(
    () =>
      new HttpErrorResponse({
        status: 404,
        statusText: 'Not Found',
      }),
  );
}

function methodNotAllowed(): Observable<never> {
  return throwError(
    () =>
      new HttpErrorResponse({
        status: 405,
        statusText: 'Method Not Allowed',
      }),
  );
}
