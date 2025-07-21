import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-registrar-asistencia',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './registrar-asistencia.html',
  styleUrl: './registrar-asistencia.css'
})
export class RegistrarAsistencia implements OnInit {
  idMiembro: number | null = null;
  horario: string = '';
  fecha_asistencia: string = '';
  mensaje: string = '';
  miembros: any[] = [];
  miembrosFiltrados: any[] = [];
  busqueda: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any[]>('http://localhost:3000/api/miembros', { headers }).subscribe({
      next: (data) => {
        console.log('Miembros recibidos:', data);
        this.miembros = data;
        this.miembrosFiltrados = [];
      },
      error: (err) => {
        console.log('Error al cargar miembros:', err);
        this.miembros = [];
      }
    });
  }

  seleccionarMiembro(m: any) {
    console.log('Miembro seleccionado:', m);
    this.idMiembro = m.id || m._id || m.id_miembro;
    this.busqueda = `${m.nombre} - ${m.cedula}`;
    this.miembrosFiltrados = [];
  }

  filtrarMiembros() {
    this.idMiembro = null;
    const texto = this.busqueda.toLowerCase();
    this.miembrosFiltrados = this.miembros.filter(m =>
      m.nombre.toLowerCase().includes(texto) ||
      m.cedula.toLowerCase().includes(texto)
    );
  }

  registrarAsistencia() {
    if (!this.idMiembro || !this.horario || !this.fecha_asistencia) {
      this.mensaje = 'Todos los campos son obligatorios.';
      return;
    }

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const body = {
      id_miembro: this.idMiembro,
      horario: this.horario,
      fecha_asistencia: this.fecha_asistencia
    };

    this.http.post('http://localhost:3000/api/asistencia', body, { headers }).subscribe({
      next: () => {
        this.mensaje = 'Asistencia registrada correctamente.';
        this.idMiembro = null;
        this.horario = '';
        this.fecha_asistencia = '';
        this.busqueda = '';
      },
      error: (err) => {
        console.log('Error al registrar:', err);
        this.mensaje = 'Error al registrar la asistencia.';
      }
    });
  }
}