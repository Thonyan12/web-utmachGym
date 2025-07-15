import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrenadoresDashboard } from './entrenadores-dashboard';

describe('EntrenadoresDashboard', () => {
  let component: EntrenadoresDashboard;
  let fixture: ComponentFixture<EntrenadoresDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntrenadoresDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntrenadoresDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
