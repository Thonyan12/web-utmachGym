import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
    return this.http.put<Factura>(`${this.apiUrl}/${factura.id_factura}`, factura);
  }

  // Eliminar una factura por ID
  deleteFactura(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  constructor() { }
}