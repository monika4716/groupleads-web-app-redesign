import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterBeforeLoginComponent } from './footer-before-login.component';

describe('FooterBeforeLoginComponent', () => {
  let component: FooterBeforeLoginComponent;
  let fixture: ComponentFixture<FooterBeforeLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterBeforeLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterBeforeLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
