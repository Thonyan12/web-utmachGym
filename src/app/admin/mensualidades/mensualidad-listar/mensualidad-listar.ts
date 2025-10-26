import { Component, OnInit } from '@angular/core';
import { MensualidadSidebar } from '../mensualidad-sidebar/mensualidad-sidebar';
import { Mensualidad, Mensualidades } from '../services/mensualidades';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-mensualidad-listar',
  imports: [ MensualidadSidebar, CommonModule, FormsModule ],
  templateUrl: './mensualidad-listar.html',
  styleUrl: './mensualidad-listar.css'
})
export class MensualidadListar implements OnInit {
  mensualidades: Mensualidad[] = [];
  searchText: string = '';

  // mapa id_miembro -> nombre
  memberMap: Record<number, string> = {};

  constructor(private mensualidadesService: Mensualidades, private http: HttpClient) { }

  ngOnInit(): void {
    console.log('🔄 Iniciando carga de mensualidades...');
    console.log('🔑 Token:', localStorage.getItem('token') ? 'Presente' : 'No presente');
    
    this.mensualidadesService.getMensualidades()
      .pipe(
        catchError((error) => {
          console.error('❌ Error al obtener las mensualidades:', error);
          console.error('Status:', error.status);
          console.error('Message:', error.message);
          console.error('Error completo:', error);
          return of([]); // Devuelve un array vacío en caso de error
        })
      )
      .subscribe({
        next: (data) => {
          console.log('✅ Mensualidades obtenidas del backend:', data);
          console.log('📊 Cantidad de mensualidades:', data?.length || 0);
          this.mensualidades = data || [];
          console.log('📋 Mensualidades asignadas al componente:', this.mensualidades);
        },
        error: (err) => {
          console.error('❌ Error en suscripción:', err);
        },
        complete: () => {
          console.log('✔️ Suscripción completada');
        }
      });

    this.loadMembers();
  }

  private loadMembers() {
    // Ajusta la ruta según tu API
    this.http.get<any[]>(`${environment.apiUrl}/api/miembros`)
      .pipe(
        catchError(err => {
          console.error('Error al obtener miembros:', err);
          return of([]);
        })
      )
      .subscribe(members => {
        // Espera que cada miembro tenga id_miembro y nombre_completo
        members.forEach(m => {
          this.memberMap[m.id_miembro] = m.nombre_completo || `${m.nombre || ''} ${m.apellido || ''}`.trim();
        });
      });
  }

  getMemberName(id?: number | string | null): string {
    if (id == null) return ''; // maneja undefined o null
    const key = Number(id);
    return this.memberMap[key] || String(key);
  }
}
