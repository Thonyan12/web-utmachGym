import { Component, inject } from '@angular/core';
import { ProductosSidebar } from '../productos-sidebar/productos-sidebar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto, Productos } from '../services/productos';

@Component({
  selector: 'app-productos-eliminar',
  imports: [CommonModule, FormsModule,ProductosSidebar],
  templateUrl: './productos-eliminar.html',
  styleUrl: './productos-eliminar.css'
})
export class ProductosEliminar {
  private service = inject(Productos);
  nombreProducto: string = '';
  producto: Producto | null = null;
  mensaje: string = '';
  mostrarConfirmacion: boolean = false;
  todosLosProductos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  mostrarSugerencias: boolean = false;

  ngOnInit() {
    this.service.getProductos().subscribe({
      next: (productos) => {
        this.todosLosProductos = productos;
      },
      error: () => {
        console.error('Error al cargar productos');
      }
    });
  }

  filtrarProductos(): void {
    const textoBusqueda = this.nombreProducto.trim().toLowerCase();
    
    if (!textoBusqueda) {
      this.productosFiltrados = [];
      this.mostrarSugerencias = false;
      return;
    }

    this.productosFiltrados = this.todosLosProductos.filter(p =>
      p.nombre_prod.toLowerCase().includes(textoBusqueda) ||
      p.tipo_prod.toLowerCase().includes(textoBusqueda)
    ).slice(0, 10);

    this.mostrarSugerencias = this.productosFiltrados.length > 0;
  }

  seleccionarProducto(producto: Producto): void {
    this.nombreProducto = producto.nombre_prod;
    this.mostrarSugerencias = false;
    this.producto = { ...producto };
    this.mensaje = '';
    this.mostrarConfirmacion = false;
  }

  buscar(): void {
    if (!this.nombreProducto.trim()) {
      this.mensaje = 'Por favor ingresa el nombre del producto.';
      this.producto = null;
      return;
    }

    this.mostrarSugerencias = false;
    const nombreBuscado = this.nombreProducto.trim().toLowerCase();
    const productoEncontrado = this.todosLosProductos.find(p => 
      p.nombre_prod.toLowerCase() === nombreBuscado
    );

    if (productoEncontrado) {
      this.producto = productoEncontrado;
      this.mensaje = '';
      this.mostrarConfirmacion = false;
    } else {
      this.producto = null;
      this.mensaje = `No se encontró un producto con el nombre "${this.nombreProducto}".`;
      this.mostrarConfirmacion = false;
    }
  }

  confirmarEliminar(): void {
    this.mostrarConfirmacion = true;
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacion = false;
  }

  eliminar(): void {
    if (!this.producto || !this.producto.id_producto) {
      this.mensaje = 'Primero busque un producto válido para eliminar.';
      return;
    }
    
    this.service.delete(this.producto.id_producto).subscribe({
      next: () => {
        this.mensaje = `Producto "${this.producto?.nombre_prod}" eliminado correctamente.`;
        this.producto = null;
        this.nombreProducto = '';
        this.mostrarConfirmacion = false;
        this.service.getProductos().subscribe(productos => {
          this.todosLosProductos = productos;
        });
      },
      error: () => {
        this.mensaje = 'Error al eliminar el producto.';
        this.mostrarConfirmacion = false;
      }
    });
  }

  limpiarFormulario(): void {
    this.producto = null;
    this.nombreProducto = '';
    this.mensaje = '';
    this.productosFiltrados = [];
    this.mostrarSugerencias = false;
    this.mostrarConfirmacion = false;
  }
}