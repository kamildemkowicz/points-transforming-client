import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TachymetryFormComponent } from './tachymetry-form.component';

describe('TachymetryFormComponent', () => {
  let component: TachymetryFormComponent;
  let fixture: ComponentFixture<TachymetryFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TachymetryFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TachymetryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
