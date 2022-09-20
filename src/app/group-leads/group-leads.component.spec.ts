import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupLeadsComponent } from './group-leads.component';

describe('GroupLeadsComponent', () => {
  let component: GroupLeadsComponent;
  let fixture: ComponentFixture<GroupLeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupLeadsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
