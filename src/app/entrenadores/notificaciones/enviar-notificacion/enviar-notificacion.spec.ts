import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviarNotificacion } from './enviar-notificacion';

describe('EnviarNotificacion', () => {
  let component: EnviarNotificacion;
  let fixture: ComponentFixture<EnviarNotificacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnviarNotificacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnviarNotificacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
