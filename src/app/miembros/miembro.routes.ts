import { Routes } from '@angular/router';
import { miembroGuard } from '../guards/miembro-guard';
import { MiembrosLayout } from './miembros-layout/miembros-layout';
import { MiembrosDashboard } from './dashboard/miembros-dashboard/miembros-dashboard';

export const miembrosRoutes: Routes = [
  {
    path: '',
    component: MiembrosLayout,
    canActivate: [miembroGuard], // Protege todas las rutas de miembros
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: MiembrosDashboard },
      // Aquí iremos agregando más rutas
    ],
  },
];
