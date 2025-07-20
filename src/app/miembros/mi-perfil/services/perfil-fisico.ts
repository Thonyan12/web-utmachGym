import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

export interface PerfilCompleto {
  miembro: {
    id_miembro: number;
    cedula: string;
    nombre_completo: string;
    nombre: string;
    apellido1: string;
    apellido2?: string;
    edad: number;
    direccion: string;
    altura_inicial: number;
    peso_inicial: number;
    contextura: string;
    objetivo: string;
    sexo: string;
    fecha_inscripcion: string;
    estado: boolean;
    correo: string;
  };
  perfil_fisico_actual: {
    id_perfil?: number;
    altura: number;
    peso: number;
    observaciones: string;
    fecha_registro: string;
    imc_calculado?: number;
    categoria_imc?: string;
  };
  historial_perfiles: any[];
  historial_rutinas: any[];
  imc_actual: number;
  categoria_imc: string;
  estadisticas: {
    total_perfiles: number;
    peso_minimo: number;
    peso_maximo: number;
    peso_promedio: number;
    primer_registro: string;
    ultimo_registro: string;
  };
  tiempo_en_gimnasio: string;
}

export interface NuevoPerfilData {
  altura: number;
  peso: number;
  observaciones?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PerfilFisico {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/perfil-fisico';

  // GET /api/perfil-fisico/mi-perfil-completo - Todo en uno
  getMiPerfilCompleto(): Observable<ApiResponse<PerfilCompleto>> {
    return this.http.get<ApiResponse<PerfilCompleto>>(`${this.apiUrl}/mi-perfil-completo`);
  }

  // POST /api/perfil-fisico/crear - Crear perfil (trigger automático)
  crearPerfilFisico(perfilData: NuevoPerfilData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/crear`, perfilData);
  }

  // GET /api/perfil-fisico/historial - Solo historial perfiles
  getHistorialPerfiles(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/historial`);
  }

  // GET /api/perfil-fisico/historial-rutinas - Solo historial rutinas
  getHistorialRutinas(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/historial-rutinas`);
  }

  // GET /api/perfil-fisico/evolucion-imc - Evolución del IMC
  getEvolucionIMC(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/evolucion-imc`);
  }

  // Funciones auxiliares
  calcularIMC(peso: number, altura: number): number {
    return parseFloat((peso / Math.pow(altura / 100, 2)).toFixed(2));
  }

  getCategoriaIMC(imc: number): string {
    if (imc < 18.5) return 'Bajo peso';
    if (imc >= 18.5 && imc <= 24.9) return 'Peso normal';
    if (imc >= 25 && imc <= 29.9) return 'Sobrepeso';
    return 'Obesidad';
  }

  getColorCategoriaIMC(categoria: string): string {
    switch (categoria?.toLowerCase()) {
      case 'bajo peso': return 'text-info';
      case 'peso normal': return 'text-success';
      case 'sobrepeso': return 'text-warning';
      case 'obesidad': return 'text-danger';
      default: return 'text-muted';
    }
  }
}
