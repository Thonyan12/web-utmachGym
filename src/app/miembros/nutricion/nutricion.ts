import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Nutricion, PlanNutricional, Dieta, Comida } from '../services/nutricion';

@Component({
  selector: 'app-nutricion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nutricion.html',
  styleUrls: ['./nutricion.css']
})
export class NutricionComponent implements OnInit {
  private nutricionService = inject(Nutricion);

  planNutricional: PlanNutricional | null = null;
  loading = true;
  error: string | null = null;

  ngOnInit() {
    this.cargarPlanNutricional();
  }

  cargarPlanNutricional() {
    this.loading = true;
    this.error = null;

    this.nutricionService.getPlanNutricional().subscribe({
      next: (response) => {
        if (response.success) {
          this.planNutricional = response.data;
          console.log('✅ Plan nutricional cargado:', this.planNutricional);
        } else {
          this.error = response.message || 'Error al cargar el plan nutricional';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar nutrición:', err);
        this.error = 'Error al conectar con el servidor';
        this.loading = false;
      }
    });
  }

  formatearHora(hora: string): string {
    try {
      const [h, m] = hora.split(':');
      const date = new Date();
      date.setHours(parseInt(h), parseInt(m));
      return date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return hora;
    }
  }

  getTipoIcon(tipo: string): string {
    const iconos: { [key: string]: string } = {
      'Desayuno': 'bi-sunrise',
      'Media mañana': 'bi-cup',
      'Almuerzo': 'bi-sun',
      'Merienda': 'bi-cookie',
      'Cena': 'bi-moon',
      'Post-entreno': 'bi-lightning',
      'Colación': 'bi-apple'
    };
    return iconos[tipo] || 'bi-dish';
  }

  getTipoBadgeClass(tipo: string): string {
    const clases: { [key: string]: string } = {
      'Desayuno': 'bg-warning',
      'Media mañana': 'bg-info',
      'Almuerzo': 'bg-success',
      'Merienda': 'bg-secondary',
      'Cena': 'bg-dark',
      'Post-entreno': 'bg-danger',
      'Colación': 'bg-primary'
    };
    return clases[tipo] || 'bg-light text-dark';
  }

  trackByDietaId(index: number, dieta: Dieta): number {
    return dieta.id_dieta;
  }

  trackByComidaId(index: number, comida: Comida): number {
    return comida.id_comida;
  }
}
