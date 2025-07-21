import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Notificaciones {
  private apiUrl = '/api/notificaciones-entrenador';

  constructor(private http: HttpClient) { }

  // Obtener notificaciones recibidas por el entrenador logueado
  getMisNotificaciones(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/mis-notificaciones`);
  }

  // Enviar una nueva notificación
  enviarNotificacion(data: { id_usuario: number, tipo: string, contenido: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/`, data);
  }

  // Marcar notificación como leída
  marcarComoLeida(id_notificacion: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id_notificacion}/leida`, {});
  }
}
