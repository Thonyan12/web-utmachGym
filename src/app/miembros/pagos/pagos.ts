import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FacturasMiembro, FacturaMiembro, DetalleFactura, FacturaConDetalles } from '../services/facturas-miembro';

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagos.html',
  styleUrl: './pagos.css'
})
export class Pagos implements OnInit {
  facturas: FacturaMiembro[] = [];
  facturasFiltradas: FacturaMiembro[] = [];
  filtro: string = '';
  loading = true;
  
  // Modal
  mostrarModal = false;
  facturaSeleccionada: FacturaMiembro | null = null;
  detallesFactura: DetalleFactura[] = [];
  loadingDetalles = false;

  constructor(private facturaService: FacturasMiembro) {}

  ngOnInit() {
    this.cargarFacturas();
  }

  cargarFacturas() {
    this.loading = true;
    this.facturaService.getFacturasMiembro().subscribe({
      next: (response) => {
        if (response.success) {
          this.facturas = response.data;
          this.facturasFiltradas = this.facturas;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar facturas:', error);
        this.loading = false;
      }
    });
  }

  filtrarFacturas() {
    if (!this.filtro.trim()) {
      this.facturasFiltradas = this.facturas;
      return;
    }

    const filtroLower = this.filtro.toLowerCase();
    this.facturasFiltradas = this.facturas.filter(factura =>
      factura.id_factura.toString().includes(filtroLower) ||
      factura.fecha_emision.toLowerCase().includes(filtroLower) ||
      factura.total.toString().includes(filtroLower) ||
      factura.admin_usuario.toLowerCase().includes(filtroLower)
    );
  }

  verDetalles(factura: FacturaMiembro) {
    this.facturaSeleccionada = factura;
    this.mostrarModal = true;
    this.loadingDetalles = true;
    
    this.facturaService.getDetalleFactura(factura.id_factura).subscribe({
      next: (response) => {
        if (response.success) {
          this.detallesFactura = response.data.detalles;
        }
        this.loadingDetalles = false;
      },
      error: (error) => {
        console.error('Error al cargar detalles:', error);
        this.loadingDetalles = false;
      }
    });
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.facturaSeleccionada = null;
    this.detallesFactura = [];
  }

  getTotalFacturas(): number {
    return this.facturas.reduce((total, factura) => total + factura.total, 0);
  }

  getFacturasEsteMes(): number {
    const fechaActual = new Date();
    return this.facturas.filter(factura => {
      const fechaFactura = new Date(factura.fecha_emision);
      return fechaFactura.getMonth() === fechaActual.getMonth() &&
             fechaFactura.getFullYear() === fechaActual.getFullYear();
    }).length;
  }

  limpiarFiltro() {
    this.filtro = '';
    this.facturasFiltradas = this.facturas;
  }
}
