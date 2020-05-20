import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasurementBoardComponent } from './measurement-board.component';

describe('MeasurementBoardComponent', () => {
  let component: MeasurementBoardComponent;
  let fixture: ComponentFixture<MeasurementBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeasurementBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasurementBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
