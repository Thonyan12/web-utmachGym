import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Notificacion {
  id_notificacion: number;
  id_usuario: number;
  titulo: string;
  contenido: string;
  fecha_envio: string;
  leido: boolean;
  tipo: string;
  estado: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class NotificacionesServiceDashboard {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/notificaciones/miembro';

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getMisNotificaciones(): Observable<{ success: boolean, data: Notificacion[] }> {
    return this.http.get<{ success: boolean, data: Notificacion[] }>(
      this.apiUrl,
      { headers: this.getHeaders() }
    );
  }

  getTodasMisNotificaciones(): Observable<{ success: boolean, sent: Notificacion[], received: Notificacion[] }> {
    return this.http.get<{ success: boolean, sent: Notificacion[], received: Notificacion[] }>(
      'http://localhost:3000/api/notificaciones/all',
      { headers: this.getHeaders() }
    );
  }

  marcarComoLeida(id_notificacion: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${id_notificacion}/leida`,
      {},
      { headers: this.getHeaders() }
    );
  }
}
