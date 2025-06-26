import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosDetalle } from './productos-detalle';

describe('ProductosDetalle', () => {
  let component: ProductosDetalle;
  let fixture: ComponentFixture<ProductosDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosDetalle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosDetalle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
