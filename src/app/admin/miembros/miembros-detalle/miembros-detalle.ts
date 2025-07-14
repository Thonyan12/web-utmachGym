import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Miembro, MiembrosService } from '../services/miembros';
import { MiembrosSidebarComponent } from '../miembros-sidebar/miembros-sidebar';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-miembros-detalle',
    standalone: true,
    imports: [CommonModule, RouterLink, MiembrosSidebarComponent, FormsModule],
    templateUrl: './miembros-detalle.html',
})
export class MiembrosDetalleComponent implements OnInit {
    private miembrosService = inject(MiembrosService);

    filtro: string = '';
    miembros: Miembro[] = [];
    miembrosFiltrados: Miembro[] = [];

    ngOnInit(): void {
        this.miembrosService.getMiembros().subscribe({
            next: (data) => {
                this.miembros = data;
                this.filtrarMiembros();
            }
        });
    }
    // ...existing code...
    mostrarModal = false;
    miembroSeleccionado: Miembro | null = null;

    abrirModal(miembro: Miembro) {
        this.miembroSeleccionado = miembro;
        this.mostrarModal = true;
    }

    cerrarModal() {
        this.mostrarModal = false;
        this.miembroSeleccionado = null;
    }
    // ...existing code...
    filtrarMiembros(): void {
        const filtroLower = this.filtro.toLowerCase();
        this.miembrosFiltrados = this.miembros.filter(m =>
            m.nombre.toLowerCase().includes(filtroLower) ||
            m.apellido1.toLowerCase().includes(filtroLower) ||
            m.apellido2.toLowerCase().includes(filtroLower) ||
            m.cedula.toLowerCase().includes(filtroLower) ||
            (m.id_miembro && m.id_miembro.toString().includes(filtroLower))
        );
    }
}