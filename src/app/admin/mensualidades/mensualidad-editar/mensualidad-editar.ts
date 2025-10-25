import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Mensualidad, Mensualidades } from '../services/mensualidades';
import { MensualidadSidebar } from '../mensualidad-sidebar/mensualidad-sidebar';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-mensualidad-editar',
  standalone: true,
  imports: [CommonModule, FormsModule, MensualidadSidebar, HttpClientModule],
  templateUrl: './mensualidad-editar.html',
  styleUrl: './mensualidad-editar.css'
})
export class MensualidadEditarComponent implements OnInit {
  private mensualidadesService = inject(Mensualidades);
  private http = inject(HttpClient);

  // búsqueda y estado
  busqueda: string = '';
  cargando = false;
  mensaje = '';

  // datos cargados
  mensualidad: Mensualidad | null = null;
  members: any[] = [];
  memberMap: Record<number, { nombre: string; cedula?: string }> = {};
  memberNameSelected = '';

  ngOnInit(): void {
    this.loadMembers();
    // opcional: pre-cargar mensualidades (no usado directamente aquí)
    this.mensualidadesService.getMensualidades()
      .pipe(catchError(() => of([])))
      .subscribe();
  }

  private loadMembers(): void {
    const url = `${environment.apiUrl}/api/miembros`;
    this.http.get<any[]>(url)
      .pipe(
        catchError(err => {
          console.warn('No se pudieron cargar miembros:', err);
          return of([]);
        })
      )
      .subscribe(list => {
        this.members = list || [];
        this.memberMap = {};
        this.members.forEach(m => {
          const id = m.id_miembro ?? m.id ?? m._id;
          const nombre = m.nombre_completo ?? (((`${m.nombre || ''} ${m.apellido1 || m.apellido || ''}`).trim()) || (m.username ?? ''));
          const cedula = m.cedula ?? m.identificacion ?? m.dni ?? '';
          if (id != null) {
            this.memberMap[Number(id)] = { nombre, cedula };
          }
        });
      });
  }

  buscarMensualidad(): void {
    this.mensaje = '';
    this.mensualidad = null;
    this.memberNameSelected = '';

    const raw = (this.busqueda || '').trim();
    if (!raw) {
      this.mensaje = 'Ingrese la cédula para buscar.';
      return;
    }
    const q = raw.toLowerCase();

    const getCedula = (m: any) => String(m.cedula ?? m.identificacion ?? m.dni ?? '').trim().toLowerCase();

    // Buscar exactamente por cédula
    const member = this.members.find(m => getCedula(m) === q);
    if (!member) {
      this.mensaje = 'No se encontró ningún miembro con esa cédula.';
      return;
    }

    const memberId = member.id_miembro ?? member.id ?? member._id;
    this.memberNameSelected = (member.nombre_completo ?? (((`${member.nombre || ''} ${member.apellido1 || member.apellido || ''}`).trim()) || '')).toString();

    if (memberId == null) {
      this.mensaje = 'El miembro encontrado no tiene id válido.';
      return;
    }

    this.cargando = true;
    const endpoints = [
      `${environment.apiUrl}/api/mensualidades/id_miembro/${memberId}`
      
    ];

    const tryEndpoint = (i: number) => {
      if (i >= endpoints.length) {
        // fallback: obtener todas y filtrar localmente
        this.http.get<any[]>(`${environment.apiUrl}/api/mensualidades`)
          .pipe(catchError(err => {
            this.cargando = false;
            console.warn('Error al cargar mensualidades:', err);
            return of([]);
          }))
          .subscribe(list => {
            this.cargando = false;
            const found = (list || []).find((ms: any) => Number(ms.id_miembro) === Number(memberId));
            if (found) {
              this.fillMensualidadFromResponse(found);
            } else {
              this.mensaje = 'No se encontraron mensualidades para el miembro.';
            }
          });
        return;
      }

      this.http.get<any>(endpoints[i])
        .pipe(catchError(err => {
          if (err.status === 404) return of(null);
          this.cargando = false;
          this.mensaje = 'Error al buscar mensualidades en el servidor.';
          return of(null);
        }))
        .subscribe(res => {
          if (!res) { tryEndpoint(i + 1); return; }
          const arr = Array.isArray(res) ? res : [res];
          if (arr.length > 0) {
            this.cargando = false;
            this.fillMensualidadFromResponse(arr[0]);
          } else {
            tryEndpoint(i + 1);
          }
        });
    };

    tryEndpoint(0);
  }

  private fillMensualidadFromResponse(res: any) {
    this.mensualidad = {
      id_mensualidad: res.id_mensualidad ?? res.id ?? 0,
      id_miembro: res.id_miembro ?? res.memberId ?? res.idMiembro ?? 0,
      fecha_inicio: res.fecha_inicio ?? '',
      fecha_fin: res.fecha_fin ?? '',
      monto: Number(res.monto ?? 0),
      estado_mensualidad: res.estado_mensualidad ?? 'Pendiente',
      estado: res.estado ?? true,
      f_registro: res.f_registro ?? (new Date().toISOString().split('T')[0])
    };
    // mostrar nombre en el campo readonly del HTML
    const info = this.memberMap[Number(this.mensualidad.id_miembro)];
    this.memberNameSelected = info?.nombre ?? this.memberNameSelected ?? (`Miembro #${this.mensualidad.id_miembro}`);
    this.mensaje = '';
  }

  actualizar(): void {
    if (!this.mensualidad) {
      this.mensaje = 'No hay mensualidad cargada para actualizar.';
      return;
    }
    this.mensualidadesService.update(this.mensualidad).subscribe({
      next: () => { this.mensaje = 'Mensualidad actualizada con éxito.'; },
      error: (err) => { console.error('Error al actualizar mensualidad:', err); this.mensaje = 'Error al actualizar la mensualidad.'; }
    });
  }
}