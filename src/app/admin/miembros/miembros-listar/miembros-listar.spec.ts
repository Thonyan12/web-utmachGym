import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiembrosListarComponent } from './miembros-listar';

describe('MiembrosListarComponent', () => {
  let component: MiembrosListarComponent;
  let fixture: ComponentFixture<MiembrosListarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiembrosListarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiembrosListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});