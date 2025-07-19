import { TestBed } from '@angular/core/testing';

import { FacturasMiembro } from './facturas-miembro';

describe('FacturasMiembro', () => {
  let service: FacturasMiembro;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacturasMiembro);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
