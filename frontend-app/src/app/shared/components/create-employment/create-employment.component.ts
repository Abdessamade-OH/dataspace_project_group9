import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmploymentDataService } from '../../services/employment-data.service';

@Component({
  selector: 'app-create-employment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-employment.component.html',
  styleUrls: ['./create-employment.component.css']
})
export class CreateEmploymentComponent implements OnInit {
  // Input: the title (data type), e.g., "Employment"
  @Input() title: string = '';

  /* 
    Form model following your EmploymentData schema:
    - Main fields: indicator, sex, year, element, source, unit, value
    - Metadata will be set automatically in TS:
         metadata.source: 'employment_integration'
         metadata.dataType: 'agriculture_employment'
         metadata.status: 'processed'
    (lastUpdated and createdAt are handled by the backend)
  */
  employmentForm = {
    indicator: '',
    sex: 'Male',  // default to 'Male'
    year: null as number | null,
    element: '',
    source: '',
    unit: '',
    value: null as number | null,
    metadata: {
      source: '',
      dataType: '',
      status: ''
    }
  };

  successMessage: string = '';
  errorMessage: string = '';

  constructor(private employmentDataService: EmploymentDataService) {}

  ngOnInit(): void {
    if (this.title.toLowerCase() === 'employment') {
      // Set automatic metadata defaults matching your sample
      this.employmentForm.metadata = {
        source: 'employment_integration',
        dataType: 'agriculture_employment',
        status: 'processed'
      };
    }
  }

  onSubmit(): void {
    // Submit the form data to the backend
    this.employmentDataService.createEmployment(this.employmentForm).subscribe({
      next: (data) => {
        this.successMessage = 'Employment data created successfully!';
        this.errorMessage = '';
        this.resetForm();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error creating employment data.';
        this.successMessage = '';
      }
    });
  }

  resetForm(): void {
    // Reset the main fields (metadata remains set by default)
    this.employmentForm.indicator = '';
    this.employmentForm.sex = 'Male';
    this.employmentForm.year = null;
    this.employmentForm.element = '';
    this.employmentForm.source = '';
    this.employmentForm.unit = '';
    this.employmentForm.value = null;
  }
}
