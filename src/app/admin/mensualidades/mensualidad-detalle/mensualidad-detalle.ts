import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Mensualidad, Mensualidades } from '../services/mensualidades'; // Asume que Mensualidades es tu servicio
import { MensualidadSidebar } from '../mensualidad-sidebar/mensualidad-sidebar';

// Define la interfaz para la Mensualidad

@Component({
  selector: 'app-mensualidad-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, MensualidadSidebar],
  templateUrl: './mensualidad-detalle.html',
  styleUrl: './mensualidad-detalle.css' // Corregido el nombre del archivo CSS
})
export class MensualidadDetalleComponent implements OnInit { // Corregido el nombre de la clase y se implementa OnInit
  private mensualidadesService = inject(Mensualidades);
  mensualidades: Mensualidad[] = []; // Corregido el tipo del array
  mensualidadesFiltradas: Mensualidad[] = []; // Corregido el tipo del array
  filtro: string = '';

  ngOnInit(): void {
    this.mensualidadesService.getMensualidades().subscribe({
      next: (data) => {
        this.mensualidades = data;
        this.mensualidadesFiltradas = data;
      },
      error: (error) => console.error('Error al obtener mensualidades', error) // Corregido el mensaje de error
    });
  }

  filtrarMensualidades(): void { // Añadido 'void' para el tipo de retorno
    const filtroLower = this.filtro.toLowerCase();
    this.mensualidadesFiltradas = this.mensualidades.filter(mensualidad => // Corregido 'mens' a 'mensualidad'
      String(mensualidad.id_mensualidad).includes(filtroLower)
    );
  }
}