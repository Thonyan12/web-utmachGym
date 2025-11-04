import { Component, inject, OnInit } from '@angular/core';
import { FacturasSidebar } from '../facturas-sidebar/facturas-sidebar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Factura, FacturasService } from '../services/facturas';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-facturas-detalle',
  imports: [CommonModule, FormsModule, FacturasSidebar, RouterModule],
  templateUrl: './facturas-detalle.html',
  styleUrls: ['./facturas-detalle.css']
})
export class FacturasDetalle implements OnInit {
  private facturasService = inject(FacturasService);
  private http = inject(HttpClient);
  
  mostrarModal: boolean = false;
  facturaSeleccionada: Factura | null = null;
  facturas: Factura[] = [];
  facturasFiltradas: Factura[] = [];
  filtro: string = '';
  memberMap: Record<number, { nombre: string; cedula: string }> = {};

  ngOnInit(): void {
    this.loadMembers();
    this.facturasService.getFacturas().subscribe({
      next: (data) => {
        this.facturas = (data || []).filter(factura => !!factura);
        this.facturasFiltradas = this.facturas;
      },
      error: (error) => console.log('Error al obtener facturas', error)
    });
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
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const anio = date.getFullYear();
    return `${dia}-${mes}-${anio}`;
  }

  filtrarFacturas(): void {
    const filtroLower = this.filtro.toLowerCase();
    this.facturasFiltradas = this.facturas.filter(factura => {
      if (!factura) return false;
      
      const memberName = this.getMemberName(factura.id_miembro).toLowerCase();
      const memberCedula = this.getMemberCedula(factura.id_miembro).toLowerCase();
      const total = String(factura.total || '');
      const estado = factura.estado_registro ? 'activo' : 'inactivo';
      
      return (
        memberName.includes(filtroLower) ||
        memberCedula.includes(filtroLower) ||
        total.includes(filtroLower) ||
        estado.includes(filtroLower)
      );
    });
  }

  abrirModal(factura: Factura): void {
    this.facturaSeleccionada = factura;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.facturaSeleccionada = null;
  }
}