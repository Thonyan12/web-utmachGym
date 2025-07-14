import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiembrosEliminarComponent } from './miembros-eliminar';

describe('MiembrosEliminarComponent', () => {
  let component: MiembrosEliminarComponent;
  let fixture: ComponentFixture<MiembrosEliminarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiembrosEliminarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiembrosEliminarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});