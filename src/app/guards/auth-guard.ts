import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    const user = authService.getCurrentUser();
    
    // Solo admin y entrenador pueden acceder al área admin
    if (user && (user.rol === 'admin' || user.rol === 'entrenador')) {
      return true;
    } else {
      // Si es miembro o rol no válido, solo redirigir (SIN logout)
      router.navigate(['/staff-login']);
      return false;
    }
  } else {
    // No autenticado
    router.navigate(['/staff-login']);
    return false;
  }
};
