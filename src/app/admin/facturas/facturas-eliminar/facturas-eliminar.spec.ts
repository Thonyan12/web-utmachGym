import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturasEliminar } from './facturas-eliminar';

describe('FacturasEliminar', () => {
  let component: FacturasEliminar;
  let fixture: ComponentFixture<FacturasEliminar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacturasEliminar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacturasEliminar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
