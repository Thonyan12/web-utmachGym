import { CanActivateFn } from '@angular/router';

export const entrenadorGuard: CanActivateFn = (route, state) => {
  return true;
};
