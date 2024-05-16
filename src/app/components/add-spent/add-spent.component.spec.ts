import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSpentComponent } from './add-spent.component';

describe('AddSpentComponent', () => {
  let component: AddSpentComponent;
  let fixture: ComponentFixture<AddSpentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSpentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddSpentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
