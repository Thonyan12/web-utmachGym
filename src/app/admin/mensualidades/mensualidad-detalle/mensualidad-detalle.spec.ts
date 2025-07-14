import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MensualidadDetalleComponent } from './mensualidad-detalle'; // Asegúrate de que la ruta sea correcta

describe('MensualidadDetalle', () => {
  let component: MensualidadDetalleComponent;
  let fixture: ComponentFixture<MensualidadDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MensualidadDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MensualidadDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});