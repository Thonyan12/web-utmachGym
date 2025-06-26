import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Miembros } from './miembros/miembros';
import { Entrenadores } from './entrenadores/entrenadores';
import { Mensualidades } from './mensualidades/mensualidades';
import { Facturas } from './facturas/facturas';
import { Productos } from './productos/productos';

export const adminRoutes: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: 'miembros', component: Miembros },
  { path: 'entrenadores', component: Entrenadores },
  { path: 'mensualidades', component: Mensualidades },
  { path: 'facturas', component: Facturas },
  { path: 'productos', component: Productos }
];