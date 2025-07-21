import { TestBed } from '@angular/core/testing';

import { NotificacionesMiembro } from './notificaciones-miembro';

describe('NotificacionesMiembro', () => {
  let service: NotificacionesMiembro;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificacionesMiembro);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
