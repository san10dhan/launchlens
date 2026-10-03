import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentsEditorComponent } from './experiments-editor-component';

describe('ExperimentsEditorComponent', () => {
  let component: ExperimentsEditorComponent;
  let fixture: ComponentFixture<ExperimentsEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperimentsEditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExperimentsEditorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
