import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NotificacionesService, Notificacion } from '../services/notificaciones';
import { NotificacionesSidebarComponent } from "../notificaciones-sidebar/notificaciones-sidebar";
import { UserFilterPipe } from '../pipes/user-filter.pipe';
import { UsuariosService, Usuario } from '../services/usuarios';

@Component({
    selector: 'app-notificaciones-crear',
    standalone: true,
    imports: [CommonModule, FormsModule, NotificacionesSidebarComponent, UserFilterPipe],
    templateUrl: './notificaciones-crear.html'
})


export class NotificacionesCrearComponent {
    private service = inject(NotificacionesService);
    private usuariosService = inject(UsuariosService);

    usuarioActual = { id_usuario: 1, rol: 'admin' }; // Simulación, reemplaza por tu lógica real

    mensaje: string = '';
    notificacion: Notificacion = {
        id_usuario: 0,
        id_usuario_remitente: 0,
        tipo: '',
        contenido: '',
        fecha_envio: '',
        leido: false,
        estado: true,
        f_registro: ''
    };


    usuarios: Usuario[] = [];
    filtroUsuario: string = '';

    ngOnInit(): void {
        this.usuariosService.getUsuarios().subscribe(data => {
            this.usuarios = data;
            console.log(this.usuarios); // <-- agrega esto
        });
    }


    // ...existing code...
    crearNotificacion(form: NgForm): void {
        this.notificacion.id_usuario_remitente = this.usuarioActual.id_usuario;
        // Asigna la fecha actual en formato YYYY-MM-DD
        this.notificacion.fecha_envio = new Date().toISOString().slice(0, 10);

        const { f_registro, id_notificacion, ...notiSinFRegistro } = this.notificacion;
        console.log('Datos a enviar:', notiSinFRegistro);

        this.service.create(notiSinFRegistro).subscribe({
            next: () => {
                this.mensaje = 'Notificación registrada correctamente.';
                form.resetForm();
            },
            error: () => {
                this.mensaje = 'Error al registrar la notificación.';
            }
        });
    }
}