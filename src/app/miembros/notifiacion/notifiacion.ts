import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificacionesMiembroService, NotificacionMiembro } from '../services/notificaciones-miembro';

@Component({
  selector: 'app-notifiacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifiacion.html',
  styleUrl: './notifiacion.css'
})
export class Notifiacion implements OnInit {
  notificaciones: NotificacionMiembro[] = [];
  loading = true;
  error: string | null = null;

  constructor(private notiService: NotificacionesMiembroService) {}

  ngOnInit() {
    this.cargarNotificaciones();
  }

  cargarNotificaciones() {
    this.loading = true;
    this.notiService.getMisNotificaciones().subscribe({
      next: res => {
        this.notificaciones = res.data;
        this.loading = false;
      },
      error: err => {
        this.error = 'Error al cargar notificaciones';
        this.loading = false;
      }
    });
  }

  marcarComoLeida(notificacion: NotificacionMiembro) {
    this.notiService.marcarComoLeida(notificacion.id_notificacion).subscribe({
      next: () => {
        notificacion.leido = true;
      }
    });
  }
}
