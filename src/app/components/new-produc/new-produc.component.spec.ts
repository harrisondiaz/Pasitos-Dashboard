import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProducComponent } from './new-produc.component';

describe('NewProducComponent', () => {
  let component: NewProducComponent;
  let fixture: ComponentFixture<NewProducComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewProducComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewProducComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
