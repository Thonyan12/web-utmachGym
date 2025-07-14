import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MiembrosService, Miembro } from '../services/miembros';
import { MiembrosSidebarComponent } from "../miembros-sidebar/miembros-sidebar";

@Component({
    selector: 'app-miembros-crear',
    standalone: true,
    imports: [CommonModule, FormsModule, MiembrosSidebarComponent],
    templateUrl: './miembros-crear.html'
})
export class MiembrosCrearComponent {
    private service = inject(MiembrosService);
    mensaje: string = '';
    miembro: Miembro = {
        cedula: '',
        nombre: '',
        apellido1: '',
        apellido2: '',
        edad: 0,
        direccion: '',
        altura: 0,
        peso: 0,
        contextura: '',
        objetivo: '',
        sexo: '',
        fecha_inscripcion: '',
        estado: true,
        correo: '',
        estado_registro: true,
        f_registro: ''
    };
guardar(form: NgForm): void {
    const miembroLimpio: any = { ...this.miembro };
    // Limpia campos numéricos y de fecha
    miembroLimpio.edad = miembroLimpio.edad ? Number(miembroLimpio.edad) : null;
    miembroLimpio.altura = miembroLimpio.altura ? Number(miembroLimpio.altura) : null;
    miembroLimpio.peso = miembroLimpio.peso ? Number(miembroLimpio.peso) : null;
    miembroLimpio.fecha_inscripcion = miembroLimpio.fecha_inscripcion || null;
    // Limpia strings vacíos
    Object.keys(miembroLimpio).forEach(k => {
        if (miembroLimpio[k] === '') miembroLimpio[k] = null;
    });

    this.service.create(miembroLimpio).subscribe({
        next: () => {
            this.mensaje = 'Miembro registrado correctamente.';
            form.resetForm();
        },
        error: (err) => {
            this.mensaje = 'Error al registrar el miembro.';
            console.error(err);
        }
    });
}
}