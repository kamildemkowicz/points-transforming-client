import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorySearchResultsComponent } from './history-search-results.component';

describe('HistorySearchResultsComponent', () => {
  let component: HistorySearchResultsComponent;
  let fixture: ComponentFixture<HistorySearchResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorySearchResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorySearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
