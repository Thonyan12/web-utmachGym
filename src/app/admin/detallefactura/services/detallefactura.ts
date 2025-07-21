import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface DetalleFactura {
  id_detalle?: number; // ID opcional para creación
  id_factura: number; // ID de la factura asociada
  tipo_detalle: string; // Tipo de detalle
  referencia_id: number; // ID de referencia
  descripcion: string; // Descripción del detalle
  monto: number; // Monto total
  iva: number; // IVA aplicado
  metodo_pago: string; // Método de pago
}

@Injectable({
  providedIn: 'root'
})
export class DetalleFacturaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/detallefactura'; // URL base de la API

  // Obtener todos los detalles de factura
  getDetallesFactura(idFactura: number): Observable<DetalleFactura[]> {
    return this.http.get<DetalleFactura[]>(`${this.apiUrl}/factura/${idFactura}`);
  }
  // Obtener un detalle de factura por ID
  getDetallesFacturaByFacturaId(idFactura: number): Observable<DetalleFactura[]> {
    return this.http.get<DetalleFactura[]>(`${this.apiUrl}/factura/${idFactura}`);
  }

  

  constructor() {}
}