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
    styleUrls: ['./notificaciones-listar.css']
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
            // El backend puede devolver { sent: [], received: [] } o un array directamente.
            if (Array.isArray(res)) {
                this.notificaciones = res as any[];
            } else if (res && (res.sent || res.received)) {
                this.notificaciones = [...(res.sent || []), ...(res.received || [])];
            } else {
                // Fallback: intentar interpretar como objeto con data
                const maybeData = (res as any).data;
                if (Array.isArray(maybeData)) this.notificaciones = maybeData;
                else this.notificaciones = [];
            }
            // Ordenar por fecha_envio desc (más recientes primero) si el campo existe
            try {
                this.notificaciones.sort((a: any, b: any) => new Date(b.fecha_envio).getTime() - new Date(a.fecha_envio).getTime());
            } catch (e) { /* ignore sort errors */ }
            this.aplicarFiltros();
        }, err => {
            console.error('Error cargando notificaciones (all):', err);
            this.notificaciones = [];
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