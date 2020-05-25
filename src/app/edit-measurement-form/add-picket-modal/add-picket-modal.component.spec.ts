import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPicketModalComponent } from './add-picket-modal.component';

describe('AddPicketModalComponent', () => {
  let component: AddPicketModalComponent;
  let fixture: ComponentFixture<AddPicketModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPicketModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPicketModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
