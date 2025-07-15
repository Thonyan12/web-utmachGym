import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificacionesCrearComponent } from './notificaciones-crear';

describe('NotificacionesCrearComponent', () => {
    let component: NotificacionesCrearComponent;
    let fixture: ComponentFixture<NotificacionesCrearComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NotificacionesCrearComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(NotificacionesCrearComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});