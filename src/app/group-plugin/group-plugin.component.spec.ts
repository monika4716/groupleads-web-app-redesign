import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupPluginComponent } from './group-plugin.component';

describe('GroupPluginComponent', () => {
  let component: GroupPluginComponent;
  let fixture: ComponentFixture<GroupPluginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupPluginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupPluginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
