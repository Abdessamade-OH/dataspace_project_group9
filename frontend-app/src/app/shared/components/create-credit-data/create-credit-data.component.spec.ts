import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCreditDataComponent } from './create-credit-data.component';

describe('CreateCreditDataComponent', () => {
  let component: CreateCreditDataComponent;
  let fixture: ComponentFixture<CreateCreditDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCreditDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCreditDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
