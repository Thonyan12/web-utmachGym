import { Component, inject, OnInit } from '@angular/core';
import { Factura, FacturasService } from '../services/facturas';
import { DetalleFactura, DetalleFacturaService } from '../../detallefactura/services/detallefactura';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FacturasSidebar } from '../facturas-sidebar/facturas-sidebar';
declare const bootstrap: any;
@Component({
  selector: 'app-facturas-listar',
  imports: [CommonModule, FormsModule, RouterModule, CurrencyPipe, FacturasSidebar],
  templateUrl: './facturas-listar.html',
  styleUrls: ['./facturas-listar.css']
})
export class FacturasListarComponent implements OnInit {
  private facturasService = inject(FacturasService);
  private detalleFacturaService = inject(DetalleFacturaService);
  facturas: Factura[] = [];
  detallesFactura: DetalleFactura[] = [];

  constructor() {}

  ngOnInit(): void {
    this.cargarFacturas();
  }

  cargarFacturas(): void {
    this.facturasService.getFacturas().subscribe({
      next: (facturas) => {
        this.facturas = facturas; // Asigna directamente el resultado al array
      },
      error: (error) => {
        console.error('Error al cargar las facturas:', error);
      },
    });
  }

  

  abrirModal(idFactura: number): void {
    const modalElement = document.getElementById('detalleFacturaModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }

    this.detalleFacturaService.getDetallesFacturaByFacturaId(idFactura).subscribe({
      next: (detalles) => {
        this.detallesFactura = detalles;
      },
      error: (error) => {
        console.error('Error al cargar detalles de factura:', error);
      }
    });
  }
}