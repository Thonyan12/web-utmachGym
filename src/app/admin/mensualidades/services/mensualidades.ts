import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Mensualidad {
  id_mensualidad?: number; // ID opcional para creación
  id_miembro?: number; // ID del miembro asociado
  fecha_inicio: string; // Fecha de inicio de la mensualidad
  fecha_fin: string; // Fecha de fin de la mensualidad
  monto: number; // Monto de la mensualidad
  estado_mensualidad: string; // Estado de la mensualidad (ej. "Activa", "Inactiva")
  estado: boolean; // Estado general (true/false)
  f_registro: string; // Fecha de registro
}

@Injectable({
  providedIn: 'root'
})
export class Mensualidades {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/mensualidades'; // URL base de la API

  // Obtener todas las mensualidades
  getMensualidades(): Observable<Mensualidad[]> {
    return this.http.get<Mensualidad[]>(this.apiUrl);
  }

  // Crear una nueva mensualidad
  create(mensualidad: Mensualidad): Observable<any> {
    return this.http.post(this.apiUrl, mensualidad);
  }

  // Obtener una mensualidad por ID
  getById(id: number): Observable<Mensualidad> {
    return this.http.get<Mensualidad>(`${this.apiUrl}/${id}`);
  }

  // Actualizar una mensualidad existente
  update(mensualidad: Mensualidad): Observable<Mensualidad> {
    return this.http.put<Mensualidad>(`${this.apiUrl}/${mensualidad.id_mensualidad}`, mensualidad);
  }

  // Eliminar una mensualidad por ID
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  constructor() { }
}