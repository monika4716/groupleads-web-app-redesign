import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupPluginCreateComponent } from './group-plugin-create.component';

describe('GroupPluginCreateComponent', () => {
  let component: GroupPluginCreateComponent;
  let fixture: ComponentFixture<GroupPluginCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupPluginCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupPluginCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
