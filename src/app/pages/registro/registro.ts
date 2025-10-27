import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { 
  AbstractControl, 
  FormBuilder, 
  FormGroup, 
  ReactiveFormsModule, 
  Validators 
} from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


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
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class Registro {
  registroForm: FormGroup;
  loading = false;
  error = '';
  showSuccessModal = false;
  showPassword = false;
  datosRegistroExitoso: any = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
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

  onSubmit() {
    if (this.registroForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    this.http.post<any>(`${environment.apiUrl}/api/members/register`, this.registroForm.value)
      .subscribe({
        next: (response) => {
          this.loading = false;
          const body = response as any;

          // Caso A: backend retorna { success: true, data: { ... } }
          if (body && body.success === true) {
            const data = body.data || {};
            
            // Normalizar credenciales si vienen en formato diferente
            if (data.usuario || data.contrasenia) {
              data.credenciales = data.credenciales || { usuario: data.usuario || '', contrasenia: data.contrasenia || '' };
            }
            
            // Asegurar que existe nombre_completo
            data.nombre_completo = data.nombre_completo || `${data.nombre || ''} ${data.apellido1 || ''}`.trim();
            
            this.datosRegistroExitoso = data;
            this.showSuccessModal = true;
            return;
          }

          // Caso B: backend retorna el objeto del miembro directamente
          if (body && (body.id_miembro || body.data?.id_miembro)) {
            this.datosRegistroExitoso = body.data || {
              id_miembro: body.id_miembro || body.data?.id_miembro,
              nombre_completo: `${body.nombre} ${body.apellido1 || ''}`.trim(),
              credenciales: { usuario: '', contrasenia: '' },
              mensaje_principal: 'Registro completado',
              instrucciones: []
            };
            this.showSuccessModal = true;
            return;
          }

          // Si hay algún error en la respuesta
          this.error = (body && (body.error || body.message)) || 'Error en el registro';
          
          // Intentar obtener credenciales si se creó el usuario pero no llegaron
          const maybeId = body?.data?.id_miembro || body?.id_miembro;
          if (maybeId) {
            this.tryFetchCredentials(maybeId).catch(() => {});
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Error al registrar:', error);

          // Manejo de errores específicos del backend
          const errMsg = error?.error?.message || error?.error?.error || null;
          const errString = typeof errMsg === 'string' ? errMsg.toLowerCase() : '';
          
          if (errMsg === 'CEDULA_DUPLICADA' || errString.includes('cedula') || errString.includes('duplicate key') && errString.includes('cedula')) {
            this.error = '❌ Esta cédula ya está registrada en nuestro sistema. Si ya eres miembro, inicia sesión.';
          } else if (errMsg === 'CORREO_DUPLICADO' || errString.includes('correo') || errString.includes('email')) {
            this.error = '❌ Este correo electrónico ya está en uso. Por favor, utiliza otro correo.';
          } else if (errString.includes('duplicate') || errString.includes('duplicada') || errString.includes('ya existe')) {
            this.error = '❌ Los datos que ingresaste ya están registrados. Verifica tu cédula o correo e intenta nuevamente.';
          } else if (errMsg === 'CAMPOS_REQUERIDOS') {
            this.error = '❌ Por favor completa todos los campos obligatorios del formulario.';
          } else if (error?.status === 400) {
            this.error = error.error?.error || '❌ Los datos ingresados no son válidos. Por favor revisa el formulario.';
          } else if (error?.status === 500) {
            this.error = '❌ Hubo un problema en el servidor. Por favor intenta nuevamente en unos momentos.';
          } else if (error?.status === 0) {
            this.error = '❌ No se pudo conectar con el servidor. Verifica tu conexión a internet.';
          } else {
            this.error = error.error?.error || '❌ No se pudo completar el registro. Por favor intenta nuevamente.';
          }
        }
      });
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