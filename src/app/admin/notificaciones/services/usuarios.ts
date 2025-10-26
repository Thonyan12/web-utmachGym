import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Usuario {
  id_usuario: number;
  usuario: string;
  nombre_completo: string;
  rol: string;
}

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    console.log('📡 Cargando usuarios desde /api/usuarios...');
    console.log('🔗 URL:', this.apiUrl);
    
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((usuarios) => {
        console.log('📋 Usuarios recibidos del backend:', usuarios);
        
        if (!usuarios || !Array.isArray(usuarios)) {
          console.warn('⚠️ Respuesta no es un array');
          return [];
        }
        
        // Mapear los usuarios con nombre completo
        const usuariosMapeados = usuarios
          .filter(u => u.estado !== false) // Solo usuarios activos
          .map((u: any) => ({
            id_usuario: u.id_usuario,
            usuario: u.usuario,
            nombre_completo: this.getNombreCompleto(u),
            rol: u.rol
          }));
        
        console.log('✅ Usuarios mapeados:', usuariosMapeados.length);
        console.log('📊 Por rol:', {
          admin: usuariosMapeados.filter(u => u.rol === 'admin').length,
          entrenador: usuariosMapeados.filter(u => u.rol === 'entrenador').length,
          miembro: usuariosMapeados.filter(u => u.rol === 'miembro').length
        });
        
        return usuariosMapeados;
      }),
      catchError((error) => {
        console.error('❌ Error al cargar usuarios:', error);
        console.error('Status:', error.status);
        console.error('URL que falló:', this.apiUrl);
        return of([]);
      })
    );
  }

  private getNombreCompleto(usuario: any): string {
    // Intentar obtener el nombre desde el campo usuario o construirlo
    const rol = usuario.rol || '';
    const nombreUsuario = usuario.usuario || 'Usuario';
    
    // Si tiene nombre_completo directamente, usarlo
    if (usuario.nombre_completo) {
      return `${usuario.nombre_completo} (${this.getRolLabel(rol)})`;
    }
    
    // Si tiene nombre y apellido, construirlo
    if (usuario.nombre) {
      const nombre = `${usuario.nombre} ${usuario.apellido || ''}`.trim();
      return `${nombre} (${this.getRolLabel(rol)})`;
    }
    
    // Fallback: usar el campo usuario
    return `${nombreUsuario} (${this.getRolLabel(rol)})`;
  }

  private getRolLabel(rol: string): string {
    const labels: { [key: string]: string } = {
      'admin': 'Admin',
      'entrenador': 'Entrenador',
      'miembro': 'Miembro'
    };
    return labels[rol] || rol;
  }
}