import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface EnviarCodigoRegistroRequest {
  correo: string;
}

export interface EnviarCodigoRegistroResponse {
  success: boolean;
  message: string;
}

export interface VerificarCodigoRegistroRequest {
  correo: string;
  codigo: string;
  cedula: string;
  nombre: string;
  apellido1: string;
  apellido2?: string;
  edad: number;
  direccion: string;
  altura: number;
  peso: number;
  contextura: string;
  objetivo: string;
  sexo: string;
}

export interface VerificarCodigoRegistroResponse {
  success: boolean;
  message: string;
  data: {
    id_usuario: number;
    id_miembro: number;
    email: string;
    credenciales: {
      usuario: string;
      contrasenia: string;
    };
  };
}

export interface ValidarLoginRequest {
  email: string;
  contrasenia: string;
}

export interface ValidarLoginResponse {
  success: boolean;
  message: string;
  requiresTwoFactor: boolean;
  email?: string; // Email ofuscado (ej: us***@example.com)
  token?: string; // Solo si requiresTwoFactor = false
  usuario?: {
    id: number;
    nombre: string;
    rol: string;
  };
}

export interface VerificarCodigo2FARequest {
  email: string;
  codigo: string;
}

export interface VerificarCodigo2FAResponse {
  success: boolean;
  message: string;
  token: string;
  usuario: {
    id: number;
    nombre: string;
    rol: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class Auth2FAService {
  private readonly apiUrl = `${environment.apiUrl}/api/auth`;

  constructor(private http: HttpClient) {}

  // ========================================
  // ENDPOINTS DE REGISTRO CON 2FA
  // ========================================

  /**
   * 1️⃣ Enviar código de verificación para registro
   * Endpoint: POST /api/auth/registro/enviar-codigo
   */
  enviarCodigoRegistro(correo: string): Observable<EnviarCodigoRegistroResponse> {
    return this.http.post<EnviarCodigoRegistroResponse>(
      `${this.apiUrl}/registro/enviar-codigo`,
      { correo }
    );
  }

  /**
   * 2️⃣ Verificar código y completar registro
   * Endpoint: POST /api/auth/registro/verificar
   */
  verificarCodigoRegistro(data: VerificarCodigoRegistroRequest): Observable<VerificarCodigoRegistroResponse> {
    return this.http.post<VerificarCodigoRegistroResponse>(
      `${this.apiUrl}/registro/verificar`,
      data
    );
  }

  // ========================================
  // ENDPOINTS DE LOGIN CON 2FA
  // ========================================

  /**
   * 3️⃣ Validar credenciales y enviar código 2FA (si está activado)
   * Endpoint: POST /api/auth/login/validar
   */
  validarLogin(email: string, contrasenia: string): Observable<ValidarLoginResponse> {
    return this.http.post<ValidarLoginResponse>(
      `${this.apiUrl}/login/validar`,
      { email, contrasenia }
    );
  }

  /**
   * 4️⃣ Verificar código 2FA y completar login
   * Endpoint: POST /api/auth/login/verificar-2fa
   */
  verificarCodigo2FA(email: string, codigo: string): Observable<VerificarCodigo2FAResponse> {
    return this.http.post<VerificarCodigo2FAResponse>(
      `${this.apiUrl}/login/verificar-2fa`,
      { email, codigo }
    );
  }
}
