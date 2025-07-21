import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-mis-notificaciones',
imports: [CommonModule, HttpClientModule],
  templateUrl: './mis-notificaciones.html',
  styleUrl: './mis-notificaciones.css'
})
export class MisNotificaciones implements OnInit {
  notificaciones: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('/api/notificaciones/mis-notificaciones').subscribe({
      next: (data) => this.notificaciones = data,
      error: () => this.notificaciones = []
    });
  }
}