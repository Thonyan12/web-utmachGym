import { Component, OnInit } from '@angular/core';
import { MiembrosSidebarComponent } from '../miembros-sidebar/miembros-sidebar';
import { Miembro, MiembrosService } from '../services/miembros';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-miembros-listar',
  standalone: true,
  imports: [MiembrosSidebarComponent, CommonModule, FormsModule],
  templateUrl: './miembros-listar.html',
  styleUrls: ['./miembros-listar.css']
})
export class MiembrosListarComponent implements OnInit {
  miembros: Miembro[] = [];
  searchText: string = '';

  constructor(private miembrosService: MiembrosService) { }

  ngOnInit(): void {
    this.miembrosService.getMiembros().subscribe(data => {
      this.miembros = data;
    });
  }
}