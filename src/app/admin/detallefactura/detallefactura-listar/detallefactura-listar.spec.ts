import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallefacturaListar } from './detallefactura-listar';

describe('DetallefacturaListar', () => {
  let component: DetallefacturaListar;
  let fixture: ComponentFixture<DetallefacturaListar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallefacturaListar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallefacturaListar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
