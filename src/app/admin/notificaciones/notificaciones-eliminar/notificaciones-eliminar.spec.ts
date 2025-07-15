import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificacionesEliminarComponent } from './notificaciones-eliminar';

describe('NotificacionesEliminarComponent', () => {
  let component: NotificacionesEliminarComponent;
  let fixture: ComponentFixture<NotificacionesEliminarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificacionesEliminarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificacionesEliminarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

   it('should create', () => {
    expect(component).toBeTruthy();
  });
});