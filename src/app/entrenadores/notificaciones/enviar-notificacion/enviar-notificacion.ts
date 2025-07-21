import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Notificaciones } from '../../services/notificaciones';

@Component({
  selector: 'app-enviar-notificacion',
  imports: [CommonModule, FormsModule],
  templateUrl: './enviar-notificacion.html',
  styleUrl: './enviar-notificacion.css'
})
export class EnviarNotificacion {
  id_usuario: number | null = null;
  tipo: string = '';
  contenido: string = '';
  mensaje: string = '';

  constructor(private notiService: Notificaciones) {}

  enviarNotificacion() {
    if (!this.id_usuario || !this.tipo || !this.contenido) {
      this.mensaje = 'Todos los campos son obligatorios.';
      return;
    }

    this.notiService.enviarNotificacion({
      id_usuario: this.id_usuario,
      tipo: this.tipo,
      contenido: this.contenido
    }).subscribe({
      next: () => {
        this.mensaje = 'Notificación enviada correctamente.';
        this.id_usuario = null;
        this.tipo = '';
        this.contenido = '';
      },
      error: () => {
        this.mensaje = 'Error al enviar la notificación.';
      }
    });
  }
}