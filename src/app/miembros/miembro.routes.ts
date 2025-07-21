import { Routes } from '@angular/router';
import { miembroGuard } from '../guards/miembro-guard';
import { MiembrosLayout } from './miembros-layout/miembros-layout';
import { MiembrosDashboard } from './dashboard/miembros-dashboard/miembros-dashboard';
import { ProductoListComponent } from './tienda/producto-list/producto-list';
import { CarritoComponent } from './tienda/carrito/carrito';
import { Pagos } from './pagos/pagos';
import { NutricionComponent } from './nutricion/nutricion';
import { EntrenamientoComponent } from './entrenamiento/entrenamiento';
import { Notifiacion } from './notifiacion/notifiacion';

export const miembrosRoutes: Routes = [
  {
    path: '',
    component: MiembrosLayout,
    canActivate: [miembroGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: MiembrosDashboard },
      { path: 'entrenamiento', component: EntrenamientoComponent },
      { path: 'nutricion', component: NutricionComponent },
      { path: 'tienda', component: ProductoListComponent },
      { path: 'cart', component: CarritoComponent },
      { path: 'pagos', component: Pagos },
      { path: 'notificaciones', component: Notifiacion },
      {
        path: 'perfil',
        loadChildren: () => import('./mi-perfil/perfil.routes').then(m => m.miPerfilRoutes)
      }
    ],
  },
];
