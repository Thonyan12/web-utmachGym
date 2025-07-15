import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificacionesSidebarComponent } from './notificaciones-sidebar';

describe('NotificacionesSidebarComponent', () => {
    let component: NotificacionesSidebarComponent;
    let fixture: ComponentFixture<NotificacionesSidebarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NotificacionesSidebarComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(NotificacionesSidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});