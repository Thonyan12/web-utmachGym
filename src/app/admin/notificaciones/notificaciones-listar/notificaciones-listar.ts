import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NotificacionesSidebarComponent } from '../notificaciones-sidebar/notificaciones-sidebar';
import { Notificacion, NotificacionesService } from '../services/notificaciones';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-notificaciones-listar',
    standalone: true,
    imports: [NotificacionesSidebarComponent, CommonModule, FormsModule],
    templateUrl: './notificaciones-listar.html',
    styleUrl: './notificaciones-listar.css'
})
export class NotificacionesListarComponent implements OnInit {
    notificaciones: Notificacion[] = [];
    searchText: string = '';

    constructor(private notificacionesService: NotificacionesService) { }

    ngOnInit(): void {
        this.notificacionesService.getNotificaciones().subscribe(data => {
            this.notificaciones = data;
        });
    }
}