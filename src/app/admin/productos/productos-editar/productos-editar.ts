import { Component, inject } from '@angular/core';
import { ProductosSidebar } from '../productos-sidebar/productos-sidebar';
import { Producto, Productos } from '../services/productos';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-productos-editar',
  imports: [CommonModule, FormsModule,ProductosSidebar],
  templateUrl: './productos-editar.html',
  styleUrl: './productos-editar.css'
})
export class ProductosEditar {
  private service = inject(Productos);
  private route = inject(ActivatedRoute);

  producto: Producto | null = null;
  mensaje: string = '';
  busqueda: string = '';
  cargando: boolean = false;
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
    const textoBusqueda = this.busqueda.trim().toLowerCase();
    
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
    this.busqueda = producto.nombre_prod;
    this.mostrarSugerencias = false;
    this.producto = { ...producto };
    this.mensaje = '';
  }

  buscarProducto(): void {
    this.mensaje = '';
    this.cargando = true;
    this.mostrarSugerencias = false;
    
    const valor = this.busqueda.trim();
    
    if (!valor) {
      this.mensaje = 'Por favor ingresa el nombre del producto.';
      this.cargando = false;
      return;
    }

    const encontrado = this.todosLosProductos.find(p => 
      p.nombre_prod.toLowerCase() === valor.toLowerCase()
    );

    if (encontrado) {
      this.producto = { ...encontrado };
      this.cargando = false;
    } else {
      this.producto = null;
      this.mensaje = `No se encontró un producto con el nombre "${valor}".`;
      this.cargando = false;
    }
  }

  actualizar(): void {
    if (this.producto) {
      this.service.update(this.producto).subscribe({
        next: () => {
          this.mensaje = 'Producto actualizado con éxito';
          this.service.getProductos().subscribe(productos => {
            this.todosLosProductos = productos;
          });
        },
        error: () => {
          this.mensaje = 'Error al actualizar el producto';
        }
      });
    }
  }

  limpiarFormulario(): void {
    this.producto = null;
    this.busqueda = '';
    this.mensaje = '';
    this.productosFiltrados = [];
    this.mostrarSugerencias = false;
  }
}