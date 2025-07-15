import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, User } from '../../../services/auth';

@Component({
  selector: 'app-entrenadores-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './entrenadores-dashboard.html',
  styleUrls: ['./entrenadores-dashboard.css']
})
export class EntrenadoresDashboard implements OnInit {
  currentUser: User | null = null;
  fechaActual: string = '';
  
  // Datos de ejemplo para entrenadores
  estadisticas = {
    miembrosAsignados: 12,
    clasesHoy: 3,
    clasesCompletadas: 28,
    notificacionesPendientes: 2
  };

  miembrosAsignados = [
    { id: 1, nombre: 'Goku Kakarotto', ultimaClase: '2025-01-13', progreso: '85%', estado: 'Activo' },
    { id: 2, nombre: 'Hermione Granger', ultimaClase: '2025-01-12', progreso: '92%', estado: 'Activo' },
    { id: 3, nombre: 'Tony Stark', ultimaClase: '2025-01-11', progreso: '78%', estado: 'Activo' },
    { id: 4, nombre: 'Diana Prince', ultimaClase: '2025-01-10', progreso: '88%', estado: 'Activo' }
  ];

  clasesHoy = [
    { hora: '08:00', miembro: 'Goku Kakarotto', tipo: 'Cardio Intensivo', estado: 'pendiente' },
    { hora: '10:00', miembro: 'Diana Prince', tipo: 'Fuerza y Resistencia', estado: 'pendiente' },
    { hora: '16:00', miembro: 'Naruto Uzumaki', tipo: 'Funcional', estado: 'completada' }
  ];

  notificacionesRecientes = [
    {
      tipo: 'info',
      titulo: 'Nuevo miembro asignado',
      mensaje: 'Se te ha asignado un nuevo miembro',
      fecha: '2025-01-13',
      icono: 'bi-person-plus'
    },
    {
      tipo: 'warning',
      titulo: 'Clase cancelada',
      mensaje: 'Tony Stark canceló su clase de mañana',
      fecha: '2025-01-12',
      icono: 'bi-calendar-x'
    }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    this.fechaActual = new Date().toLocaleDateString('es-ES');
  }

  obtenerPrimerNombre(): string {
    if (!this.currentUser?.nombre_completo) {
      return 'Coach';
    }
    return this.currentUser.nombre_completo.split(' ')[0] || 'Coach';
  }

  marcarAsistencia(miembro: string) {
    alert(`Marcando asistencia para ${miembro}`);
    // Aquí iría la lógica real para marcar asistencia
  }

  getSaludo(): string {
    const hora = new Date().getHours();
    if (hora < 12) return 'Buenos días';
    if (hora < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }
}
