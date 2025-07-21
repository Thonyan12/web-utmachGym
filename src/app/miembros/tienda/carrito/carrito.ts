import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { RouterLink }        from '@angular/router';
import { CarritoService, Cart, CartItem } from '../services/carrito';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  selector: 'app-carrito',
  templateUrl: './carrito.html',
})
export class CarritoComponent implements OnInit {
  
  cartData: Cart | null = null;

  constructor(
    private carritoSvc: CarritoService,
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.carritoSvc.getCart().subscribe(c => this.cartData = c);
  }

  update(item: CartItem, qty: number) {
    this.carritoSvc.updateItem(item.id_detalle_carrito, qty)
      .subscribe(() => this.load());
  }

  remove(item: any) {
    
    if (confirm(`¿Eliminar "${item.producto?.nombre_prod || 'este producto'}" del carrito?`)) {
      this.carritoSvc.removeItem(item.id_detalle_carrito).subscribe({
        next: () => {
          console.log('✅ Producto eliminado del carrito');
          this.load(); 
        },
        error: err => {
          console.error('❌ Error al eliminar:', err);
          alert('Error al eliminar el producto');
        }
      });
    }
  }

  checkout() {
    this.carritoSvc.checkout().subscribe(() => {
      alert('Compra realizada con éxito');
      this.load();
      this.refreshNotifications();
    });
  }
  private refreshNotifications() {
  window.dispatchEvent(new CustomEvent('notificationsUpdated'));
  console.log('🔔 Evento de notificaciones emitido después del checkout');
}
}
