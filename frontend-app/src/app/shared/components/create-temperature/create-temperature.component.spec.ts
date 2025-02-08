import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTemperatureComponent } from './create-temperature.component';

describe('CreateTemperatureComponent', () => {
  let component: CreateTemperatureComponent;
  let fixture: ComponentFixture<CreateTemperatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTemperatureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTemperatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
