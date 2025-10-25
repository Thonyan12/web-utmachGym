import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallefacturaEditar } from './detallefactura-editar';

describe('DetallefacturaEditar', () => {
  let component: DetallefacturaEditar;
  let fixture: ComponentFixture<DetallefacturaEditar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallefacturaEditar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallefacturaEditar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
