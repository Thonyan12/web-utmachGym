import { Routes } from '@angular/router';
import { AdminLayout } from './admin-layout';
import { Dashboard } from './dashboard/dashboard';
import { Entrenadores } from './entrenadores/entrenadores';
import { Facturas } from './facturas/facturas';
import { MiembrosListarComponent } from './miembros/miembros-listar/miembros-listar';
import { MiembrosCrearComponent } from './miembros/miembros-crear/miembros-crear';
import { MiembrosEditarComponent } from './miembros/miembros-editar/miembros-editar';
import { MiembrosDetalle } from './miembros/miembros-detalle/miembros-detalle';
import { MiembrosEliminarComponent } from './miembros/miembros-eliminar/miembros-eliminar';

import { ProductosListar } from './productos/productos-listar/productos-listar';
import { ProductosCrearComponent } from './productos/productos-crear/productos-crear';
import { ProductosEditar } from './productos/productos-editar/productos-editar';
import { ProductosDetalle } from './productos/productos-detalle/productos-detalle';
import { ProductosEliminar } from './productos/productos-eliminar/productos-eliminar';

import { MensualidadListar } from './mensualidades/mensualidad-listar/mensualidad-listar';
import { Mensualidades } from './mensualidades/services/mensualidades';

// Importar los guards
import { authGuard } from '../guards/auth-guard';
import { adminGuard } from '../guards/admin-guard';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayout,
    canActivate: [authGuard], // Protege todas las rutas admin
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'entrenadores', component: Entrenadores },
      { path: 'facturas', component: Facturas },
      {
        path: 'productos',
        canActivate: [adminGuard], // Solo admins pueden gestionar productos
        children: [
          { path: '', component: ProductosListar },
          { path: 'crear', component: ProductosCrearComponent },
          { path: 'editar/:id', component: ProductosEditar },
          { path: 'detalle/:id', component: ProductosDetalle },
          { path: 'eliminar/:id', component: ProductosEliminar }
        ] 
      },
      {
        path: 'mensualidades',
        children: [
          { path: '', component: MensualidadListar }
        ]
      },
      {
        path: 'miembros',
        children: [
          { path: '', component: MiembrosListarComponent },
          { path: 'crear', component: MiembrosCrearComponent },
          { path: 'editar/:id', component: MiembrosEditarComponent },
          { path: 'detalle/:id', component: MiembrosDetalle },
          { path: 'eliminar/:id', component: MiembrosEliminarComponent }
        ]
      }
    ]
  }
];
