import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Notifiacion } from './notifiacion';
import { NotificacionesMiembroService } from '../services/notificaciones-miembro';
import { SocketService } from '../../services/socket.service';

describe('Notifiacion', () => {
  let component: Notifiacion;
  let fixture: ComponentFixture<Notifiacion>;

  const mockNotiService = {
    getMisNotificaciones: () => of({ success: true, data: [] }),
    generarNotificacionEntrenador: () => of({ success: false }),
    marcarComoLeida: () => of({ success: true })
  };

  const mockSocketService = {
    connect: () => {},
    disconnect: () => {},
    on: (event: string) => of()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Notifiacion],
      providers: [
        { provide: NotificacionesMiembroService, useValue: mockNotiService },
        { provide: SocketService, useValue: mockSocketService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Notifiacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
