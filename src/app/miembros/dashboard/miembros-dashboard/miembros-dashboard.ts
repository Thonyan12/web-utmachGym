import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, User } from '../../../services/auth';

@Component({
  selector: 'app-miembros-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './miembros-dashboard.html',
  styleUrls: ['./miembros-dashboard.css']
})
export class MiembrosDashboard implements OnInit {
  currentUser: User | null = null;
  fechaActual: string = ''; // ✅ Nueva propiedad para la fecha
  
  // Datos de ejemplo (luego vendrán del backend)
  estadoMensualidad = {
    activa: true,
    diasRestantes: 15,
    fechaVencimiento: '2025-01-28'
  };

  proximasClases = [
    { 
      fecha: '2025-01-14', 
      hora: '08:00', 
      tipo: 'Cardio Intensivo', 
      entrenador: 'Jean Carlo Velasco' 
    },
    { 
      fecha: '2025-01-15', 
      hora: '10:00', 
      tipo: 'Fuerza y Resistencia', 
      entrenador: 'Carolina Aguirre' 
    }
  ];

  progresoSemanal = {
    clases: 3,
    meta: 5
  };

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    // ✅ Configurar la fecha actual al inicializar
    this.fechaActual = new Date().toLocaleDateString('es-ES');
  }

  // ✅ Método para obtener el primer nombre
  obtenerPrimerNombre(): string {
    if (!this.currentUser?.nombre_completo) {
      return 'Miembro';
    }
    return this.currentUser.nombre_completo.split(' ')[0] || 'Miembro';
  }
}
