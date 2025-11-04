import { Component, inject, OnInit } from '@angular/core';
import { FacturasSidebar } from '../facturas-sidebar/facturas-sidebar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Factura, FacturasService } from '../services/facturas';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-facturas-eliminar',
  imports: [CommonModule, FormsModule, FacturasSidebar],
  templateUrl: './facturas-eliminar.html',
  styleUrls: ['./facturas-eliminar.css']
})
export class FacturasEliminar implements OnInit {
  private service = inject(FacturasService);
  private http = inject(HttpClient);

  busqueda: string = '';
  factura: Factura | null = null;
  mensaje: string = '';
  mostrarConfirmacion: boolean = false;
  members: any[] = [];
  miembrosFiltrados: any[] = [];
  memberMap: Record<number, { nombre: string; cedula: string }> = {};
  mostrarSugerencias = false;
  mostrarModalSeleccion = false;
  facturasDisponibles: Factura[] = [];

  ngOnInit(): void {
    this.loadMembers();
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
        this.members = members || [];
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

  filtrarMiembros(): void {
    const query = this.busqueda.toLowerCase().trim();
    if (!query) {
      this.miembrosFiltrados = [];
      this.mostrarSugerencias = false;
      return;
    }

    this.miembrosFiltrados = this.members.filter(m => {
      const nombre = `${m.nombre || ''} ${m.apellido1 || ''} ${m.apellido2 || ''}`.toLowerCase();
      const cedula = (m.cedula || '').toLowerCase();
      return nombre.includes(query) || cedula.includes(query);
    }).slice(0, 5);

    this.mostrarSugerencias = this.miembrosFiltrados.length > 0;
  }

  seleccionarMiembro(miembro: any): void {
    this.busqueda = `${miembro.nombre} ${miembro.apellido1}`.trim();
    this.mostrarSugerencias = false;
    this.buscar();
  }

  getMemberName(id?: number | string | null): string {
    if (id == null) return 'Sin asignar';
    const key = Number(id);
    const info = this.memberMap[key];
    return info ? info.nombre : `ID: ${key}`;
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const anio = date.getFullYear();
    return `${dia}-${mes}-${anio}`;
  }

  buscar(): void {
    this.mensaje = '';
    this.factura = null;
    this.mostrarConfirmacion = false;
    
    const raw = this.busqueda.trim();
    if (!raw) {
      this.mensaje = 'Ingrese el nombre o cédula del miembro.';
      return;
    }

    const q = raw.toLowerCase();
    const getCedula = (m: any) => String(m.cedula || '').toLowerCase();
    const getNombre = (m: any) => `${m.nombre || ''} ${m.apellido1 || ''} ${m.apellido2 || ''}`.toLowerCase();

    const member = this.members.find(m => getCedula(m) === q || getNombre(m).includes(q));
    if (!member) {
      this.mensaje = 'No se encontró ningún miembro con esa información.';
      return;
    }

    const memberId = member.id_miembro;
    this.service.getFacturas().subscribe({
      next: (facturas) => {
        const facturasDelMiembro = facturas.filter(f => f.id_miembro === memberId);
        if (facturasDelMiembro.length > 1) {
          this.facturasDisponibles = facturasDelMiembro;
          this.mostrarModalSeleccion = true;
          this.mensaje = '';
        } else if (facturasDelMiembro.length === 1) {
          this.factura = facturasDelMiembro[0];
          this.mensaje = '';
        } else {
          this.mensaje = 'No se encontraron facturas para este miembro.';
        }
      },
      error: () => {
        this.mensaje = 'Error al buscar facturas.';
      }
    });
  }

  seleccionarFactura(factura: Factura): void {
    this.factura = factura;
    this.cerrarModalSeleccion();
    this.mensaje = '';
  }

  cerrarModalSeleccion(): void {
    this.mostrarModalSeleccion = false;
  }

  confirmarEliminar(): void {
    this.mostrarConfirmacion = true;
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacion = false;
  }

  eliminar(): void {
    if (!this.factura?.id_factura) return;
    
    this.service.deleteFactura(this.factura.id_factura).subscribe({
      next: () => {
        this.mensaje = 'Factura eliminada correctamente.';
        this.factura = null;
        this.busqueda = '';
        this.mostrarConfirmacion = false;
      },
      error: (error) => {
        console.error('Error al eliminar la factura:', error);
        this.mensaje = 'Error al eliminar la factura.';
        this.mostrarConfirmacion = false;
      },
    });
  }
}