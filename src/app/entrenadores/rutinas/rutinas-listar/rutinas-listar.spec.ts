import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RutinasListar } from './rutinas-listar';

describe('RutinasListar', () => {
  let component: RutinasListar;
  let fixture: ComponentFixture<RutinasListar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RutinasListar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RutinasListar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
