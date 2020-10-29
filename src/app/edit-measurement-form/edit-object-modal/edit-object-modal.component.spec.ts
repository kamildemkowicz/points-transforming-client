import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditObjectModalComponent } from './edit-object-modal.component';

describe('EditObjectModalComponent', () => {
  let component: EditObjectModalComponent;
  let fixture: ComponentFixture<EditObjectModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditObjectModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditObjectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
