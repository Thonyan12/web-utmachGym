import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { Auth2FAService } from '../../services/auth-2fa.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit, OnDestroy {
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
  // NUEVO: Flujo de login con soporte 2FA
  // ========================================
  
  onSubmit() {
    if (!this.usuario || !this.contrasenia) {
      this.error = 'Por favor complete todos los campos';
      return;
    }

    this.loading = true;
    this.error = '';

    // 1️⃣ Intentar login con nuevo endpoint 2FA
    this.auth2FAService.validarLogin(this.usuario, this.contrasenia)
      .subscribe({
        next: (response) => {
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
              // Usuario sin 2FA - login directo (usuarios antiguos)
              if (response.token && response.usuario) {
                // Guardar token y usuario en localStorage
                localStorage.setItem('token', response.token);
                localStorage.setItem('currentUser', JSON.stringify(response.usuario));
                
                // Validar que sea miembro
                if (response.usuario.rol === 'miembro') {
                  this.router.navigate(['/miembros/dashboard']);
                } else if (response.usuario.rol === 'admin' || response.usuario.rol === 'entrenador') {
                  this.authService.logout();
                  this.error = '🚫 Acceso denegado. Usted es parte del staff. Use el botón "Staff" en la página principal.';
                } else {
                  this.authService.logout();
                  this.error = 'Tipo de usuario no reconocido.';
                }
              }
            }
          } else {
            this.error = response.message || 'Credenciales incorrectas';
          }
        },
        error: (error) => {
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

    console.log('[Login 2FA] Verificando código:', {
      email: this.usuario,
      codigoLength: this.codigoVerificacion.length
    });

    this.auth2FAService.verificarCodigo2FA(this.usuario, this.codigoVerificacion)
      .subscribe({
        next: (response) => {
          this.loading = false;
          console.log('[Login 2FA] Respuesta del backend:', response);
          
          if (response.success && response.token && response.usuario) {
            // Guardar token y usuario
            localStorage.setItem('token', response.token);
            localStorage.setItem('currentUser', JSON.stringify(response.usuario));
            
            // Validar rol
            if (response.usuario.rol === 'miembro') {
              console.log('[Login 2FA] Redirigiendo a /miembros/dashboard');
              this.router.navigate(['/miembros/dashboard']).then(success => {
                console.log('[Login 2FA] Navegación exitosa:', success);
                if (!success) {
                  console.error('[Login 2FA] La navegación falló, forzando recarga');
                  window.location.href = '/miembros/dashboard';
                }
              });
            } else if (response.usuario.rol === 'admin' || response.usuario.rol === 'entrenador') {
              this.authService.logout();
              this.error = '🚫 Acceso denegado. Este portal es solo para miembros.';
              this.volverACredenciales();
            } else {
              this.authService.logout();
              this.error = 'Tipo de usuario no reconocido.';
              this.volverACredenciales();
            }
          } else {
            this.error = response.message || 'Error al verificar el código';
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('[Login 2FA] Error completo:', error);
          console.error('[Login 2FA] Error response:', error.error);
          console.error('[Login 2FA] Status:', error.status);
          
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
            // Mostrar mensaje de éxito temporal
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

  // Login legacy (para compatibilidad con endpoint antiguo)
  private intentarLoginLegacy() {
    this.authService.login(this.usuario, this.contrasenia)
      .subscribe({
        next: (response) => {
          this.loading = false;
          
          if (response.user.rol === 'miembro') {
            this.router.navigate([response.redirectTo]);
          } else if (response.user.rol === 'admin' || response.user.rol === 'entrenador') {
            this.authService.logout();
            this.error = '🚫 Acceso denegado. Usted es parte del staff. Use el botón "Staff" en la página principal.';
          } else {
            this.authService.logout();
            this.error = 'Tipo de usuario no reconocido. Contacte al administrador.';
          }
        },
        error: (error) => {
          this.loading = false;
          this.authService.logout();
          this.error = error.error?.message || 'Credenciales incorrectas';
          console.error('Error de login:', error);
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
