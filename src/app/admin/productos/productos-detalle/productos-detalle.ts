import { Component, inject } from '@angular/core';
import { ProductosSidebar } from '../productos-sidebar/productos-sidebar';
import { Producto, Productos } from '../services/productos';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-productos-detalle',
  imports: [CommonModule, FormsModule,ProductosSidebar],
  templateUrl: './productos-detalle.html',
  styleUrl: './productos-detalle.css'
})
export class ProductosDetalle {
  private productosService = inject(Productos);
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  filtro: string = '';

  ngOnInit(): void {
    this.productosService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.productosFiltrados = data;
      },
      error: (error) => console.log('Error al obtener productos', error)
    });
  }

  filtrarProductos() {
    const filtroLower = this.filtro.toLowerCase();
    this.productosFiltrados = this.productos.filter(prod =>
      prod.nombre_prod.toLowerCase().includes(filtroLower) ||
      prod.tipo_prod.toLowerCase().includes(filtroLower) ||
      String(prod.id_producto).includes(filtroLower)
    );
  }
}