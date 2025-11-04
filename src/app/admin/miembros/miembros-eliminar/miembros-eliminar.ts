import { Component, inject } from '@angular/core';
import { MiembrosSidebarComponent } from '../miembros-sidebar/miembros-sidebar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Miembro, MiembrosService } from '../services/miembros';

@Component({
  selector: 'app-miembros-eliminar',
  imports: [CommonModule, FormsModule, MiembrosSidebarComponent],
  templateUrl: './miembros-eliminar.html',
  styleUrl: './miembros-eliminar.css'
})
export class MiembrosEliminarComponent {
  private service = inject(MiembrosService);
  busqueda: string = '';
  miembro: Miembro | null = null;
  mensaje: string = '';
  mostrarConfirmacion: boolean = false;
  todosLosMiembros: Miembro[] = [];
  miembrosFiltrados: Miembro[] = [];
  mostrarSugerencias: boolean = false;

  ngOnInit() {
    if ((this.service as any).getMiembros) {
      (this.service as any).getMiembros().subscribe({
        next: (data: Miembro[]) => this.todosLosMiembros = data || [],
        error: (err: any) => {
          console.error('Error cargando miembros:', err);
          this.todosLosMiembros = [];
        }
      });
    }
  }

  filtrarMiembros(): void {
    const textoBusqueda = this.busqueda.trim().toLowerCase();
    
    if (!textoBusqueda) {
      this.miembrosFiltrados = [];
      this.mostrarSugerencias = false;
      return;
    }

    this.miembrosFiltrados = this.todosLosMiembros.filter(m =>
      (m.cedula || '').toString().toLowerCase().includes(textoBusqueda) ||
      (m.nombre || '').toString().toLowerCase().includes(textoBusqueda) ||
      (m.apellido1 || '').toString().toLowerCase().includes(textoBusqueda) ||
      (m.apellido2 || '').toString().toLowerCase().includes(textoBusqueda) ||
      (`${m.nombre} ${m.apellido1} ${m.apellido2}`).toLowerCase().includes(textoBusqueda)
    ).slice(0, 10);

    this.mostrarSugerencias = this.miembrosFiltrados.length > 0;
  }

  seleccionarMiembro(miembro: Miembro): void {
    this.busqueda = `${miembro.nombre} ${miembro.apellido1} ${miembro.apellido2}`;
    this.mostrarSugerencias = false;
    this.miembro = { ...miembro };
    this.mensaje = '';
    this.mostrarConfirmacion = false;
  }

  buscar(): void {
    if (!this.busqueda.trim()) {
      this.mensaje = 'Por favor ingresa cédula o nombre para buscar.';
      this.miembro = null;
      return;
    }

    this.mostrarSugerencias = false;
    const valor = this.busqueda.trim().toLowerCase();
    
    const encontrado = this.todosLosMiembros.find(m =>
      (m.cedula || '').toString().toLowerCase() === valor ||
      (`${m.nombre} ${m.apellido1} ${m.apellido2}`).toLowerCase() === valor
    );

    if (encontrado) {
      this.miembro = encontrado;
      this.mensaje = '';
      this.mostrarConfirmacion = false;
    } else {
      this.miembro = null;
      this.mensaje = `No se encontró un miembro con "${this.busqueda}".`;
      this.mostrarConfirmacion = false;
    }
  }

  confirmarEliminar(): void {
    this.mostrarConfirmacion = true;
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacion = false;
  }

  eliminar(): void {
    if (!this.miembro || !this.miembro.id_miembro) {
      this.mensaje = 'Primero busque un miembro válido para eliminar.';
      return;
    }
    
    this.service.delete(this.miembro.id_miembro).subscribe({
      next: () => {
        this.mensaje = `Miembro "${this.miembro?.nombre} ${this.miembro?.apellido1}" eliminado correctamente.`;
        this.miembro = null;
        this.busqueda = '';
        this.mostrarConfirmacion = false;
        if ((this.service as any).getMiembros) {
          (this.service as any).getMiembros().subscribe({
            next: (data: Miembro[]) => this.todosLosMiembros = data || []
          });
        }
      },
      error: () => {
        this.mensaje = 'Error al eliminar el miembro.';
        this.mostrarConfirmacion = false;
      }
    });
  }

  limpiarFormulario(): void {
    this.miembro = null;
    this.busqueda = '';
    this.mensaje = '';
    this.miembrosFiltrados = [];
    this.mostrarSugerencias = false;
    this.mostrarConfirmacion = false;
  }
}