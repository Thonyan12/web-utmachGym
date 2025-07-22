import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FacturasSidebar } from '../facturas-sidebar/facturas-sidebar';
import { FacturasService } from '../services/facturas'; // Importar el servicio

declare const bootstrap: any;

@Component({
  selector: 'app-facturas-crear',
  templateUrl: './facturas-crear.html',
  imports: [CommonModule, FormsModule, FacturasSidebar, RouterModule],
  styleUrls: ['./facturas-crear.css']
})
export class FacturasCrearComponent {
  factura: any = {
    id_miembro: 0,
    id_admin: 0,
    fecha_emision: '',
    total: 0,
    estado_registro: true,
    f_registro: ''
  };

  detalle: any = {
    tipo_detalle: '',
    referencia_id: null, 
    descripcion: '',
    monto: 0,
    iva: 0,
    metodo_pago: '', 
    estado_registro: true, 
    f_registro: '' 
  };

  mensaje: string = '';

  detalleTipos: string[] = [
    'pago mensual',
    'compra producto',
    'compra suplemento',
    'servicio adicional'
  ];

  // Inyectar FacturasService en el constructor
  constructor(private facturasService: FacturasService) {}

  abrirModal(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    const modal = new bootstrap.Modal(document.getElementById('detalleFacturaModal')!);
    modal.show();
  }

  calcularIVA(): void {
    this.detalle.iva = this.detalle.monto * 0.12;
  }

  guardarDetalleFactura(detalleForm: NgForm): void {
    if (detalleForm.invalid) {
      return;
    }
  
    const facturaCompleta = {
      factura: this.factura,
      detalles: [this.detalle] // Enviar el detalle como un array
    };
  
    console.log('Datos enviados al backend:', facturaCompleta); // Depuración
  
    this.facturasService.createFacturaConDetalle(facturaCompleta).subscribe({
      next: () => {
        alert('Factura y detalle creados correctamente.');
        const modal = bootstrap.Modal.getInstance(document.getElementById('detalleFacturaModal')!);
        modal?.hide();
      },
      error: (error) => {
        console.error('Error al crear la factura y el detalle:', error);
        alert('Ocurrió un error al guardar la factura y el detalle.');
      }
    });
  }

  guardar(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    alert('Factura guardada correctamente.');
  }
}