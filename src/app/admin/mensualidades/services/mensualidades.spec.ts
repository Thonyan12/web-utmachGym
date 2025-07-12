import { TestBed } from '@angular/core/testing';

import { Mensualidades } from './mensualidades';

describe('Mensualidades', () => {
  let service: Mensualidades;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Mensualidades);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
