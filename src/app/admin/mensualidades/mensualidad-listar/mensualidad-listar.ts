import { Component, OnInit } from '@angular/core';
import { MensualidadSidebar } from '../mensualidad-sidebar/mensualidad-sidebar';
import { Mensualidad, Mensualidades } from '../services/mensualidades';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-mensualidad-listar',
  imports: [ MensualidadSidebar, CommonModule, FormsModule ],
  templateUrl: './mensualidad-listar.html',
  styleUrl: './mensualidad-listar.css'
})
export class MensualidadListar implements OnInit {
  mensualidades: Mensualidad[] = [];
  searchText: string = '';

  constructor(private mensualidadesService: Mensualidades) { }

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
  }
}
