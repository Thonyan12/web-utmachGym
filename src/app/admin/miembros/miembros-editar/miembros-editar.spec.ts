import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiembrosEditarComponent } from './miembros-editar';

describe('MiembrosEditarComponent', () => {
  let component: MiembrosEditarComponent;
  let fixture: ComponentFixture<MiembrosEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiembrosEditarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiembrosEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});