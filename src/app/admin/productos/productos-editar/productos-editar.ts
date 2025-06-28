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

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.service.getById(id).subscribe({
        next: (data) => {
          this.producto = data;
        },
        error: () => {
          this.mensaje = 'Error al obtener el producto';
        }
      });
    }
  }

  actualizar(): void {
    if (this.producto) {
      this.service.update(this.producto).subscribe({
        next: () => {
          this.mensaje = 'Producto actualizado con éxito';
        },
        error: () => {
          this.mensaje = 'Error al actualizar el producto';
        }
      });
    }
  }
  
busqueda: string = '';
cargando: boolean = false;

buscarProducto(): void {
  this.mensaje = '';
  this.producto = null;
  this.cargando = true;
  const valor = this.busqueda.trim();
  if (!valor) {
    this.mensaje = 'Ingrese un ID o nombre para buscar.';
    this.cargando = false;
    return;
  }
  // Verificar si el valor es un número
  const id = Number(valor);
  if (!isNaN(id)) {
    this.service.getById(id).subscribe({
      next: (data) => {
        this.producto = data;
        this.cargando = false;
      },
      error: () => {
        this.mensaje = 'No se encontró el producto.';
        this.cargando = false;
      }
    });
  } else {
    this.service.getProductos().subscribe({
      next: (productos) => {
        const encontrado = productos.find(p => p.nombre_prod.toLowerCase() === valor.toLowerCase());
        if (encontrado) {
          this.producto = encontrado;
        } else {
          this.mensaje = 'No se encontró el producto.';
        }
        this.cargando = false;
      },
      error: () => {
        this.mensaje = 'Error al buscar el producto.';
        this.cargando = false;
      }
    });
  }
}
}