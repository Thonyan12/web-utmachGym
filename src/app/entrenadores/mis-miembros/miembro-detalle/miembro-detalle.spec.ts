import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiembroDetalle } from './miembro-detalle'; // Ruta correcta al componente

describe('MiembroDetalleComponent', () => {
  let component: MiembroDetalle;
  let fixture: ComponentFixture<MiembroDetallet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MiembroDetalle], // Usa 'declarations' para registrar el componente
    }).compileComponents();

    fixture = TestBed.createComponent(MiembroDetalle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});