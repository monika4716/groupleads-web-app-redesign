import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBioPreviewComponent } from './admin-bio-preview.component';

describe('AdminBioPreviewComponent', () => {
  let component: AdminBioPreviewComponent;
  let fixture: ComponentFixture<AdminBioPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminBioPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBioPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
