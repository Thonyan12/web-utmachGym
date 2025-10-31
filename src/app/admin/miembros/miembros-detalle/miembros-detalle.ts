import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Miembro, MiembrosService } from '../services/miembros';
import { MiembrosSidebarComponent } from '../miembros-sidebar/miembros-sidebar';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-miembros-detalle',
    standalone: true,
    imports: [CommonModule, MiembrosSidebarComponent, FormsModule],
    templateUrl: './miembros-detalle.html',
})
export class MiembrosDetalleComponent implements OnInit {
    private miembrosService = inject(MiembrosService);

    filtro: string = '';
  miembros: Miembro[] = [];
  miembrosFiltrados: Miembro[] = []; // lista visible según búsqueda

  mostrarModal = false;
  miembroSeleccionado: Miembro | null = null;

  ngOnInit(): void {
    this.miembrosService.getMiembros().subscribe({
      next: (data) => {
        this.miembros = data || [];
        this.miembrosFiltrados = []; // vacío hasta que el usuario busque
      },
      error: () => {
        this.miembros = [];
        this.miembrosFiltrados = [];
      }
    });
  }

  filtrarMiembros(): void {
    const q = (this.filtro || '').trim().toLowerCase();
    if (!q) {
      this.miembrosFiltrados = [];
      return;
    }
    this.miembrosFiltrados = this.miembros.filter(m =>
      (m.cedula || '').toString().toLowerCase().includes(q) ||
      (m.nombre || '').toString().toLowerCase().includes(q) ||
      (m.apellido1 || '').toString().toLowerCase().includes(q) ||
      (m.apellido2 || '').toString().toLowerCase().includes(q)
    );
  }

  abrirModal(miembro: Miembro): void {
    this.miembroSeleccionado = miembro;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.miembroSeleccionado = null;
    this.mostrarModal = false;
  }

  formatearFecha(d: string | Date | null | undefined): string {
    if (!d) return '';
    const date = new Date(d);
    const pad = (n: number) => n < 10 ? '0' + n : '' + n;
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
  }
}

