import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PerfilFisico, PerfilCompleto, NuevoPerfilData } from '../services/perfil-fisico';

@Component({
  selector: 'app-perfil-actual',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil-actual.html',
  styleUrls: ['./perfil-actual.css']
})
export class PerfilActual implements OnInit {
  // ✅ Cambiar de private a public para acceso desde template
  public perfilService = inject(PerfilFisico);
  private fb = inject(FormBuilder);

  perfil: PerfilCompleto | null = null;
  loading = true;
  error: string | null = null;
  
  // Modal para crear perfil
  mostrarModalCrear = false;
  enviandoPerfil = false;
  mensajeExito: string | null = null;

  // Formulario para nuevo perfil
  nuevoPerfilForm: FormGroup;

  constructor() {
    this.nuevoPerfilForm = this.fb.group({
      altura: ['', [Validators.required, Validators.min(120), Validators.max(250)]],
      peso: ['', [Validators.required, Validators.min(30), Validators.max(300)]],
      observaciones: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  ngOnInit() {
    this.cargarPerfilCompleto();
  }

  cargarPerfilCompleto() {
    this.loading = true;
    this.error = null;

    this.perfilService.getMiPerfilCompleto().subscribe({
      next: (response) => {
        if (response.success) {
          this.perfil = response.data;
          console.log('✅ Perfil cargado:', this.perfil);
        } else {
          this.error = response.message || 'Error al cargar el perfil';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar perfil:', err);
        this.error = 'Error al conectar con el servidor';
        this.loading = false;
      }
    });
  }

  abrirModalCrear() {
    this.nuevoPerfilForm.reset();
    this.mostrarModalCrear = true;
    this.mensajeExito = null;
    this.error = null;
  }

  cerrarModal() {
    this.mostrarModalCrear = false;
    this.mensajeExito = null;
    this.error = null;
  }

  crearNuevoPerfil() {
    if (this.nuevoPerfilForm.valid) {
      this.enviandoPerfil = true;
      const formData: NuevoPerfilData = this.nuevoPerfilForm.value;

      this.perfilService.crearPerfilFisico(formData).subscribe({
        next: (response) => {
          if (response.success) {
            this.mensajeExito = '✅ Perfil físico creado exitosamente. El sistema está evaluando nuevas rutinas automáticamente.';
            this.mostrarModalCrear = false;
            this.cargarPerfilCompleto(); // Recargar datos
          } else {
            this.error = response.message || 'Error al crear perfil';
          }
          this.enviandoPerfil = false;
        },
        error: (err) => {
          console.error('❌ Error al crear perfil:', err);
          this.error = 'Error al crear el perfil físico';
          this.enviandoPerfil = false;
        }
      });
    }
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getIMCColor(categoria: string): string {
    return this.perfilService.getColorCategoriaIMC(categoria);
  }

  getIMCIcon(categoria: string): string {
    switch (categoria?.toLowerCase()) {
      case 'bajo peso': return 'bi-arrow-down-circle';
      case 'peso normal': return 'bi-check-circle';
      case 'sobrepeso': return 'bi-exclamation-circle';
      case 'obesidad': return 'bi-x-circle';
      default: return 'bi-question-circle';
    }
  }

  // ✅ Métodos públicos para cálculos en el template
  calcularIMCPreview(): number {
    const altura = this.nuevoPerfilForm.get('altura')?.value;
    const peso = this.nuevoPerfilForm.get('peso')?.value;
    
    if (altura && peso) {
      return this.perfilService.calcularIMC(peso, altura);
    }
    return 0;
  }

  getCategoriaIMCPreview(): string {
    const imc = this.calcularIMCPreview();
    if (imc > 0) {
      return this.perfilService.getCategoriaIMC(imc);
    }
    return '';
  }
}
