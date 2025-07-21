// src/app/entrenadores/entrenadores.routes.ts
import { Routes } from '@angular/router';
import { EntrenadoresLayout } from './entrenadores-layout/entrenadores-layout';
import { EntrenadoresDashboard } from './dashboard/entrenadores-dashboard/entrenadores-dashboard';
import { entrenadorGuard } from '../guards/entrenador-guard';
// Mis miembros
import { MiembrosAsignadosListar } from './mis-miembros/miembros-asignados-listar/miembros-asignados-listar';
import { MiembroDetalle } from './mis-miembros/miembro-detalle/miembro-detalle';
import { MiembrosAsignarComponent } from './mis-miembros/miembros-asignar/miembros-asignar';

// Asistencia
import { RegistrarAsistencia } from './asistencia/registrar-asistencia/registrar-asistencia';
import { HistorialAsistencia } from './asistencia/historial-asistencia/historial-asistencia';

// Notificaciones
import { EnviarNotificacion } from './notificaciones/enviar-notificacion/enviar-notificacion';
import { MisNotificaciones } from './notificaciones/mis-notificaciones/mis-notificaciones';

// Perfil
import { MiPerfilEntrenador } from './perfil/mi-perfil-entrenador/mi-perfil-entrenador';

export const entrenadoresRoutes: Routes = [
  {
    path: '',
    component: EntrenadoresLayout,
    canActivate: [entrenadorGuard], // Protege todas las rutas de entrenadores
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: EntrenadoresDashboard },
      
      // ===============================
      // MIS MIEMBROS ASIGNADOS
      // ===============================
      {
        path: 'mis-miembros',
        children: [
          { path: '', component: MiembrosAsignadosListar },
          { path: 'detalle/:id', component: MiembroDetalle },
          { path: 'asignar', component: MiembrosAsignarComponent }
        ]
      },
      
      // ===============================
      // ASISTENCIA
      // ===============================
      {
        path: 'asistencia',
        children: [
          { path: '', component: RegistrarAsistencia },
          { path: 'historial', component: HistorialAsistencia }
        ]
      },
      
      // ===============================
      // NOTIFICACIONES
      // ===============================
      {
        path: 'notificaciones',
        children: [
          { path: '', component: MisNotificaciones },
          { path: 'enviar', component: EnviarNotificacion }
        ]
      },
      
      // ===============================
      // PERFIL DEL ENTRENADOR
      // ===============================
      { path: 'perfil', component: MiPerfilEntrenador }
    ]
  }
];