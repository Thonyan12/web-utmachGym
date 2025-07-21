import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Notifiacion } from './notifiacion';

describe('Notifiacion', () => {
  let component: Notifiacion;
  let fixture: ComponentFixture<Notifiacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Notifiacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Notifiacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
