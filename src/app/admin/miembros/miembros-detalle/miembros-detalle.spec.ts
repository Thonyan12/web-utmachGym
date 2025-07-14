import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MiembrosDetalleComponent } from './miembros-detalle';

describe('MiembrosDetalle', () => {
    let component: MiembrosDetalleComponent;
    let fixture: ComponentFixture<MiembrosDetalleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MiembrosDetalleComponent, HttpClientTestingModule, RouterTestingModule]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MiembrosDetalleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
