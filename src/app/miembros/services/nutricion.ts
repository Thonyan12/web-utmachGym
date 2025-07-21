import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Dieta {
  id_dieta: number;
  nombre: string;
  objetivo: string;
  descripcion: string;
  duracion_dias: number;
  f_registro: string;
  id_rutina: number;
  nivel: string;
  tipo_rut: string;
  rutina_descripcion: string;
  duracion_rut: string;
  rutina_fecha_inicio: string;
  asignacion_descripcion: string;
  total_comidas: number;
  comidas: Comida[];
}

export interface Comida {
  id_comida: number;
  nombre: string;
  tipo: string;
  hora_recomendada: string;
  descripcion: string;
  f_registro: string;
}

export interface DietaConComidas {
  dieta: Dieta;
  comidas: Comida[];
}

export interface PlanNutricional {
  dietas: Dieta[];
  total_dietas: number;
  total_comidas: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class Nutricion {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/dietas';

  // Obtener todas las dietas del miembro
  getMyDietas(): Observable<ApiResponse<Dieta[]>> {
    return this.http.get<ApiResponse<Dieta[]>>(`${this.apiUrl}/miembro`);
  }

  // Obtener detalles de una dieta específica
  getDietaDetails(dietaId: number): Observable<ApiResponse<DietaConComidas>> {
    return this.http.get<ApiResponse<DietaConComidas>>(`${this.apiUrl}/miembro/${dietaId}/detalles`);
  }

  // Obtener todas las comidas organizadas por dieta
  getAllMyComidas(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/miembro/comidas`);
  }

  // Obtener plan nutricional completo
  getPlanNutricional(): Observable<ApiResponse<PlanNutricional>> {
    return this.http.get<ApiResponse<PlanNutricional>>(`${this.apiUrl}/miembro/plan-completo`);
  }
}