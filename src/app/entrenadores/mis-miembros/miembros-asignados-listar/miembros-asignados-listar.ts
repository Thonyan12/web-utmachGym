import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-miembros-asignados-listar',
  imports: [CommonModule, HttpClientModule, RouterModule,RouterModule],
  templateUrl: './miembros-asignados-listar.html',
    styleUrls: ['./miembros-asignados-listar.css'],
})
export class MiembrosAsignadosListar implements OnInit {
  miembros: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}
  asignarMiembros() {
    this.router.navigate(['/entrenadores/mis-miembros/asignar']);
  }
ngOnInit(): void {
const token = localStorage.getItem('token'); // Asegúrate de guardar el token en localStorage
  const headers = { Authorization: `Bearer ${token}` };

  this.http.get<any>('http://localhost:3000/api/entrenadores/mis-miembros', { headers }).subscribe({
    next: (data) => {
      console.log('Datos recibidos:', data);
      this.miembros = data.data || []; 
    },
    error: (err) => {
      console.log('Error:', err);
      this.miembros = [];
    }
  });
  }
}