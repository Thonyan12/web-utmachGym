import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MensualidadSidebar } from "../mensualidad-sidebar/mensualidad-sidebar";
import { Mensualidad, Mensualidades } from '../services/mensualidades';



@Component({
  selector: 'app-mensualidad-crear',
  standalone: true,
  imports: [CommonModule, FormsModule, MensualidadSidebar],
  templateUrl: './mensualidad-crear.html'
})
export class MensualidadCrearComponent {
    private service= inject(Mensualidades);
    mensaje: string = '';
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

  guardar(form: NgForm): void {
    this.service.create(this.mensualidad).subscribe({
      next: () => {
        this.mensaje = 'Mensualidad registrada correctamente.';
        form.resetForm(); // Esto limpia el formulario y los estados de validación
      },
      error: () => {
        this.mensaje = 'Error al registrar la mensualidad.';
      }
    });
  }
}