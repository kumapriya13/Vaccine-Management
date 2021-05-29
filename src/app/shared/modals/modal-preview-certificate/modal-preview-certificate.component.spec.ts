import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPreviewCertificateComponent } from './modal-preview-certificate.component';

describe('ModalPreviewCertificateComponent', () => {
  let component: ModalPreviewCertificateComponent;
  let fixture: ComponentFixture<ModalPreviewCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPreviewCertificateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPreviewCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
