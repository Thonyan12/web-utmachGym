import { TestBed } from '@angular/core/testing';

import { Entrenadores } from './entrenadores';

describe('Entrenadores', () => {
  let service: Entrenadores;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Entrenadores);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
