import { Component, DestroyRef, computed, inject, signal } from '@angular/core';

import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  switchMap,
  catchError,
  of,
  combineLatest,
} from 'rxjs';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { Experiment, ExperimentStatus } from './models/experiment.model';

import { ExperimentService } from './services/experiment.service';

@Component({
  selector: 'app-experiments',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './experiments-component.html',
  styleUrl: './experiments-component.css',
})
export class ExperimentsComponent {
  private readonly experimentService = inject(ExperimentService);

  private readonly destroyRef = inject(DestroyRef);

  readonly searchControl = new FormControl('', {
    nonNullable: true,
  });

  readonly statusControl = new FormControl<ExperimentStatus | 'ALL'>('ALL', {
    nonNullable: true,
  });

  readonly experiments = signal<Experiment[]>([]);

  readonly loading = signal(false);

  readonly error = signal<string | null>(null);

  readonly hasExperiments = computed(() => this.experiments().length > 0);

  constructor() {
    this.loadExperiments();
  }

  private loadExperiments(): void {
    combineLatest([
      this.searchControl.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
      ),

      this.statusControl.valueChanges.pipe(
        startWith<ExperimentStatus | 'ALL'>('ALL'),
        distinctUntilChanged(),
      ),
    ])
      .pipe(
        switchMap(([query, status]) => {
          this.loading.set(true);
          this.error.set(null);

          return this.experimentService
            .getExperiments({
              query,
              status,
            })
            .pipe(
              catchError(() => {
                this.error.set('Unable to load experiments.');

                return of([]);
              }),
            );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (experiments) => {
          this.experiments.set(experiments);
          this.loading.set(false);
        },
      });
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }
}
