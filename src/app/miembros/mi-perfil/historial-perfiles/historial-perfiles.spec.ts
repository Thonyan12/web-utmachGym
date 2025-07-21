import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialPerfiles } from './historial-perfiles';

describe('HistorialPerfiles', () => {
  let component: HistorialPerfiles;
  let fixture: ComponentFixture<HistorialPerfiles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialPerfiles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialPerfiles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
