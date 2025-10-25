import { TestBed } from '@angular/core/testing';

import { NotificacionesServiceDashboard } from './notificaciones';

describe('NotificacionesServiceDashboard', () => {
  let service: NotificacionesServiceDashboard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificacionesServiceDashboard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
