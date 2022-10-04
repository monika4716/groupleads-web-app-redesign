import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupProfileCreateComponent } from './group-profile-create.component';

describe('GroupProfileCreateComponent', () => {
  let component: GroupProfileCreateComponent;
  let fixture: ComponentFixture<GroupProfileCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupProfileCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupProfileCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
