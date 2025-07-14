import { Component, inject, OnInit } from '@angular/core';
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
  private service = inject(MiembrosService);
  miembros: Miembro[] = [];
  searchText: string = '';

  constructor(private miembrosService: MiembrosService) { }

  ngOnInit(): void {
    this.miembrosService.getMiembros().subscribe(data => {
      this.miembros = data;
    });
  }

  cambiarEstado(miembro: any, nuevoEstado: boolean) {
    const miembroActualizado = { ...miembro, estado: nuevoEstado };
    this.service.update(miembroActualizado).subscribe({
      next: () => {
        miembro.estado = nuevoEstado;
      },
      error: () => {
        alert('Error al actualizar el estado');
      }
    });
  }
}