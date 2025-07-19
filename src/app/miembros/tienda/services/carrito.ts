import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../../services/auth';
import { Producto } from '../../../admin/productos/services/productos';



export interface CartItem {
  id_detalle_carrito: number;
  id_carrito: number;
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  producto?: Producto;    // <- campo nuevo
}

export interface Cart {
  cart: {
    id_carrito: number;
    total_pago: number;
    procesado: boolean;
  };
  items: CartItem[];
}

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private baseUrl = 'http://localhost:3000/api/miembros';

  constructor(
    private http: HttpClient,
    private auth: AuthService   
  ) {}

  private memberId(): number {
   
    const user = this.auth.getCurrentUser();
    if (!user?.id_miembro) {
      throw new Error('Usuario no es miembro o no está autenticado');
    }
    return user.id_miembro;
  }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(
      `${this.baseUrl}/${this.memberId()}/cart`
    );
  }

  addItem(productId: number, quantity: number): Observable<CartItem> {
    return this.http.post<CartItem>(
      `${this.baseUrl}/${this.memberId()}/cart/item`,
      { productId, quantity }
    );
  }

  updateItem(itemId: number, quantity: number): Observable<CartItem> {
    return this.http.put<CartItem>(
      `${this.baseUrl}/${this.memberId()}/cart/item/${itemId}`,
      { quantity }
    );
  }

  removeItem(itemId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/${this.memberId()}/cart/item/${itemId}`
    );
  }

  checkout(): Observable<Cart> {
    return this.http.post<Cart>(
      `${this.baseUrl}/${this.memberId()}/cart/checkout`,
      {}
    );
  }
}
