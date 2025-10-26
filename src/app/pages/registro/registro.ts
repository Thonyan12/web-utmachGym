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

    // Conectar con tu backend
    // Be tolerant with backend response shape: some services return { success: true, data: ... }
    // while others may return the created member object directly. We'll accept both.
    this.http.post<any>(`${environment.apiUrl}/api/members/register`, this.registroForm.value)
      .subscribe({
        next: (response) => {
          this.loading = false;
          const body = response as any;

          // Case A: backend returns { success: true, data: { ... } }
          if (body && body.success === true) {
            // Normalize backend shape: backend may return usuario/contrasenia at top-level of data
            const data = body.data || {};
            if (data.usuario || data.contrasenia) {
              // convert to expected shape { credenciales: { usuario, contrasenia } }
              data.credenciales = data.credenciales || { usuario: data.usuario || '', contrasenia: data.contrasenia || '' };
            }
            // also ensure nombre_completo exists
            data.nombre_completo = data.nombre_completo || `${data.nombre || ''} ${data.apellido1 || ''}`.trim();
            console.log('[Registro] backend success response:', body);
            console.log('[Registro] normalized data to show in modal:', data);
            this.datosRegistroExitoso = data;
            this.showSuccessModal = true;
            return;
          }

          // Case B: backend returns the created member object (e.g. { id_miembro: 1, nombre: ... })
          if (body && (body.id_miembro || body.data?.id_miembro)) {
            // Normalize into the shape the UI expects (minimal)
            this.datosRegistroExitoso = body.data || {
              id_miembro: body.id_miembro || body.data?.id_miembro,
              nombre_completo: `${body.nombre} ${body.apellido1 || ''}`.trim(),
              credenciales: { usuario: '', contrasenia: '' },
              mensaje_principal: 'Registro completado',
              instrucciones: []
            };
            console.log('[Registro] received member object, showing modal with:', this.datosRegistroExitoso);
            this.showSuccessModal = true;
            return;
          }

          // Otherwise show any error message returned, or a generic one
          this.error = (body && (body.error || body.message)) || 'Error en el registro';
          // If the backend returned an id but no credentials, try to fetch credentials
          const maybeId = body?.data?.id_miembro || body?.id_miembro;
          if (maybeId) {
            this.tryFetchCredentials(maybeId).catch(() => {/* ignore */});
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Error al registrar:', error);

          // Log useful debugging info to console to help backend debugging
          try {
            console.log('HTTP status:', error.status);
            console.log('Response body:', error.error);
          } catch (e) { /* ignore */ }

          // Manejo de errores específicos de tu backend (por message code)
          const errMsg = error?.error?.message || error?.error?.error || null;
          if (errMsg === 'CEDULA_DUPLICADA') {
            this.error = 'Ya existe un miembro registrado con esta cédula';
          } else if (errMsg === 'CORREO_DUPLICADO') {
            this.error = 'Ya existe un miembro registrado con este correo electrónico';
          } else if (errMsg === 'CAMPOS_REQUERIDOS') {
            this.error = error.error?.error || 'Campos requeridos faltantes';
          } else if (error?.status === 400) {
            // if backend returned validation errors, surface them
            this.error = error.error?.error || 'Datos inválidos. Revise el formulario.';
          } else {
            this.error = error.error?.error || 'Error al registrar miembro. Intente nuevamente.';
          }
        }
      });
  }

  // Try several possible endpoints to retrieve the generated credentials for a member
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

        // Accept either { usuario, contrasenia } or { data: { credenciales: { usuario, contrasenia } } }
        let creds = null as any;
        if (resp.usuario && resp.contrasenia) creds = { usuario: resp.usuario, contrasenia: resp.contrasenia };
        if (resp.data?.credenciales) creds = resp.data.credenciales;
        if (resp.data?.usuario && resp.data?.contrasenia) creds = { usuario: resp.data.usuario, contrasenia: resp.data.contrasenia };

        if (creds) {
          // Merge into datosRegistroExitoso so modal shows credentials
          this.datosRegistroExitoso = this.datosRegistroExitoso || {};
          this.datosRegistroExitoso.credenciales = creds;
          this.showSuccessModal = true;
          return;
        }
      } catch (e) {
        // ignore and try next
      }
    }
    // If none found, leave as-is; frontend will show generic success without credentials
    return;
  }

  private markFormGroupTouched() {
    Object.keys(this.registroForm.controls).forEach(key => {
      this.registroForm.get(key)?.markAsTouched();
    });
  }

  // Funciones para el modal de éxito
  copiarTexto(texto: string) {
    navigator.clipboard.writeText(texto).then(() => {
      console.log('Texto copiado al portapapeles');
      // Aquí podrías mostrar un toast de confirmación
    }).catch(err => {
      console.error('Error al copiar texto:', err);
    });
  }

  cerrarModalYRedireccionar() {
    this.showSuccessModal = false;
    this.datosRegistroExitoso = null;
    this.router.navigate(['/auth']);
  }
}