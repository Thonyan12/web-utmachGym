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
    styleUrl: './miembros-editar.css'
})
export class MiembrosEditarComponent {
  private service = inject(MiembrosService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  miembro: Miembro | null = null;
  mensaje: string = '';
  busqueda: string = '';
  cargando: boolean = false;
  todosLosMiembros: Miembro[] = [];
  miembrosFiltrados: Miembro[] = [];
  mostrarSugerencias: boolean = false;

  ngOnInit() {
    if ((this.service as any).getMiembros) {
      (this.service as any).getMiembros().subscribe({
        next: (data: Miembro[]) => this.todosLosMiembros = data || [],
        error: (err: any) => {
          console.error('Error cargando miembros:', err);
          this.todosLosMiembros = [];
        }
      });
    }
  }

  filtrarMiembros(): void {
    const textoBusqueda = this.busqueda.trim().toLowerCase();
    
    if (!textoBusqueda) {
      this.miembrosFiltrados = [];
      this.mostrarSugerencias = false;
      return;
    }

    this.miembrosFiltrados = this.todosLosMiembros.filter(m =>
      (m.cedula || '').toString().toLowerCase().includes(textoBusqueda) ||
      (m.nombre || '').toString().toLowerCase().includes(textoBusqueda) ||
      (m.apellido1 || '').toString().toLowerCase().includes(textoBusqueda) ||
      (m.apellido2 || '').toString().toLowerCase().includes(textoBusqueda) ||
      (`${m.nombre} ${m.apellido1} ${m.apellido2}`).toLowerCase().includes(textoBusqueda)
    ).slice(0, 10);

    this.mostrarSugerencias = this.miembrosFiltrados.length > 0;
  }

  seleccionarMiembro(miembro: Miembro): void {
    this.busqueda = `${miembro.nombre} ${miembro.apellido1} ${miembro.apellido2}`;
    this.mostrarSugerencias = false;
    this.setMiembro(miembro);
    this.mensaje = '';
  }

  buscarMiembro(): void {
    this.mensaje = '';
    this.miembro = null;
    this.cargando = true;
    this.mostrarSugerencias = false;
    
    const valor = this.busqueda.trim();
    
    if (!valor) {
      this.mensaje = 'Por favor ingresa cédula o nombre para buscar.';
      this.cargando = false;
      return;
    }

    const encontrados = this.todosLosMiembros.filter(m =>
      (m.cedula || '').toString().toLowerCase() === valor.toLowerCase() ||
      (`${m.nombre} ${m.apellido1} ${m.apellido2}`).toLowerCase() === valor.toLowerCase()
    );

    if (encontrados.length === 1) {
      this.cargando = false;
      this.setMiembro(encontrados[0]);
    } else if (encontrados.length > 1) {
      this.cargando = false;
      this.miembrosFiltrados = encontrados;
      this.mostrarSugerencias = true;
      this.mensaje = 'Varios miembros encontrados, selecciona uno del listado.';
    } else {
      this.cargando = false;
      this.mensaje = `No se encontró un miembro con "${valor}".`;
    }
  }

  private setMiembro(m: Miembro): void {
    const rawSexo = (m as any).sexo ?? (m as any).genero ?? (m as any).sexo_miembro ?? (m as any).gender ?? null;

    let sexoNorm: 'M' | 'F' | null = null;
    if (rawSexo != null) {
      if (typeof rawSexo === 'string') {
        const s = rawSexo.trim().toLowerCase();
        if (['m', 'masculino', 'male', 'hombre'].includes(s)) sexoNorm = 'M';
        else if (['f', 'femenino', 'female', 'mujer'].includes(s)) sexoNorm = 'F';
      } else if (typeof rawSexo === 'boolean') {
        sexoNorm = rawSexo ? 'M' : 'F';
      } else if (typeof rawSexo === 'number') {
        sexoNorm = rawSexo === 1 ? 'M' : 'F';
      }
    }

    this.miembro = {
      id_miembro: m.id_miembro,
      cedula: m.cedula,
      nombre: m.nombre,
      apellido1: m.apellido1,
      apellido2: m.apellido2,
      correo: m.correo,
      direccion: m.direccion,
      edad: m.edad,
      altura: m.altura,
      peso: m.peso,
      contextura: m.contextura,
      sexo: sexoNorm,
      estado: m.estado,
      objetivo: m.objetivo,
      fecha_inscripcion: (m as any).fecha_inscripcion ?? (m as any).f_registro ?? new Date().toISOString().split('T')[0],
      f_registro: (m as any).f_registro ?? (m as any).fecha_inscripcion ?? null
    } as Miembro;
    this.miembrosFiltrados = [];
    this.mostrarSugerencias = false;
    this.mensaje = '';
  }

  actualizar(): void {
    if (!this.miembro) {
      this.mensaje = 'Selecciona un miembro antes de actualizar.';
      return;
    }

    const updater = (this.service as any).update || (this.service as any).updateMiembro || (this.service as any).put;
    if (!updater) {
      this.mensaje = 'Función de actualización no disponible en el servicio.';
      return;
    }

    try {
      const call = updater.length === 2 && this.miembro.id_miembro != null
        ? updater.call(this.service, this.miembro.id_miembro, this.miembro)
        : updater.call(this.service, this.miembro);

      call.subscribe({
        next: () => {
          this.mensaje = 'Miembro actualizado con éxito.';
          const idx = this.todosLosMiembros.findIndex((x: Miembro) => x.id_miembro === this.miembro!.id_miembro);
          if (idx >= 0) this.todosLosMiembros[idx] = { ...(this.todosLosMiembros[idx]), ...(this.miembro as any) } as Miembro;
          setTimeout(() => this.router.navigate(['/admin/miembros']), 1200);
        },
        error: (err: any) => {
          console.error('Error actualizando miembro:', err);
          this.mensaje = 'Error al actualizar el miembro.';
        }
      });
    } catch (ex) {
      console.error('Error llamando al updater:', ex);
      this.mensaje = 'Error al intentar actualizar.';
    }
  }

  limpiarFormulario(): void {
    this.miembro = null;
    this.busqueda = '';
    this.mensaje = '';
    this.miembrosFiltrados = [];
    this.mostrarSugerencias = false;
  }
}

