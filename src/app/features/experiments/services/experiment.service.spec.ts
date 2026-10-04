import { provideHttpClient } from "@angular/common/http";
import { Experiment } from "../models/experiment.model";
import { ExperimentService } from "./experiment.service";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

describe('ExperimentService', () => {
  let service: ExperimentService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExperimentService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ExperimentService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should load experiments', () => {
    const mockExperiments: Experiment[] = [
      {
        id: 'exp-101',
        name: 'Checkout Redesign',
        description: 'Test checkout',
        status: 'RUNNING',
        owner: 'Rahul',
        startDate: '2026-09-01',
        endDate: '2026-10-15',
      },
    ];

    service.getExperiments().subscribe((result) => {
      expect(result).toEqual(mockExperiments);
    });

    const request = httpController.expectOne('/api/experiments');

    expect(request.request.method).toBe('GET');

    request.flush(mockExperiments);
  });
});
