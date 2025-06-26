import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: '**', redirectTo: '', pathMatch: 'full' } // Redirige a Landing
];
