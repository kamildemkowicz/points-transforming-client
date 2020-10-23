import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMeasuringStationModalComponent } from './add-measuring-station-modal.component';

describe('AddMeasuringStationModalComponent', () => {
  let component: AddMeasuringStationModalComponent;
  let fixture: ComponentFixture<AddMeasuringStationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMeasuringStationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMeasuringStationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
