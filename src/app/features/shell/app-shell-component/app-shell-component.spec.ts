import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppShellComponent } from './app-shell-component';

describe('AppShellComponent', () => {
  let component: AppShellComponent;
  let fixture: ComponentFixture<AppShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppShellComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('renders application navigation', async () => {
    await TestBed.configureTestingModule({
      imports: [AppShellComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppShellComponent);

    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll('a');

    expect(Array.from(links).some((link: any) => link.textContent.trim() === 'Experiments')).toBe(
      true,
    );

    expect(Array.from(links).some((link: any) => link.textContent.trim() === 'Users')).toBe(true);
  });
});
