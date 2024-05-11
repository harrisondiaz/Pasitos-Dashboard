import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpentComponent } from './spent.component';

describe('SpentComponent', () => {
  let component: SpentComponent;
  let fixture: ComponentFixture<SpentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
