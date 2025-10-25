import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-historial-asistencia',
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule],
  templateUrl: './historial-asistencia.html',
  styleUrls: ['./historial-asistencia.css']
})
export class HistorialAsistencia implements OnInit {
  asistencias: any[] = [];
  asistenciasFiltradas: any[] = [];
  miembros: any[] = [];
  miembroSeleccionado: number | null = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarMiembros();
    this.cargarAsistencias();
  }

  cargarMiembros(): void {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any>('http://localhost:3000/api/entrenadores/mis-miembros', { headers }).subscribe({
      next: (data) => {
        console.log('Miembros cargados:', data);
        this.miembros = data.data || [];
        // Filtrar después de cargar los miembros
        this.filtrarAsistencias();
      },
      error: (err) => {
        console.error('Error al cargar miembros:', err);
        this.miembros = [];
      }
    });
  }

  cargarAsistencias(): void {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any>('http://localhost:3000/api/asistencia', { headers }).subscribe({
      next: (data) => {
        console.log('Respuesta completa del backend:', data);
        console.log('Tipo de data:', typeof data);
        console.log('Es array?:', Array.isArray(data));
        
        // Manejar diferentes estructuras de respuesta
        if (Array.isArray(data)) {
          this.asistencias = data;
        } else if (data && data.data && Array.isArray(data.data)) {
          this.asistencias = data.data;
        } else if (data && Array.isArray(data.asistencias)) {
          this.asistencias = data.asistencias;
        } else {
          console.error('Estructura de respuesta desconocida:', data);
          this.asistencias = [];
        }
        
        console.log('Asistencias procesadas:', this.asistencias);
        // Filtrar después de cargar las asistencias
        this.filtrarAsistencias();
      },
      error: (err) => {
        console.error('Error al cargar asistencias:', err);
        this.asistencias = [];
        this.asistenciasFiltradas = [];
      }
    });
  }

  filtrarAsistencias(): void {
    console.log('Filtrando asistencias...');
    console.log('Miembro seleccionado:', this.miembroSeleccionado);
    console.log('Asistencias totales:', this.asistencias.length);
    console.log('Miembros:', this.miembros.length);

    if (this.miembroSeleccionado) {
      this.asistenciasFiltradas = this.asistencias.filter(
        a => a.id_miembro === this.miembroSeleccionado
      );
    } else {
      // Filtrar solo asistencias de mis miembros asignados
      const idsMiembros = this.miembros.map(m => m.id_miembro);
      console.log('IDs de miembros asignados:', idsMiembros);
      this.asistenciasFiltradas = this.asistencias.filter(
        a => idsMiembros.includes(a.id_miembro)
      );
    }
    console.log('Asistencias filtradas:', this.asistenciasFiltradas.length);
  }

  obtenerNombreMiembro(idMiembro: number): string {
    const miembro = this.miembros.find(m => m.id_miembro === idMiembro);
    if (miembro) {
      return `${miembro.nombre} ${miembro.apellido1} ${miembro.apellido2 || ''}`.trim();
    }
    return 'Miembro desconocido';
  }

  obtenerCedulaMiembro(idMiembro: number): string {
    const miembro = this.miembros.find(m => m.id_miembro === idMiembro);
    return miembro ? miembro.cedula : 'N/A';
  }

  irARegistrar(): void {
    this.router.navigate(['/entrenadores/asistencia']);
  }
}