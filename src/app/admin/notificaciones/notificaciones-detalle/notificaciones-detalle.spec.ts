import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificacionesDetalleComponent } from './notificaciones-detalle';

describe('NotificacionesDetalleComponent', () => {
    let component: NotificacionesDetalleComponent;
    let fixture: ComponentFixture<NotificacionesDetalleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NotificacionesDetalleComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(NotificacionesDetalleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});