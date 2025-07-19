import { Routes } from '@angular/router';
import { miembroGuard } from '../guards/miembro-guard';
import { MiembrosLayout } from './miembros-layout/miembros-layout';
import { MiembrosDashboard } from './dashboard/miembros-dashboard/miembros-dashboard';
import { ProductoListComponent } from './tienda/producto-list/producto-list';
import { CarritoComponent } from './tienda/carrito/carrito';

export const miembrosRoutes: Routes = [
  {
    path: '',
    component: MiembrosLayout,
    canActivate: [miembroGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: MiembrosDashboard },

      { path: 'tienda', component: ProductoListComponent },
      { path: 'cart', component: CarritoComponent },
    ],
  },
];
