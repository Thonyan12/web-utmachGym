import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../services/auth';

@Component({
  selector: 'app-miembros-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './miembros-layout.html',
  styleUrls: ['./miembros-layout.css']
})
export class MiembrosLayout implements OnInit {
  currentUser: User | null = null;
  mostrarDialogoSalir = false;
  menuCollapsed = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  // ✅ Método para obtener el primer nombre de forma segura
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
