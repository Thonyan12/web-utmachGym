import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosListar } from './productos-listar';

describe('ProductosListar', () => {
  let component: ProductosListar;
  let fixture: ComponentFixture<ProductosListar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosListar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosListar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
