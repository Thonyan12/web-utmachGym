import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, User } from '../../../services/auth';
import { NotificacionesServiceDashboard, Notificacion } from '../../services/notificaciones';

@Component({
  selector: 'app-miembros-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './miembros-dashboard.html',
  styleUrls: ['./miembros-dashboard.css']
})
export class MiembrosDashboard implements OnInit {
  currentUser: User | null = null;
  fechaActual: string = ''; 

  notificacionesEnviadas: Notificacion[] = [];
  notificacionesRecibidas: Notificacion[] = [];
  loadingNotificaciones = true;

  constructor(
    private authService: AuthService,
    private notiService: NotificacionesServiceDashboard
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.fechaActual = new Date().toLocaleDateString('es-ES');
    this.cargarNotificaciones();
  }

  cargarNotificaciones() {
    this.loadingNotificaciones = true;
    this.notiService.getTodasMisNotificaciones().subscribe({
      next: res => {
        this.notificacionesEnviadas = (res.sent || []).sort((a, b) =>
          new Date(b.fecha_envio).getTime() - new Date(a.fecha_envio).getTime()
        );
        this.notificacionesRecibidas = (res.received || []).sort((a, b) =>
          new Date(b.fecha_envio).getTime() - new Date(a.fecha_envio).getTime()
        );
        this.loadingNotificaciones = false;
      },
      error: () => {
        this.notificacionesEnviadas = [];
        this.notificacionesRecibidas = [];
        this.loadingNotificaciones = false;
      }
    });
  }

  marcarComoLeida(notif: Notificacion) {
    if (!notif.leido) {
      this.notiService.marcarComoLeida(notif.id_notificacion).subscribe({
        next: () => {
          notif.leido = true;
        }
      });
    }
  }

  obtenerPrimerNombre(): string {
    if (!this.currentUser?.nombre_completo) {
      return 'Miembro';
    }
    return this.currentUser.nombre_completo.split(' ')[0] || 'Miembro';
  }

  trackByNotificacion(index: number, notif: Notificacion): number {
    return notif.id_notificacion;
  }
}
