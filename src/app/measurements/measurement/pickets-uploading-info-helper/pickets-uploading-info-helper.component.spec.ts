import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PicketsUploadingInfoHelperComponent } from './pickets-uploading-info-helper.component';

describe('PicketsUploadingInfoHelperComponent', () => {
  let component: PicketsUploadingInfoHelperComponent;
  let fixture: ComponentFixture<PicketsUploadingInfoHelperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PicketsUploadingInfoHelperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PicketsUploadingInfoHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
