import { Component, OnInit }   from '@angular/core';
import { CommonModule }        from '@angular/common';
import { FormsModule }         from '@angular/forms';
import { Producto, Productos } from '../../../admin/productos/services/productos';
import { CarritoService }      from '../services/carrito';

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './producto-list.html',
  styleUrls: ['./producto-list.css']
})
export class ProductoListComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  cantidades: Record<number, number> = {};
  
  // ✅ Nuevas propiedades para filtrado
  filtroTexto: string = '';
  categoriaSeleccionada: string = '';
  categorias: string[] = [];

  constructor(
    private productoSvc: Productos,
    private carritoSvc: CarritoService
  ) {}

  ngOnInit() {
    this.productoSvc.getProductos().subscribe(productos => {
      // Filtrar solo productos activos (estado = true)
      const productosActivos = productos.filter(p => p.estado === true);
      
      // Ordenar alfabéticamente por nombre
      this.productos = productosActivos.sort((a, b) => 
        a.nombre_prod.localeCompare(b.nombre_prod)
      );
      
      // Extraer categorías únicas solo de productos activos
      this.categorias = [...new Set(productosActivos.map(p => p.tipo_prod))].sort();
      
      // Mostrar todos los productos activos inicialmente
      this.productosFiltrados = this.productos;
    });
  }

  // ✅ Método para filtrar productos
  filtrarProductos() {
    this.productosFiltrados = this.productos.filter(producto => {
      const coincideTexto = producto.nombre_prod.toLowerCase()
        .includes(this.filtroTexto.toLowerCase()) ||
        producto.tipo_prod.toLowerCase()
        .includes(this.filtroTexto.toLowerCase());
      
      const coincideCategoria = !this.categoriaSeleccionada || 
        producto.tipo_prod === this.categoriaSeleccionada;
      
      return coincideTexto && coincideCategoria;
    });
  }

  // ✅ Limpiar filtros
  limpiarFiltros() {
    this.filtroTexto = '';
    this.categoriaSeleccionada = '';
    this.productosFiltrados = this.productos;
  }

  addToCart(p: Producto) {
    const qty = this.cantidades[p.id_producto!] || 1;
    console.log('🛒 Agregando:', { productId: p.id_producto, quantity: qty });
    
    this.carritoSvc.addItem(p.id_producto!, qty).subscribe({
      next: () => {
        alert(`✅ Agregaste ${qty}×${p.nombre_prod} al carrito`);
        // ✅ Resetear cantidad después de agregar
        this.cantidades[p.id_producto!] = 1;
      },
      error: err => {
        console.error('❌ Error:', err);
        alert('❌ ' + (err.error?.message || err.message));
      }
    });
  }
}
