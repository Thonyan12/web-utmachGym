import { Component, OnInit, OnDestroy } from '@angular/core'; 
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../services/auth';
import { CarritoService } from '../tienda/services/carrito';
import { NotificacionesMiembroService } from '../services/notificaciones-miembro'; // 👈 Agrega esto

@Component({
  selector: 'app-miembros-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './miembros-layout.html',
  styleUrls: ['./miembros-layout.css']
})
export class MiembrosLayout implements OnInit, OnDestroy { 
  currentUser: User | null = null;
  cartCount = 0;
  mostrarDialogoSalir = false;
  menuCollapsed = false;
  notificacionesNoLeidas = 0; 
  
  private notificationListener: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private carritoService: CarritoService,
    private notiService: NotificacionesMiembroService 
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    this.loadCartCount();
    this.loadNotificacionesNoLeidas(); 
    
    this.notificationListener = () => {
      this.loadCartCount(); 
      this.loadNotificacionesNoLeidas(); 
    };
    
    window.addEventListener('notificationsUpdated', this.notificationListener);
  }

  
  ngOnDestroy() {
    if (this.notificationListener) {
      window.removeEventListener('notificationsUpdated', this.notificationListener);
    }
  }

  
  private loadCartCount() {
    this.carritoService.getCart().subscribe({
      next: c => {
        this.cartCount = c.items.length;
        console.log('🛒 Contador de carrito actualizado:', this.cartCount);
      },
      error: err => {
        console.error('Error loading cart:', err);
        this.cartCount = 0;
      }
    });
  }

  private loadNotificacionesNoLeidas() {
    this.notiService.getMisNotificaciones().subscribe({
      next: res => {
        this.notificacionesNoLeidas = res.data.filter(n => !n.leido).length;
      },
      error: () => {
        this.notificacionesNoLeidas = 0;
      }
    });
  }

  obtenerPrimerNombre(): string {
    if (!this.currentUser?.nombre_completo) {
      return 'Usuario';
    }
    return this.currentUser.nombre_completo.split(' ')[0] || 'Usuario';
  }

  logout() {
    this.mostrarDialogoSalir = false;
    this.authService.logout();
    this.router.navigate(['/']);
  }

  volverInicio() {
    this.mostrarDialogoSalir = false;
    this.router.navigate(['/']);
  }

  toggleMenu() {
    this.menuCollapsed = !this.menuCollapsed;
  }
}
