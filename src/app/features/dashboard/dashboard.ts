import { Component, computed, inject, signal } from '@angular/core';
import { ExperimentService } from '../experiments/services/experiment.service';
import { Experiment } from '../experiments/models/experiment.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly experimentService = inject(ExperimentService);

  readonly experiments = signal<Experiment[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly totalExperiments = computed(() => this.experiments().length);

  readonly runningExperiments = computed(
    () => this.experiments().filter((experiment) => experiment.status === 'RUNNING').length,
  );

  readonly draftExperiments = computed(
    () => this.experiments().filter((experiment) => experiment.status === 'DRAFT').length,
  );

  readonly completedExperiments = computed(
    () => this.experiments().filter((experiment) => experiment.status === 'COMPLETED').length,
  );

  constructor() {
    this.loadDashboard();
  }

  private loadDashboard(): void {
    this.experimentService.getExperiments().subscribe({
      next: (experiments) => {
        this.experiments.set(experiments);
        this.loading.set(false);
      },

      error: () => {
        this.loading.set(false);
        this.error.set('Unable to load dashboard data.');
      },
    });
  }
}
