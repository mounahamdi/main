import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeContainerComponent } from './stripe-container.component';

describe('StripeContainerComponent', () => {
  let component: StripeContainerComponent;
  let fixture: ComponentFixture<StripeContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StripeContainerComponent]
    });
    fixture = TestBed.createComponent(StripeContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
