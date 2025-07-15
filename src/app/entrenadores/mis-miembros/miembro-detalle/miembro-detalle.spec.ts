import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiembroDetalle } from './miembro-detalle';

describe('MiembroDetalle', () => {
  let component: MiembroDetalle;
  let fixture: ComponentFixture<MiembroDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiembroDetalle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiembroDetalle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
