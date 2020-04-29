import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PicketsComponent } from './pickets.component';

describe('PicketsComponent', () => {
  let component: PicketsComponent;
  let fixture: ComponentFixture<PicketsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PicketsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
