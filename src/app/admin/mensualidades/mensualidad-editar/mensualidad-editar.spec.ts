import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MensualidadEditarComponent } from './mensualidad-editar';


describe('MensualidadEditar', () => {
  let component: MensualidadEditarComponent;
  let fixture: ComponentFixture<MensualidadEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MensualidadEditarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MensualidadEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});