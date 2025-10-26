import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Miembro {
    id_miembro?: number;
    cedula: string;
    nombre: string;
    apellido1: string;
    apellido2: string;
    edad: number;
    direccion: string;
    altura: number;
    peso: number;
    contextura: string;
    objetivo: string;
    sexo: string;
    fecha_inscripcion: string;
    estado: boolean;
    correo: string;
    estado_registro: boolean;
    f_registro: string;
}

@Injectable({
    providedIn: 'root'
})
export class MiembrosService {
    private http = inject(HttpClient);
    // Use environment.apiUrl so requests go through the gateway.
    // Gateway maps `/api/members` -> members-service (backend), so use that prefix.
    private apiUrl = `${environment.apiUrl}/api/members`;

    getMiembros(): Observable<Miembro[]> {
        return this.http.get<Miembro[]>(this.apiUrl);
    }

    getById(id: number): Observable<Miembro> {
        return this.http.get<Miembro>(`${this.apiUrl}/${id}`);
    }

    update(miembro: Miembro): Observable<Miembro> {
        return this.http.put<Miembro>(`${this.apiUrl}/${miembro.id_miembro}`, miembro);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    create(miembro: Miembro): Observable<any> {
        return this.http.post(this.apiUrl, miembro);
    }

    constructor() { }
}