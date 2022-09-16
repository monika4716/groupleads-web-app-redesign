import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderBeforeLoginComponent } from './header-before-login.component';

describe('HeaderBeforeLoginComponent', () => {
  let component: HeaderBeforeLoginComponent;
  let fixture: ComponentFixture<HeaderBeforeLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderBeforeLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderBeforeLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
