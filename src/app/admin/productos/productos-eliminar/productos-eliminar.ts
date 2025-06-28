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
  idProducto: number = 0;
  producto: Producto| null = null;
  mensaje: string = '';
  mostrarConfirmacion: boolean = false;

  buscar(): void {
    if (this.idProducto <= 0) {
      this.mensaje = 'El ID del producto debe ser un número positivo.';
      this.producto = null;
      return;
    }
    this.service.getById(this.idProducto).subscribe({
      next: (data) => {
        this.producto = data;
        this.mensaje = '';
        this.mostrarConfirmacion = false;
      },
      error: () => {
        this.producto = null;
        this.mensaje = 'No se encontró un producto con ese ID.';
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
    if (!this.producto) {
      this.mensaje = 'Primero busque un producto válido para eliminar.';
      return;
    }
    this.service.delete(this.idProducto).subscribe({
      next: () => {
        this.mensaje = 'Producto eliminado correctamente.';
        this.producto = null;
        this.idProducto = 0;
        this.mostrarConfirmacion = false;
      },
      error: () => {
        this.mensaje = 'Error al eliminar el producto.';
        this.mostrarConfirmacion = false;
      }
    });
  }
}