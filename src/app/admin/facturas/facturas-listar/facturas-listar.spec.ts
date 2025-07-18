import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturasListarComponent } from './facturas-listar';

describe('FacturasListar', () => {
  let component: FacturasListarComponent;
  let fixture: ComponentFixture<FacturasListarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacturasListarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacturasListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
