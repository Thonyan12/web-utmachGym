import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { miembroGuard } from './miembro-guard';

describe('miembroGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => miembroGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
