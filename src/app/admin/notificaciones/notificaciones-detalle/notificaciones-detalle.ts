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
        this.notificacionesService.getNotificaciones().subscribe({
            next: (data) => {
                this.notificaciones = (data || []).filter(noti => !!noti);
                this.notificacionesFiltradas = this.notificaciones;
            },
            error: (error) => console.log('Error al obtener notificaciones', error)
        });
    }

    filtrarNotificaciones() {
        const filtroLower = this.filtro.toLowerCase();
        this.notificacionesFiltradas = this.notificaciones.filter(noti =>
            !!noti && (
                (noti.tipo || '').toLowerCase().includes(filtroLower) ||
                (noti.contenido || '').toLowerCase().includes(filtroLower) ||
                String(noti.id_notificacion || '').includes(filtroLower)
            )
        );
    }
}