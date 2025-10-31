import { Component, OnInit } from '@angular/core';
import { ProductosSidebar } from '../productos-sidebar/productos-sidebar';
import { Producto, Productos } from '../services/productos';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-productos-listar',
  imports: [ ProductosSidebar, CommonModule, FormsModule, RouterLink],
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

  // Formatear fecha a formato DIA-MES-AÑO
  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    
    const date = new Date(fecha);
    const dia = date.getDate().toString().padStart(2, '0');
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const anio = date.getFullYear();
    
    return `${dia}-${mes}-${anio}`;
  }

}
