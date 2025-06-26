import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosSidebar } from './productos-sidebar';

describe('ProductosSidebar', () => {
  let component: ProductosSidebar;
  let fixture: ComponentFixture<ProductosSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
