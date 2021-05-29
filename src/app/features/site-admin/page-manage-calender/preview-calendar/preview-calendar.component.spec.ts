import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewCalendarComponent } from './preview-calendar.component';

describe('PreviewCalendarComponent', () => {
  let component: PreviewCalendarComponent;
  let fixture: ComponentFixture<PreviewCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
