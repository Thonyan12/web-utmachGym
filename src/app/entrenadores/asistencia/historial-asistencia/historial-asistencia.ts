import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-historial-asistencia',
imports: [CommonModule, HttpClientModule],
  templateUrl: './historial-asistencia.html',
  styleUrls: ['./historial-asistencia.css']
})
export class HistorialAsistencia implements OnInit {
  asistencias: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('/api/asistencia').subscribe({
      next: (data) => this.asistencias = data,
      error: () => this.asistencias = []
    });
  }
}