import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-registrar-asistencia',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './registrar-asistencia.html',
  styleUrl: './registrar-asistencia.css'
})
export class RegistrarAsistencia {
  idMiembro: number | null = null;
  horario: string = '';
  fecha_asistencia: string = '';
  mensaje: string = '';

  constructor(private http: HttpClient) { }

  registrarAsistencia() {
    if (!this.idMiembro || !this.horario || !this.fecha_asistencia) {
      this.mensaje = 'Todos los campos son obligatorios.';
      return;
    }

    const body = {
      id_miembro: this.idMiembro,
      horario: this.horario,
      fecha_asistencia: this.fecha_asistencia
    };

    this.http.post('/api/asistencia', body).subscribe({
      next: () => {
        this.mensaje = 'Asistencia registrada correctamente.';
        this.idMiembro = null;
        this.horario = '';
        this.fecha_asistencia = '';
      },
      error: () => {
        this.mensaje = 'Error al registrar la asistencia.';
      }
    });
  }
}