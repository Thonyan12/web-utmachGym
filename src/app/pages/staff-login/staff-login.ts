import { Component, OnInit } from '@angular/core';
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
export class StaffLogin implements OnInit {
  usuario = '';
  contrasenia = '';
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Limpiar cualquier sesión anterior al cargar la página de login
    console.log('🧹 Limpiando sesión anterior...');
    this.authService.logout();
  }

  onSubmit() {
    if (!this.usuario || !this.contrasenia) {
      this.error = 'Por favor complete todos los campos';
      return;
    }

    this.loading = true;
    this.error = '';

    // Timeout de 10 segundos
    const timeoutId = setTimeout(() => {
      this.loading = false;
      this.error = '⏱️ El servidor está tardando demasiado en responder. Por favor verifique:\n' +
                   '1. Que el backend esté corriendo\n' +
                   '2. Que la base de datos PostgreSQL esté activa\n' +
                   '3. Que los microservicios estén configurados correctamente';
    }, 10000);

    this.authService.login(this.usuario, this.contrasenia)
      .subscribe({
        next: (response) => {
          clearTimeout(timeoutId);
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
          clearTimeout(timeoutId);
          this.loading = false;
          
          // 🧹 IMPORTANTE: Limpiar tokens inválidos
          this.authService.logout();
          
          // Manejo mejorado de errores
          if (error.status === 0) {
            this.error = '❌ No se pudo conectar con el servidor. Verifique que el backend esté corriendo en http://localhost:3000';
          } else if (error.status === 408) {
            this.error = '⏱️ Timeout: El servidor backend no responde. Verifique la conexión a la base de datos.';
          } else if (error.status === 401) {
            this.error = '🔒 Credenciales incorrectas. Verifique su usuario y contraseña.';
          } else {
            this.error = error.error?.message || `Error ${error.status}: ${error.statusText}`;
          }
          
          console.error('Error completo:', error);
        }
      });
  }
}
