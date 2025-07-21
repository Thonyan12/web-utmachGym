import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Notificaciones } from '../../services/notificaciones';

@Component({
  selector: 'app-mis-notificaciones',
  imports: [CommonModule],
  templateUrl: './mis-notificaciones.html',
  styleUrl: './mis-notificaciones.css'
})
export class MisNotificaciones implements OnInit {
  notificaciones: any[] = [];

  constructor(private notiService: Notificaciones) {}

  ngOnInit(): void {
    this.notiService.getMisNotificaciones().subscribe({
      next: (resp: any) => {
        console.log('RESPUESTA NOTIFICACIONES:', resp); // <-- agrega esto
        this.notificaciones = resp.data ? resp.data : [];
      },
      error: (err) => {
        console.error('ERROR:', err);
        this.notificaciones = [];
      }
    });
  }

  marcarLeido(noti: any) {
    this.notiService.marcarComoLeida(noti.id_notificacion).subscribe({
      next: () => {
        noti.leido = true;
      },
      error: (err) => {
        console.error('Error al marcar como leída:', err);
      }
    });
  }
}