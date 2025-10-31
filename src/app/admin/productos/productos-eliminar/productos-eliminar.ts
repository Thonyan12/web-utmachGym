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

  buscar(): void {
    if (!this.nombreProducto.trim()) {
      this.mensaje = 'Por favor ingresa el nombre del producto.';
      this.producto = null;
      return;
    }

    // Obtener todos los productos y buscar por nombre
    this.service.getProductos().subscribe({
      next: (productos) => {
        const nombreBuscado = this.nombreProducto.trim().toLowerCase();
        const productoEncontrado = productos.find(p => 
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
      },
      error: () => {
        this.producto = null;
        this.mensaje = 'Error al buscar el producto.';
        this.mostrarConfirmacion = false;
      }
    });
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
      },
      error: () => {
        this.mensaje = 'Error al eliminar el producto.';
        this.mostrarConfirmacion = false;
      }
    });
  }
}