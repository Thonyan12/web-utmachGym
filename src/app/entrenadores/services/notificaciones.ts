import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Notificaciones {
  private apiUrl = 'http://localhost:3000/api/notificaciones-entrenador';

  constructor(private http: HttpClient) { }

  // Obtener notificaciones recibidas por el entrenador logueado
  getMisNotificaciones(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    console.log('📡 Llamando a:', `${this.apiUrl}/mis-notificaciones`);
    console.log('🔑 Token:', token ? 'Presente' : 'No presente');
    return this.http.get<any>(`${this.apiUrl}/mis-notificaciones`, { headers });
  }

  // Enviar una nueva notificación
  enviarNotificacion(data: { id_usuario: number, tipo: string, contenido: string }): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    console.log('📤 Enviando notificación a:', this.apiUrl);
    console.log('📋 Datos:', data);
    console.log('🔑 Token:', token ? 'Presente' : 'No presente');
    return this.http.post<any>(`${this.apiUrl}`, data, { headers });
  }

  // Marcar notificación como leída
  marcarComoLeida(id_notificacion: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    console.log('✅ Marcando como leída:', `${this.apiUrl}/${id_notificacion}/leida`);
    // Cambiado de PATCH a PUT porque CORS no permite PATCH
    return this.http.put<any>(`${this.apiUrl}/${id_notificacion}/leida`, {}, { headers });
  }
}
