import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageEditReceptionistComponent } from './page-edit-receptionist.component';

describe('PageEditReceptionistComponent', () => {
  let component: PageEditReceptionistComponent;
  let fixture: ComponentFixture<PageEditReceptionistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageEditReceptionistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageEditReceptionistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
