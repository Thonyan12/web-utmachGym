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
    console.log('🔄 Iniciando carga de notificaciones de entrenador...');
    console.log('🔑 Token:', localStorage.getItem('token') ? 'Presente' : 'No presente');
    
    this.notiService.getMisNotificaciones().subscribe({
      next: (resp: any) => {
        console.log('✅ RESPUESTA COMPLETA del backend:', resp);
        console.log('📊 Tipo de respuesta:', typeof resp);
        console.log('📋 Estructura:', Object.keys(resp));
        
        // Manejar diferentes formatos de respuesta
        if (resp.data) {
          this.notificaciones = resp.data;
          console.log('✔️ Usando resp.data:', this.notificaciones.length, 'notificaciones');
        } else if (Array.isArray(resp)) {
          this.notificaciones = resp;
          console.log('✔️ Respuesta es array directo:', this.notificaciones.length, 'notificaciones');
        } else {
          this.notificaciones = [];
          console.warn('⚠️ Formato de respuesta no reconocido');
        }
      },
      error: (err) => {
        console.error('❌ ERROR al cargar notificaciones:', err);
        console.error('Status:', err.status);
        console.error('Message:', err.message);
        console.error('Error completo:', err);
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