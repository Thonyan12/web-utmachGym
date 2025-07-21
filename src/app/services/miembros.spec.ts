import { TestBed } from '@angular/core/testing';

import { Miembros } from './miembros';

describe('Miembros', () => {
  let service: Miembros;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Miembros);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
