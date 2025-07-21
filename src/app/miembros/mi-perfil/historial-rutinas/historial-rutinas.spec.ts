import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialRutinas } from './historial-rutinas';

describe('HistorialRutinas', () => {
  let component: HistorialRutinas;
  let fixture: ComponentFixture<HistorialRutinas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialRutinas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialRutinas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
