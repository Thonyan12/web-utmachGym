import { Routes } from '@angular/router';
import { AdminLayout } from './admin-layout';
import { Dashboard } from './dashboard/dashboard';
import { Facturas } from './facturas/facturas';

// Miembros
import { MiembrosListarComponent } from './miembros/miembros-listar/miembros-listar';
import { MiembrosCrearComponent } from './miembros/miembros-crear/miembros-crear';
import { MiembrosEditarComponent } from './miembros/miembros-editar/miembros-editar';
import { MiembrosDetalleComponent } from './miembros/miembros-detalle/miembros-detalle';
import { MiembrosEliminarComponent } from './miembros/miembros-eliminar/miembros-eliminar';

// Productos
import { ProductosListar } from './productos/productos-listar/productos-listar';
import { ProductosCrearComponent } from './productos/productos-crear/productos-crear';
import { ProductosEditar } from './productos/productos-editar/productos-editar';
import { ProductosDetalle } from './productos/productos-detalle/productos-detalle';
import { ProductosEliminar } from './productos/productos-eliminar/productos-eliminar';

// Mensualidades
import { MensualidadListar } from './mensualidades/mensualidad-listar/mensualidad-listar';
import { MensualidadCrearComponent } from './mensualidades/mensualidad-crear/mensualidad-crear';
import { MensualidadDetalleComponent } from './mensualidades/mensualidad-detalle/mensualidad-detalle';
import { MensualidadEditarComponent } from './mensualidades/mensualidad-editar/mensualidad-editar';
import { MensualidadEliminarComponent } from './mensualidades/mensualidad-eliminar/mensualidad-eliminar';

// Guards
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
      
      // ❌ ELIMINAR: { path: 'entrenadores', component: Entrenadores },
      
      { path: 'facturas', component: Facturas },
      
      // ===============================
      // PRODUCTOS - Solo para administradores
      // ===============================
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
      
      // ===============================
      // MENSUALIDADES
      // ===============================
      {
        path: 'mensualidades',
        children: [
          { path: '', component: MensualidadListar },
          { path: 'crear', component: MensualidadCrearComponent },
          { path: 'detalle/:id', component: MensualidadDetalleComponent },
          { path: 'editar/:id', component: MensualidadEditarComponent },
          { path: 'eliminar/:id', component: MensualidadEliminarComponent }
        ]
      },
      
      // ===============================
      // MIEMBROS
      // ===============================
      {
        path: 'miembros',
        children: [
          { path: '', component: MiembrosListarComponent },
          { path: 'crear', component: MiembrosCrearComponent },
          { path: 'editar/:id', component: MiembrosEditarComponent },
          { path: 'detalle/:id', component: MiembrosDetalleComponent },
          { path: 'eliminar/:id', component: MiembrosEliminarComponent }
        ]
      }
    ]
  }
];
