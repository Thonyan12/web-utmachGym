import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-staff-login',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './staff-login.html',
  styleUrl: './staff-login.css'
})
export class StaffLogin {
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
          
          // ✅ VALIDAR QUE SEA STAFF (admin o entrenador)
          if (response.user.rol === 'admin') {
            // ✅ Es administrador → va al área admin
            this.router.navigate(['/admin/dashboard']);
          } else if (response.user.rol === 'entrenador') {
            // ✅ Es entrenador → va al área entrenadores
            this.router.navigate(['/entrenadores/dashboard']);
          } else if (response.user.rol === 'miembro') {
            // ❌ Es un miembro, NO puede acceder al área staff
            this.authService.logout(); // Limpiar token
            this.error = '🚫 Acceso denegado. Usted es un miembro del gimnasio. Para acceder a su área personal, use el botón "Miembro" en la página principal.';
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
