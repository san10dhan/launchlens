import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Experiment, ExperimentStatus } from '../models/experiment.model';

export interface ExperimentFilters {
  query: string;
  status: ExperimentStatus | 'ALL';
}

@Injectable({
  providedIn: 'root',
})
export class ExperimentService {
  private readonly http = inject(HttpClient);

  getExperiments(filters?: Partial<ExperimentFilters>): Observable<Experiment[]> {
    let params = new HttpParams();

    if (filters?.query) {
      params = params.set('query', filters.query);
    }

    if (filters?.status && filters.status !== 'ALL') {
      params = params.set('status', filters.status);
    }

    return this.http.get<Experiment[]>('/api/experiments', { params });
  }

  getExperiment(id: string): Observable<Experiment> {
    return this.http.get<Experiment>(`/api/experiments/${id}`);
  }

  createExperiment(experiment: Omit<Experiment, 'id'>): Observable<Experiment> {
    return this.http.post<Experiment>('/api/experiments', experiment);
  }

  updateExperiment(id: string, experiment: Partial<Experiment>): Observable<Experiment> {
    return this.http.put<Experiment>(`/api/experiments/${id}`, experiment);
  }

  deleteExperiment(id: string): Observable<void> {
    return this.http.delete<void>(`/api/experiments/${id}`);
  }
}
