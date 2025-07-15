import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiPerfilEntrenador } from './mi-perfil-entrenador';

describe('MiPerfilEntrenador', () => {
  let component: MiPerfilEntrenador;
  let fixture: ComponentFixture<MiPerfilEntrenador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiPerfilEntrenador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiPerfilEntrenador);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
