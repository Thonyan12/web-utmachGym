import { Component, OnInit } from '@angular/core';
import { ProductosSidebar } from '../productos-sidebar/productos-sidebar';
import { Producto, Productos } from '../services/productos';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-productos-listar',
  imports: [ ProductosSidebar, CommonModule, FormsModule],
  templateUrl: './productos-listar.html',
  styleUrl: './productos-listar.css'
})
export class ProductosListar implements OnInit {
  productos: Producto [] = [];
  searchText: string = '';

  constructor(private productosService: Productos) { }
  ngOnInit(): void {
    this.productosService.getProductos().subscribe(data => {
      this.productos = data;
    });
  }

}
