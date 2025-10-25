import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-registrar-asistencia',
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './registrar-asistencia.html',
  styleUrl: './registrar-asistencia.css'
})
export class RegistrarAsistencia implements OnInit {
  idMiembro: number | null = null;
  horario: string = '';
  fecha_asistencia: string = '';
  mensaje: string = '';
  miembros: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    // Cargar solo los miembros asignados al entrenador
    this.http.get<any>('http://localhost:3000/api/entrenadores/mis-miembros', { headers }).subscribe({
      next: (data) => {
        console.log('Miembros asignados recibidos:', data);
        this.miembros = data.data || [];
      },
      error: (err) => {
        console.log('Error al cargar miembros:', err);
        this.miembros = [];
      }
    });
  }

  limpiarFormulario(): void {
    this.idMiembro = null;
    this.horario = '';
    this.fecha_asistencia = '';
  }

  registrarAsistencia() {
    if (!this.idMiembro || !this.horario || !this.fecha_asistencia) {
      this.mensaje = 'Todos los campos son obligatorios.';
      return;
    }

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    // Primero verificar si ya existe una asistencia para este miembro en esta fecha
    this.http.get<any>('http://localhost:3000/api/asistencia', { headers }).subscribe({
      next: (response) => {
        const todasAsistencias = Array.isArray(response) ? response : (response.data || []);
        
        // Buscar si ya existe un registro para este miembro en esta fecha
        const asistenciaExistente = todasAsistencias.find((asistencia: any) => 
          asistencia.id_miembro === this.idMiembro && 
          asistencia.fecha_asistencia.startsWith(this.fecha_asistencia)
        );

        if (asistenciaExistente) {
          const nombreMiembro = this.miembros.find(m => m.id_miembro === this.idMiembro);
          const nombre = nombreMiembro ? `${nombreMiembro.nombre} ${nombreMiembro.apellido1}` : 'este miembro';
          this.mensaje = `Ya existe un registro de asistencia para ${nombre} en la fecha ${this.fecha_asistencia}. No se puede registrar dos veces el mismo día.`;
          this.limpiarMensajeDespuesDe(5000);
          return;
        }

        // Si no existe, proceder a registrar
        this.registrarNuevaAsistencia(headers);
      },
      error: (err) => {
        console.log('Error al verificar asistencias:', err);
        this.mensaje = 'Error al verificar asistencias existentes.';
      }
    });
  }

  private registrarNuevaAsistencia(headers: any) {
    const body = {
      id_miembro: this.idMiembro,
      horario: this.horario,
      fecha_asistencia: this.fecha_asistencia
    };

    this.http.post('http://localhost:3000/api/asistencia', body, { headers }).subscribe({
      next: () => {
        this.mensaje = 'Asistencia registrada correctamente.';
        this.limpiarFormulario();
        this.limpiarMensajeDespuesDe(3000);
      },
      error: (err) => {
        console.log('Error al registrar:', err);
        this.mensaje = 'Error al registrar la asistencia.';
        this.limpiarMensajeDespuesDe(5000);
      }
    });
  }

  private limpiarMensajeDespuesDe(ms: number): void {
    setTimeout(() => {
      this.mensaje = '';
    }, ms);
  }
}