import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MensualidadSidebar } from '../mensualidad-sidebar/mensualidad-sidebar'; // Asegúrate de que la ruta sea correcta
import { Mensualidades, Mensualidad } from '../services/mensualidades'; // Asegúrate de que la ruta sea correcta y que Mensualidades sea tu servicio

@Component({
  selector: 'app-mensualidad-editar',
  standalone: true,
  imports: [CommonModule, FormsModule, MensualidadSidebar],
  templateUrl: './mensualidad-editar.html',
  styleUrl: './mensualidad-editar.css'
})
export class MensualidadEditarComponent implements OnInit { // Corregido: Nombre de la clase a MensualidadEditarComponent e implementa OnInit
  private service = inject(Mensualidades); // Inyección del servicio
  private route = inject(ActivatedRoute); // Inyección de ActivatedRoute

  mensualidad: Mensualidad | null = null; // Corregido: Propiedad 'mensualidades' a 'mensualidad' (singular) para coincidir con el HTML
  mensaje: string = '';
  busqueda: string = '';
  cargando: boolean = false;

  ngOnInit(): void {
    // Obtener el ID de la URL y precargar la mensualidad si existe
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      if (!isNaN(id)) {
        this.busqueda = id.toString(); // Establece el ID en el campo de búsqueda
        this.buscarMensualidad(); // Llama a la función de búsqueda automáticamente
      }
    }
  }

  /**
   * Actualiza la mensualidad.
   */
  actualizar(): void {
    // Asegurarse de que la propiedad 'mensualidad' (singular) se usa aquí
    if (this.mensualidad && this.mensualidad.id_mensualidad) {
      this.service.update(this.mensualidad).subscribe({
        next: () => {
          this.mensaje = 'Mensualidad actualizada con éxito.';
        },
        error: (err) => {
          this.mensaje = 'Error al actualizar la mensualidad: ' + err.message;
          console.error('Error al actualizar mensualidad:', err);
        }
      });
    } else {
      this.mensaje = 'No hay mensualidad seleccionada para actualizar.';
    }
  }

  /**
   * Busca una mensualidad por ID.
   */
  buscarMensualidad(): void {
    this.mensaje = '';
    this.mensualidad = null; // Asegurarse de que la propiedad 'mensualidad' (singular) se usa aquí
    this.cargando = true;
    const valorBusqueda = this.busqueda.trim();

    if (!valorBusqueda) {
      this.mensaje = 'Ingrese un ID de Mensualidad para buscar.';
      this.cargando = false;
      return;
    }

    const id = Number(valorBusqueda);

    if (!isNaN(id)) {
      this.service.getById(id).subscribe({
        next: (data) => {
          if (data) {
            this.mensualidad = data; // Asegurarse de que la propiedad 'mensualidad' (singular) se usa aquí
          } else {
            this.mensaje = 'No se encontró la mensualidad con ese ID.';
          }
          this.cargando = false;
        },
        error: (err) => {
          this.mensaje = 'Error al buscar la mensualidad.';
          this.cargando = false;
          console.error('Error en buscarMensualidad:', err);
        }
      });
    } else {
      this.mensaje = 'Ingrese un ID de Mensualidad válido (número).';
      this.cargando = false;
    }
  }
}