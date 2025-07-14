import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const miembroGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    const user = authService.getCurrentUser();
    
    // ✅ Solo miembros pueden acceder al área de miembros
    if (user && user.rol === 'miembro') {
      return true;
    } else {
      // ❌ Si no es miembro, redirigir según su rol
      if (user?.rol === 'admin' || user?.rol === 'entrenador') {
        router.navigate(['/admin/dashboard']);
      } else {
        router.navigate(['/login']);
      }
      return false;
    }
  } else {
    // ❌ No autenticado
    router.navigate(['/login']);
    return false;
  }
};
