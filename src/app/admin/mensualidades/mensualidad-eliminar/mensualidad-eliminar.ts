import { Component, inject } from '@angular/core';
import { MensualidadSidebar } from '../mensualidad-sidebar/mensualidad-sidebar'; // Asegúrate de que la ruta sea correcta
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Mensualidades, Mensualidad } from '../services/mensualidades'; // Asegúrate de que la ruta sea correcta y que Mensualidades sea tu servicio

@Component({
  selector: 'app-mensualidad-eliminar',
  imports: [CommonModule, FormsModule, MensualidadSidebar],
  templateUrl: './mensualidad-eliminar.html',
  styleUrl: './mensualidad-eliminar.css' // Asegúrate de que este archivo CSS exista si lo usas
})
export class MensualidadEliminarComponent { // Cambiado el nombre de la clase a MensualidadEliminarComponent
  private service = inject(Mensualidades); // Inyección del servicio de mensualidades
  idMensualidad: number = 0; // Propiedad para el ID de la mensualidad a buscar
  mensualidad: Mensualidad | null = null; // Corregido: Propiedad 'mensualidades' a 'mensualidad' (singular)
  mensaje: string = ''; // Mensajes para el usuario (éxito, error, etc.)
  mostrarConfirmacion: boolean = false; // Controla la visibilidad del mensaje de confirmación

  /**
   * Busca una mensualidad por su ID.
   */
  buscar(): void {
    if (this.idMensualidad <= 0) {
      this.mensaje = 'El ID de la mensualidad debe ser un número positivo.';
      this.mensualidad = null; // Usar 'mensualidad' singular
      return;
    }
    this.service.getById(this.idMensualidad).subscribe({
      next: (data) => {
        this.mensualidad = data; // Usar 'mensualidad' singular
        this.mensaje = ''; // Limpiar mensajes anteriores
        this.mostrarConfirmacion = false; // Ocultar confirmación si se busca de nuevo
      },
      error: () => {
        this.mensualidad = null; // Usar 'mensualidad' singular
        this.mensaje = 'No se encontró una mensualidad con ese ID.';
        this.mostrarConfirmacion = false;
      }
    });
  }

  /**
   * Muestra el cuadro de diálogo de confirmación para eliminar.
   */
  confirmarEliminar(): void {
    this.mostrarConfirmacion = true;
  }

  /**
   * Cancela el proceso de eliminación y oculta el cuadro de confirmación.
   */
  cancelarEliminar(): void {
    this.mostrarConfirmacion = false;
  }

  /**
   * Elimina la mensualidad seleccionada.
   */
  eliminar(): void {
    if (!this.mensualidad || !this.mensualidad.id_mensualidad) { // Usar 'mensualidad' singular
      this.mensaje = 'Primero busque una mensualidad válida para eliminar.';
      return;
    }
    this.service.delete(this.mensualidad.id_mensualidad).subscribe({ // Usar 'mensualidad' singular
      next: () => {
        this.mensaje = 'Mensualidad eliminada correctamente.';
        this.mensualidad = null; // Usar 'mensualidad' singular
        this.idMensualidad = 0; // Reiniciar el campo de ID
        this.mostrarConfirmacion = false; // Ocultar confirmación
      },
      error: (err) => {
        this.mensaje = 'Error al eliminar la mensualidad.';
        this.mostrarConfirmacion = false;
        console.error('Error al eliminar mensualidad:', err);
      }
    });
  }
}