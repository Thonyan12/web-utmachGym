import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NotificacionMiembro {
  id_notificacion: number;
  id_usuario: number;
  contenido: string;
  fecha_envio: string;
  leido: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificacionesMiembroService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/notificaciones-miembro';

  getMisNotificaciones(): Observable<{ success: boolean, data: NotificacionMiembro[] }> {
    return this.http.get<{ success: boolean, data: NotificacionMiembro[] }>(`${this.apiUrl}`);
  }

  marcarComoLeida(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/leido`, {});
  }
}
