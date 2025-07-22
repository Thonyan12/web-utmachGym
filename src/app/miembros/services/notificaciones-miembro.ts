import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NotificacionMiembro {
  id_notificacion: number;
  id_miembro: number;
  contenido: string;
  fecha_envio: string;
  leido: boolean;
  tipo?: string; 
  titulo?: string;
  coach_nombre?: string;
  estado?: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificacionesMiembroService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/notificaciones-miembro';

  // ✅ MÉTODO PARA OBTENER HEADERS CON TOKEN
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('🔑 Token desde localStorage:', token ? 'Token presente' : 'No hay token');
    
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // ✅ CORREGIDO - Con headers
  getMisNotificaciones(): Observable<{ success: boolean, data: NotificacionMiembro[] }> {
    console.log('📡 Llamando getMisNotificaciones con headers...');
    return this.http.get<{ success: boolean, data: NotificacionMiembro[] }>(
      `${this.apiUrl}`, 
      { headers: this.getHeaders() }
    );
  }

  // ✅ CORREGIDO - Con headers
  marcarComoLeida(id: number): Observable<any> {
    console.log('📡 Marcando como leída con headers:', id);
    return this.http.put(
      `${this.apiUrl}/${id}/leido`, 
      {}, 
      { headers: this.getHeaders() }
    );
  }

  // ✅ CORREGIDO - Con headers y mejor logging
  generarNotificacionEntrenador(): Observable<{ success: boolean, message: string, notificacion?: any }> {
    console.log('📡 Llamando generarNotificacionEntrenador con headers...');
    
    const headers = this.getHeaders();
    console.log('🔍 Headers enviados:', headers.keys());
    
    return this.http.post<{ success: boolean, message: string, notificacion?: any }>(
      `${this.apiUrl}/generar-entrenador`, 
      {}, 
      { headers }
    );
  }

  // ✅ MÉTODO DE TEST PARA EL SERVICIO
  testearConexion(): Observable<any> {
    console.log('🧪 Testeando conexión desde servicio...');
    return this.http.get(`${this.apiUrl}/test`, { headers: this.getHeaders() });
  }
}