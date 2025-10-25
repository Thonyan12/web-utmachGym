import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

export interface Factura {
  id_factura?: number; // ID opcional para creación
  id_miembro: number; // ID del miembro asociado
  id_admin: number; // ID del administrador asociado
  fecha_emision: string; // Fecha de emisión de la factura
  total: number; // Total de la factura
  estado_registro: boolean; // Estado general (true/false)
  f_registro: string; // Fecha de registro
}

@Injectable({
  providedIn: 'root'
})
export class FacturasService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/facturas'; // URL base de la API

private headers(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    let h = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) h = h.set('Authorization', `Bearer ${token}`);
    return h;
  }


  // Obtener todas las facturas
  getFacturas(): Observable<Factura[]> {
    return this.http.get<Factura[]>(this.apiUrl);
  }

  // Crear una nueva factura
  createFactura(factura: Factura): Observable<any> {
    return this.http.post(this.apiUrl, factura);
  }

  // Obtener una factura por ID
  getFacturaById(id: number): Observable<Factura> {
    return this.http.get<Factura>(`${this.apiUrl}/${id}`);
  }

  // Actualizar una factura existente
  updateFactura(factura: Factura): Observable<Factura> {
    if (!factura.id_factura) return throwError(() => new Error('id_factura es requerido'));
    return this.http.put<Factura>(`${this.apiUrl}/${factura.id_factura}`, factura, { headers: this.headers() }).pipe(
      catchError(err => throwError(() => err))
    );
  }

  // Eliminar una factura por ID
  deleteFactura(idFactura: number): Observable<any> {
    const url = `${this.apiUrl}/${idFactura}`;
    console.log('URL generada para eliminar:', url);
    return this.http.delete(url);
  }

  createFacturaConDetalle(facturaCompleta: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear-con-detalle`, facturaCompleta);
  }

  constructor() { }
}