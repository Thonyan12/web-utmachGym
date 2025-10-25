import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-miembro-detalle',
  templateUrl: './miembro-detalle.html',
  styleUrls: ['./miembro-detalle.css'],
  imports: [CommonModule, RouterModule],
})
export class MiembroDetalle implements OnInit {
  miembro: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // Obtiene el ID de la URL
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    
    this.http.get<any>(`http://localhost:3000/api/miembros/${id}`, { headers }).subscribe({
      next: (data) => {
        console.log('Datos recibidos del miembro:', data);
        this.miembro = data; // Asigna los datos del miembro directamente
      },
      error: (err) => {
        console.error('Error al obtener detalles del miembro:', err);
      }
    });
  }
}

