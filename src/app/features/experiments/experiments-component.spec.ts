import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentsComponent } from './experiments-component';

describe('ExperimentsComponent', () => {
  let component: ExperimentsComponent;
  let fixture: ComponentFixture<ExperimentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperimentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExperimentsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
