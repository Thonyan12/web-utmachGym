import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AsignacionRutina {
  id_asignacion: number;
  id_miembro: number;
  id_rutina: number;
  descripcion_asignacion: string;
  fecha_inicio: string;
  estado_asignacion: boolean;
  f_registro: string;
  nivel: string;
  tipo_rut: string;
  descripcion_rut: string;
  duracion_rut: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class Entrenamiento {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/rutinas';

  // Obtener mis rutinas asignadas
  getMisRutinas(): Observable<ApiResponse<AsignacionRutina[]>> {
    return this.http.get<ApiResponse<AsignacionRutina[]>>(`${this.apiUrl}/mis-rutinas`);
  }
}