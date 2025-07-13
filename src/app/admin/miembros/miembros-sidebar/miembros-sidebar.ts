import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MiembrosService, Miembro } from '../services/miembros';
import { RouterModule } from '@angular/router';
@Component({
    selector: 'app-miembros-sidebar',
    standalone: true,
    imports: [RouterModule, CommonModule, FormsModule],
    templateUrl: './miembros-sidebar.html',
    styleUrls: ['./miembros-sidebar.css']
  })
export class MiembrosSidebarComponent {
  private service = inject(MiembrosService);
  mensaje: string = '';
  miembro: Miembro = {
    cedula: '',
    nombre: '',
    apellido1: '',
    apellido2: '',
    edad: 0,
    direccion: '',
    altura: 0,
    peso: 0,
    contextura: '',
    objetivo: '',
    sexo: '',
    fecha_inscripcion: '',
    estado: true,
    correo: '',
    estado_registro: true,
    f_registro: ''
  };

  guardar(form: NgForm): void {
    this.service.create(this.miembro).subscribe({
      next: () => {
        this.mensaje = 'Miembro registrado correctamente.';
        form.resetForm();
      },
      error: () => {
        this.mensaje = 'Error al registrar el miembro.';
      }
    });
  }
}