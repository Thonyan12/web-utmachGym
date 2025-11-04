import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Mensualidad, Mensualidades } from '../services/mensualidades';
import { MensualidadSidebar } from '../mensualidad-sidebar/mensualidad-sidebar';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-mensualidad-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, MensualidadSidebar],
  templateUrl: './mensualidad-detalle.html',
  styleUrl: './mensualidad-detalle.css'
})
export class MensualidadDetalleComponent implements OnInit {
  private mensualidadesService = inject(Mensualidades);
  private http = inject(HttpClient);

  mensualidades: Mensualidad[] = [];
  mensualidadesFiltradas: Mensualidad[] = [];
  filtro: string = '';
  members: Array<any> = [];
  memberMap: Record<number, { nombre: string; cedula?: string }> = {};
  mostrarModal: boolean = false;
  mensualidadSeleccionada: Mensualidad | null = null;

  ngOnInit(): void {
    this.loadMembers();

    this.mensualidadesService.getMensualidades().subscribe({
      next: (data) => {
        this.mensualidades = data || [];
        this.mensualidadesFiltradas = [...this.mensualidades];
      },
      error: (error) => console.error('Error al obtener mensualidades', error)
    });
  }

  private loadMembers(): void {
    const url = `${environment.apiUrl}/api/miembros`;
    this.http.get<any[]>(url)
      .pipe(catchError(err => {
        console.warn('No se pudieron cargar miembros:', err);
        return of([]);
      }))
      .subscribe(list => {
        this.members = list || [];
        this.memberMap = {};
        this.members.forEach(m => {
          const id = m.id_miembro ?? m.id ?? m._id;
          const nombre = m.nombre_completo ?? ((`${m.nombre || ''} ${m.apellido1 || m.apellido || ''}`).trim() || (m.username ?? ''));
          const cedula = m.cedula ?? m.identificacion ?? m.dni ?? '';
          if (id != null) {
            this.memberMap[Number(id)] = { nombre: nombre || String(id), cedula };
          }
        });
      });
  }

  getMemberName(id?: number | null): string {
    if (id == null) return '';
    const info = this.memberMap[Number(id)];
    return info ? info.nombre : `Miembro #${id}`;
  }

  getMemberCedula(id?: number | null): string {
    if (id == null) return 'N/A';
    const info = this.memberMap[Number(id)];
    return info?.cedula || 'N/A';
  }

  filtrarMensualidades(): void {
    const q = this.filtro?.toLowerCase().trim() || '';
    if (!q) {
      this.mensualidadesFiltradas = [...this.mensualidades];
      return;
    }

    this.mensualidadesFiltradas = this.mensualidades.filter(mensualidad => {
      const byFechaInicio = String(mensualidad.fecha_inicio || '').toLowerCase().includes(q);
      const byFechaFin = String(mensualidad.fecha_fin || '').toLowerCase().includes(q);
      const byEstado = String(mensualidad.estado_mensualidad || '').toLowerCase().includes(q);
      const byMonto = String(mensualidad.monto ?? '').toLowerCase().includes(q);

      const memberInfo = this.memberMap[Number(mensualidad.id_miembro)];
      const byMemberName = memberInfo?.nombre?.toLowerCase().includes(q) ?? false;
      const byMemberCedula = memberInfo?.cedula?.toLowerCase().includes(q) ?? false;

      return byFechaInicio || byFechaFin || byEstado || byMonto || byMemberName || byMemberCedula;
    });
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const anio = date.getFullYear();
    return `${dia}-${mes}-${anio}`;
  }

  abrirModal(mensualidad: Mensualidad): void {
    this.mensualidadSeleccionada = mensualidad;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.mensualidadSeleccionada = null;
  }
}
