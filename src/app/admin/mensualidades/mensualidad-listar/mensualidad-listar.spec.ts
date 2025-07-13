import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MensualidadListar } from './mensualidad-listar';

describe('MensualidadListar', () => {
  let component: MensualidadListar;
  let fixture: ComponentFixture<MensualidadListar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MensualidadListar]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MensualidadListar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});