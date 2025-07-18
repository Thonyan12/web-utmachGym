import { FormsModule } from '@angular/forms';
import { Component, inject, OnInit } from '@angular/core';
import { NotificacionesSidebarComponent } from '../notificaciones-sidebar/notificaciones-sidebar';
import { Notificacion, NotificacionesService } from '../services/notificaciones';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-notificaciones-detalle',
    standalone: true,
    imports: [CommonModule, NotificacionesSidebarComponent, RouterModule,FormsModule],
    templateUrl: './notificaciones-detalle.html',
    styleUrls: ['./notificaciones-detalle.css']
})
export class NotificacionesDetalleComponent implements OnInit {
    private notificacionesService = inject(NotificacionesService);
    mostrarModal: boolean = false;
    notificacionSeleccionada: Notificacion | null = null;
    notificaciones: Notificacion[] = [];
    notificacionesFiltradas: Notificacion[] = [];
    filtro: string = '';

    abrirModal(notificacion: Notificacion): void {
        this.notificacionSeleccionada = notificacion;
        this.mostrarModal = true;
    }

    cerrarModal(): void {
        this.mostrarModal = false;
        this.notificacionSeleccionada = null;
    }

    ngOnInit(): void {
        this.notificacionesService.getAllUserNotifications().subscribe({
            next: res => {
                // Unimos enviadas y recibidas
                this.notificaciones = [...res.sent, ...res.received];
                this.notificacionesFiltradas = this.notificaciones;
            },
            error: err => console.log('Error al obtener notificaciones', err)
        });
    }

    filtrarNotificaciones(): void {
        const term = this.filtro.toLowerCase().trim();
        this.notificacionesFiltradas = this.notificaciones.filter(noti => {
            const id   = noti.id_notificacion?.toString() ?? '';
            const tipo = noti.tipo.toLowerCase();
            const cont = noti.contenido.toLowerCase();
            // si term es vacío => true (muestra todo), o coincide con id, tipo o contenido
            return term === '' 
                || id.includes(term) 
                || tipo.includes(term) 
                || cont.includes(term);
        });
    }
}