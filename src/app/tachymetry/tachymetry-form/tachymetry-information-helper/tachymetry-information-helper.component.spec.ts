import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TachymetryInformationHelperComponent } from './tachymetry-information-helper.component';

describe('TachymetryInformationHelperComponent', () => {
  let component: TachymetryInformationHelperComponent;
  let fixture: ComponentFixture<TachymetryInformationHelperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TachymetryInformationHelperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TachymetryInformationHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
