import { TestBed } from '@angular/core/testing';

import { NotificacionesMiembroService } from './notificaciones-miembro';

describe('NotificacionesMiembroService', () => {
  let service: NotificacionesMiembroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificacionesMiembroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
