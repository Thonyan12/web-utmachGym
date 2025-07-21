import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetalleFacturaService, DetalleFactura } from '../services/detallefactura';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DetallefacturaSidebar } from '../detallefactura-sidebar/detallefactura-sidebar';

@Component({
  selector: 'app-detallefactura-listar',
  imports: [CommonModule, FormsModule, DetallefacturaSidebar],
  templateUrl: './detallefactura-listar.html',
  styleUrls: ['./detallefactura-listar.css']
})
export class DetallefacturaListar implements OnInit {
  detallesFactura: DetalleFactura[] = [];
  mensaje: string = '';
  idFactura!: number;

  constructor(
    private detalleFacturaService: DetalleFacturaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Captura el parámetro id_factura de la URL
    this.idFactura = Number(this.route.snapshot.paramMap.get('id_factura'));
    this.cargarDetallesFactura();
  }

  cargarDetallesFactura(): void {
    this.detalleFacturaService.getDetallesFacturaByFacturaId(this.idFactura).subscribe({
      next: (detalles) => {
        this.detallesFactura = detalles;
      },
      error: (error) => {
        console.error('Error al cargar detalles de factura:', error);
        this.mensaje = 'Error al cargar los detalles de factura.';
      }
    });
  }

  
}