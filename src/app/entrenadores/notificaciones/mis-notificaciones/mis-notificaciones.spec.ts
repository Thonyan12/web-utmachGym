import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisNotificaciones } from './mis-notificaciones';

describe('MisNotificaciones', () => {
  let component: MisNotificaciones;
  let fixture: ComponentFixture<MisNotificaciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisNotificaciones]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisNotificaciones);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
