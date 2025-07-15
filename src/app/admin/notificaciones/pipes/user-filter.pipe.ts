import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'userFilter', standalone: true })
export class UserFilterPipe implements PipeTransform {
  transform(usuarios: any[], filtro: string): any[] {
    if (!usuarios) return [];
    if (!filtro) return usuarios;
    const filtroLower = filtro.toLowerCase();
    return usuarios.filter(user =>
      (user.nombre_completo || '').toLowerCase().includes(filtroLower) ||
      (user.usuario || '').toLowerCase().includes(filtroLower)
    );
  }
}