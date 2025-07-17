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
    this.http.post<RegistroResponse>(`${environment.apiUrl}/api/members/register`, this.registroForm.value)
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            // Mostrar modal con credenciales
            this.datosRegistroExitoso = response.data;
            this.showSuccessModal = true;
          } else {
            this.error = response.error || 'Error en el registro';
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Error al registrar:', error);
          
          // Manejo de errores específicos de tu backend
          if (error.error?.message === 'CEDULA_DUPLICADA') {
            this.error = 'Ya existe un miembro registrado con esta cédula';
          } else if (error.error?.message === 'CORREO_DUPLICADO') {
            this.error = 'Ya existe un miembro registrado con este correo electrónico';
          } else if (error.error?.message === 'CAMPOS_REQUERIDOS') {
            this.error = error.error.error || 'Campos requeridos faltantes';
          } else {
            this.error = error.error?.error || 'Error al registrar miembro. Intente nuevamente.';
          }
        }
      });
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