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
  private service = inject(Mensualidades);
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
    if (form.invalid) {
      return;
    }
  
    this.service.create(this.mensualidad).subscribe({
      next: (response) => {
        if (response?.id_mensualidad) {
          this.mensaje = `Mensualidad creada con éxito. ID Mensualidad: ${response.id_mensualidad}`;
        } else {
          this.mensaje = 'Mensualidad creada, pero no se pudo obtener el ID.';
        }
        form.resetForm();
      },
      error: (error) => {
        console.error('Error al crear la mensualidad:', error);
        this.mensaje = 'Error al crear la mensualidad.';
      },
    });
  }
}