import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { RouterLink }        from '@angular/router';
import { CarritoService, Cart, CartItem } from '../services/carrito';
import { Productos } from '../../../admin/productos/services/productos';
import { forkJoin } from 'rxjs';

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
    private productosSvc: Productos,
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.carritoSvc.getCart().subscribe(cart => {
      // Cargar los datos de productos que no vengan completos
      const itemsNeedingProducts = cart.items.filter(item => !item.producto);
      
      if (itemsNeedingProducts.length > 0) {
        const productRequests = itemsNeedingProducts.map(item => 
          this.productosSvc.getById(item.id_producto)
        );
        
        forkJoin(productRequests).subscribe(productos => {
          itemsNeedingProducts.forEach((item, index) => {
            item.producto = productos[index];
          });
          this.cartData = cart;
        });
      } else {
        this.cartData = cart;
      }
    });
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
