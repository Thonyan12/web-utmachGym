import { TestBed } from '@angular/core/testing';

import { DetalleFacturaService } from './detallefactura';

describe('Detallefactura', () => {
  let service: DetalleFacturaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetalleFacturaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
