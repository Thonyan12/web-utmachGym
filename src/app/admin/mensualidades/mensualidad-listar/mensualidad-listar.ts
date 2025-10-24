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
    this.mensualidadesService.getMensualidades()
      .pipe(
        catchError((error) => {
          console.error('Error al obtener las mensualidades:', error);
          return of([]); // Devuelve un array vacío en caso de error
        })
      )
      .subscribe((data) => {
        console.log('Mensualidades obtenidas:', data); // Verifica los datos en la consola
        this.mensualidades = data;
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
