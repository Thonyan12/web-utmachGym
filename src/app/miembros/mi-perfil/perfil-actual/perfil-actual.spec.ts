import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilActual } from './perfil-actual';

describe('PerfilActual', () => {
  let component: PerfilActual;
  let fixture: ComponentFixture<PerfilActual>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilActual]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilActual);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
