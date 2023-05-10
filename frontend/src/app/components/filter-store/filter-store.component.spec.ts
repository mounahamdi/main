import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterStoreComponent } from './filter-store.component';

describe('FilterStoreComponent', () => {
  let component: FilterStoreComponent;
  let fixture: ComponentFixture<FilterStoreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterStoreComponent]
    });
    fixture = TestBed.createComponent(FilterStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
