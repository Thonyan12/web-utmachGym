import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FacturaMiembro {
  id_factura: number;
  fecha_emision: string;
  total: number;
  estado_registro: boolean;
  f_registro: string;
  nombre_miembro: string;
  admin_usuario: string;
}

export interface DetalleFactura {
  id_detalle: number;
  tipo_detalle: string;
  referencia_id: number;
  descripcion: string;
  monto: number;
  iva: number;
  metodo_pago: string;
  estado_registro: boolean;
  f_registro: string;
}

export interface FacturaConDetalles {
  factura: FacturaMiembro;
  detalles: DetalleFactura[];
}

@Injectable({
  providedIn: 'root'
})
export class FacturasMiembro {
  private apiUrl = 'http://localhost:3000/api/facturasMiembros';

  constructor(private http: HttpClient) {}

  getFacturasMiembro(): Observable<{success: boolean, data: FacturaMiembro[], total: number}> {
    return this.http.get<{success: boolean, data: FacturaMiembro[], total: number}>(`${this.apiUrl}/miembro`);
  }

  getDetalleFactura(idFactura: number): Observable<{success: boolean, data: FacturaConDetalles}> {
    return this.http.get<{success: boolean, data: FacturaConDetalles}>(`${this.apiUrl}/miembro/${idFactura}/detalles`);
  }
}
