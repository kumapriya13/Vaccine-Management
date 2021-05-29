import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentDynamicHeaderComponent } from './component-dynamic-header.component';

describe('ComponentDynamicHeaderComponent', () => {
  let component: ComponentDynamicHeaderComponent;
  let fixture: ComponentFixture<ComponentDynamicHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponentDynamicHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentDynamicHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
