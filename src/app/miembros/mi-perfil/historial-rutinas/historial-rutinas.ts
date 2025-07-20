import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ Agregar para ngModel
import { RouterLink } from '@angular/router'; // ✅ Para navegación
import { PerfilFisico } from '../services/perfil-fisico';

export interface RutinaHistorial {
  id_asignacion: number;
  id_rutina: number;
  tipo_rutina: string;
  nivel: string;
  descripcion_rutina: string;
  duracion_rutina: number;
  fecha_inicio: string;
  fecha_fin?: string;
  estado_rutina: boolean;
  descripcion_asignacion: string;
  progreso?: string;
  dias_completados?: number;
  total_dias?: number;
}

@Component({
  selector: 'app-historial-rutinas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './historial-rutinas.html',
  styleUrls: ['./historial-rutinas.css']
})
export class HistorialRutinas implements OnInit {
  private perfilService = inject(PerfilFisico);

  // Estado del componente
  historialRutinas: RutinaHistorial[] = [];
  loading = true;
  error: string | null = null;
  
  // Información del miembro
  miembroInfo: any = null;
  
  // Filtros
  filtroTipo = '';
  filtroNivel = '';
  filtroEstado = '';
  buscarTexto = '';
  
  // Estadísticas
  totalRutinas = 0;
  rutinasActivas = 0;
  rutinasCompletadas = 0;

  // Opciones para filtros
  tiposRutina: string[] = [];
  nivelesRutina: string[] = [];

  ngOnInit() {
    this.cargarHistorialRutinas();
  }

  cargarHistorialRutinas() {
    this.loading = true;
    this.error = null;

    this.perfilService.getHistorialRutinas().subscribe({
      next: (response) => {
        if (response.success) {
          this.historialRutinas = response.data.historial_rutinas || [];
          this.miembroInfo = response.data.miembro_info;
          this.totalRutinas = response.data.total_rutinas || 0;
          this.rutinasActivas = response.data.rutinas_activas || 0;
          this.rutinasCompletadas = this.totalRutinas - this.rutinasActivas;
          
          // Extraer opciones únicas para filtros
          this.extraerOpcionesFiltros();
          
          console.log('✅ Historial de rutinas cargado:', this.historialRutinas);
        } else {
          this.error = response.message || 'Error al cargar historial de rutinas';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar historial:', err);
        this.error = 'Error al conectar con el servidor';
        this.loading = false;
      }
    });
  }

  extraerOpcionesFiltros() {
    // Extraer tipos únicos
    this.tiposRutina = [...new Set(this.historialRutinas
      .map(r => r.tipo_rutina)
      .filter(tipo => tipo)
    )];
    
    // Extraer niveles únicos
    this.nivelesRutina = [...new Set(this.historialRutinas
      .map(r => r.nivel)
      .filter(nivel => nivel)
    )];
  }

  // Getter para rutinas filtradas
  get rutinasFiltradas(): RutinaHistorial[] {
    return this.historialRutinas.filter(rutina => {
      const cumpleTipo = !this.filtroTipo || rutina.tipo_rutina === this.filtroTipo;
      const cumpleNivel = !this.filtroNivel || rutina.nivel === this.filtroNivel;
      const cumpleEstado = !this.filtroEstado || 
        (this.filtroEstado === 'activa' && rutina.estado_rutina) ||
        (this.filtroEstado === 'completada' && !rutina.estado_rutina);
      const cumpleBusqueda = !this.buscarTexto || 
        rutina.tipo_rutina?.toLowerCase().includes(this.buscarTexto.toLowerCase()) ||
        rutina.descripcion_rutina?.toLowerCase().includes(this.buscarTexto.toLowerCase()) ||
        rutina.descripcion_asignacion?.toLowerCase().includes(this.buscarTexto.toLowerCase());
      
      return cumpleTipo && cumpleNivel && cumpleEstado && cumpleBusqueda;
    });
  }

  limpiarFiltros() {
    this.filtroTipo = '';
    this.filtroNivel = '';
    this.filtroEstado = '';
    this.buscarTexto = '';
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  calcularDiasTranscurridos(fechaInicio: string, fechaFin?: string): number {
    const inicio = new Date(fechaInicio);
    const fin = fechaFin ? new Date(fechaFin) : new Date();
    const diferencia = fin.getTime() - inicio.getTime();
    return Math.floor(diferencia / (1000 * 60 * 60 * 24));
  }

  getEstadoBadgeClass(estado: boolean): string {
    return estado ? 'bg-success' : 'bg-secondary';
  }

  getEstadoTexto(estado: boolean): string {
    return estado ? 'Activa' : 'Completada';
  }

  getNivelBadgeClass(nivel: string): string {
    switch (nivel?.toLowerCase()) {
      case 'principiante': return 'bg-info';
      case 'intermedio': return 'bg-warning';
      case 'avanzado': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getTipoIcon(tipo: string): string {
    switch (tipo?.toLowerCase()) {
      case 'cardio': return 'bi-heart-pulse';
      case 'fuerza': return 'bi-lightning';
      case 'resistencia': return 'bi-arrow-repeat';
      case 'flexibilidad': return 'bi-arrow-left-right';
      case 'hiit': return 'bi-stopwatch';
      default: return 'bi-activity';
    }
  }

  // ✅ Agregar trackBy para mejor performance
  trackByRutina(index: number, rutina: RutinaHistorial): number {
    return rutina.id_asignacion;
  }

  // ✅ Métodos para manejar progreso de forma segura
  tieneProgreso(rutina: RutinaHistorial): boolean {
    return !!(rutina.progreso && rutina.dias_completados && rutina.total_dias);
  }

  getPorcentajeProgreso(rutina: RutinaHistorial): number {
    if (!this.tieneProgreso(rutina)) return 0;
    return Math.round((rutina.dias_completados! / rutina.total_dias!) * 100);
  }

  getDiasCompletados(rutina: RutinaHistorial): string {
    if (!this.tieneProgreso(rutina)) {
      return 'Sin datos de progreso específicos';
    }
    return `${rutina.dias_completados} / ${rutina.total_dias} días completados`;
  }
}
