import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Productos, Producto } from '../services/productos';
import { ProductosSidebar } from "../productos-sidebar/productos-sidebar";

@Component({
  selector: 'app-productos-crear',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductosSidebar, RouterLink],
  templateUrl: './productos-crear.html'
})
export class ProductosCrearComponent {
  private service = inject(Productos);
  mensaje: string = '';
  producto: Producto = {
    nombre_prod: '',
    tipo_prod: '',
    precio_prod: 0,
    stock: 0,
    estado: true,
    f_registro: ''
  };

guardar(form: NgForm): void {
  this.service.create(this.producto).subscribe({
    next: () => {
      this.mensaje = 'Producto registrado correctamente.';
      form.resetForm(); // Esto limpia el formulario y los estados de validación
    },
    error: () => {
      this.mensaje = 'Error al registrar el producto.';
    }
  });
}
}