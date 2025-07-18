import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: number;
    usuario: string;
    rol: string;
    nombre_completo: string;
    email: string;
  };
  redirectTo: string;
}
export interface User {
  id: number;
  usuario: string;
  rol: string;
  nombre_completo: string;
  email: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Cargar usuario desde localStorage al iniciar
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }
  // Login unificado (funciona para admin, entrenador, miembro)
  login(usuario: string, contrasenia: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, { usuario, contrasenia })
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        })
      );
  }
  // Registro para miembros
  register(memberData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, memberData);
  }
  // Verificar token
  verifyToken(): Observable<any> {
    return this.http.get(`${this.apiUrl}/verify`);
  }

  // Logout (SIN redirección automática)
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
   
  }

  // Obtener token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Verificar si el token expiró
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp < Date.now() / 1000;
    } catch (error) {
      return true;
    }
  }

  // Obtener usuario actual
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Verificar rol específico
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user !== null && user.rol === role;
  }

  // Verificar si es admin
  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  // Verificar si es entrenador
  isTrainer(): boolean {
    return this.hasRole('entrenador');
  }

  // Verificar si es miembro
  isMember(): boolean {
    return this.hasRole('miembro');
  }
}
