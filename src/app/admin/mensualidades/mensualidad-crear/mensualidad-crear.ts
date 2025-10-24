// ...existing code...
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MensualidadSidebar } from "../mensualidad-sidebar/mensualidad-sidebar";
import { Mensualidad, Mensualidades } from '../services/mensualidades';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-mensualidad-crear',
  standalone: true,
  imports: [CommonModule, FormsModule, MensualidadSidebar, HttpClientModule],
  templateUrl: './mensualidad-crear.html'
})
export class MensualidadCrearComponent {
  private service = inject(Mensualidades);
  private http = inject(HttpClient);

  mensaje: string = '';

  // fields for miembro lookup
  cedula: string = '';
  nombreMiembro: string = '';
  apellidoMiembro: string = '';
  buscandoMiembro = false;
  miembroEncontrado = false;
  errorBusqueda = '';

  mensualidad: Mensualidad = {
    id_mensualidad: 0,
    id_miembro: 0,
    fecha_inicio: '',
    fecha_fin: '',
    monto: 0,
    estado_mensualidad: 'Pendiente',
    estado: true,
    f_registro: new Date().toISOString().split('T')[0]
  };

  buscarMiembroPorCedula(): void {
    this.errorBusqueda = '';
    this.nombreMiembro = '';
    this.apellidoMiembro = '';
    this.miembroEncontrado = false;

    const ced = this.cedula?.trim();
    if (!ced) {
      this.errorBusqueda = 'Ingrese la cédula del miembro.';
      return;
    }

    this.buscandoMiembro = true;
    // CORRECCIÓN: añadir "/" antes de la cédula
    const url = `${environment.apiUrl}/api/miembros/cedula/${encodeURIComponent(ced)}`;

    // Intentar enviar token si existe (ajusta la key si usas otra)
    const token = localStorage.getItem('token') || '';
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

    this.http.get<any>(url, { headers })
      .pipe(
        catchError(err => {
          console.error('Error buscando miembro:', err);
          this.buscandoMiembro = false;
          if (err.status === 404) {
            this.errorBusqueda = 'Miembro no encontrado con esa cédula.';
          } else if (err.status === 401) {
            this.errorBusqueda = 'No autorizado. Inicie sesión.';
            // opcional: redirigir a login
            // window.location.href = '/auth';
          } else {
            this.errorBusqueda = 'Error al buscar miembro.';
          }
          return of(null);
        })
      )
      .subscribe(res => {
        this.buscandoMiembro = false;
        if (!res) return;

        const id = res.id_miembro ?? res.id ?? res._id;
        const nombreCompleto = res.nombre_completo ??
          `${res.nombre || ''} ${res.apellido1 || res.apellido || ''}`.trim();

        if (id != null) {
          this.mensualidad.id_miembro = Number(id);
          this.nombreMiembro = nombreCompleto || '';
          this.apellidoMiembro = res.apellido2 ?? res.apellido ?? '';
          this.miembroEncontrado = true;
          this.errorBusqueda = '';
        } else {
          this.errorBusqueda = 'Respuesta inválida del servidor al buscar miembro.';
        }
      });
  }

  calcularFechaFin(): void {
    if (!this.mensualidad.fecha_inicio) {
      this.mensualidad.fecha_fin = '';
      return;
    }
    const inicio = new Date(this.mensualidad.fecha_inicio);
    if (isNaN(inicio.getTime())) {
      this.mensualidad.fecha_fin = '';
      return;
    }
    const fin = new Date(inicio.getTime() + 30 * 24 * 60 * 60 * 1000);
    const yyyy = fin.getFullYear();
    const mm = String(fin.getMonth() + 1).padStart(2, '0');
    const dd = String(fin.getDate()).padStart(2, '0');
    this.mensualidad.fecha_fin = `${yyyy}-${mm}-${dd}`;
  }

  guardar(form: NgForm): void {
    if (form.invalid) {
      this.mensaje = 'Por favor, complete correctamente el formulario.';
      return;
    }
    if (!this.miembroEncontrado || !this.mensualidad.id_miembro) {
      this.mensaje = 'Debe buscar y seleccionar un miembro válido por cédula.';
      return;
    }
    // Aseguramos que la fecha fin esté calculada antes de enviar
    this.calcularFechaFin();

    this.service.create(this.mensualidad).subscribe({
      next: (response) => {
        if (response?.id_mensualidad) {
          this.mensaje = `Mensualidad creada con éxito. ID Mensualidad: ${response.id_mensualidad}`;
        } else {
          this.mensaje = 'Mensualidad creada, pero no se pudo obtener el ID.';
        }
        form.resetForm();
        // limpiar estado local
        this.cedula = '';
        this.nombreMiembro = '';
        this.apellidoMiembro = '';
        this.miembroEncontrado = false;
      },
      error: (error) => {
        console.error('Error al crear la mensualidad:', error);
        this.mensaje = 'Error al crear la mensualidad.';
      },
    });
  }
}
// ...existing code...