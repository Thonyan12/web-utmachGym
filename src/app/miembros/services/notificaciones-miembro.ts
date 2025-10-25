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
  origen?: 'miembro' | 'general'; // Para identificar de qué tabla viene
  id_usuario_remitente?: number; // Para notificaciones de entrenadores
}

@Injectable({ providedIn: 'root' })
export class NotificacionesMiembroService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/notificaciones-unificadas';

  // MÉTODO PARA OBTENER HEADERS CON TOKEN
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('🔑 Token desde localStorage:', token ? 'Token presente' : 'No hay token');
    
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  
  getMisNotificaciones(): Observable<{ success: boolean, data: NotificacionMiembro[], resumen?: any }> {
    console.log('📡 Llamando getMisNotificaciones UNIFICADAS con headers...');
    return this.http.get<{ success: boolean, data: NotificacionMiembro[], resumen?: any }>(
      `${this.apiUrl}`, 
      { headers: this.getHeaders() }
    );
  }

  
  marcarComoLeida(id: number, origen?: 'miembro' | 'general'): Observable<any> {
    console.log('📡 Marcando como leída con headers:', id, 'origen:', origen);
    
    // La ruta ahora es: /:origen/:id_notificacion/leida
    if (!origen) {
      origen = 'general'; // Por defecto
    }
    
    const url = `${this.apiUrl}/${origen}/${id}/leida`;
    
    return this.http.put(
      url, 
      {}, 
      { headers: this.getHeaders() }
    );
  }

  // Método adicional para obtener solo no leídas
  getNoLeidas(): Observable<{ success: boolean, data: NotificacionMiembro[], total?: number }> {
    console.log('📡 Obteniendo notificaciones no leídas...');
    return this.http.get<{ success: boolean, data: NotificacionMiembro[], total?: number }>(
      `${this.apiUrl}/no-leidas`, 
      { headers: this.getHeaders() }
    );
  }

  // Método adicional para filtrar por tipo
  getPorTipo(tipo: string): Observable<{ success: boolean, data: NotificacionMiembro[], total?: number }> {
    console.log('📡 Filtrando notificaciones por tipo:', tipo);
    return this.http.get<{ success: boolean, data: NotificacionMiembro[], total?: number }>(
      `${this.apiUrl}/tipo/${tipo}`, 
      { headers: this.getHeaders() }
    );
  }

  
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

  
  testearConexion(): Observable<any> {
    console.log('🧪 Testeando conexión desde servicio...');
    return this.http.get(`${this.apiUrl}/test`, { headers: this.getHeaders() });
  }
}