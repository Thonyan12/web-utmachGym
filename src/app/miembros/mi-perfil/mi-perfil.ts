import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PerfilSidebar } from './sidebar/sidebar';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [RouterOutlet, PerfilSidebar],
  templateUrl: './mi-perfil.html',
  styleUrls: ['./mi-perfil.css']
})
export class MiPerfil {

}
