import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleFacturaCrearComponent } from './detallefactura-crear';

describe('DetallefacturaCrear', () => {
  let component: DetalleFacturaCrearComponent;
  let fixture: ComponentFixture<DetalleFacturaCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleFacturaCrearComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleFacturaCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
