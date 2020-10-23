import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TachymetryComponent } from './tachymetry.component';

describe('TachymetryComponent', () => {
  let component: TachymetryComponent;
  let fixture: ComponentFixture<TachymetryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TachymetryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TachymetryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
