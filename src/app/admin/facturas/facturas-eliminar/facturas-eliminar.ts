import { Component, inject } from '@angular/core';
import { FacturasSidebar } from '../facturas-sidebar/facturas-sidebar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Factura, FacturasService } from '../services/facturas';

@Component({
  selector: 'app-facturas-eliminar',
  imports: [CommonModule, FormsModule, FacturasSidebar],
  templateUrl: './facturas-eliminar.html',
  styleUrls: ['./facturas-eliminar.css']
})
export class FacturasEliminar {
  private service = inject(FacturasService);
  idFactura: number = 0;
  factura: Factura | null = null;
  mensaje: string = '';
  mostrarConfirmacion: boolean = false;

  buscar(): void {
    if (this.idFactura <= 0) {
      this.mensaje = 'El ID de la factura debe ser un número positivo.';
      this.factura = null;
      return;
    }
    this.service.getFacturaById(this.idFactura).subscribe({
      next: (data) => {
        this.factura = data;
        this.mensaje = '';
        this.mostrarConfirmacion = false;
      },
      error: () => {
        this.factura = null;
        this.mensaje = 'No se encontró una factura con ese ID.';
        this.mostrarConfirmacion = false;
      }
    });
  }

  confirmarEliminar(): void {
    this.mostrarConfirmacion = true;
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacion = false;
  }

  eliminar(): void {
    if (!this.factura) {
      this.mensaje = 'Primero busque una factura válida para eliminar.';
      return;
    }
    this.service.deleteFactura(this.idFactura).subscribe({
      next: () => {
        this.mensaje = 'Factura eliminada correctamente.';
        this.factura = null;
        this.idFactura = 0;
        this.mostrarConfirmacion = false;
      },
      error: () => {
        this.mensaje = 'Error al eliminar la factura.';
        this.mostrarConfirmacion = false;
      }
    });
  }
}