import { Component, inject, OnInit } from '@angular/core';
import { ProductosSidebar } from '../productos-sidebar/productos-sidebar';
import { Producto, Productos } from '../services/productos';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-productos-detalle',
  imports: [CommonModule, FormsModule, ProductosSidebar, RouterModule],
  templateUrl: './productos-detalle.html',
  styleUrls: ['./productos-detalle.css']
})
export class ProductosDetalle implements OnInit {
  private productosService = inject(Productos);
  mostrarModal: boolean = false;
  productoSeleccionado: any = null;
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  filtro: string = '';



  abrirModal(producto: any): void {
    this.productoSeleccionado = producto;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.productoSeleccionado = null;
  }

ngOnInit(): void {
  this.productosService.getProductos().subscribe({
    next: (data) => {
      // Filtra productos nulos o undefined
      this.productos = (data || []).filter(prod => !!prod);
      this.productosFiltrados = this.productos;
    },
    error: (error) => console.log('Error al obtener productos', error)
  });
}

filtrarProductos() {
  const filtroLower = this.filtro.toLowerCase();
  this.productosFiltrados = this.productos.filter(prod =>
    !!prod && (
      (prod.nombre_prod || '').toLowerCase().includes(filtroLower) ||
      (prod.tipo_prod || '').toLowerCase().includes(filtroLower) ||
      String(prod.id_producto || '').includes(filtroLower)
    )
  );
}
}