import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConceptComponent } from './concept.component';

describe('ConceptComponent', () => {
  let component: ConceptComponent;
  let fixture: ComponentFixture<ConceptComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ConceptComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
