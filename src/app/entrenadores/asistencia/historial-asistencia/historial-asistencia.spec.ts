import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialAsistencia } from './historial-asistencia';

describe('HistorialAsistencia', () => {
  let component: HistorialAsistencia;
  let fixture: ComponentFixture<HistorialAsistencia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialAsistencia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialAsistencia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
