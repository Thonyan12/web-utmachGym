import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiembrosDashboard } from './miembros-dashboard';

describe('MiembrosDashboard', () => {
  let component: MiembrosDashboard;
  let fixture: ComponentFixture<MiembrosDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiembrosDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiembrosDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
