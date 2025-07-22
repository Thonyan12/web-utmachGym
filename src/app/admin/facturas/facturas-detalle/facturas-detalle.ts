import { Component, inject, OnInit } from '@angular/core';
import { FacturasSidebar } from '../facturas-sidebar/facturas-sidebar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Factura, FacturasService } from '../services/facturas';

@Component({
  selector: 'app-facturas-detalle',
  imports: [CommonModule, FormsModule, FacturasSidebar, RouterModule],
  templateUrl: './facturas-detalle.html',
  styleUrls: ['./facturas-detalle.css']
})

export class FacturasDetalle implements OnInit {
  private facturasService = inject(FacturasService);
  mostrarModal: boolean = false;
  facturaSeleccionada: Factura | null = null;
  facturas: Factura[] = [];
  facturasFiltradas: Factura[] = [];
  filtro: string = '';

  detalleTipos: string[] = [
    'pago mensual',
    'compra producto',
    'compra suplemento',
    'servicio adicional'
  ];

  
  tipoDetalle: string = '';

  abrirModal(factura: Factura): void {
    this.facturaSeleccionada = factura;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.facturaSeleccionada = null;
  }

  ngOnInit(): void {
    this.facturasService.getFacturas().subscribe({
      next: (data) => {
        // Filtra facturas nulas o undefined
        this.facturas = (data || []).filter(factura => !!factura);
        this.facturasFiltradas = this.facturas;
      },
      error: (error) => console.log('Error al obtener facturas', error)
    });
  }

  filtrarFacturas(): void {
    const filtroLower = this.filtro.toLowerCase();
    this.facturasFiltradas = this.facturas.filter(factura =>
      !!factura && (
        String(factura.id_factura || '').includes(filtroLower) ||
        String(factura.id_miembro || '').includes(filtroLower) ||
        String(factura.total || '').includes(filtroLower)
      )
    );
  }
}