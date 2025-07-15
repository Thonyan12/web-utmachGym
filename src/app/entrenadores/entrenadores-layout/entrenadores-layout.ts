import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../services/auth';

@Component({
  selector: 'app-entrenadores-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './entrenadores-layout.html',
  styleUrls: ['./entrenadores-layout.css']
})
export class EntrenadoresLayout implements OnInit {
  currentUser: User | null = null;
  mostrarDialogoSalir = false;
  menuCollapsed = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  // Método para obtener el primer nombre
  obtenerPrimerNombre(): string {
    if (!this.currentUser?.nombre_completo) {
      return 'Coach';
    }
    return this.currentUser.nombre_completo.split(' ')[0] || 'Coach';
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
