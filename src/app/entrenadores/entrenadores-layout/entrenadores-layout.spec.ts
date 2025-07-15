import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrenadoresLayout } from './entrenadores-layout';

describe('EntrenadoresLayout', () => {
  let component: EntrenadoresLayout;
  let fixture: ComponentFixture<EntrenadoresLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntrenadoresLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntrenadoresLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
