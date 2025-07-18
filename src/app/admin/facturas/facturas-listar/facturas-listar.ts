import { Component, inject, OnInit } from '@angular/core';
import { FacturasSidebar } from '../facturas-sidebar/facturas-sidebar';
import { Factura, FacturasService } from '../services/facturas';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-facturas-listar',
  imports: [FacturasSidebar, CommonModule, FormsModule],
  templateUrl: './facturas-listar.html',
  styleUrls: ['./facturas-listar.css']
})
export class FacturasListarComponent implements OnInit {
  private service = inject(FacturasService);
  facturas: Factura[] = [];
  searchText: string = '';

  constructor(private facturasService: FacturasService) { }

  ngOnInit(): void {
    this.facturasService.getFacturas().subscribe(data => {
      this.facturas = data;
    });
  }

  cambiarEstado(factura: any, nuevoEstado: boolean) {
    const facturaActualizada = { ...factura, estado_registro: nuevoEstado };
    this.service.updateFactura(facturaActualizada).subscribe({
      next: () => {
        factura.estado_registro = nuevoEstado;
      },
      error: () => {
        alert('Error al actualizar el estado');
      }
    });
  }
}