import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MiembrosDetalle } from './miembros-detalle';

describe('MiembrosDetalle', () => {
    let component: MiembrosDetalle;
    let fixture: ComponentFixture<MiembrosDetalle>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MiembrosDetalle, HttpClientTestingModule, RouterTestingModule]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MiembrosDetalle);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
