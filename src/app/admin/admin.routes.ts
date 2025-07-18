import { Routes } from '@angular/router';
import { AdminLayout } from './admin-layout';
import { Dashboard } from './dashboard/dashboard';

// Miembros
import { MiembrosListarComponent } from './miembros/miembros-listar/miembros-listar';
import { MiembrosCrearComponent } from './miembros/miembros-crear/miembros-crear';
import { MiembrosEditarComponent } from './miembros/miembros-editar/miembros-editar';
import { MiembrosDetalleComponent } from './miembros/miembros-detalle/miembros-detalle';
import { MiembrosEliminarComponent } from './miembros/miembros-eliminar/miembros-eliminar';

// Notificaciones
import { NotificacionesListarComponent } from './notificaciones/notificaciones-listar/notificaciones-listar';
import { NotificacionesCrearComponent } from './notificaciones/notificaciones-crear/notificaciones-crear';
import { NotificacionesDetalleComponent } from './notificaciones/notificaciones-detalle/notificaciones-detalle';
import { NotificacionesEliminarComponent } from './notificaciones/notificaciones-eliminar/notificaciones-eliminar';

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

//Factura
import { FacturasListarComponent } from './facturas/facturas-listar/facturas-listar';
import { FacturasCrearComponent } from './facturas/facturas-crear/facturas-crear';
import { FacturasDetalle } from './facturas/facturas-detalle/facturas-detalle';
import { FacturasEditar } from './facturas/facturas-editar/facturas-editar';
import { FacturasEliminar } from './facturas/facturas-eliminar/facturas-eliminar';




export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },

      // Productos (solo admins)
      {
        path: 'productos',
        canActivate: [adminGuard],
        children: [
          { path: '', component: ProductosListar },
          { path: 'crear', component: ProductosCrearComponent },
          { path: 'editar/:id', component: ProductosEditar },
          { path: 'detalle/:id', component: ProductosDetalle },
          { path: 'eliminar/:id', component: ProductosEliminar }
        ]
      },

      // Notificaciones
      {
        path: 'notificaciones',
        children: [
          { path: '', component: NotificacionesListarComponent },
          { path: 'crear', component: NotificacionesCrearComponent },
          { path: 'detalle/:id', component: NotificacionesDetalleComponent },
          { path: 'eliminar/:id', component: NotificacionesEliminarComponent }
        ]
      },

      // Mensualidades
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

      // Miembros
      {
        path: 'miembros',
        children: [
          { path: '', component: MiembrosListarComponent },
          { path: 'crear', component: MiembrosCrearComponent },
          { path: 'editar/:id', component: MiembrosEditarComponent },
          { path: 'detalle/:id', component: MiembrosDetalleComponent },
          { path: 'eliminar/:id', component: MiembrosEliminarComponent }
        ]
      },

      // Facturas
      {
        path: 'facturas',
        children: [
          { path: '', component: FacturasListarComponent }, // Listar Facturas
          { path: 'crear', component: FacturasCrearComponent},
          { path: 'editar/:id', component: FacturasEditar }, 
          { path: 'detalle/:id', component: FacturasDetalle},
          { path: 'eliminar/:id', component: FacturasEliminar}
        ]
      }


    ]
  }
];