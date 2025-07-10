import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { Terminos } from './pages/terminos/terminos';
import { Politicas } from './pages/politicas/politicas';
import { Contacto } from './pages/contacto/contacto';
import { adminRoutes } from './admin/admin.routes';
import { StaffLogin } from './pages/staff-login/staff-login';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: Login },
  { path: 'staff-login', component: StaffLogin }, 
  { path: 'registro', component: Registro },
  { path: 'terminos', component: Terminos },
  { path: 'politicas', component: Politicas },
  { path: 'contacto', component: Contacto },
  { path: 'admin', children: adminRoutes }, 
  { path: '**', redirectTo: '', pathMatch: 'full' } // <-- Siempre al final
];
