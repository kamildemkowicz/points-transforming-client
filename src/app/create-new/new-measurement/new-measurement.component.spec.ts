import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMeasurementComponent } from './new-measurement.component';

describe('NewMeasurementComponent', () => {
  let component: NewMeasurementComponent;
  let fixture: ComponentFixture<NewMeasurementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewMeasurementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMeasurementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
