import { Component, OnInit } from '@angular/core'; // Importa Component y OnInit
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-miembro-detalle',
  templateUrl: './miembro-detalle.html',
  imports: [CommonModule], // Importa CommonModule para usar directivas como ngClass
})
export class MiembroDetalle implements OnInit {
  miembro: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // Obtiene el ID de la URL
    this.http.get<any>(`http://localhost:3000/api/miembros/${id}`).subscribe({
      next: (data) => {
        this.miembro = data.data; // Asigna los datos del miembro
      },
      error: (err) => {
        console.log('Error al obtener detalles:', err);
      }
    });
  }
}