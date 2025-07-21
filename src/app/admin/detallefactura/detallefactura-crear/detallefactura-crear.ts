import { Component, OnInit } from '@angular/core';
import { DetalleFacturaService } from '../services/detallefactura';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-detallefactura-crear',
  imports:[CommonModule, FormsModule],
  templateUrl: './detallefactura-crear.html',
  styleUrls: ['./detallefactura-crear.css']
})
export class DetalleFacturaCrearComponent implements OnInit {
  detalle: any = {
    id_factura: 0,
    tipo_detalle: '',
    referencia_id: null,
    descripcion: '',
    monto: 0,
    iva: 0,
    metodo_pago: 'Efectivo',
    estado_registro: true,
    f_registro: ''
  };

  constructor(private detalleFacturaService: DetalleFacturaService) {}

  ngOnInit(): void {
    // Automatizar la fecha de registro
    this.detalle.f_registro = new Date().toISOString().split('T')[0];
  }

  calcularIVA(): void {
    // Calcular el IVA como el 12% del monto
    this.detalle.iva = this.detalle.monto * 0.12;
  }

  guardar(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.detalleFacturaService.createDetalleFactura(this.detalle).subscribe({
      next: () => {
        alert('Detalle de factura creado correctamente.');
        form.resetForm();
        this.detalle.f_registro = new Date().toISOString().split('T')[0]; // Restablecer la fecha de registro
      },
      error: (error) => {
        console.error('Error al crear el detalle de factura:', error);
      }
    });
  }
}