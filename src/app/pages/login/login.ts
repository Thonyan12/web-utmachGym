import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  usuario = '';
  contrasenia = '';
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.usuario || !this.contrasenia) {
      this.error = 'Por favor complete todos los campos';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.usuario, this.contrasenia)
      .subscribe({
        next: (response) => {
          this.loading = false;
          
          // ✅ VALIDAR QUE SEA MIEMBRO
          if (response.user.rol === 'miembro') {
            // ✅ Es miembro, puede acceder
            this.router.navigate([response.redirectTo]); // Redirige a /miembros/dashboard
          } else if (response.user.rol === 'admin' || response.user.rol === 'entrenador') {
            // ❌ Es staff, debe usar staff-login
            this.authService.logout(); // Limpiar token
            this.error = '🚫 Acceso denegado. Usted es parte del staff. Use el botón "Staff" en la página principal.';
          } else {
            // ❌ Rol desconocido
            this.authService.logout();
            this.error = 'Tipo de usuario no reconocido. Contacte al administrador.';
          }
        },
        error: (error) => {
          this.loading = false;
          this.error = error.error?.message || 'Credenciales incorrectas';
        }
      });
  }
}
