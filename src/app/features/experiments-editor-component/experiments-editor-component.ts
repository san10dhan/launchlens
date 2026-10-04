import { Component, inject, signal } from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ExperimentService } from '../experiments/services/experiment.service';
import { ExperimentStatus } from '../experiments/models/experiment.model';

function dateRangeValidator(control: AbstractControl): ValidationErrors | null {
  const start = control.get('startDate')?.value;
  const end = control.get('endDate')?.value;

  if (!start || !end) {
    return null;
  }

  return new Date(start) <= new Date(end) ? null : { invalidDateRange: true };
}

@Component({
  selector: 'app-experiments-editor',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './experiments-editor-component.html',
  styleUrl: './experiments-editor-component.css',
})
export class ExperimentsEditorComponent {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly experimentService = inject(ExperimentService);

  readonly experimentId = this.route.snapshot.paramMap.get('id');

  readonly isEditMode = signal(!!this.experimentId);

  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],

      description: ['', [Validators.required, Validators.maxLength(500)]],

      status: ['DRAFT' as ExperimentStatus, Validators.required],

      owner: ['', Validators.required],

      trafficPercentage: [100, [Validators.required, Validators.min(1), Validators.max(100)]],

      startDate: [''],

      endDate: [''],
    },
    {
      validators: dateRangeValidator,
    },
  );

  constructor() {
    if (this.experimentId) {
      this.loadExperiment(this.experimentId);
    }
  }

  private loadExperiment(id: string): void {
    this.loading.set(true);

    this.experimentService.getExperiment(id).subscribe({
      next: (experiment) => {
        this.form.patchValue({
          name: experiment.name,
          description: experiment.description,
          status: experiment.status,
          owner: experiment.owner,
          // trafficPercentage: experiment.trafficPercentage,
          startDate: experiment.startDate ?? '',
          endDate: experiment.endDate ?? '',
        });

        this.loading.set(false);
      },

      error: () => {
        this.loading.set(false);
        this.error.set('Unable to load experiment.');
      },
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    const payload = this.form.getRawValue();

    const request$ = this.experimentId
      ? this.experimentService.updateExperiment(this.experimentId, payload)
      : this.experimentService.createExperiment(payload);

    request$.subscribe({
      next: (experiment) => {
        this.router.navigate(['/app/experiments', experiment.id]);
      },

      error: () => {
        this.saving.set(false);
        this.error.set('Unable to save experiment. Please try again.');
      },
    });
  }
}
