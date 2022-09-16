import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBioComponent } from './admin-bio.component';

describe('AdminBioComponent', () => {
  let component: AdminBioComponent;
  let fixture: ComponentFixture<AdminBioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminBioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
