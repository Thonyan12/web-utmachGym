import { Component, OnInit } from '@angular/core';
import { MiembrosSidebarComponent } from '../miembros-sidebar/miembros-sidebar';
import { Miembro, MiembrosService } from '../services/miembros';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-miembros-listar',
  standalone: true,
  imports: [MiembrosSidebarComponent, CommonModule, FormsModule],
  templateUrl: './miembros-listar.html',
  styleUrls: ['./miembros-listar.css']
})
export class MiembrosListarComponent implements OnInit {
  miembros: Miembro[] = [];
  searchText: string = '';

  constructor(private miembrosService: MiembrosService) { }

  ngOnInit(): void {
    this.miembrosService.getMiembros().subscribe(data => {
      try {
        // Intentar ordenar por fecha de registro/f_registro (más recientes primero)
        this.miembros = (data || []).slice().sort((a: any, b: any) => {
          const fa = a.f_registro ? new Date(a.f_registro).getTime() : (a.fecha_inscripcion ? new Date(a.fecha_inscripcion).getTime() : 0);
          const fb = b.f_registro ? new Date(b.f_registro).getTime() : (b.fecha_inscripcion ? new Date(b.fecha_inscripcion).getTime() : 0);
          return fb - fa;
        });
      } catch (e) {
        // Fallback: asignar sin ordenar si hay error
        console.warn('Error ordenando miembros por fecha:', e);
        this.miembros = data;
      }
    });
  }

  private sortMembersInPlace() {
    try {
      this.miembros.sort((a: any, b: any) => {
        const fa = a.f_registro ? new Date(a.f_registro).getTime() : (a.fecha_inscripcion ? new Date(a.fecha_inscripcion).getTime() : 0);
        const fb = b.f_registro ? new Date(b.f_registro).getTime() : (b.fecha_inscripcion ? new Date(b.fecha_inscripcion).getTime() : 0);
        return fb - fa;
      });
    } catch (e) {
      console.warn('Error al ordenar miembros in-place:', e);
    }
  }

  cambiarEstado(miembro: Miembro, nuevoEstado: boolean) {
    const miembroActualizado: Miembro = { ...miembro, estado: nuevoEstado };
    this.miembrosService.update(miembroActualizado).subscribe({
      next: () => {
        miembro.estado = nuevoEstado;
        // Reordenar la lista por fecha en caso de que la actualización afecte el orden
        this.sortMembersInPlace();
      },
      error: () => {
        alert('Error al actualizar el estado');
      }
    });
  }
}