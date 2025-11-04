import { Component, inject, OnInit } from '@angular/core';
import { MensualidadSidebar } from '../mensualidad-sidebar/mensualidad-sidebar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Mensualidades, Mensualidad } from '../services/mensualidades';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-mensualidad-eliminar',
  standalone: true,
  imports: [CommonModule, FormsModule, MensualidadSidebar, HttpClientModule],
  templateUrl: './mensualidad-eliminar.html',
  styleUrl: './mensualidad-eliminar.css'
})
export class MensualidadEliminarComponent implements OnInit {
  private service = inject(Mensualidades);
  private http = inject(HttpClient);

  consulta: string = '';
  cargando = false;
  mensaje: string = '';
  members: any[] = [];
  miembrosFiltrados: any[] = [];
  mensualidad: Mensualidad | null = null;
  mensualidadesEncontradas: Mensualidad[] = [];
  mostrarConfirmacion: boolean = false;
  mostrarSugerencias = false;

  get foundCount(): number {
    return (this.mensualidadesEncontradas ?? []).length;
  }

  ngOnInit(): void {
    this.loadMembers();
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
      });
  }

  filtrarMiembros(): void {
    const query = this.consulta.toLowerCase().trim();
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
    this.consulta = `${miembro.nombre} ${miembro.apellido1}`.trim();
    this.mostrarSugerencias = false;
    this.buscarPorCedulaONombre();
  }

  getMemberById(id: number | string | undefined | null) {
    if (id == null) return null;
    return this.members.find(m => {
      const mid = m.id_miembro ?? m.id ?? m._id;
      return String(mid) === String(id);
    }) || null;
  }

  getMemberDisplayName(id: number | string | undefined | null): string {
    const m = this.getMemberById(id);
    if (!m) return `Miembro #${id ?? ''}`.trim();
    const nombreCompleto = m.nombre_completo ?? ((`${m.nombre ?? ''} ${m.apellido1 ?? m.apellido ?? ''}`).trim());
    return nombreCompleto || (m.username ?? `Miembro #${id ?? ''}`);
  }

  buscarPorCedulaONombre(): void {
    this.mensaje = '';
    this.mensualidad = null;
    this.mensualidadesEncontradas = [];
    this.mostrarConfirmacion = false;

    const raw = (this.consulta || '').trim();
    if (!raw) {
      this.mensaje = 'Ingrese cédula o nombre para buscar.';
      return;
    }
    const q = raw.toLowerCase();

    const getCedula = (m: any) => String(m.cedula ?? m.identificacion ?? m.dni ?? '').trim().toLowerCase();
    const getFullName = (m: any) => String(m.nombre_completo ?? ((`${m.nombre || ''} ${m.apellido1 || m.apellido || ''}`).trim()) ?? '').trim().toLowerCase();

    let matchedMember = this.members.find(m => getCedula(m) === q);
    if (!matchedMember) {
      matchedMember = this.members.find(m => getFullName(m) === q);
    }
    if (!matchedMember) {
      matchedMember = this.members.find(m => {
        const name = getFullName(m);
        const ced = getCedula(m);
        return name.includes(q) || ced.includes(q);
      });
    }

    if (!matchedMember) {
      this.mensaje = 'No se encontró ningún miembro con esa cédula o nombre.';
      return;
    }

    const memberId = matchedMember.id_miembro ?? matchedMember.id ?? matchedMember._id;
    if (memberId == null) {
      this.mensaje = 'El miembro encontrado no tiene un identificador válido.';
      return;
    }

    this.cargando = true;
    this.service.getMensualidades()
      .pipe(
        catchError(err => {
          console.error('Error al obtener mensualidades:', err);
          this.cargando = false;
          this.mensaje = 'Error al consultar mensualidades en el servidor.';
          return of([]);
        })
      )
      .subscribe((list: Mensualidad[]) => {
        this.cargando = false;
        const encontrados = (list || []).filter(m => String(m.id_miembro) === String(memberId));
        if (encontrados.length === 0) {
          this.mensaje = 'No se encontraron mensualidades para el miembro indicado.';
          return;
        }
        this.mensualidadesEncontradas = encontrados;
        this.mensualidad = encontrados[0];
        if (encontrados.length > 1) {
          this.mensaje = `Se encontraron ${encontrados.length} mensualidades; se cargó la primera.`;
        } else {
          this.mensaje = 'Mensualidad encontrada y cargada para eliminar.';
        }
      });
  }

  confirmarEliminar(): void {
    if (!this.mensualidad || !this.mensualidad.id_mensualidad) {
      this.mensaje = 'No hay una mensualidad seleccionada para eliminar.';
      return;
    }
    this.mostrarConfirmacion = true;
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacion = false;
  }

  eliminar(): void {
    if (!this.mensualidad || !this.mensualidad.id_mensualidad) {
      this.mensaje = 'Primero busque y seleccione una mensualidad válida.';
      return;
    }
    this.service.delete(this.mensualidad.id_mensualidad).subscribe({
      next: () => {
        this.mensaje = 'Mensualidad eliminada correctamente.';
        this.mensualidad = null;
        this.mensualidadesEncontradas = [];
        this.consulta = '';
        this.mostrarConfirmacion = false;
      },
      error: (err) => {
        console.error('Error al eliminar mensualidad:', err);
        this.mensaje = 'Error al eliminar la mensualidad.';
        this.mostrarConfirmacion = false;
      }
    });
  }
}