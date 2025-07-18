import { Component, inject } from '@angular/core';
import { FacturasSidebar } from '../facturas-sidebar/facturas-sidebar';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Factura, FacturasService } from '../services/facturas';

@Component({
  selector: 'app-facturas-editar',
  imports: [CommonModule, FormsModule, FacturasSidebar],
  templateUrl: './facturas-editar.html',
  styleUrls: ['./facturas-editar.css']
})
export class FacturasEditar {
  private service = inject(FacturasService);
  private route = inject(ActivatedRoute);

  factura: Factura | null = null;
  mensaje: string = '';
  busqueda: string = '';
  cargando: boolean = false;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.service.getFacturaById(id).subscribe({
        next: (data) => {
          this.factura = data;
        },
        error: () => {
          this.mensaje = 'Error al obtener la factura.';
        }
      });
    }
  }

  actualizar(): void {
    if (this.factura) {
      this.service.updateFactura(this.factura).subscribe({
        next: () => {
          this.mensaje = 'Factura actualizada con éxito.';
        },
        error: () => {
          this.mensaje = 'Error al actualizar la factura.';
        }
      });
    }
  }

  buscarFactura(): void {
    this.mensaje = '';
    this.factura = null;
    this.cargando = true;
    const valor = this.busqueda.trim();
    if (!valor) {
      this.mensaje = 'Ingrese un ID para buscar.';
      this.cargando = false;
      return;
    }
    const id = Number(valor);
    if (!isNaN(id)) {
      this.service.getFacturaById(id).subscribe({
        next: (data) => {
          this.factura = data;
          this.cargando = false;
        },
        error: () => {
          this.mensaje = 'No se encontró la factura.';
          this.cargando = false;
        }
      });
    } else {
      this.mensaje = 'El ID ingresado no es válido.';
      this.cargando = false;
    }
  }
}