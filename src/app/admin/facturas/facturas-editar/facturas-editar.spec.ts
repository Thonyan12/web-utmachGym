import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturasEditar } from './facturas-editar';

describe('FacturasEditar', () => {
  let component: FacturasEditar;
  let fixture: ComponentFixture<FacturasEditar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacturasEditar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacturasEditar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
