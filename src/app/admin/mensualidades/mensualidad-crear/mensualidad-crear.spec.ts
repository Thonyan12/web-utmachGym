import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MensualidadCrearComponent } from './mensualidad-crear'; // Asegúrate de que la ruta sea correcta

describe('MensualidadCrear', () => {
  let component: MensualidadCrearComponent;
  let fixture: ComponentFixture<MensualidadCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MensualidadCrearComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MensualidadCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
