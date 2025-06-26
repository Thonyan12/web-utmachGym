import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosEliminar } from './productos-eliminar';

describe('ProductosEliminar', () => {
  let component: ProductosEliminar;
  let fixture: ComponentFixture<ProductosEliminar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosEliminar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosEliminar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
