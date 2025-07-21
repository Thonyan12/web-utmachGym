import { Component } from '@angular/core';
import { MiembrosService } from '../miembros.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-miembros-asignar',
  templateUrl: './miembros-asignar.html',
  imports: [CommonModule,FormsModule],
})
export class MiembrosAsignarComponent {
  miembrosDisponibles: any[] = [];

  constructor(private miembrosService: MiembrosService, private router: Router) {
    this.cargarMiembrosDisponibles();
  }
// ... existing code ...
asignarSeleccionados() {
  const seleccionados = this.miembrosDisponibles.filter(m => m.seleccionado);
  if (seleccionados.length === 0) {
    alert('Selecciona al menos un miembro.');
    return;
  }
  this.miembrosService.asignarMiembros(seleccionados).subscribe({
    next: () => this.router.navigate(['/entrenadores/mis-miembros']),
    error: err => alert('Error al asignar miembros')
  });
}
// ... existing code ...
  cargarMiembrosDisponibles() {
    this.miembrosService.obtenerMiembrosDisponibles().subscribe((data: any[]) => {
      this.miembrosDisponibles = data;
    });
  }
}