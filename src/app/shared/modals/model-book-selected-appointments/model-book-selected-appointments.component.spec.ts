import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelBookSelectedAppointmentsComponent } from './model-book-selected-appointments.component';

describe('ModelBookSelectedAppointmentsComponent', () => {
  let component: ModelBookSelectedAppointmentsComponent;
  let fixture: ComponentFixture<ModelBookSelectedAppointmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelBookSelectedAppointmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelBookSelectedAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
