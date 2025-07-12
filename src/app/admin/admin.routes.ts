import { Routes } from '@angular/router';
import { AdminLayout } from './admin-layout';
import { Dashboard } from './dashboard/dashboard';
import { Miembros } from './miembros/miembros';
import { Entrenadores } from './entrenadores/entrenadores';
import { Facturas } from './facturas/facturas';

import { ProductosListar } from './productos/productos-listar/productos-listar';
import { ProductosCrearComponent } from './productos/productos-crear/productos-crear';
import { ProductosEditar } from './productos/productos-editar/productos-editar';
import { ProductosDetalle } from './productos/productos-detalle/productos-detalle';
import { ProductosEliminar } from './productos/productos-eliminar/productos-eliminar';


import { MensualidadListar } from './mensualidades/mensualidad-listar/mensualidad-listar';
import { Mensualidades } from './mensualidades/services/mensualidades';


export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // <-- Redirección aquí
      { path: 'dashboard', component: Dashboard },
      { path: 'miembros', component: Miembros },
      { path: 'entrenadores', component: Entrenadores },
      { path: 'facturas', component: Facturas },
      {
        path: 'productos',
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
      }




    ]
  }
];