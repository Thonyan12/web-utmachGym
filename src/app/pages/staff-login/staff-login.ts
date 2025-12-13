import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { Auth2FAService } from '../../services/auth-2fa.service';

@Component({
  selector: 'app-staff-login',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './staff-login.html',
  styleUrl: './staff-login.css'
})
export class StaffLogin implements OnInit, OnDestroy {
  usuario = '';
  contrasenia = '';
  loading = false;
  error = '';

  // ========================================
  // NUEVO: Estados para 2FA
  // ========================================
  paso: 'credenciales' | 'verificacion-2fa' = 'credenciales';
  requires2FA = false;
  emailOfuscado = '';
  codigoVerificacion = '';
  countdown = 0;
  private countdownInterval: any;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private auth2FAService: Auth2FAService
  ) {}

  ngOnInit() {
    // Limpiar cualquier sesión anterior al cargar la página de login
    console.log('🧹 Limpiando sesión anterior...');
    this.authService.logout();
  }

  // ========================================
  // NUEVO: Flujo de login con 2FA obligatorio
  // ========================================
  
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
      this.error = '⏱️ El servidor está tardando demasiado en responder. Verifique que el backend esté corriendo.';
    }, 10000);

    // 1️⃣ Intentar login con nuevo endpoint 2FA
    this.auth2FAService.validarLogin(this.usuario, this.contrasenia)
      .subscribe({
        next: (response) => {
          clearTimeout(timeoutId);
          this.loading = false;
          
          if (response.success) {
            // Verificar si requiere 2FA
            if (response.requiresTwoFactor) {
              // Usuario tiene 2FA activado - mostrar pantalla de código
              this.requires2FA = true;
              this.emailOfuscado = response.email || '';
              this.paso = 'verificacion-2fa';
              this.iniciarCountdown();
            } else {
              // Usuario sin 2FA - login directo
              if (response.token && response.usuario) {
                this.completarLoginStaff(response.token, response.usuario);
              }
            }
          } else {
            this.error = response.message || 'Credenciales incorrectas';
          }
        },
        error: (error) => {
          clearTimeout(timeoutId);
          this.loading = false;
          
          // Si el endpoint 2FA falla, intentar con el endpoint legacy
          console.warn('Endpoint 2FA no disponible, intentando login legacy...', error);
          this.intentarLoginLegacy();
        }
      });
  }

  // Verificar código 2FA
  verificarCodigo2FA() {
    if (!this.codigoVerificacion || this.codigoVerificacion.length !== 6) {
      this.error = '⚠️ Por favor ingresa el código de 6 dígitos';
      return;
    }

    this.loading = true;
    this.error = '';

    console.log('[Staff 2FA] Verificando código:', {
      email: this.usuario,
      codigoLength: this.codigoVerificacion.length
    });

    this.auth2FAService.verificarCodigo2FA(this.usuario, this.codigoVerificacion)
      .subscribe({
        next: (response) => {
          this.loading = false;
          console.log('[Staff 2FA] Respuesta del backend:', response);
          
          if (response.success && response.token && response.usuario) {
            this.completarLoginStaff(response.token, response.usuario);
          } else {
            this.error = response.message || 'Error al verificar el código';
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('[Staff 2FA] Error completo:', error);
          console.error('[Staff 2FA] Error response:', error.error);
          console.error('[Staff 2FA] Status:', error.status);
          console.error('[Staff 2FA] URL intentada:', error.url);
          
          const errMsg = error?.error?.message || '';
          if (errMsg.includes('inválido') || errMsg.includes('expirado')) {
            this.error = '❌ Código inválido o expirado. Solicita uno nuevo.';
          } else if (error.status === 400) {
            this.error = '❌ ' + (error.error?.message || 'Código inválido o expirado');
          } else {
            this.error = error.error?.message || '❌ No se pudo verificar el código.';
          }
        }
      });
  }

  // Completar login y redirigir según rol
  private completarLoginStaff(token: string, usuario: any) {
    // Guardar token y usuario
    localStorage.setItem('token', token);
    localStorage.setItem('currentUser', JSON.stringify(usuario));
    
    // Validar rol y redirigir
    if (usuario.rol === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    } else if (usuario.rol === 'entrenador') {
      this.router.navigate(['/entrenadores/dashboard']);
    } else if (usuario.rol === 'miembro') {
      this.authService.logout();
      this.error = '🚫 Acceso denegado. Usted es un miembro. Use el portal de miembros.';
      this.volverACredenciales();
    } else {
      this.authService.logout();
      this.error = 'Tipo de usuario no reconocido.';
      this.volverACredenciales();
    }
  }

  // Reenviar código 2FA
  reenviarCodigo2FA() {
    if (this.countdown > 0) return;

    this.loading = true;
    this.error = '';

    this.auth2FAService.validarLogin(this.usuario, this.contrasenia)
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success && response.requiresTwoFactor) {
            this.error = '';
            this.codigoVerificacion = '';
            this.iniciarCountdown();
            const successMsg = '✉️ Código reenviado correctamente';
            this.error = successMsg;
            setTimeout(() => {
              if (this.error === successMsg) this.error = '';
            }, 3000);
          } else {
            this.error = 'No se pudo reenviar el código';
          }
        },
        error: (error) => {
          this.loading = false;
          this.error = error.error?.message || '❌ Error al reenviar el código';
        }
      });
  }

  // Volver a pantalla de credenciales
  volverACredenciales() {
    this.paso = 'credenciales';
    this.requires2FA = false;
    this.codigoVerificacion = '';
    this.error = '';
    this.detenerCountdown();
  }

  // Login legacy (para compatibilidad)
  private intentarLoginLegacy() {
    this.authService.login(this.usuario, this.contrasenia)
      .subscribe({
        next: (response) => {
          this.loading = false;
          
          if (response.user.rol === 'admin') {
            this.router.navigate(['/admin/dashboard']);
          } else if (response.user.rol === 'entrenador') {
            this.router.navigate(['/entrenadores/dashboard']);
          } else if (response.user.rol === 'miembro') {
            this.authService.logout();
            this.error = '🚫 Acceso denegado. Usted es un miembro del gimnasio.';
          } else {
            this.authService.logout();
            this.error = 'Tipo de usuario no reconocido.';
          }
        },
        error: (error) => {
          this.loading = false;
          this.authService.logout();
          
          if (error.status === 0) {
            this.error = '❌ No se pudo conectar con el servidor.';
          } else if (error.status === 401) {
            this.error = '🔒 Credenciales incorrectas.';
          } else {
            this.error = error.error?.message || 'Error en el login';
          }
          
          console.error('Error completo:', error);
        }
      });
  }

  // Countdown para reenvío
  private iniciarCountdown() {
    this.countdown = 60;
    this.detenerCountdown();
    
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.detenerCountdown();
      }
    }, 1000);
  }

  private detenerCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  ngOnDestroy() {
    this.detenerCountdown();
  }
}
