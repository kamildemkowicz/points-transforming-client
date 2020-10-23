import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TachymetryReportComponent } from './tachymetry-report.component';

describe('TachymetryReportComponent', () => {
  let component: TachymetryReportComponent;
  let fixture: ComponentFixture<TachymetryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TachymetryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TachymetryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
