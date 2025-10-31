import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Miembro, MiembrosService } from '../services/miembros';
import { MiembrosSidebarComponent } from '../miembros-sidebar/miembros-sidebar';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-miembros-detalle',
    standalone: true,
    imports: [CommonModule, MiembrosSidebarComponent, FormsModule],
    templateUrl: './miembros-detalle.html',
})
export class MiembrosDetalleComponent implements OnInit {
    private miembrosService = inject(MiembrosService);

    filtro: string = '';
    miembros: Miembro[] = [];
    miembrosFiltrados: Miembro[] = []; // inicialmente vacío: no mostrar nada hasta buscar
    selectedMiembroId: number | null = null;

    mostrarModal = false;
    miembroSeleccionado: Miembro | null = null;

    ngOnInit(): void {
        // cargamos todos los miembros en memoria, pero no mostramos nada hasta que el usuario busque
        this.miembrosService.getMiembros().subscribe({
            next: (data) => {
                this.miembros = data || [];
                this.miembrosFiltrados = []; // asegurar vacío al inicio
            },
            error: () => {
                this.miembros = [];
                this.miembrosFiltrados = [];
            }
        });
    }

    abrirModal(miembro: Miembro) {
        this.miembroSeleccionado = miembro;
        this.mostrarModal = true;
    }

    cerrarModal() {
        this.mostrarModal = false;
        this.miembroSeleccionado = null;
    }

    filtrarMiembros(): void {
        const q = (this.filtro || '').trim().toLowerCase();
        if (!q) {
            // no hay búsqueda: mantener la lista vacía
            this.miembrosFiltrados = [];
            this.selectedMiembroId = null;
            return;
        }

        this.miembrosFiltrados = this.miembros.filter(m =>
            (m.nombre || '').toString().toLowerCase().includes(q) ||
            (m.apellido1 || '').toString().toLowerCase().includes(q) ||
            (m.apellido2 || '').toString().toLowerCase().includes(q) ||
            (m.cedula || '').toString().toLowerCase().includes(q) ||
            (m.id_miembro != null && m.id_miembro.toString().includes(q))
        );

        // opcional: si hay solo un resultado, seleccionarlo
        if (this.miembrosFiltrados.length === 1) {
            this.selectedMiembroId = this.miembrosFiltrados[0].id_miembro || null;
        } else {
            this.selectedMiembroId = null;
        }
    }

    onSelectChange(): void {
        const id = this.selectedMiembroId;
        if (!id) return;
        const miembro = this.miembrosFiltrados.find(m => m.id_miembro === id);
        if (miembro) this.abrirModal(miembro);
    }
}

