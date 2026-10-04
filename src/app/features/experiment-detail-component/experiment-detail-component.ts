import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';

import { ExperimentService } from '../experiments/services/experiment.service';
import { Experiment } from '../experiments/models/experiment.model';

@Component({
  selector: 'app-experiment-detail-component',
  imports: [RouterLink],
  templateUrl: './experiment-detail-component.html',
  styleUrl: './experiment-detail-component.css',
})
export class ExperimentDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly experimentService = inject(ExperimentService);

  readonly experiment = signal<Experiment | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    this.route.paramMap
      .pipe(switchMap((params) => this.experimentService.getExperiment(params.get('id')!)))
      .subscribe({
        next: (experiment) => {
          this.experiment.set(experiment);
          this.loading.set(false);
        },

        error: () => {
          this.loading.set(false);
          this.error.set('Unable to load this experiment.');
        },
      });
  }
}
