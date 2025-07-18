import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Notificacion {
  id_notificacion?: number;
  id_usuario: number;
  id_usuario_remitente: number;
  tipo: string;
  contenido: string;
  fecha_envio: string;
  leido: boolean;
  estado: boolean;
  f_registro?: string; // <-- ahora es opcional
}

@Injectable({
  providedIn: 'root',
})
export class NotificacionesService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/notificaciones';

  getNotificaciones(): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(this.apiUrl);
  }

  create(notificacion: Notificacion): Observable<any> {
    const { id_notificacion, f_registro, ...noti } = notificacion;
    return this.http.post(this.apiUrl, noti);
  }

  getById(id: number): Observable<Notificacion> {
    return this.http.get<Notificacion>(`${this.apiUrl}/${id}`);
  }

  update(notificacion: Notificacion): Observable<Notificacion> {
    return this.http.put<Notificacion>(
      `${this.apiUrl}/${notificacion.id_notificacion}`,
      notificacion
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Obtener notificaciones enviadas por el usuario logueado
  getSentNotifications(): Observable<{
    success: boolean;
    data: Notificacion[];
  }> {
    return this.http.get<{ success: boolean; data: Notificacion[] }>(
      `${this.apiUrl}/sent`
    );
  }

  // Obtener notificaciones recibidas por el usuario logueado
  getReceivedNotifications(): Observable<{
    success: boolean;
    data: Notificacion[];
  }> {
    return this.http.get<{ success: boolean; data: Notificacion[] }>(
      `${this.apiUrl}/received`
    );
  }

  // Obtener todas las notificaciones del usuario (enviadas y recibidas)
  getAllUserNotifications(): Observable<{
    success: boolean;
    sent: Notificacion[];
    received: Notificacion[];
  }> {
    return this.http.get<{ success: boolean; sent: Notificacion[]; received: Notificacion[] }>(
      `${this.apiUrl}/all`
    );
  }

  getByTipo(tipo: string): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.apiUrl}/tipo/${tipo}`);
  }

  constructor() {}
}
