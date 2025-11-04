import { Component, inject, OnInit } from '@angular/core';
import { Factura, FacturasService } from '../services/facturas';
import { DetalleFactura, DetalleFacturaService } from '../../detallefactura/services/detallefactura';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FacturasSidebar } from '../facturas-sidebar/facturas-sidebar';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { catchError, of } from 'rxjs';

declare const bootstrap: any;

@Component({
  selector: 'app-facturas-listar',
  imports: [CommonModule, FormsModule, RouterModule, CurrencyPipe, FacturasSidebar],
  templateUrl: './facturas-listar.html',
  styleUrls: ['./facturas-listar.css']
})
export class FacturasListarComponent implements OnInit {
  private facturasService = inject(FacturasService);
  private detalleFacturaService = inject(DetalleFacturaService);
  private http = inject(HttpClient);
  
  facturas: Factura[] = [];
  detallesFactura: DetalleFactura[] = [];
  memberMap: Record<number, { nombre: string; cedula: string }> = {};

  ngOnInit(): void {
    this.loadMembers();
    this.cargarFacturas();
  }

  private loadMembers(): void {
    this.http.get<any[]>(`${environment.apiUrl}/api/miembros`)
      .pipe(
        catchError(err => {
          console.error('Error al obtener miembros:', err);
          return of([]);
        })
      )
      .subscribe(members => {
        members.forEach(m => {
          const nombreCompleto = `${m.nombre || ''} ${m.apellido1 || ''} ${m.apellido2 || ''}`.trim();
          const cedula = m.cedula || m.identificacion || 'N/A';
          this.memberMap[m.id_miembro] = {
            nombre: nombreCompleto || 'Sin nombre',
            cedula: cedula
          };
        });
      });
  }

  getMemberName(id?: number | string | null): string {
    if (id == null) return 'Sin asignar';
    const key = Number(id);
    const info = this.memberMap[key];
    return info ? info.nombre : `ID: ${key}`;
  }

  getMemberCedula(id?: number | string | null): string {
    if (id == null) return 'N/A';
    const key = Number(id);
    const info = this.memberMap[key];
    return info?.cedula || 'N/A';
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    const dia = date.getDate().toString().padStart(2, '0');
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const anio = date.getFullYear();
    return `${dia}-${mes}-${anio}`;
  }

  cargarFacturas(): void {
    this.facturasService.getFacturas().subscribe({
      next: (facturas) => {
        this.facturas = facturas;
      },
      error: (error) => {
        console.error('Error al cargar las facturas:', error);
      },
    });
  }

  abrirModal(idFactura: number): void {
    const modalElement = document.getElementById('detalleFacturaModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }

    this.detalleFacturaService.getDetallesFacturaByFacturaId(idFactura).subscribe({
      next: (detalles) => {
        this.detallesFactura = detalles;
      },
      error: (error) => {
        console.error('Error al cargar detalles de factura:', error);
      }
    });
  }
}