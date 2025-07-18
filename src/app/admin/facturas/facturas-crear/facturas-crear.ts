import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FacturasSidebar } from "../facturas-sidebar/facturas-sidebar";
import { Factura, FacturasService } from '../services/facturas';

@Component({
  selector: 'app-facturas-crear',
  standalone: true,
  imports: [CommonModule, FormsModule, FacturasSidebar],
  templateUrl: './facturas-crear.html'
})
export class FacturasCrearComponent {
  private service = inject(FacturasService);
  mensaje: string = '';
  factura: Factura = {
    id_miembro: 0,
    id_admin: 0,
    fecha_emision: '',
    total: 0,
    estado_registro: true,
    f_registro: ''
  };

  guardar(form: NgForm): void {
    this.service.createFactura(this.factura).subscribe({
      next: () => {
        this.mensaje = 'Factura registrada correctamente.';
        form.resetForm(); // Esto limpia el formulario y los estados de validación
      },
      error: () => {
        this.mensaje = 'Error al registrar la factura.';
      }
    });
  }
}