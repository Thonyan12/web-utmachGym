import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PerfilFisico } from '../services/perfil-fisico';

export interface PerfilHistorial {
  id_perfil: number;
  altura: number;
  peso: number;
  observaciones: string;
  fecha_registro: string;
  imc_calculado: number;
  categoria_imc: string;
  diferencia_peso?: number;
  dias_desde_anterior?: number;
}

@Component({
  selector: 'app-historial-perfiles',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './historial-perfiles.html',
  styleUrls: ['./historial-perfiles.css']
})
export class HistorialPerfiles implements OnInit {
  private perfilService = inject(PerfilFisico);

  // Estado del componente
  historialPerfiles: PerfilHistorial[] = [];
  loading = true;
  error: string | null = null;
  
  // Información del miembro
  miembroInfo: any = null;
  
  // Filtros
  filtroIMC = '';
  filtroFecha = '';
  buscarTexto = '';
  ordenarPor = 'fecha_desc'; // fecha_desc, fecha_asc, peso_desc, peso_asc, imc_desc, imc_asc
  
  // Estadísticas
  totalRegistros = 0;
  pesoInicial = 0;
  pesoActual = 0;
  diferenciaPesoTotal = 0;
  promedioIMC = 0;
  tendenciaPeso = ''; // 'subiendo', 'bajando', 'estable'

  // Opciones para filtros
  categoriasIMC: string[] = ['Bajo peso', 'Peso normal', 'Sobrepeso', 'Obesidad'];
  rangosFecha: any[] = [
    { valor: '', label: 'Todas las fechas' },
    { valor: 'ultimo_mes', label: 'Último mes' },
    { valor: 'ultimos_3_meses', label: 'Últimos 3 meses' },
    { valor: 'ultimo_ano', label: 'Último año' }
  ];

  ngOnInit() {
    this.cargarHistorialPerfiles();
  }

  cargarHistorialPerfiles() {
    this.loading = true;
    this.error = null;

    this.perfilService.getHistorialPerfiles().subscribe({
      next: (response) => {
        if (response.success) {
          this.historialPerfiles = response.data.historial_perfiles || [];
          this.miembroInfo = response.data.miembro_info;
          
          // Calcular estadísticas
          this.calcularEstadisticas();
          
          console.log('✅ Historial de perfiles cargado:', this.historialPerfiles);
        } else {
          this.error = response.message || 'Error al cargar historial de perfiles';
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

  calcularEstadisticas() {
    if (this.historialPerfiles.length === 0) return;

    this.totalRegistros = this.historialPerfiles.length;
    
    // Ordenar por fecha para cálculos
    const perfilesOrdenados = [...this.historialPerfiles].sort(
      (a, b) => new Date(a.fecha_registro).getTime() - new Date(b.fecha_registro).getTime()
    );

    this.pesoInicial = perfilesOrdenados[0].peso;
    this.pesoActual = perfilesOrdenados[perfilesOrdenados.length - 1].peso;
    this.diferenciaPesoTotal = this.pesoActual - this.pesoInicial;

    // Promedio IMC
    this.promedioIMC = parseFloat(
      (this.historialPerfiles.reduce((sum, p) => sum + p.imc_calculado, 0) / this.totalRegistros).toFixed(2)
    );

    // Tendencia de peso (últimos 3 registros)
    if (this.totalRegistros >= 3) {
      const ultimos3 = perfilesOrdenados.slice(-3);
      const pendiente = this.calcularTendencia(ultimos3);
      
      if (pendiente > 0.5) this.tendenciaPeso = 'subiendo';
      else if (pendiente < -0.5) this.tendenciaPeso = 'bajando';
      else this.tendenciaPeso = 'estable';
    }

    // Calcular diferencias entre registros consecutivos
    this.calcularDiferenciasConsecutivas(perfilesOrdenados);
  }

  calcularTendencia(perfiles: PerfilHistorial[]): number {
    const n = perfiles.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += perfiles[i].peso;
      sumXY += i * perfiles[i].peso;
      sumX2 += i * i;
    }

    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  }

  calcularDiferenciasConsecutivas(perfilesOrdenados: PerfilHistorial[]) {
    for (let i = 1; i < perfilesOrdenados.length; i++) {
      const actual = perfilesOrdenados[i];
      const anterior = perfilesOrdenados[i - 1];
      
      actual.diferencia_peso = parseFloat((actual.peso - anterior.peso).toFixed(2));
      
      const fechaActual = new Date(actual.fecha_registro);
      const fechaAnterior = new Date(anterior.fecha_registro);
      actual.dias_desde_anterior = Math.floor(
        (fechaActual.getTime() - fechaAnterior.getTime()) / (1000 * 60 * 60 * 24)
      );
    }
  }

  // Getter para perfiles filtrados y ordenados
  get perfilesFiltrados(): PerfilHistorial[] {
    let perfiles = [...this.historialPerfiles];

    // Aplicar filtros
    if (this.filtroIMC) {
      perfiles = perfiles.filter(p => p.categoria_imc === this.filtroIMC);
    }

    if (this.filtroFecha) {
      const ahora = new Date();
      perfiles = perfiles.filter(p => {
        const fecha = new Date(p.fecha_registro);
        switch (this.filtroFecha) {
          case 'ultimo_mes':
            return (ahora.getTime() - fecha.getTime()) <= 30 * 24 * 60 * 60 * 1000;
          case 'ultimos_3_meses':
            return (ahora.getTime() - fecha.getTime()) <= 90 * 24 * 60 * 60 * 1000;
          case 'ultimo_ano':
            return (ahora.getTime() - fecha.getTime()) <= 365 * 24 * 60 * 60 * 1000;
          default:
            return true;
        }
      });
    }

    if (this.buscarTexto) {
      const texto = this.buscarTexto.toLowerCase();
      perfiles = perfiles.filter(p => 
        p.observaciones?.toLowerCase().includes(texto) ||
        p.categoria_imc?.toLowerCase().includes(texto)
      );
    }

    // Aplicar ordenamiento
    perfiles.sort((a, b) => {
      switch (this.ordenarPor) {
        case 'fecha_desc':
          return new Date(b.fecha_registro).getTime() - new Date(a.fecha_registro).getTime();
        case 'fecha_asc':
          return new Date(a.fecha_registro).getTime() - new Date(b.fecha_registro).getTime();
        case 'peso_desc':
          return b.peso - a.peso;
        case 'peso_asc':
          return a.peso - b.peso;
        case 'imc_desc':
          return b.imc_calculado - a.imc_calculado;
        case 'imc_asc':
          return a.imc_calculado - b.imc_calculado;
        default:
          return 0;
      }
    });

    return perfiles;
  }

  limpiarFiltros() {
    this.filtroIMC = '';
    this.filtroFecha = '';
    this.buscarTexto = '';
    this.ordenarPor = 'fecha_desc';
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatearFechaCorta(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
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

  getDiferenciaPesoColor(diferencia: number): string {
    if (diferencia > 0) return 'text-danger'; // Subió
    if (diferencia < 0) return 'text-success'; // Bajó
    return 'text-muted'; // Igual
  }

  getDiferenciaPesoIcon(diferencia: number): string {
    if (diferencia > 0) return 'bi-arrow-up';
    if (diferencia < 0) return 'bi-arrow-down';
    return 'bi-dash';
  }

  getTendenciaColor(): string {
    switch (this.tendenciaPeso) {
      case 'subiendo': return 'text-danger';
      case 'bajando': return 'text-success';
      case 'estable': return 'text-info';
      default: return 'text-muted';
    }
  }

  getTendenciaIcon(): string {
    switch (this.tendenciaPeso) {
      case 'subiendo': return 'bi-trend-up';
      case 'bajando': return 'bi-trend-down';
      case 'estable': return 'bi-dash-lg';
      default: return 'bi-question';
    }
  }

  trackByPerfil(index: number, perfil: PerfilHistorial): number {
    return perfil.id_perfil;
  }
}
