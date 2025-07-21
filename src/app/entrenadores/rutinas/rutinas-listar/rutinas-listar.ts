import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-rutinas-listar',
 imports: [CommonModule, HttpClientModule],
  templateUrl: './rutinas-listar.html',
  styleUrl: './rutinas-listar.css'
})
export class RutinasListar implements OnInit {
  rutinas: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('/api/rutinas').subscribe({
      next: (data) => this.rutinas = data,
      error: () => this.rutinas = []
    });
  }
}