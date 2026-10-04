import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentDetailComponent } from './experiment-detail-component';

describe('ExperimentDetailComponent', () => {
  let component: ExperimentDetailComponent;
  let fixture: ComponentFixture<ExperimentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperimentDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExperimentDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
