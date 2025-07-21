import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-mi-perfil-entrenador',
 imports: [CommonModule, HttpClientModule],
  templateUrl: './mi-perfil-entrenador.html',
  styleUrl: './mi-perfil-entrenador.css'
})
export class MiPerfilEntrenador implements OnInit {
  entrenador: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('/api/entrenadores/mi-perfil').subscribe({
      next: (data) => this.entrenador = data,
      error: () => this.entrenador = null
    });
  }
}