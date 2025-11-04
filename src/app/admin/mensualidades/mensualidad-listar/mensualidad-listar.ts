import { Component, OnInit } from '@angular/core';
import { MensualidadSidebar } from '../mensualidad-sidebar/mensualidad-sidebar';
import { Mensualidad, Mensualidades } from '../services/mensualidades';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-mensualidad-listar',
  imports: [ MensualidadSidebar, CommonModule, FormsModule, RouterLink ],
  templateUrl: './mensualidad-listar.html',
  styleUrl: './mensualidad-listar.css'
})
export class MensualidadListar implements OnInit {
  mensualidades: Mensualidad[] = [];
  searchText: string = '';
  memberMap: Record<number, { nombre: string; cedula: string }> = {};

  constructor(private mensualidadesService: Mensualidades, private http: HttpClient) { }

  ngOnInit(): void {
    this.loadMembers();
    this.loadMensualidades();
  }

  private loadMensualidades(): void {
    this.mensualidadesService.getMensualidades()
      .pipe(
        catchError((error) => {
          console.error('Error al obtener las mensualidades:', error);
          return of([]);
        })
      )
      .subscribe({
        next: (data) => {
          this.mensualidades = data || [];
        }
      });
  }

  private loadMembers(): void {
    this.http.get<any[]>(`${environment.apiUrl}/api/miembros`)
      .pipe(
        catchError(err => {
          console.error('Error al obtener miembros:', err);
          return of([]);
        })
      )
      .subscribe(members => {
        members.forEach(m => {
          const nombreCompleto = `${m.nombre || ''} ${m.apellido1 || ''} ${m.apellido2 || ''}`.trim();
          const cedula = m.cedula || m.identificacion || 'N/A';
          this.memberMap[m.id_miembro] = {
            nombre: nombreCompleto || 'Sin nombre',
            cedula: cedula
          };
        });
      });
  }

  getMemberName(id?: number | string | null): string {
    if (id == null) return 'Sin asignar';
    const key = Number(id);
    const info = this.memberMap[key];
    return info ? info.nombre : `ID: ${key}`;
  }

  getMemberCedula(id?: number | string | null): string {
    if (id == null) return 'N/A';
    const key = Number(id);
    const info = this.memberMap[key];
    return info?.cedula || 'N/A';
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    
    const date = new Date(fecha);
    const dia = date.getDate().toString().padStart(2, '0');
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const anio = date.getFullYear();
    
    return `${dia}-${mes}-${anio}`;
  }
}
