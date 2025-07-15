import { Component, inject } from '@angular/core';
import { NotificacionesSidebarComponent } from '../notificaciones-sidebar/notificaciones-sidebar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Notificacion, NotificacionesService } from '../services/notificaciones';

@Component({
    selector: 'app-notificaciones-eliminar',
    standalone: true,
    imports: [CommonModule, FormsModule, NotificacionesSidebarComponent],
    templateUrl: './notificaciones-eliminar.html',
    styleUrl: './notificaciones-eliminar.css'
})
export class NotificacionesEliminarComponent {
    private service = inject(NotificacionesService);
    idNotificacion: number = 0;
    notificacion: Notificacion | null = null;
    mensaje: string = '';
    mostrarConfirmacion: boolean = false;

    buscar(): void {
        if (this.idNotificacion <= 0) {
            this.mensaje = 'El ID de la notificación debe ser un número positivo.';
            this.notificacion = null;
            return;
        }
        this.service.getById(this.idNotificacion).subscribe({
            next: (data) => {
                this.notificacion = data;
                this.mensaje = '';
                this.mostrarConfirmacion = false;
            },
            error: () => {
                this.notificacion = null;
                this.mensaje = 'No se encontró una notificación con ese ID.';
                this.mostrarConfirmacion = false;
            }
        });
    }

    confirmarEliminar(): void {
        this.mostrarConfirmacion = true;
    }

    cancelarEliminar(): void {
        this.mostrarConfirmacion = false;
    }

    eliminar(): void {
        if (!this.notificacion) {
            this.mensaje = 'Primero busque una notificación válida para eliminar.';
            return;
        }
        this.service.delete(this.idNotificacion).subscribe({
            next: () => {
                this.mensaje = 'Notificación eliminada correctamente.';
                this.notificacion = null;
                this.idNotificacion = 0;
                this.mostrarConfirmacion = false;
            },
            error: () => {
                this.mensaje = 'Error al eliminar la notificación.';
                this.mostrarConfirmacion = false;
            }
        });
    }
}