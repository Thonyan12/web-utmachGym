import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface Producto {
id_producto?: number;
nombre_prod: string;
tipo_prod: string;
precio_prod: number;
stock: number;
estado: boolean;
f_registro: string;
}
@Injectable({
  providedIn: 'root'
})
export class Productos {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/productos';
  
  getProductos(): Observable<Producto[]> {
  return this.http.get<Producto[]>(this.apiUrl);
  }
  create(producto: Producto): Observable<any> {
  return this.http.post(this.apiUrl, producto);
}
  getById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }  

  update(producto: Producto): Observable<Producto> {
  return this.http.put<Producto>(`${this.apiUrl}/${producto.id_producto}`, producto);
}

delete(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`);
}
  constructor() { }
}
