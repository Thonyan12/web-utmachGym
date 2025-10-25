import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FacturasSidebar } from '../facturas-sidebar/facturas-sidebar';
import { FacturasService } from '../services/facturas';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DetalleFacturaCrearComponent } from '../../detallefactura/detallefactura-crear/detallefactura-crear';

@Component({
  selector: 'app-facturas-crear',
  standalone: true,
  imports: [CommonModule, FormsModule, FacturasSidebar, HttpClientModule, DetalleFacturaCrearComponent],
  templateUrl: './facturas-crear.html'
})
export class FacturasCrearComponent {
  private service = inject(FacturasService);
  private http = inject(HttpClient);
  private router = inject(Router);

  cedula: string = '';
  nombreMiembro: string = '';
  apellidoMiembro: string = '';
  buscandoMiembro = false;
  miembroEncontrado = false;
  errorBusqueda = '';

  mensaje: string = '';
  sending = false;

  factura: any = {
    id_factura: 0,
    id_miembro: 0,
    id_admin: 11,
    fecha_emision: new Date().toISOString().split('T')[0],
    total: 0,
    estado_registro: true,
    f_registro: new Date().toISOString().split('T')[0]
  };

  // Nuevo: modal control
  showDetalleModal = false;
  detalleFacturaId: number | null = null;

  buscarMiembroPorCedula(): void {
    this.errorBusqueda = '';
    this.nombreMiembro = '';
    this.apellidoMiembro = '';
    this.miembroEncontrado = false;

    const ced = (this.cedula || '').trim();
    if (!ced) {
      this.errorBusqueda = 'Ingrese la cédula del miembro.';
      return;
    }

    this.buscandoMiembro = true;
    const url = `${environment.apiUrl}/api/miembros/cedula/${encodeURIComponent(ced)}`;
    const token = localStorage.getItem('token') || '';
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

    this.http.get<any>(url, { headers })
      .pipe(
        catchError((err: any) => {
          this.buscandoMiembro = false;
          if (err.status === 404) this.errorBusqueda = 'Miembro no encontrado.';
          else if (err.status === 401) this.errorBusqueda = 'No autorizado. Inicie sesión.';
          else this.errorBusqueda = 'Error al buscar miembro.';
          return of(null);
        })
      )
      .subscribe((res: any | null) => {
        this.buscandoMiembro = false;
        if (!res) return;
        const data = Array.isArray(res) ? res[0] : res;
        const id = data?.id_miembro ?? data?.id ?? data?._id;
        const nombreCompleto = data?.nombre_completo ?? `${data?.nombre || ''} ${data?.apellido1 || data?.apellido || ''}`.trim();
        const apellido = data?.apellido2 ?? data?.apellido ?? '';
        if (id != null) {
          this.factura.id_miembro = Number(id);
          this.nombreMiembro = nombreCompleto || '';
          this.apellidoMiembro = apellido || '';
          this.miembroEncontrado = true;
          this.errorBusqueda = '';
        } else {
          this.errorBusqueda = 'Respuesta inválida del servidor.';
        }
      });
  }

  guardar(form: NgForm): void {
    this.mensaje = '';
    if (form.invalid) {
      this.mensaje = 'Complete correctamente el formulario.';
      return;
    }
    if (!this.miembroEncontrado || !this.factura.id_miembro) {
      this.mensaje = 'Busque y seleccione un miembro válido por cédula.';
      return;
    }

    // asegurar y normalizar payload
    this.factura.fecha_emision = new Date().toISOString().split('T')[0];
    this.factura.f_registro = new Date().toISOString().split('T')[0];
    this.factura.id_admin = 11;
    this.factura.estado_registro = true;
    this.factura.total = Number(this.factura.total || 0);

    const payload: any = {
      id_miembro: Number(this.factura.id_miembro),
      id_admin: Number(this.factura.id_admin),
      fecha_emision: this.factura.fecha_emision,
      total: this.factura.total,
      estado_registro: this.factura.estado_registro,
      f_registro: this.factura.f_registro
    };

    Object.keys(payload).forEach(k => {
      if (payload[k] === undefined || payload[k] === null) delete payload[k];
    });

    const token = localStorage.getItem('token') || '';
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);

    this.sending = true;
    const create$ = (this.service as any)?.create && typeof (this.service as any).create === 'function'
      ? (this.service as any).create(payload)
      : this.http.post<any>(`${environment.apiUrl}/api/facturas`, payload, { headers });

    create$
      .pipe(
        catchError((err: any) => {
          console.error('Error al crear factura (cliente):', err);
          this.mensaje = err?.error?.message || err?.error?.error || 'Error al crear factura.';
          this.sending = false;
          return of(null);
        })
      )
      .subscribe((res: any | null) => {
        this.sending = false;
        if (!res) return;
        const createdId: number = Number(res?.id_factura ?? res?.id ?? 0);
        if (createdId) {
          this.mensaje = `Factura creada. ID: ${createdId}`;
          // abrir modal inline pasándole el id (no navegar)
          this.detalleFacturaId = createdId;
          this.showDetalleModal = true;
        } else {
          this.mensaje = 'Factura creada pero no se obtuvo ID.';
        }
      });
  }

  // handler para cuando el componente detalle emite cierre
  onDetalleClose(saved: boolean) {
    this.showDetalleModal = false;
    // si guardó detalle, redirigir o refrescar lista según desees
    if (saved) {
      this.router.navigate(['/admin/facturas']);
    }
  }

  cancelar(): void {
    this.router.navigate(['/admin/facturas']);
  }

}