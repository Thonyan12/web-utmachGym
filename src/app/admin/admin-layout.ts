// admin-layout.ts
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService, User } from '../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css']
})
export class AdminLayout implements OnInit {
  currentUser: User | null = null;
  mostrarDialogoSalir = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    // Obtener usuario actual
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
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
}