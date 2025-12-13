import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { 
  AbstractControl, 
  FormBuilder, 
  FormGroup, 
  ReactiveFormsModule, 
  FormsModule,
  Validators 
} from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Auth2FAService } from '../../services/auth-2fa.service';


interface RegistroResponse {
  success: boolean;
  message: string;
  data: {
    id_miembro: number;
    nombre_completo: string;
    credenciales: {
      usuario: string;
      contrasenia: string;
    };
    mensaje_principal: string;
    instrucciones: string[];
  };
  error?: string;
}

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, FormsModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class Registro implements OnDestroy {
  registroForm: FormGroup;
  loading = false;
  error = '';
  showSuccessModal = false;
  showPassword = false;
  datosRegistroExitoso: any = null;

  // ========================================
  // NUEVO: Estados para 2FA
  // ========================================
  paso: 'formulario' | 'verificacion' = 'formulario';
  codigoEnviado = false;
  codigoVerificacion = '';
  emailRegistro = '';
  mensajeExito = '';
  countdown = 0; // Contador para reenvío
  private countdownInterval: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private auth2FAService: Auth2FAService
  ) {
    this.registroForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      correo: ['', [Validators.required, Validators.email]],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido1: ['', [Validators.required, Validators.minLength(2)]],
      apellido2: [''],
      edad: ['', [Validators.required, Validators.min(15), Validators.max(80)]],
      sexo: ['', Validators.required],
      direccion: ['', [Validators.required, Validators.minLength(5)]],
      altura: ['', [Validators.required, Validators.min(130), Validators.max(220)]],
      peso: ['', [Validators.required, Validators.min(35), Validators.max(200)]],
      contextura: ['', Validators.required],
      objetivo: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  // Getters para acceder fácilmente a los controles del formulario
  get cedula() { return this.registroForm.get('cedula'); }
  get correo() { return this.registroForm.get('correo'); }
  get nombre() { return this.registroForm.get('nombre'); }
  get apellido1() { return this.registroForm.get('apellido1'); }
  get apellido2() { return this.registroForm.get('apellido2'); }
  get edad() { return this.registroForm.get('edad'); }
  get sexo() { return this.registroForm.get('sexo'); }
  get direccion() { return this.registroForm.get('direccion'); }
  get altura() { return this.registroForm.get('altura'); }
  get peso() { return this.registroForm.get('peso'); }
  get contextura() { return this.registroForm.get('contextura'); }
  get objetivo() { return this.registroForm.get('objetivo'); }

  // ========================================
  // NUEVO: Flujo de registro con 2FA
  // ========================================
  
  onSubmit() {
    if (this.registroForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    this.emailRegistro = this.registroForm.value.correo;

    // 1️⃣ Enviar código de verificación al correo
    this.auth2FAService.enviarCodigoRegistro(this.emailRegistro)
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.paso = 'verificacion';
            this.codigoEnviado = true;
            this.mensajeExito = '✉️ Hemos enviado un código de 6 dígitos a tu correo';
            this.iniciarCountdown();
          } else {
            this.error = response.message || 'No se pudo enviar el código';
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Error al enviar código:', error);
          
          const errMsg = error?.error?.message || '';
          if (errMsg.includes('ya está registrado') || errMsg.includes('correo')) {
            this.error = '❌ Este correo ya está registrado. Por favor, inicia sesión o usa otro correo.';
          } else if (error?.status === 0) {
            this.error = '❌ No se pudo conectar con el servidor. Verifica tu conexión a internet.';
          } else {
            this.error = error.error?.message || '❌ No se pudo enviar el código de verificación.';
          }
        }
      });
  }

  // 2️⃣ Verificar código y completar registro
  verificarCodigo() {
    if (!this.codigoVerificacion || this.codigoVerificacion.length !== 6) {
      this.error = '⚠️ Por favor ingresa el código de 6 dígitos';
      return;
    }

    this.loading = true;
    this.error = '';

    const datosCompletos = {
      correo: this.emailRegistro,
      codigo: this.codigoVerificacion,
      ...this.registroForm.value
    };

    this.auth2FAService.verificarCodigoRegistro(datosCompletos)
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success && response.data) {
            // Preparar datos para el modal de éxito
            this.datosRegistroExitoso = {
              id_miembro: response.data.id_miembro,
              id_usuario: response.data.id_usuario,
              nombre_completo: `${this.registroForm.value.nombre} ${this.registroForm.value.apellido1}`.trim(),
              credenciales: response.data.credenciales,
              mensaje_principal: '¡Registro exitoso!',
              instrucciones: [
                'Tu cuenta ha sido creada correctamente',
                'Guarda tus credenciales en un lugar seguro',
                'Usa estos datos para iniciar sesión'
              ]
            };
            this.showSuccessModal = true;
            this.detenerCountdown();
          } else {
            this.error = response.message || 'Error al verificar el código';
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Error al verificar código:', error);
          
          const errMsg = error?.error?.message || '';
          if (errMsg.includes('inválido') || errMsg.includes('expirado')) {
            this.error = '❌ Código inválido o expirado. Solicita uno nuevo.';
          } else {
            this.error = error.error?.message || '❌ No se pudo verificar el código. Intenta nuevamente.';
          }
        }
      });
  }

  // Reenviar código de verificación
  reenviarCodigo() {
    if (this.countdown > 0) return;

    this.loading = true;
    this.error = '';
    this.mensajeExito = '';

    this.auth2FAService.enviarCodigoRegistro(this.emailRegistro)
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.mensajeExito = '✉️ Código reenviado correctamente';
            this.codigoVerificacion = '';
            this.iniciarCountdown();
          } else {
            this.error = response.message || 'No se pudo reenviar el código';
          }
        },
        error: (error) => {
          this.loading = false;
          this.error = error.error?.message || '❌ Error al reenviar el código';
        }
      });
  }

  // Volver al formulario
  volverAlFormulario() {
    this.paso = 'formulario';
    this.codigoEnviado = false;
    this.codigoVerificacion = '';
    this.error = '';
    this.mensajeExito = '';
    this.detenerCountdown();
  }

  // Iniciar countdown de 60 segundos para reenvío
  private iniciarCountdown() {
    this.countdown = 60;
    this.detenerCountdown(); // Limpiar cualquier intervalo previo
    
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

  // Intentar obtener credenciales desde varios endpoints posibles
  private async tryFetchCredentials(idMiembro: number) {
    const attempts = [
      `${environment.apiUrl}/api/members/${idMiembro}/credentials`,
      `${environment.apiUrl}/api/members/${idMiembro}/user`,
      `${environment.apiUrl}/api/miembros/${idMiembro}/usuario`,
      `${environment.apiUrl}/api/miembros/${idMiembro}/credenciales`,
      `${environment.apiUrl}/api/miembros/${idMiembro}/user`
    ];

    for (const url of attempts) {
      try {
        const resp: any = await this.http.get(url).toPromise();
        if (!resp) continue;

        // Buscar credenciales en diferentes formatos de respuesta
        let creds = null as any;
        if (resp.usuario && resp.contrasenia) creds = { usuario: resp.usuario, contrasenia: resp.contrasenia };
        if (resp.data?.credenciales) creds = resp.data.credenciales;
        if (resp.data?.usuario && resp.data?.contrasenia) creds = { usuario: resp.data.usuario, contrasenia: resp.data.contrasenia };

        if (creds) {
          this.datosRegistroExitoso = this.datosRegistroExitoso || {};
          this.datosRegistroExitoso.credenciales = creds;
          this.showSuccessModal = true;
          return;
        }
      } catch (e) {
        continue;
      }
    }
    return;
  }

  private markFormGroupTouched() {
    Object.keys(this.registroForm.controls).forEach(key => {
      this.registroForm.get(key)?.markAsTouched();
    });
  }

  // Copiar texto al portapapeles y mostrar confirmación
  copiarTexto(texto: string) {
    if (!texto) return;
    
    navigator.clipboard.writeText(texto).then(() => {
      const tooltip = document.createElement('div');
      tooltip.textContent = '✓ Copiado!';
      tooltip.className = 'copy-tooltip';
      document.body.appendChild(tooltip);
      
      setTimeout(() => {
        document.body.removeChild(tooltip);
      }, 2000);
    }).catch(err => {
      console.error('Error al copiar texto:', err);
      alert('No se pudo copiar el texto. Por favor, cópialo manualmente.');
    });
  }

  cerrarModalYRedireccionar() {
    this.showSuccessModal = false;
    this.datosRegistroExitoso = null;
    this.router.navigate(['/auth']);
  }
}