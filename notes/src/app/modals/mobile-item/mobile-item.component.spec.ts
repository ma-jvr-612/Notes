import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MobileItemComponent } from './mobile-item.component';

describe('MobileItemComponent', () => {
  let component: MobileItemComponent;
  let fixture: ComponentFixture<MobileItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MobileItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
