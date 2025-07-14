import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MensualidadEliminarComponent } from './mensualidad-eliminar'; // Asegúrate de que la ruta sea correcta

describe('MensualidadEliminarComponent', () => {
  let component: MensualidadEliminarComponent;
  let fixture: ComponentFixture<MensualidadEliminarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MensualidadEliminarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MensualidadEliminarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});