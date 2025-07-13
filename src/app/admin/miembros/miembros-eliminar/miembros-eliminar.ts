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
  idMiembro: number = 0;
  miembro: Miembro | null = null;
  mensaje: string = '';
  mostrarConfirmacion: boolean = false;

  buscar(): void {
    if (this.idMiembro <= 0) {
      this.mensaje = 'El ID del miembro debe ser un número positivo.';
      this.miembro = null;
      return;
    }
    this.service.getById(this.idMiembro).subscribe({
      next: (data) => {
        this.miembro = data;
        this.mensaje = '';
        this.mostrarConfirmacion = false;
      },
      error: () => {
        this.miembro = null;
        this.mensaje = 'No se encontró un miembro con ese ID.';
        this.mostrarConfirmacion = false;
      }
    });
  }

  confirmarEliminar(): void {
    this.mostrarConfirmacion = true;
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacion = false;
  }

  eliminar(): void {
    if (!this.miembro) {
      this.mensaje = 'Primero busque un miembro válido para eliminar.';
      return;
    }
    this.service.delete(this.idMiembro).subscribe({
      next: () => {
        this.mensaje = 'Miembro eliminado correctamente.';
        this.miembro = null;
        this.idMiembro = 0;
        this.mostrarConfirmacion = false;
      },
      error: () => {
        this.mensaje = 'Error al eliminar el miembro.';
        this.mostrarConfirmacion = false;
      }
    });
  }
}