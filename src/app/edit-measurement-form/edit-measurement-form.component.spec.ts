import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMeasurementFormComponent } from './edit-measurement-form.component';

describe('EditMeasurementFormComponent', () => {
  let component: EditMeasurementFormComponent;
  let fixture: ComponentFixture<EditMeasurementFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMeasurementFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMeasurementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
