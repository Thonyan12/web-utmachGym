import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Entrenamiento, AsignacionRutina } from '../services/entrenamiento';

@Component({
  selector: 'app-entrenamiento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entrenamiento.html',
  styleUrls: ['./entrenamiento.css']
})
export class EntrenamientoComponent implements OnInit {
  private entrenamientoService = inject(Entrenamiento);

  rutinasAsignadas: AsignacionRutina[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit() {
    this.cargarMisRutinas();
  }

  cargarMisRutinas() {
    this.loading = true;
    this.error = null;

    this.entrenamientoService.getMisRutinas().subscribe({
      next: (response) => {
        if (response.success) {
          this.rutinasAsignadas = response.data;
          console.log('✅ Rutinas cargadas:', this.rutinasAsignadas);
        } else {
          this.error = response.message || 'Error al cargar las rutinas';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar rutinas:', err);
        this.error = 'Error al conectar con el servidor';
        this.loading = false;
      }
    });
  }

  // ✅ Método para contar rutinas activas
  get rutinasActivasCount(): number {
    return this.rutinasAsignadas.filter(rutina => rutina.estado_asignacion).length;
  }

  // ✅ Método para total de rutinas
  get totalRutinasCount(): number {
    return this.rutinasAsignadas.length;
  }

  getNivelBadgeClass(nivel: string): string {
    const clases: { [key: string]: string } = {
      'Principiante': 'bg-success',
      'Intermedio': 'bg-warning',
      'Avanzado': 'bg-danger',
      'Experto': 'bg-dark'
    };
    return clases[nivel] || 'bg-secondary';
  }

  getTipoIcon(tipo: string): string {
    const iconos: { [key: string]: string } = {
      'Cardio': 'bi-heart-pulse',
      'Fuerza': 'bi-lightning',
      'Resistencia': 'bi-shield',
      'Flexibilidad': 'bi-arrows-move',
      'Funcional': 'bi-gear',
      'Mixto': 'bi-shuffle'
    };
    return iconos[tipo] || 'bi-dumbbell';
  }

  calcularDiasDesdeInicio(fechaInicio: string): number {
    const inicio = new Date(fechaInicio);
    const hoy = new Date();
    const diferencia = hoy.getTime() - inicio.getTime();
    return Math.floor(diferencia / (1000 * 3600 * 24));
  }

  trackByAsignacionId(index: number, asignacion: AsignacionRutina): number {
    return asignacion.id_asignacion;
  }
}