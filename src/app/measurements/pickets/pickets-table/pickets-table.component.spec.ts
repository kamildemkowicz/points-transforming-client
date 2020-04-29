import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PicketsTableComponent } from './pickets-table.component';

describe('PicketsTableComponent', () => {
  let component: PicketsTableComponent;
  let fixture: ComponentFixture<PicketsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PicketsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PicketsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
