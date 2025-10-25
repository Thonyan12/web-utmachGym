import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Notificaciones } from '../../services/notificaciones';

@Component({
  selector: 'app-enviar-notificacion',
  imports: [CommonModule, FormsModule],
  templateUrl: './enviar-notificacion.html',
  styleUrl: './enviar-notificacion.css'
})
export class EnviarNotificacion implements OnInit {
  id_usuario: number | null = null;
  tipo: string = '';
  contenido: string = '';
  mensaje: string = '';
  miembros: any[] = [];

  constructor(
    private notiService: Notificaciones,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.cargarMiembrosAsignados();
  }

  cargarMiembrosAsignados(): void {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any>('http://localhost:3000/api/entrenadores/mis-miembros', { headers }).subscribe({
      next: (data) => {
        console.log('Miembros asignados:', data);
        this.miembros = data.data || [];
      },
      error: (err) => {
        console.error('Error al cargar miembros:', err);
        this.miembros = [];
      }
    });
  }

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
        this.limpiarFormulario();
      },
      error: () => {
        this.mensaje = 'Error al enviar la notificación.';
      }
    });
  }

  limpiarFormulario(): void {
    this.id_usuario = null;
    this.tipo = '';
    this.contenido = '';
  }
}