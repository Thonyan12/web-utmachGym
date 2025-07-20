import { Routes } from '@angular/router';
import { MiPerfil } from './mi-perfil';
import { PerfilActual } from './perfil-actual/perfil-actual';
import { HistorialPerfiles } from './historial-perfiles/historial-perfiles';
import { HistorialRutinas } from './historial-rutinas/historial-rutinas';

export const miPerfilRoutes: Routes = [
  {
    path: '',
    component: MiPerfil,
    children: [
      { path: '', redirectTo: 'actual', pathMatch: 'full' },
      { path: 'actual', component: PerfilActual },
      { path: 'historial-perfiles', component: HistorialPerfiles },
      { path: 'historial-rutinas', component: HistorialRutinas },
    ],
  },
];
