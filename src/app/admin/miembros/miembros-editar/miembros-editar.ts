import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Miembro, MiembrosService } from '../services/miembros';
import { MiembrosSidebarComponent } from '../miembros-sidebar/miembros-sidebar';

@Component({
    selector: 'app-miembros-editar',
    imports: [CommonModule, FormsModule, MiembrosSidebarComponent],
    templateUrl: './miembros-editar.html',
})
export class MiembrosEditarComponent {
    private service = inject(MiembrosService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    miembro: Miembro | null = null;
    mensaje: string = '';
    busqueda: string = '';
    cargando: boolean = false;

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.busqueda = id;
            this.buscarMiembro();
        }
    }

    buscarMiembro(): void {
        this.mensaje = '';
        this.miembro = null;
        this.cargando = true;
        const valor = this.busqueda.trim();
        if (!valor) {
            this.mensaje = 'Ingrese un ID, cédula o nombre para buscar.';
            this.cargando = false;
            return;
        }

        const id = Number(valor);
        if (!isNaN(id)) {
            this.service.getById(id).subscribe({
                next: (data) => {
                    this.miembro = data;
                    this.cargando = false;
                },
                error: () => {
                    this.buscarPorCedulaONombre(valor);
                }
            });
        } else {
            this.buscarPorCedulaONombre(valor);
        }
    }

    private buscarPorCedulaONombre(valor: string): void {
        this.service.getMiembros().subscribe({
            next: (miembros) => {
                const valorLower = valor.toLowerCase();
                const encontrado = miembros.find(m =>
                    m.cedula === valor ||
                    m.nombre.toLowerCase().includes(valorLower) ||
                    `${m.nombre.toLowerCase()} ${m.apellido1.toLowerCase()}`.includes(valorLower)
                );

                if (encontrado) {
                    this.miembro = encontrado;
                } else {
                    this.mensaje = 'No se encontró el miembro.';
                }
                this.cargando = false;
            },
            error: () => {
                this.mensaje = 'Error al buscar el miembro.';
                this.cargando = false;
            }
        });
    }

    actualizar(): void {
        if (this.miembro) {
            this.service.update(this.miembro).subscribe({
                next: () => {
                    this.mensaje = 'Miembro actualizado con éxito.';
                    setTimeout(() => this.router.navigate(['/admin/miembros']), 2000);
                },
                error: () => {
                    this.mensaje = 'Error al actualizar el miembro.';
                }
            });
        }
    }
}

