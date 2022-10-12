import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupProfilePreviewComponent } from './group-profile-preview.component';

describe('GroupProfilePreviewComponent', () => {
  let component: GroupProfilePreviewComponent;
  let fixture: ComponentFixture<GroupProfilePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupProfilePreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupProfilePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
