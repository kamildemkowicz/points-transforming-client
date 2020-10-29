import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TachymetryViewComponent } from './tachymetry-view.component';

describe('TachymetryViewComponent', () => {
  let component: TachymetryViewComponent;
  let fixture: ComponentFixture<TachymetryViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TachymetryViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TachymetryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
