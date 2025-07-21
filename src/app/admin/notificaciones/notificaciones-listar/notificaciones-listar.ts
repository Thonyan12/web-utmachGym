import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NotificacionesSidebarComponent } from '../notificaciones-sidebar/notificaciones-sidebar';
import { Notificacion, NotificacionesService } from '../services/notificaciones';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-notificaciones-listar',
    standalone: true,
    imports: [NotificacionesSidebarComponent, CommonModule, FormsModule, RouterModule],
    templateUrl: './notificaciones-listar.html',
    styleUrl: './notificaciones-listar.css'
})
export class NotificacionesListarComponent implements OnInit {
    notificaciones: Notificacion[] = [];
    notificacionesFiltradas: Notificacion[] = [];
    searchText: string = '';
    filtroTipo: string = 'todas'; // 'todas', 'enviadas', 'recibidas'

    constructor(private notificacionesService: NotificacionesService) { }

    ngOnInit(): void {
        this.cargarTodasLasNotificaciones();
    }

    cargarTodasLasNotificaciones(): void {
        this.notificacionesService.getAllUserNotifications().subscribe(res => {
            this.notificaciones = [...res.sent, ...res.received];
            this.aplicarFiltros();
        });
    }

    cargarNotificacionesEnviadas(): void {
        this.notificacionesService.getSentNotifications().subscribe(response => {
            this.notificaciones = response.data;
            this.aplicarFiltros();
        });
    }

    cargarNotificacionesRecibidas(): void {
        this.notificacionesService.getReceivedNotifications().subscribe(response => {
            this.notificaciones = response.data;
            this.aplicarFiltros();
        });
    }

    onFiltroChange(): void {
        switch(this.filtroTipo) {
            case 'enviadas':
                this.cargarNotificacionesEnviadas();
                break;
            case 'recibidas':
                this.cargarNotificacionesRecibidas();
                break;
            default:
                this.cargarTodasLasNotificaciones();
                break;
        }
    }

    aplicarFiltros(): void {
        this.notificacionesFiltradas = this.notificaciones.filter(notificacion => {
            const cumpleBusqueda = this.searchText === '' || 
                notificacion.contenido.toLowerCase().includes(this.searchText.toLowerCase()) ||
                notificacion.tipo.toLowerCase().includes(this.searchText.toLowerCase());
            
            return cumpleBusqueda;
        });
    }

    onSearchChange(): void {
        this.aplicarFiltros();
    }
}