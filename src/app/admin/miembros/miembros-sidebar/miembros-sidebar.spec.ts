import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiembrosSidebarComponent } from './miembros-sidebar';

describe('MiembrosSidebarComponent', () => {
  let component: MiembrosSidebarComponent;
  let fixture: ComponentFixture<MiembrosSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiembrosSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiembrosSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});