import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAdvanceSpentComponent } from './search-advance-spent.component';

describe('SearchAdvanceSpentComponent', () => {
  let component: SearchAdvanceSpentComponent;
  let fixture: ComponentFixture<SearchAdvanceSpentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchAdvanceSpentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchAdvanceSpentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
