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

  // combobox / búsqueda
  selectedMiembroId: number | null = null;
  miembrosFiltrados: Miembro[] = [];
  miembrosCache: Miembro[] = [];

  ngOnInit() {
    // Cargar cache local si el servicio lo permite
    if ((this.service as any).getMiembros) {
      (this.service as any).getMiembros().subscribe({
        next: (data: Miembro[]) => this.miembrosCache = data || [],
        error: (err: any) => {
          console.error('Error cargando miembros:', err);
          this.miembrosCache = [];
        }
      });
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.busqueda = id;
      this.buscarMiembro();
    }
  }

  // filtra para llenar el combobox mientras escribes
  filtrarMiembros(): void {
    const q = (this.busqueda || '').trim().toLowerCase();
    if (!q) {
      this.miembrosFiltrados = [];
      this.selectedMiembroId = null;
      return;
    }
    this.miembrosFiltrados = this.miembrosCache.filter(m =>
      (m.cedula || '').toString().toLowerCase().includes(q) ||
      (m.nombre || '').toString().toLowerCase().includes(q) ||
      (m.apellido1 || '').toString().toLowerCase().includes(q) ||
      (m.apellido2 || '').toString().toLowerCase().includes(q) ||
      (m.id_miembro != null && m.id_miembro.toString().includes(q))
    );
    if (this.miembrosFiltrados.length === 1) {
      this.selectedMiembroId = this.miembrosFiltrados[0].id_miembro || null;
      if (this.selectedMiembroId) this.onSelectChange();
    } else {
      this.selectedMiembroId = null;
    }
  }

  onSelectChange(): void {
    if (!this.selectedMiembroId) return;
    const m = this.miembrosFiltrados.find(x => x.id_miembro === this.selectedMiembroId)
      || this.miembrosCache.find(x => x.id_miembro === this.selectedMiembroId);
    if (m) this.setMiembro(m);
  }

  buscarMiembro(): void {
    this.mensaje = '';
    this.miembro = null;
    this.cargando = true;
    const valor = (this.busqueda || '').trim();
    if (!valor) {
      this.mensaje = 'Ingrese un ID, cédula o nombre para buscar.';
      this.cargando = false;
      return;
    }

    const idNum = Number(valor);
    if (!isNaN(idNum) && (this.service as any).getById) {
      (this.service as any).getById(idNum).subscribe({
        next: (data: Miembro) => {
          this.cargando = false;
          if (data) this.setMiembro(data);
          else this.mensaje = 'No se encontró el miembro por ID.';
        },
        error: (err: any) => {
          console.error('Error getById:', err);
          this.cargando = false;
          this.buscarPorCacheOBackend(valor);
        }
      });
      return;
    }

    this.buscarPorCacheOBackend(valor);
  }

  private buscarPorCacheOBackend(valor: string): void {
    const valorLower = valor.toLowerCase();
    const encontrados = this.miembrosCache.filter(m =>
      (m.cedula || '').toString().toLowerCase() === valorLower ||
      (m.cedula || '').toString().toLowerCase().includes(valorLower) ||
      (m.nombre || '').toString().toLowerCase().includes(valorLower) ||
      (m.apellido1 || '').toString().toLowerCase().includes(valorLower) ||
      (m.apellido2 || '').toString().toLowerCase().includes(valorLower) ||
      (`${m.nombre || ''} ${m.apellido1 || ''} ${m.apellido2 || ''}`).toLowerCase().includes(valorLower)
    );

    if (encontrados.length === 1) {
      this.cargando = false;
      this.setMiembro(encontrados[0]);
      return;
    }

    if (encontrados.length > 1) {
      this.cargando = false;
      this.miembrosFiltrados = encontrados;
      this.mensaje = 'Seleccione el miembro desde el combobox.';
      return;
    }

    // fallback server-side if available
    if ((this.service as any).getByCedula) {
      (this.service as any).getByCedula(valor).subscribe({
        next: (res: any) => {
          this.cargando = false;
          if (Array.isArray(res) && res.length === 1) this.setMiembro(res[0]);
          else if (Array.isArray(res) && res.length > 1) {
            this.miembrosFiltrados = res;
            this.mensaje = 'Seleccione el miembro desde el combobox.';
          } else this.mensaje = 'No se encontró el miembro.';
        },
        error: (err: any) => {
          console.error('Error búsqueda backend:', err);
          this.cargando = false;
          this.mensaje = 'Error al buscar el miembro.';
        }
      });
      return;
    }

    this.cargando = false;
    this.mensaje = 'No se encontró el miembro. Implementa búsqueda server-side si es necesario.';
  }

  private setMiembro(m: Miembro): void {
    // normalizar posibles nombres de campo que traiga el backend
    const rawSexo = (m as any).sexo ?? (m as any).genero ?? (m as any).sexo_miembro ?? (m as any).gender ?? null;

    let sexoNorm: 'M' | 'F' | null = null;
    if (rawSexo != null) {
      if (typeof rawSexo === 'string') {
        const s = rawSexo.trim().toLowerCase();
        if (['m', 'masculino', 'male', 'hombre'].includes(s)) sexoNorm = 'M';
        else if (['f', 'femenino', 'female', 'mujer'].includes(s)) sexoNorm = 'F';
      } else if (typeof rawSexo === 'boolean') {
        // si el backend usa boolean, asumimos true -> M, false -> F (ajusta si tu lógica es distinta)
        sexoNorm = rawSexo ? 'M' : 'F';
      } else if (typeof rawSexo === 'number') {
        // si viene como 0/1
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
      sexo: sexoNorm, // ahora en 'M' | 'F' | null
      estado: m.estado,
      objetivo: m.objetivo,
      fecha_inscripcion: (m as any).fecha_inscripcion ?? (m as any).f_registro ?? new Date().toISOString().split('T')[0],
      f_registro: (m as any).f_registro ?? (m as any).fecha_inscripcion ?? null
    } as Miembro;
    this.miembrosFiltrados = [];
    this.selectedMiembroId = null;
    this.mensaje = '';
  }

  actualizar(): void {
    if (!this.miembro) {
      this.mensaje = 'Selecciona un miembro antes de actualizar.';
      return;
    }

    // preferir método update (original) y fallback a otros nombres
    const updater = (this.service as any).update || (this.service as any).updateMiembro || (this.service as any).put;
    if (!updater) {
      this.mensaje = 'Función de actualización no disponible en el servicio.';
      return;
    }

    // log del payload para depuración
    console.log('Miembro a actualizar:', this.miembro);

    // si el endpoint espera id en la URL, intenta usar update(id, payload) si existe
    try {
      const call = updater.length === 2 && this.miembro.id_miembro != null
        ? updater.call(this.service, this.miembro.id_miembro, this.miembro)
        : updater.call(this.service, this.miembro);

      call.subscribe({
        next: () => {
          this.mensaje = 'Miembro actualizado con éxito.';
          // actualizar cache local
          const idx = this.miembrosCache.findIndex(x => x.id_miembro === this.miembro!.id_miembro);
          if (idx >= 0) this.miembrosCache[idx] = { ...(this.miembrosCache[idx]), ...(this.miembro as any) } as Miembro;
          setTimeout(() => this.router.navigate(['/admin/miembros']), 1200);
        },
        error: (err: any) => {
          console.error('Error actualizando miembro (full):', err);
          const serverBody = err?.error ?? err?.message ?? err;
          this.mensaje = 'Error al actualizar el miembro.';
          alert(`Error actualizando miembro (status ${err.status}): ${JSON.stringify(serverBody)}`);
        }
      });
    } catch (ex) {
      console.error('Error llamando al updater:', ex);
      this.mensaje = 'Error al intentar actualizar (cliente).';
    }
  }
}

