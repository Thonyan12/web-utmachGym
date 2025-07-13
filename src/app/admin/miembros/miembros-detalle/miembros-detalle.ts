import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Miembro, MiembrosService } from '../services/miembros';
import { MiembrosSidebarComponent } from '../miembros-sidebar/miembros-sidebar';

@Component({
    selector: 'app-miembros-detalle',
    standalone: true,
    imports: [CommonModule, RouterLink, MiembrosSidebarComponent],
    templateUrl: './miembros-detalle.html',
})
export class MiembrosDetalle {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private miembrosService = inject(MiembrosService);

    miembro: Miembro | undefined;

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.miembrosService.getById(Number(id)).subscribe({
                next: (data) => {
                    this.miembro = data;
                },
                error: (error) => {
                    console.error('Error al obtener el miembro', error);
                    this.router.navigate(['/admin/miembros']);
                }
            });
        }
    }
}

