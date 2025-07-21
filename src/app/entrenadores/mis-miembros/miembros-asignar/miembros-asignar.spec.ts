import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiembrosAsignarComponent } from './miembros-asignar';

describe('MiembrosAsignarComponent', () => {
  let component: MiembrosAsignarComponent;
  let fixture: ComponentFixture<MiembrosAsignarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiembrosAsignarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiembrosAsignarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});