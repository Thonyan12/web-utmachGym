import { TestBed } from '@angular/core/testing';

import { PerfilFisico } from './perfil-fisico';

describe('PerfilFisico', () => {
  let service: PerfilFisico;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerfilFisico);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
