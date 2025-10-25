import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MiembrosService {
  private apiUrl = 'http://localhost:3000/api/miembros';

  constructor(private http: HttpClient) {}

  obtenerMiembrosDisponibles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/disponibles`);
  }

  asignarMiembros(miembros: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/asignar`, { miembros });
  }
}