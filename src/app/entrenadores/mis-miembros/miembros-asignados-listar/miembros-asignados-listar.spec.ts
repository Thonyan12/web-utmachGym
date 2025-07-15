import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiembrosAsignadosListar } from './miembros-asignados-listar';

describe('MiembrosAsignadosListar', () => {
  let component: MiembrosAsignadosListar;
  let fixture: ComponentFixture<MiembrosAsignadosListar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiembrosAsignadosListar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiembrosAsignadosListar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
