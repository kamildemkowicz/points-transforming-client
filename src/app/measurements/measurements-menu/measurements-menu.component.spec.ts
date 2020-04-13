import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasurementsMenuComponent } from './measurements-menu.component';

describe('MeasurementsMenuComponent', () => {
  let component: MeasurementsMenuComponent;
  let fixture: ComponentFixture<MeasurementsMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeasurementsMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasurementsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
