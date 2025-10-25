import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService, User } from '../../../services/auth';

interface Miembro {
  id_miembro: number;
  nombre: string;
  apellido1: string;
  apellido2?: string;
  cedula: string;
  estado: boolean;
}

interface Asistencia {
  id_miembro: number;
  fecha_asistencia: string;
  horario: string;
  estado: boolean;
}

@Component({
  selector: 'app-entrenadores-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entrenadores-dashboard.html',
  styleUrls: ['./entrenadores-dashboard.css']
})
export class EntrenadoresDashboard implements OnInit {
  currentUser: User | null = null;
  fechaActual: string = '';
  
  // Datos reales del backend
  totalMiembrosAsignados: number = 0;
  registrosDelMes: number = 0;
  miembros: Miembro[] = [];
  asistenciasDelMes: Asistencia[] = [];

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.cargarDatos();
      }
    });
    
    this.fechaActual = new Date().toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  cargarDatos() {
    this.cargarMiembrosAsignados();
    this.cargarAsistenciasDelMes();
  }

  cargarMiembrosAsignados() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any>('http://localhost:3000/api/entrenadores/mis-miembros', { headers })
      .subscribe({
        next: (response) => {
          this.miembros = Array.isArray(response) ? response : (response.data || []);
          this.totalMiembrosAsignados = this.miembros.length;
        },
        error: (error) => {
          console.error('Error al cargar miembros:', error);
          this.totalMiembrosAsignados = 0;
        }
      });
  }

  cargarAsistenciasDelMes() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Obtener el primer y último día del mes actual
    const hoy = new Date();
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

    this.http.get<any>('http://localhost:3000/api/asistencia', { headers })
      .subscribe({
        next: (response) => {
          const todasAsistencias = Array.isArray(response) ? response : (response.data || []);
          
          // Filtrar asistencias del mes actual y de mis miembros
          const idsMisMiembros = this.miembros.map(m => m.id_miembro);
          this.asistenciasDelMes = todasAsistencias.filter((a: Asistencia) => {
            const fechaAsistencia = new Date(a.fecha_asistencia);
            return fechaAsistencia >= primerDiaMes && 
                   fechaAsistencia <= ultimoDiaMes && 
                   idsMisMiembros.includes(a.id_miembro);
          });
          
          this.registrosDelMes = this.asistenciasDelMes.length;
        },
        error: (error) => {
          console.error('Error al cargar asistencias del mes:', error);
          this.registrosDelMes = 0;
        }
      });
  }

  obtenerPrimerNombre(): string {
    if (!this.currentUser?.nombre_completo) {
      return 'Coach';
    }
    return this.currentUser.nombre_completo.split(' ')[0] || 'Coach';
  }
}
