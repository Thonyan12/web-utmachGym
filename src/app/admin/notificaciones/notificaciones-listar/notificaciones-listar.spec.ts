import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificacionesListarComponent } from './notificaciones-listar';

describe('NotificacionesListarComponent', () => {
    let component: NotificacionesListarComponent;
    let fixture: ComponentFixture<NotificacionesListarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NotificacionesListarComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(NotificacionesListarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});